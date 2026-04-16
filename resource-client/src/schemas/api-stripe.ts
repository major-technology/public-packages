import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Stripe API resource
 * Note: Stripe authentication is handled automatically by the API
 */
export interface ApiStripePayload {
  type: "api";
  subtype: "stripe";
  /** HTTP method to use */
  method: HttpMethod;
  /** Stripe API path (e.g., "/v1/customers") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Flattened success response for Stripe API calls.
 * The generic T types the parsed JSON body directly — no need to
 * dig through result.body.kind / result.body.value.
 */
export interface StripeInvokeSuccess<T> {
  ok: true;
  requestId: string;
  /** HTTP status code from Stripe */
  status: number;
  /** Parsed JSON response body, typed as T */
  json: T;
}

export interface StripeInvokeFailure {
  ok: false;
  requestId: string;
  error: { message: string; httpStatus?: number };
}

/**
 * Discriminated union for Stripe invoke responses.
 * Use response.ok to narrow, then access response.json directly.
 */
export type StripeInvokeResponse<T = unknown> =
  | StripeInvokeSuccess<T>
  | StripeInvokeFailure;
