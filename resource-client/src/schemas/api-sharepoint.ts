import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Microsoft SharePoint (Graph API) resource.
 * Authentication (OAuth) is handled automatically by the API.
 *
 * Common usage patterns:
 * - List Sites:        GET  /v1.0/sites?search=*
 * - Get List Items:    GET  /v1.0/sites/{site-id}/lists/{list-id}/items?$expand=fields
 * - Search Files:      GET  /v1.0/sites/{site-id}/drive/root/search(q='report')
 * - Create Item:       POST /v1.0/sites/{site-id}/lists/{list-id}/items
 */
export interface ApiSharePointPayload {
  type: "api";
  subtype: "sharepoint";
  /** HTTP method to use */
  method: HttpMethod;
  /** Microsoft Graph API path (e.g. "/v1.0/sites?search=*") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body (for POST/PATCH requests) */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
