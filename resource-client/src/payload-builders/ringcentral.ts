import type { ApiRingCentralPayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a RingCentral invoke payload
 * @param method HTTP method to use
 * @param path RingCentral API path
 * @param options Additional options
 */
export function buildRingCentralInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiRingCentralPayload {
  return {
    type: "api",
    subtype: "ringcentral",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

/**
 * Build a payload to list call log entries
 * @param options Optional filters for call log
 */
export function buildRingCentralListCallLogPayload(
  options?: {
    dateFrom?: string;
    dateTo?: string;
    direction?: string;
    type?: string;
    perPage?: number;
    page?: number;
  }
): ApiRingCentralPayload {
  const query: QueryParams = {};
  if (options?.dateFrom) query.dateFrom = options.dateFrom;
  if (options?.dateTo) query.dateTo = options.dateTo;
  if (options?.direction) query.direction = options.direction;
  if (options?.type) query.type = options.type;
  if (options?.perPage !== undefined) query.perPage = String(options.perPage);
  if (options?.page !== undefined) query.page = String(options.page);

  return buildRingCentralInvokePayload("GET", "/v1.0/account/~/call-log", {
    query: Object.keys(query).length > 0 ? query : undefined,
  });
}

/**
 * Build a payload to get a specific call record
 * @param callRecordId The call record ID
 */
export function buildRingCentralGetCallRecordPayload(
  callRecordId: string
): ApiRingCentralPayload {
  return buildRingCentralInvokePayload("GET", `/v1.0/account/~/call-log/${callRecordId}`);
}

/**
 * Build a payload to send an SMS message
 * @param from Sender phone number
 * @param to Recipient phone number
 * @param text Message text
 */
export function buildRingCentralSendSmsPayload(
  from: string,
  to: string,
  text: string
): ApiRingCentralPayload {
  return buildRingCentralInvokePayload("POST", "/v1.0/account/~/extension/~/sms", {
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
 * Build a payload to list messages
 * @param options Optional filters for messages
 */
export function buildRingCentralListMessagesPayload(
  options?: {
    messageType?: string;
    dateFrom?: string;
    dateTo?: string;
    perPage?: number;
    page?: number;
  }
): ApiRingCentralPayload {
  const query: QueryParams = {};
  if (options?.messageType) query.messageType = options.messageType;
  if (options?.dateFrom) query.dateFrom = options.dateFrom;
  if (options?.dateTo) query.dateTo = options.dateTo;
  if (options?.perPage !== undefined) query.perPage = String(options.perPage);
  if (options?.page !== undefined) query.page = String(options.page);

  return buildRingCentralInvokePayload("GET", "/v1.0/account/~/extension/~/message-store", {
    query: Object.keys(query).length > 0 ? query : undefined,
  });
}

/**
 * Build a payload to list extensions
 * @param options Optional filters for extensions
 */
export function buildRingCentralListExtensionsPayload(
  options?: {
    type?: string;
    status?: string;
    perPage?: number;
    page?: number;
  }
): ApiRingCentralPayload {
  const query: QueryParams = {};
  if (options?.type) query.type = options.type;
  if (options?.status) query.status = options.status;
  if (options?.perPage !== undefined) query.perPage = String(options.perPage);
  if (options?.page !== undefined) query.page = String(options.page);

  return buildRingCentralInvokePayload("GET", "/v1.0/account/~/extension", {
    query: Object.keys(query).length > 0 ? query : undefined,
  });
}

/**
 * Build a payload to get a specific extension
 * @param extensionId The extension ID
 */
export function buildRingCentralGetExtensionPayload(
  extensionId: string
): ApiRingCentralPayload {
  return buildRingCentralInvokePayload("GET", `/v1.0/account/~/extension/${extensionId}`);
}
