/**
 * Payload for invoking a Fireflies GraphQL query/mutation
 */
export interface ApiFirefliesPayload {
  type: "api";
  subtype: "fireflies";
  /** GraphQL query or mutation string */
  query: string;
  /** GraphQL variables */
  variables?: Record<string, unknown>;
  /** GraphQL operation name */
  operationName?: string;
  /** Timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Flattened success response for Fireflies API calls.
 * The generic T types the parsed GraphQL data payload directly —
 * no need to dig through result.body.kind / result.body.value / data.
 */
export interface FirefliesInvokeSuccess<T> {
  ok: true;
  requestId: string;
  /** Parsed GraphQL data object, typed as T */
  data: T;
}

export interface FirefliesInvokeFailure {
  ok: false;
  requestId: string;
  error: { message: string; graphqlErrors?: Array<{ message: string; path?: string[] }> };
}

/**
 * Discriminated union for Fireflies invoke responses.
 * Use response.ok to narrow, then access response.data directly.
 */
export type FirefliesInvokeResponse<T = unknown> =
  | FirefliesInvokeSuccess<T>
  | FirefliesInvokeFailure;
