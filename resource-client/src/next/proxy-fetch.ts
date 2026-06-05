import { headers } from "next/headers";

/**
 * Configuration for {@link createProxyFetch}.
 *
 * Pass config explicitly rather than relying on `process.env`, so the same
 * call site works across Next runtimes (Node / edge / serverless).
 */
export interface CreateProxyFetchConfig {
  /** Base URL of the Major API, e.g. `"https://go-api.prod.major.build"`. */
  baseUrl: string;
  /** UUID of the resource the proxy should route through. */
  resourceId: string;
  /** App-level JWT. Sent as `x-major-jwt`. */
  majorJwtToken: string;
  /** Override the runtime fetch implementation. Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch;
  /**
   * Default value for `X-Major-Timeout-Ms`. Only applied when the caller
   * did not already set the header. Server-side clamp: 60000.
   */
  timeoutMs?: number;
}

/**
 * Returns a `fetch`-compatible function that routes every request through
 * the Major HTTP proxy at `${baseUrl}/v1/proxy/${resourceId}`.
 *
 * When called inside a Next.js request scope (Server Component, Route
 * Handler, Server Action), the helper auto-forwards `x-major-user-jwt`
 * from the incoming request headers so per-user-OAuth resources work
 * transparently. Outside of a request scope (e.g. background jobs) the
 * `headers()` call is swallowed and the user JWT is simply not set.
 *
 * The proxy injects upstream auth on the caller's behalf, so callers must
 * NOT set `Authorization`. The proxy also strips reserved request headers
 * (`Authorization`, `Cookie`, `Host`, `Forwarded`, `X-Forwarded-*`,
 * `X-Real-Ip`) and the `X-Major-*` / `X-Pd-*` namespaces — values supplied
 * in those headers are silently dropped.
 *
 * Body size and `X-Major-Max-Response-Bytes` are clamped to 50 MB by the
 * proxy; `X-Major-Timeout-Ms` is clamped to 60_000.
 *
 * Drop-in usage with SDKs that accept a fetch:
 *
 * ```ts
 * const proxyFetch = createProxyFetch({ baseUrl, resourceId, majorJwtToken });
 * const stripe = new Stripe(key, {
 *   httpClient: Stripe.createFetchHttpClient(proxyFetch),
 * });
 * ```
 */
export function createProxyFetch(config: CreateProxyFetchConfig): typeof fetch {
  const runtimeFetch = config.fetch ?? globalThis.fetch;

  return async function proxyFetch(input, init) {
    // Validate at request time, not factory-call time, so instantiating at
    // module scope (where build-time env vars may be absent) doesn't throw.
    if (!config.baseUrl) {
      throw new Error("createProxyFetch: baseUrl is required");
    }
    if (!config.resourceId) {
      throw new Error("createProxyFetch: resourceId is required");
    }
    if (!config.majorJwtToken) {
      throw new Error("createProxyFetch: majorJwtToken is required");
    }

    const proxyUrl = `${config.baseUrl.replace(/\/$/, "")}/v1/proxy/${config.resourceId}`;

    const isRequest =
      typeof Request !== "undefined" && input instanceof Request;

    const targetUrl =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : isRequest
            ? (input as Request).url
            : String(input);

    const method =
      init?.method ?? (isRequest ? (input as Request).method : "GET");
    const body =
      init?.body ?? (isRequest ? (input as Request).body : undefined);

    const outHeaders = new Headers(
      init?.headers ?? (isRequest ? (input as Request).headers : undefined),
    );

    outHeaders.set("x-major-jwt", config.majorJwtToken);
    outHeaders.set("X-Major-Target-URL", targetUrl);

    let userJwt: string | null = null;
    try {
      userJwt = (await headers()).get("x-major-user-jwt");
    } catch {
      // Outside a Next.js request scope (e.g. background job) — skip.
    }
    if (userJwt) {
      outHeaders.set("x-major-user-jwt", userJwt);
    }

    if (
      config.timeoutMs !== undefined &&
      !outHeaders.has("X-Major-Timeout-Ms")
    ) {
      outHeaders.set("X-Major-Timeout-Ms", String(config.timeoutMs));
    }

    return runtimeFetch(proxyUrl, { ...init, method, headers: outHeaders, body });
  };
}
