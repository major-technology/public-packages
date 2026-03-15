import type { ApiGoogleCalendarPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";
import { normalizeQueryParams } from "./normalize-query";

/**
 * Build a Google Calendar invoke payload
 * @param method HTTP method to use
 * @param path Google Calendar API path
 * @param options Additional options
 */
export function buildGoogleCalendarInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiGoogleCalendarPayload {
  return {
    type: "api",
    subtype: "googlecalendar",
    method,
    path,
    query: normalizeQueryParams(options?.query),
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
