import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Google Drive API resource
 * Note: Google Drive authentication is handled automatically by the API
 */
export interface ApiGoogleDrivePayload {
  type: "api";
  subtype: "googledrive";
  /** HTTP method to use */
  method: HttpMethod;
  /** Google Drive API path (e.g., "files") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
