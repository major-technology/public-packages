import type { ApiGmailPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";
import { normalizeQueryParams } from "./normalize-query";

/**
 * Build a Gmail invoke payload
 * @param method HTTP method to use
 * @param path Gmail API path
 * @param options Additional options
 */
export function buildGmailInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiGmailPayload {
  return {
    type: "api",
    subtype: "gmail",
    method,
    path,
    query: normalizeQueryParams(options?.query),
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
