import type { ApiZohoDeskPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Zoho Desk invoke payload
 * @param method HTTP method to use
 * @param path Zoho Desk API path
 * @param options Additional options
 */
export function buildZohoDeskInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiZohoDeskPayload {
  return {
    type: "api",
    subtype: "zohodesk",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
