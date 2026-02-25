import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a QuickBooks Online API resource
 * Note: QuickBooks authentication is handled automatically by the API
 *
 * Common usage patterns:
 * - Query: GET /query?query=SELECT * FROM Customer
 * - Get Entity: GET /invoice/123
 * - Create Entity: POST /invoice
 * - Update Entity: POST /invoice?operation=update
 * - Delete Entity: POST /invoice?operation=delete
 */
export interface ApiQuickBooksPayload {
  type: "api";
  subtype: "quickbooks";
  /** HTTP method to use */
  method: HttpMethod;
  /** QuickBooks API path relative to /v3/company/{realmId} */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
