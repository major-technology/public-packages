import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Google Calendar API resource
 * Note: Google Calendar authentication is handled automatically by the API
 */
export interface ApiGoogleCalendarPayload {
  type: "api";
  subtype: "googlecalendar";
  /** HTTP method to use */
  method: HttpMethod;
  /** Google Calendar API path (e.g., "/calendars/primary/events") */
  path: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
