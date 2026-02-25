import type { ApiQuickBooksPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

export function buildQuickBooksInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiQuickBooksPayload {
  return {
    type: "api",
    subtype: "quickbooks",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

export function buildQuickBooksQueryPayload(
  query: string,
  options?: { timeoutMs?: number }
): ApiQuickBooksPayload {
  return buildQuickBooksInvokePayload("GET", "/query", {
    query: { query: [query] },
    timeoutMs: options?.timeoutMs,
  });
}
