import type { MCPToolResult, MCPToolCallResponse } from "./schemas";
import { ResourceInvokeError } from "./errors";

/**
 * Configuration for {@link createMcpClient}.
 *
 * Pass config explicitly rather than relying on `process.env`, so the same call
 * site works across runtimes. In a deployed Major app the values come from the
 * injected env: `baseUrl` ← `MAJOR_API_BASE_URL`, `applicationId` ←
 * `APPLICATION_ID`, `majorJwtToken` ← `MAJOR_JWT_TOKEN`.
 */
export interface CreateMcpClientConfig {
  /** Base URL of the Major API, e.g. `"https://go-api.prod.major.build"`. */
  baseUrl: string;
  /** UUID of the MCP-subtype connector to call. */
  resourceId: string;
  /** UUID of the calling application — MCP tool calls are app-scoped. */
  applicationId: string;
  /** App-level JWT. Sent as `x-major-jwt`. */
  majorJwtToken: string;
  /** Override the runtime fetch implementation. Defaults to `globalThis.fetch`. */
  fetch?: typeof fetch;
  /**
   * Optional resolver for the per-user OAuth token, forwarded as
   * `x-major-user-jwt` so per-user-OAuth MCP connectors resolve to the right
   * connected account. Errors and nullish results are swallowed — the header is
   * simply not set. The `@major-tech/resource-client/next` entry supplies a
   * `next/headers`-based default so Next app code gets it transparently.
   */
  getUserJwt?: () => Promise<string | null | undefined> | string | null | undefined;
}

/** A client for calling tools on an MCP-subtype connector at runtime. */
export interface McpClient {
  /**
   * Call a single tool on the connector's MCP server and return its structured
   * result, typed as T.
   *
   * @typeParam T - Shape of the tool's structured result.
   * @param tool - The upstream MCP tool name (e.g. `"search-tickets"`).
   * @param args - Tool arguments, forwarded verbatim to the MCP server.
   * @returns The tool's structured result, typed as T. `undefined` if the tool
   *          returned only unstructured (text) content.
   * @throws ResourceInvokeError on transport failure, a server error response, or
   *         a tool-level error.
   */
  callTool<T = unknown>(tool: string, args?: Record<string, unknown>): Promise<T>;
}

/**
 * Returns a client for calling tools on an MCP-subtype connector (custom remote
 * MCP server, Linear, etc.) through the Major app-runtime MCP endpoint at
 * `${baseUrl}/internal/apps/v1/${applicationId}/resource/${resourceId}/mcp/call`.
 *
 * One generic client for every MCP connector: the tool name and args are defined
 * by the upstream server, so there are no per-subtype typed methods. Upstream
 * auth is injected server-side using the connector's resolved shared or per-user
 * credential — callers must NOT set auth headers.
 *
 * Server-side only (the app JWT must never reach the browser). Next app code
 * should import `createMcpClient` from `@major-tech/resource-client/next`, which
 * wires up `getUserJwt` from the request headers automatically.
 */
export function createMcpClient(config: CreateMcpClientConfig): McpClient {
  const runtimeFetch = config.fetch ?? globalThis.fetch;

  return {
    async callTool<T = unknown>(
      tool: string,
      args: Record<string, unknown> = {},
    ): Promise<T> {
      // Validate at call time, not factory-call time, so instantiating at module
      // scope (where build-time env vars may be absent) doesn't throw.
      if (!config.baseUrl) {
        throw new ResourceInvokeError("createMcpClient: baseUrl is required");
      }
      if (!config.resourceId) {
        throw new ResourceInvokeError("createMcpClient: resourceId is required");
      }
      if (!config.applicationId) {
        throw new ResourceInvokeError("createMcpClient: applicationId is required");
      }
      if (!config.majorJwtToken) {
        throw new ResourceInvokeError("createMcpClient: majorJwtToken is required");
      }

      const url = `${config.baseUrl.replace(/\/$/, "")}/internal/apps/v1/${config.applicationId}/resource/${config.resourceId}/mcp/call`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-major-jwt": config.majorJwtToken,
      };

      if (config.getUserJwt) {
        let userJwt: string | null | undefined = null;
        try {
          userJwt = await config.getUserJwt();
        } catch {
          // No request scope / resolver failed — proceed without the user JWT.
        }
        if (userJwt) {
          headers["x-major-user-jwt"] = userJwt;
        }
      }

      let data: MCPToolCallResponse;
      try {
        const response = await runtimeFetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ tool, args }),
        });
        data = (await response.json()) as MCPToolCallResponse;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new ResourceInvokeError(`Failed to call MCP tool: ${message}`);
      }

      if (data.error) {
        throw new ResourceInvokeError(
          data.error.error_string || "MCP tool call failed",
          data.error.status_code,
        );
      }

      if (!data.result) {
        throw new ResourceInvokeError("MCP tool call returned no result");
      }

      // Tool-level failure: the call succeeded but the tool reported an error.
      // Surface it as a throw, using the text content as the message.
      if (data.result.isError) {
        throw new ResourceInvokeError(
          firstTextContent(data.result) || "MCP tool reported an error",
        );
      }

      // The tool's structured result. Undefined for tools that return only
      // unstructured (text) content.
      return data.result.structuredContent as T;
    },
  };
}

/** Returns the first non-empty text block from an MCP result, if any. */
function firstTextContent(result: MCPToolResult): string | undefined {
  for (const block of result.content ?? []) {
    if (block?.type === "text" && typeof block.text === "string" && block.text) {
      return block.text;
    }
  }
  return undefined;
}
