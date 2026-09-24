/**
 * @fileoverview Next.js entry point: supplies `getUserJwt` from `next/headers`
 * so app code doesn't have to thread the visitor's JWT through by hand.
 */

import { headers } from "next/headers";
import { createAppFetch as createCoreAppFetch } from "../app-fetch";
import type { CreateAppFetchConfig as CoreConfig } from "../app-fetch";

/** Next.js config for {@link createAppFetch}: this entry supplies `getUserJwt`. */
export type CreateAppFetchConfig = Omit<CoreConfig, "getUserJwt">;

/**
 * Next.js variant of the core `createAppFetch`. It reads `x-major-user-jwt`
 * from the incoming request (sent on as `x-major-jwt`) when called inside a request scope.
 */
export function createAppFetch(config: CreateAppFetchConfig): typeof fetch {
  return createCoreAppFetch({
    ...config,
    getUserJwt: async () => (await headers()).get("x-major-user-jwt"),
  });
}
