import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildGoogleCalendarInvokePayload } from "../payload-builders/googlecalendar";

export class GoogleCalendarResourceClient extends BaseResourceClient {
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildGoogleCalendarInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * List all calendars accessible to the connected account.
   * @param invocationKey Unique key for tracking this invocation
   */
  async listCalendars(invocationKey: string): Promise<ApiInvokeResponse> {
    return this.invoke("GET", "users/me/calendarList", invocationKey);
  }

  /**
   * List events from a calendar with optional filtering.
   * @param invocationKey Unique key for tracking this invocation
   * @param options Filtering options for events
   */
  async listEvents(
    invocationKey: string,
    options: {
      calendarId?: string;
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
      q?: string;
      singleEvents?: boolean;
      orderBy?: "startTime" | "updated";
      pageToken?: string;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const calendarId = options.calendarId ?? "primary";
    const query: QueryParams = {};

    if (options.timeMin) {
      query.timeMin = options.timeMin;
    }

    if (options.timeMax) {
      query.timeMax = options.timeMax;
    }

    if (options.maxResults) {
      query.maxResults = String(options.maxResults);
    }

    if (options.q) {
      query.q = options.q;
    }

    if (options.singleEvents) {
      query.singleEvents = "true";
    }

    if (options.orderBy) {
      query.orderBy = options.orderBy;
    }

    if (options.pageToken) {
      query.pageToken = options.pageToken;
    }

    return this.invoke(
      "GET",
      `calendars/${calendarId}/events`,
      invocationKey,
      { query }
    );
  }

  /**
   * Get a single event by ID.
   * @param eventId The event ID
   * @param invocationKey Unique key for tracking this invocation
   * @param calendarId Calendar ID (default: "primary")
   */
  async getEvent(
    eventId: string,
    invocationKey: string,
    calendarId: string = "primary"
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "GET",
      `calendars/${calendarId}/events/${eventId}`,
      invocationKey
    );
  }

  /**
   * Create a new calendar event.
   * @param event Event data
   * @param invocationKey Unique key for tracking this invocation
   * @param calendarId Calendar ID (default: "primary")
   */
  async createEvent(
    event: {
      summary: string;
      start: { dateTime?: string; date?: string; timeZone?: string };
      end: { dateTime?: string; date?: string; timeZone?: string };
      location?: string;
      description?: string;
      attendees?: Array<{ email: string }>;
    },
    invocationKey: string,
    calendarId: string = "primary"
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "POST",
      `calendars/${calendarId}/events`,
      invocationKey,
      { body: { type: "json", value: event } }
    );
  }

  /**
   * Update an existing calendar event.
   * @param eventId The event ID to update
   * @param event Partial event data to update
   * @param invocationKey Unique key for tracking this invocation
   * @param calendarId Calendar ID (default: "primary")
   */
  async updateEvent(
    eventId: string,
    event: Record<string, unknown>,
    invocationKey: string,
    calendarId: string = "primary"
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "PATCH",
      `calendars/${calendarId}/events/${eventId}`,
      invocationKey,
      { body: { type: "json", value: event } }
    );
  }

  /**
   * Delete a calendar event.
   * @param eventId The event ID to delete
   * @param invocationKey Unique key for tracking this invocation
   * @param calendarId Calendar ID (default: "primary")
   */
  async deleteEvent(
    eventId: string,
    invocationKey: string,
    calendarId: string = "primary"
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "DELETE",
      `calendars/${calendarId}/events/${eventId}`,
      invocationKey
    );
  }
}
