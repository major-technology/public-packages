import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a RingCentral API resource
 * Note: RingCentral authentication is handled automatically by the API
 */
export interface ApiRingCentralPayload {
  type: "api";
  subtype: "ringcentral";
  /** HTTP method to use */
  method: HttpMethod;
  /** RingCentral API path (e.g., "/restapi/v1.0/account/~/call-log") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
