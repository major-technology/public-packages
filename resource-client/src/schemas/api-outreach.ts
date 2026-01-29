import type { HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking an Outreach API resource
 * Note: Outreach S2S authentication is handled automatically by the API
 */
export interface ApiOutreachPayload {
  type: "api";
  subtype: "outreach";
  /** HTTP method to use */
  method: HttpMethod;
  /** Outreach API path (e.g., "/api/v2/prospects") */
  path: string;
  /** Optional query parameters */
  queryParams?: QueryParams;
  /** Optional JSON body */
  body?: Record<string, unknown>;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Result from an Outreach API invocation
 */
export interface ApiOutreachResult {
  kind: "outreach";
  /** HTTP status code from Outreach API */
  statusCode: number;
  /** Response data from Outreach API */
  data: unknown;
  /** Response headers (optional) */
  headers?: Record<string, string>;
}
