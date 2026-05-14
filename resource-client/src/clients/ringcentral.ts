import type {
  HttpMethod,
  QueryParams,
  RingCentralInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildRingCentralInvokePayload } from "../payload-builders/ringcentral";

/**
 * Client for interacting with RingCentral API resources.
 *
 * This client provides a simple interface for making authenticated requests
 * to the RingCentral REST API. Authentication is handled automatically.
 *
 * @example
 * ```typescript
 * // List recent call log entries
 * const calls = await client.listCallLog("list-calls", {
 *   dateFrom: "2024-01-01T00:00:00Z",
 *   perPage: 25,
 * });
 *
 * // Send an SMS
 * const sms = await client.sendSms("+15551234567", "+15559876543", "Hello!", "send-sms");
 *
 * // Generic API call
 * const result = await client.invoke("GET", "/restapi/v1.0/account/~/extension", "list-ext");
 * ```
 */
export class RingCentralResourceClient extends BaseResourceClient {
  /**
   * Invoke a RingCentral API request
   *
   * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @param path - RingCentral API path (e.g., "/restapi/v1.0/account/~/call-log")
   * @param invocationKey - Unique key for this invocation (for tracking)
   * @param options - Optional query params, body, and timeout
   * @returns The API response with status and body
   */
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<RingCentralInvokeResponse> {
    const payload = buildRingCentralInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<RingCentralInvokeResponse>;
  }

  /**
   * List call log entries
   *
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional filters (dateFrom, dateTo, direction, type, perPage, page)
   * @returns Call log records
   */
  async listCallLog(
    invocationKey: string,
    options?: {
      dateFrom?: string;
      dateTo?: string;
      direction?: string;
      type?: string;
      perPage?: number;
      page?: number;
    }
  ): Promise<RingCentralInvokeResponse> {
    const query: QueryParams = {};
    if (options?.dateFrom) query.dateFrom = options.dateFrom;
    if (options?.dateTo) query.dateTo = options.dateTo;
    if (options?.direction) query.direction = options.direction;
    if (options?.type) query.type = options.type;
    if (options?.perPage !== undefined) query.perPage = String(options.perPage);
    if (options?.page !== undefined) query.page = String(options.page);

    return this.invoke("GET", "/restapi/v1.0/account/~/call-log", invocationKey, {
      query: Object.keys(query).length > 0 ? query : undefined,
    });
  }

  /**
   * Get a specific call record by ID
   *
   * @param callRecordId - The call record ID
   * @param invocationKey - Unique key for this invocation
   * @returns The call record details
   */
  async getCallRecord(
    callRecordId: string,
    invocationKey: string
  ): Promise<RingCentralInvokeResponse> {
    return this.invoke("GET", `/restapi/v1.0/account/~/call-log/${callRecordId}`, invocationKey);
  }

  /**
   * Send an SMS message
   *
   * @param from - Sender phone number
   * @param to - Recipient phone number
   * @param text - Message text
   * @param invocationKey - Unique key for this invocation
   * @returns The sent message details
   */
  async sendSms(
    from: string,
    to: string,
    text: string,
    invocationKey: string
  ): Promise<RingCentralInvokeResponse> {
    return this.invoke("POST", "/restapi/v1.0/account/~/extension/~/sms", invocationKey, {
      body: {
        type: "json",
        value: {
          from: { phoneNumber: from },
          to: [{ phoneNumber: to }],
          text,
        },
      },
    });
  }

  /**
   * List messages from the message store
   *
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional filters (messageType, dateFrom, dateTo, perPage, page)
   * @returns Message records
   */
  async listMessages(
    invocationKey: string,
    options?: {
      messageType?: string;
      dateFrom?: string;
      dateTo?: string;
      perPage?: number;
      page?: number;
    }
  ): Promise<RingCentralInvokeResponse> {
    const query: QueryParams = {};
    if (options?.messageType) query.messageType = options.messageType;
    if (options?.dateFrom) query.dateFrom = options.dateFrom;
    if (options?.dateTo) query.dateTo = options.dateTo;
    if (options?.perPage !== undefined) query.perPage = String(options.perPage);
    if (options?.page !== undefined) query.page = String(options.page);

    return this.invoke("GET", "/restapi/v1.0/account/~/extension/~/message-store", invocationKey, {
      query: Object.keys(query).length > 0 ? query : undefined,
    });
  }

  /**
   * List extensions on the account
   *
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional filters (type, status, perPage, page)
   * @returns Extension records
   */
  async listExtensions(
    invocationKey: string,
    options?: {
      type?: string;
      status?: string;
      perPage?: number;
      page?: number;
    }
  ): Promise<RingCentralInvokeResponse> {
    const query: QueryParams = {};
    if (options?.type) query.type = options.type;
    if (options?.status) query.status = options.status;
    if (options?.perPage !== undefined) query.perPage = String(options.perPage);
    if (options?.page !== undefined) query.page = String(options.page);

    return this.invoke("GET", "/restapi/v1.0/account/~/extension", invocationKey, {
      query: Object.keys(query).length > 0 ? query : undefined,
    });
  }

  /**
   * Get a specific extension by ID
   *
   * @param extensionId - The extension ID
   * @param invocationKey - Unique key for this invocation
   * @returns The extension details
   */
  async getExtension(
    extensionId: string,
    invocationKey: string
  ): Promise<RingCentralInvokeResponse> {
    return this.invoke("GET", `/restapi/v1.0/account/~/extension/${extensionId}`, invocationKey);
  }
}
