import type {
  ApiAttioPayload,
  HttpMethod,
  QueryParams,
  JsonBody,
} from "../schemas";

/**
 * Build an Attio invoke payload
 * @param method HTTP method to use
 * @param path Attio API path (e.g., "/v2/objects")
 * @param options Additional options
 */
export function buildAttioInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiAttioPayload {
  return {
    type: "api",
    subtype: "attio",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
