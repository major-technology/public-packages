import { headers } from "next/headers";

/**
 * Lifts `x-major-user-jwt` from the current Next.js request headers and returns
 * it as a header bag suitable for `AgentsClientConfig.getHeaders`.
 *
 * Returns `{}` when:
 *  - called outside a Next.js request scope (e.g. background job, build step) —
 *    `headers()` throws there and we swallow it,
 *  - the inbound request did not carry an `x-major-user-jwt`.
 *
 * A missing user JWT is a valid state — the server falls back to the deployment
 * identity, which is correct for headless callers.
 */
export async function defaultGetHeaders(): Promise<Record<string, string>> {
  let userJwt: string | null = null;

  try {
    userJwt = (await headers()).get("x-major-user-jwt");
  } catch {
    return {};
  }

  if (!userJwt) {
    return {};
  }

  return { "x-major-user-jwt": userJwt };
}
