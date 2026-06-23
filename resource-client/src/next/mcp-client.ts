import { headers } from "next/headers";
import { createMcpClient as createCoreMcpClient } from "../mcp-client";
import type { CreateMcpClientConfig as CoreConfig, McpClient } from "../mcp-client";

/**
 * Next.js config for {@link createMcpClient}. Same as the core config but
 * without `getUserJwt` — this entry supplies it from `next/headers`.
 */
export type CreateMcpClientConfig = Omit<CoreConfig, "getUserJwt">;

/**
 * Next.js variant of the core `createMcpClient`. Identical behaviour, plus it
 * auto-forwards `x-major-user-jwt` from the incoming request headers when called
 * inside a Next.js request scope (Server Component, Route Handler, Server
 * Action), so per-user-OAuth MCP connectors resolve transparently. Outside a
 * request scope the `headers()` call is swallowed and the user JWT is not set.
 *
 * Use this from Next app code. Non-Next runtimes should import `createMcpClient`
 * from the package root, which has no `next` dependency.
 */
export function createMcpClient(config: CreateMcpClientConfig): McpClient {
  return createCoreMcpClient({
    ...config,
    getUserJwt: async () => (await headers()).get("x-major-user-jwt"),
  });
}
