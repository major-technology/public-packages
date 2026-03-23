import type { ApiGongPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Gong invoke payload
 * @param method HTTP method to use
 * @param path Gong API path
 * @param options Additional options
 */
export function buildGongInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiGongPayload {
  return {
    type: "api",
    subtype: "gong",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
