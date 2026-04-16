import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Clerk Backend API resource
 * Note: Clerk authentication is handled automatically by the API
 */
export interface ApiClerkPayload {
  type: "api";
  subtype: "clerk";
  /** HTTP method to use */
  method: HttpMethod;
  /** Clerk API path (e.g., "/v1/users") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
