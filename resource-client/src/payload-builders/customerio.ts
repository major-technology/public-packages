import type { ApiCustomerIOPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Customer.io invoke payload
 * @param method HTTP method to use
 * @param path Customer.io API path as documented: "/v1/..." (App API) or "/api/v1/...", "/api/v2/..." (Track API)
 * @param options Additional options
 */
export function buildCustomerIOInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiCustomerIOPayload {
  return {
    type: "api",
    subtype: "customerio",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
