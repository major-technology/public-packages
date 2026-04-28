import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking Meta Marketing API
 * Note: Meta Marketing authentication is handled automatically by the API
 */
export interface ApiMetaMarketingPayload {
  type: "api";
  subtype: "metamarketing";
  /** HTTP method to use */
  method: HttpMethod;
  /** Graph API path (e.g., "/v21.0/act_123/campaigns") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Flattened success response for Meta Marketing API calls.
 * The generic T types the parsed JSON body directly — no need to
 * dig through result.body.kind / result.body.value.
 */
export interface MetaMarketingInvokeSuccess<T> {
  ok: true;
  requestId: string;
  /** HTTP status code from Meta Marketing API */
  status: number;
  /** Parsed JSON response body, typed as T */
  json: T;
}

export interface MetaMarketingInvokeFailure {
  ok: false;
  requestId: string;
  error: { message: string; httpStatus?: number };
}

/**
 * Discriminated union for Meta Marketing invoke responses.
 * Use response.ok to narrow, then access response.json directly.
 */
export type MetaMarketingInvokeResponse<T = unknown> =
  | MetaMarketingInvokeSuccess<T>
  | MetaMarketingInvokeFailure;
