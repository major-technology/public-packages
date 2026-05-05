import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Notion API resource.
 * Note: Notion authentication and Notion-Version header are handled automatically.
 */
export interface ApiNotionPayload {
  type: "api";
  subtype: "notion";
  /** HTTP method to use */
  method: HttpMethod;
  /** Notion API path (e.g., "/v1/pages/PAGE_ID") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
