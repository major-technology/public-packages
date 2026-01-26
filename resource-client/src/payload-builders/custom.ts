import type { ApiCustomPayload, HttpMethod, QueryParams, BodyPayload } from "../schemas";

/**
 * Build a Custom API invoke payload
 * @param method HTTP method to use
 * @param path Path to append to the resource's base URL
 * @param options Additional options
 */
export function buildCustomApiInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    headers?: Record<string, string>;
    body?: BodyPayload;
    timeoutMs?: number;
  }
): ApiCustomPayload {
  return {
    type: "api",
    subtype: "custom",
    method,
    path,
    query: options?.query,
    headers: options?.headers,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
