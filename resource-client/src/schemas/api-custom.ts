import type { BodyPayload, HttpMethod, QueryParams } from "./common";

/**
 * Custom API specific invoke data
 */
export interface CustomAPIInvokeData {
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

/**
 * Payload for invoking a custom API resource
 * Uses embedded structure for direct Go unmarshaling
 */
export interface ApiCustomPayload {
  type: "api";
  subtype: "custom";
  /** Embedded Custom API payload */
  custom: CustomAPIInvokeData;
}