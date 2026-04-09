import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Gmail API resource
 * Note: Gmail authentication is handled automatically by the API
 */
export interface ApiGmailPayload {
  type: "api";
  subtype: "gmail";
  /** HTTP method to use */
  method: HttpMethod;
  /** Gmail API path (e.g., "users/me/messages") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
