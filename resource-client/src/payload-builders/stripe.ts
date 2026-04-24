import type {
  ApiStripePayload,
  HttpMethod,
  QueryParams,
  JsonBody,
} from "../schemas";

/**
 * Build a Stripe invoke payload
 * @param method HTTP method to use
 * @param path Stripe API path (e.g., "/v1/customers")
 * @param options Additional options
 */
export function buildStripeInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiStripePayload {
  return {
    type: "api",
    subtype: "stripe",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
