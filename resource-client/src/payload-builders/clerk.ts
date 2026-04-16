import type { ApiClerkPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Clerk invoke payload
 * @param method HTTP method to use
 * @param path Clerk API path (e.g., "/v1/users")
 * @param options Additional options
 */
export function buildClerkInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiClerkPayload {
  return {
    type: "api",
    subtype: "clerk",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
