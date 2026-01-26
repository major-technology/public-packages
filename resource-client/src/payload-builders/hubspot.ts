import type { ApiHubSpotPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a HubSpot invoke payload
 * @param method HTTP method to use
 * @param path HubSpot API path
 * @param options Additional options
 */
export function buildHubSpotInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiHubSpotPayload {
  return {
    type: "api",
    subtype: "hubspot",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
