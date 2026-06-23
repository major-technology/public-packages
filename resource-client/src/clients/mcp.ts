import type { MCPToolResult } from "../schemas";
import { BaseResourceClient } from "../base";
import { ResourceInvokeError } from "../errors";

/**
 * Client for calling tools on an MCP-subtype connector (e.g. a custom remote MCP
 * server) at runtime. The connector is reached through the Major app proxy using
 * its resolved shared or per-user credential; upstream auth is injected
 * server-side.
 */
export class MCPResourceClient extends BaseResourceClient {
  /**
   * Call a single tool on the connector's MCP server.
   *
   * @typeParam T - Shape of the tool's structured result, if any
   * @param tool - The upstream MCP tool name (e.g. "search-emails-by-metadata")
   * @param args - Tool arguments, forwarded verbatim to the MCP server
   * @returns The MCP tool result. Inspect `.isError` for tool-level failures;
   *          read `.structuredContent` (typed as T) or `.content` for the payload.
   * @throws ResourceInvokeError on transport failure or a server error response
   */
  async callTool<T = unknown>(
    tool: string,
    args: Record<string, unknown> = {},
  ): Promise<MCPToolResult & { structuredContent?: T }> {
    const data = await this.callMcpToolRaw(tool, args);

    if (data.error) {
      throw new ResourceInvokeError(
        data.error.error_string || "MCP tool call failed",
        data.error.status_code,
      );
    }

    if (!data.result) {
      throw new ResourceInvokeError("MCP tool call returned no result");
    }

    return data.result as MCPToolResult & { structuredContent?: T };
  }
}
