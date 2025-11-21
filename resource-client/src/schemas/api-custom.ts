import type { BodyPayload, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a custom API resource
 */
export interface ApiCustomPayload {
  type: "api";
  subtype: "custom";
  /** HTTP method to use */
  method: HttpMethod;
  /** Path to append to the resource's base URL */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional additional headers to include */
  headers?: Record<string, string>;
  /** Optional request body */
  body?: BodyPayload;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

