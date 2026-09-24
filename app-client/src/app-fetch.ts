/**
 * @fileoverview Core fetch handle a deployed Major app uses to call another app
 * in its org: resolves the target app's URL through go-api, then sends the
 * visitor's JWT to it as `x-major-jwt`.
 */

/**
 * Configuration for {@link createAppFetch}.
 */
export interface CreateAppFetchConfig {
  /** Base URL of the Major API, e.g. `"https://go-api.prod.major.build"`. */
  baseUrl: string;
  /** UUID of the app to call. Baked by `major-app-client add`; the deploy grants access from it. */
  appId: string;
  /** App-level JWT (`MAJOR_JWT_TOKEN`). Sent as `x-major-jwt` on the URL lookup only. */
  majorJwtToken: string;
  /** Override the runtime fetch implementation. Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch;
  /**
   * Resolver for the visitor's `x-major-user-jwt`, sent to the target app as
   * `x-major-jwt`, which authorizes the call with it. Errors and nullish results are swallowed.
   * The `./next` entry supplies a `next/headers`-based default.
   */
  getUserJwt?: () => Promise<string | null | undefined> | string | null | undefined;
}

function pathOf(input: RequestInfo | URL): string {
  const raw =
    typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
  const url = new URL(raw, "http://placeholder");

  return url.pathname + url.search;
}

async function messageOf(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string; error?: string };

    return body.message ?? body.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

/**
 * Returns a `fetch`-compatible function that calls another Major app. Each call
 * resolves the target app's URL through `${baseUrl}/app-calls/apps/${appId}`,
 * then sends the request to that URL with the visitor's JWT as `x-major-jwt`.
 * Only the path and query of `input` are used, so the JWT can only reach the
 * target app.
 *
 * ```ts
 * const res = await ordersFetch("/api/orders?status=open");
 * ```
 */
export function createAppFetch(config: CreateAppFetchConfig): typeof fetch {
  const runtimeFetch = config.fetch ?? globalThis.fetch;

  return async function appFetch(input, init) {
    // Validate at request time so module-scope instances survive `next build`.
    if (!config.baseUrl) {
      throw new Error("createAppFetch: baseUrl is required");
    }
    if (!config.appId) {
      throw new Error("createAppFetch: appId is required");
    }
    if (!config.majorJwtToken) {
      throw new Error("createAppFetch: majorJwtToken is required");
    }

    let userJwt: string | null | undefined = null;
    if (config.getUserJwt) {
      try {
        userJwt = await config.getUserJwt();
      } catch {
        // No request scope: proceed without the user JWT.
      }
    }

    const lookupHeaders = new Headers({ "x-major-jwt": config.majorJwtToken });
    if (userJwt) {
      lookupHeaders.set("x-major-user-jwt", userJwt);
    }

    const lookup = await runtimeFetch(
      `${config.baseUrl.replace(/\/$/, "")}/app-calls/apps/${config.appId}`,
      { method: "GET", headers: lookupHeaders },
    );

    if (!lookup.ok) {
      throw new Error(
        `app-client: lookup for app ${config.appId} failed (${lookup.status}): ${await messageOf(lookup)}`,
      );
    }

    const { url } = (await lookup.json()) as { url: string };
    const isRequest = typeof Request !== "undefined" && input instanceof Request;
    const headers = new Headers(isRequest ? (input as Request).headers : undefined);
    new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
    headers.delete("x-major-user-jwt");
    headers.delete("x-major-jwt");
    if (userJwt) {
      headers.set("x-major-jwt", userJwt);
    }

    return runtimeFetch(`${url.replace(/\/$/, "")}${pathOf(input)}`, {
      ...init,
      method: init?.method ?? (isRequest ? (input as Request).method : "GET"),
      body: init?.body ?? (isRequest ? (input as Request).body : undefined),
      headers,
    });
  };
}
