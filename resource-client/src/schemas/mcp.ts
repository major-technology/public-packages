/**
 * Result returned by an upstream MCP tool call, forwarded verbatim from the
 * connector's MCP server. Mirrors the MCP `CallToolResult` wire shape, so app
 * code reads `content` / `structuredContent` / `isError` exactly as it would
 * from a raw MCP client.
 */
export interface MCPToolContent {
  /** Content block type, e.g. "text". */
  type: string;
  /** Present for text content blocks. */
  text?: string;
  [key: string]: unknown;
}

export interface MCPToolResult<T = unknown> {
  /** Unstructured content blocks (text, etc.). */
  content: MCPToolContent[];
  /** Structured result, when the tool returns one. */
  structuredContent?: T;
  /** True when the tool itself reported an error (inspect `content` for detail). */
  isError?: boolean;
}

/**
 * Envelope returned by POST .../resource/:resourceId/mcp/call. Success carries
 * `result`; failures carry the standard error envelope.
 */
export interface MCPToolCallResponse {
  result?: MCPToolResult;
  error?: {
    error_string?: string;
    internal_code?: number;
    status_code?: number;
  };
}
