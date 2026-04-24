import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking an Attio API resource
 * Note: Attio authentication is handled automatically by the API
 */
export interface ApiAttioPayload {
  type: "api";
  subtype: "attio";
  /** HTTP method to use */
  method: HttpMethod;
  /** Attio API path (e.g., "/v2/objects") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Flattened success response for Attio API calls.
 * The generic T types the parsed JSON body directly — no need to
 * dig through result.body.kind / result.body.value.
 */
export interface AttioInvokeSuccess<T> {
  ok: true;
  requestId: string;
  /** HTTP status code from Attio */
  status: number;
  /** Parsed JSON response body, typed as T */
  json: T;
}

export interface AttioInvokeFailure {
  ok: false;
  requestId: string;
  error: { message: string; httpStatus?: number };
}

/**
 * Discriminated union for Attio invoke responses.
 * Use response.ok to narrow, then access response.json directly.
 */
export type AttioInvokeResponse<T = unknown> =
  | AttioInvokeSuccess<T>
  | AttioInvokeFailure;
