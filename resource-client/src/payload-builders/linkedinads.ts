import type { ApiLinkedInAdsPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a LinkedIn Ads invoke payload
 * @param method HTTP method to use
 * @param path LinkedIn Marketing API path
 * @param options Additional options
 */
export function buildLinkedInAdsInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiLinkedInAdsPayload {
  return {
    type: "api",
    subtype: "linkedinads",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
