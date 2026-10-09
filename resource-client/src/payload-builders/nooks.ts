import type { ApiNooksPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Nooks invoke payload
 * @param method HTTP method to use
 * @param path Nooks API path relative to https://partner-api.nooks.in/v1 (e.g., "/users")
 * @param options Additional options
 */
export function buildNooksInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiNooksPayload {
  return {
    type: "api",
    subtype: "nooks",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
