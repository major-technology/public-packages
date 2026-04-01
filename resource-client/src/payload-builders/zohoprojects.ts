import type { ApiZohoProjectsPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Zoho Projects invoke payload
 * @param method HTTP method to use
 * @param path Zoho Projects API path
 * @param options Additional options
 */
export function buildZohoProjectsInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiZohoProjectsPayload {
  return {
    type: "api",
    subtype: "zohoprojects",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
