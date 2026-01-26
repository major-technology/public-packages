import type { ApiGoogleSheetsPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Google Sheets invoke payload
 * @param method HTTP method to use
 * @param path Google Sheets API path relative to the spreadsheet
 * @param options Additional options
 */
export function buildGoogleSheetsInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiGoogleSheetsPayload {
  return {
    type: "api",
    subtype: "googlesheets",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}
