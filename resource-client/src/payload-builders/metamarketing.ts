import type {
  ApiMetaMarketingPayload,
  HttpMethod,
  QueryParams,
  JsonBody,
} from "../schemas";

/**
 * Build a Meta Marketing invoke payload
 * @param method HTTP method to use
 * @param path Graph API path (e.g., "/v21.0/act_123/campaigns")
 * @param options Additional options
 */
export function buildMetaMarketingInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiMetaMarketingPayload {
  return {
    type: "api",
    subtype: "metamarketing",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
