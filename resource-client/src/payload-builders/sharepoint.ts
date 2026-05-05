import type { ApiSharePointPayload, HttpMethod, QueryParams } from "../schemas";

/**
 * Build a SharePoint (Microsoft Graph) invoke payload.
 *
 * Accepts a plain `body` object — wraps it as `{ type: "json", value: body }`
 * for the wire format so callers never have to deal with the envelope.
 *
 * @param method - HTTP method to use
 * @param path - Microsoft Graph API path (e.g. "/v1.0/sites?search=*")
 * @param options - Optional query params, body, and timeout
 */
export function buildSharePointInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: Record<string, unknown>;
    timeoutMs?: number;
  }
): ApiSharePointPayload {
  return {
    type: "api",
    subtype: "sharepoint",
    method,
    path,
    query: options?.query,
    body: options?.body ? { type: "json", value: options.body } : undefined,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
