import type { ApiSalesforcePayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Salesforce invoke payload
 * @param method HTTP method to use
 * @param path Salesforce API path
 * @param options Additional options
 */
export function buildSalesforceInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiSalesforcePayload {
  return {
    type: "api",
    subtype: "salesforce",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
