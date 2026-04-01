import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Zoho Projects API resource
 * Note: Zoho Projects authentication is handled automatically by the API
 */
export interface ApiZohoProjectsPayload {
  type: "api";
  subtype: "zohoprojects";
  /** HTTP method to use */
  method: HttpMethod;
  /** Zoho Projects API path (e.g., "/restapi/portal/{portalId}/projects/") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
