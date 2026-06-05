import { headers } from "next/headers";
import { createProxyFetch as createCoreProxyFetch } from "../proxy-fetch";
import type { CreateProxyFetchConfig as CoreConfig } from "../proxy-fetch";

/**
 * Next.js config for {@link createProxyFetch}. Same as the core config but
 * without `getUserJwt` — this entry supplies it from `next/headers`.
 */
export type CreateProxyFetchConfig = Omit<CoreConfig, "getUserJwt">;

/**
 * Next.js variant of the core `createProxyFetch`. Identical behaviour, plus it
 * auto-forwards `x-major-user-jwt` from the incoming request headers when
 * called inside a Next.js request scope (Server Component, Route Handler,
 * Server Action), so per-user-OAuth resources resolve transparently. Outside
 * a request scope (e.g. background jobs) the `headers()` call is swallowed and
 * the user JWT is simply not set.
 *
 * Use this from Next app code. Non-Next runtimes (agent skill scripts,
 * standalone Node) should import `createProxyFetch` from the package root,
 * which has no `next` dependency.
 */
export function createProxyFetch(config: CreateProxyFetchConfig): typeof fetch {
  return createCoreProxyFetch({
    ...config,
    getUserJwt: async () => (await headers()).get("x-major-user-jwt"),
  });
}
