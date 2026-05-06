import type { ApiGoogleDrivePayload, HttpMethod, QueryParams, JsonBody } from "../schemas";
import { normalizeQueryParams } from "./normalize-query";

/**
 * Build a Google Drive invoke payload
 * @param method HTTP method to use
 * @param path Google Drive API path
 * @param options Additional options
 */
export function buildGoogleDriveInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiGoogleDrivePayload {
  return {
    type: "api",
    subtype: "googledrive",
    method,
    path,
    query: normalizeQueryParams(options?.query),
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
