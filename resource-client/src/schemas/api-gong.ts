import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Gong API resource
 * Note: Gong authentication is handled automatically by the API
 */
export interface ApiGongPayload {
  type: "api";
  subtype: "gong";
  /** HTTP method to use */
  method: HttpMethod;
  /** Gong API path (e.g., "/v2/calls") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
