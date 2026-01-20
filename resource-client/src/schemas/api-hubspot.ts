import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * HubSpot specific invoke data
 */
export interface HubSpotInvokeData {
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

/**
 * Payload for invoking a HubSpot API resource
 * Uses embedded structure for direct Go unmarshaling
 * Note: HubSpot authentication is handled automatically by the API
 */
export interface ApiHubSpotPayload {
  type: "api";
  subtype: "hubspot";
  /** Embedded HubSpot payload */
  hubspot: HubSpotInvokeData;
}