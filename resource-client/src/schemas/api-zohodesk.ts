import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Zoho Desk API resource
 * Note: Zoho Desk authentication is handled automatically by the API
 */
export interface ApiZohoDeskPayload {
  type: "api";
  subtype: "zohodesk";
  /** HTTP method to use */
  method: HttpMethod;
  /** Zoho Desk API path (e.g., "/api/v1/tickets") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
