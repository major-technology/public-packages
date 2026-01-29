import type { ApiOutreachPayload, HttpMethod, QueryParams } from "../schemas";

/**
 * Build an Outreach invoke payload
 * @param method HTTP method to use
 * @param path Outreach API path (e.g., "/api/v2/prospects")
 * @param options Additional options
 */
export function buildOutreachInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    queryParams?: QueryParams;
    body?: Record<string, unknown>;
    timeoutMs?: number;
  }
): ApiOutreachPayload {
  return {
    type: "api",
    subtype: "outreach",
    method,
    path,
    queryParams: options?.queryParams,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
