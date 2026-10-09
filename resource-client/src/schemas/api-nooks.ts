import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Nooks API resource
 * Note: Nooks authentication is handled automatically by the API
 */
export interface ApiNooksPayload {
  type: "api";
  subtype: "nooks";
  /** HTTP method to use */
  method: HttpMethod;
  /** Nooks API path relative to https://partner-api.nooks.in/v1 (e.g., "/users"), or a links.next URL */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
