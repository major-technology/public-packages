import type { ApiNotionPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Notion invoke payload
 * @param method HTTP method to use
 * @param path Notion API path
 * @param options Additional options
 */
export function buildNotionInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiNotionPayload {
  return {
    type: "api",
    subtype: "notion",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
