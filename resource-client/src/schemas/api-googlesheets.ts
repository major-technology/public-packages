import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Google Sheets specific invoke data
 */
export interface GoogleSheetsInvokeData {
  /** HTTP method to use */
  method: HttpMethod;
  /** 
   * Google Sheets API path relative to the spreadsheet
   * Examples:
   * - "/values/{range}" - Get/update cell values (e.g., "/values/Sheet1!A1:D5")
   * - "/values:batchGet" - Get multiple ranges
   * - "/values:batchUpdate" - Update multiple ranges
   * - "/values:append" - Append values
   * - "/values:clear" - Clear values
   * - "/:batchUpdate" - Update spreadsheet properties, formatting, etc.
   * - "" or "/" - Get spreadsheet metadata
   */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body (Google Sheets uses JSON) */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Payload for invoking a Google Sheets API resource
 * Uses embedded structure for direct Go unmarshaling
 * Note: Google Sheets authentication is handled automatically by the API
 * The resource is bound to a specific spreadsheet (stored in resourceMeta)
 */
export interface ApiGoogleSheetsPayload {
  type: "api";
  subtype: "googlesheets";
  /** Embedded Google Sheets payload */
  googlesheets: GoogleSheetsInvokeData;
}