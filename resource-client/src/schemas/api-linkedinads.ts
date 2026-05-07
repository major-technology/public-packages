import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a LinkedIn Marketing API resource
 * Note: LinkedIn authentication is handled automatically by the API
 */
export interface ApiLinkedInAdsPayload {
  type: "api";
  subtype: "linkedinads";
  /** HTTP method to use */
  method: HttpMethod;
  /** LinkedIn Marketing API path (e.g., "/rest/adAccounts") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
