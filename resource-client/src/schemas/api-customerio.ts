import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Customer.io API resource
 * Note: Customer.io authentication is handled automatically by the API
 */
export interface ApiCustomerIOPayload {
  type: "api";
  subtype: "customerio";
  /** HTTP method to use */
  method: HttpMethod;
  /** Customer.io API path as documented: "/v1/..." for the App API, "/api/v1/..." or "/api/v2/..." for the Track API */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
