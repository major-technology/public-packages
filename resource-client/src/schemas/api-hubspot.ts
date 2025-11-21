import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a HubSpot API resource
 * Note: HubSpot authentication is handled automatically by the API
 */
export interface ApiHubSpotPayload {
  type: "api";
  subtype: "hubspot";
  /** HTTP method to use */
  method: HttpMethod;
  /** HubSpot API path (e.g., "/crm/v3/objects/deals") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body (HubSpot typically uses JSON) */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

