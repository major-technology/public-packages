import type { ApiSalesforcePayload, HttpMethod, QueryParams, JsonBody } from "../schemas";

/**
 * Build a Salesforce invoke payload
 * @param method HTTP method to use
 * @param path Salesforce API path
 * @param options Additional options
 */
export function buildSalesforceInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiSalesforcePayload {
  return {
    type: "api",
    subtype: "salesforce",
    method,
    path,
    query: options?.query,
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

/**
 * Build a Salesforce query payload for SOQL queries
 * @param query SOQL query string
 * @param options Additional options
 */
export function buildSalesforceQueryPayload(
  query: string,
  options?: { timeoutMs?: number }
): ApiSalesforcePayload {
  return buildSalesforceInvokePayload("GET", "/services/data/v63.0/query", {
    query: { q: [query] },
    timeoutMs: options?.timeoutMs,
  });
}

/**
 * Build a Salesforce getRecord payload
 * @param objectType Salesforce object type (e.g., "Account", "Contact")
 * @param recordId The record ID
 * @param options Optional fields to retrieve and timeout
 */
export function buildSalesforceGetRecordPayload(
  objectType: string,
  recordId: string,
  options?: { fields?: string[]; timeoutMs?: number }
): ApiSalesforcePayload {
  const query: QueryParams = {};
  if (options?.fields && options.fields.length > 0) {
    query.fields = [options.fields.join(",")];
  }

  return buildSalesforceInvokePayload(
    "GET",
    `/services/data/v63.0/sobjects/${objectType}/${recordId}`,
    {
      query: Object.keys(query).length > 0 ? query : undefined,
      timeoutMs: options?.timeoutMs,
    }
  );
}

/**
 * Build a Salesforce createRecord payload
 * @param objectType Salesforce object type (e.g., "Account", "Contact")
 * @param data Record data to create
 * @param options Additional options
 */
export function buildSalesforceCreateRecordPayload(
  objectType: string,
  data: Record<string, unknown>,
  options?: { timeoutMs?: number }
): ApiSalesforcePayload {
  return buildSalesforceInvokePayload(
    "POST",
    `/services/data/v63.0/sobjects/${objectType}`,
    {
      body: { type: "json", value: data },
      timeoutMs: options?.timeoutMs,
    }
  );
}

/**
 * Build a Salesforce updateRecord payload
 * @param objectType Salesforce object type (e.g., "Account", "Contact")
 * @param recordId The record ID to update
 * @param data Fields to update
 * @param options Additional options
 */
export function buildSalesforceUpdateRecordPayload(
  objectType: string,
  recordId: string,
  data: Record<string, unknown>,
  options?: { timeoutMs?: number }
): ApiSalesforcePayload {
  return buildSalesforceInvokePayload(
    "PATCH",
    `/services/data/v63.0/sobjects/${objectType}/${recordId}`,
    {
      body: { type: "json", value: data },
      timeoutMs: options?.timeoutMs,
    }
  );
}

/**
 * Build a Salesforce deleteRecord payload
 * @param objectType Salesforce object type (e.g., "Account", "Contact")
 * @param recordId The record ID to delete
 * @param options Additional options
 */
export function buildSalesforceDeleteRecordPayload(
  objectType: string,
  recordId: string,
  options?: { timeoutMs?: number }
): ApiSalesforcePayload {
  return buildSalesforceInvokePayload(
    "DELETE",
    `/services/data/v63.0/sobjects/${objectType}/${recordId}`,
    {
      timeoutMs: options?.timeoutMs,
    }
  );
}

/**
 * Build a Salesforce describeObject payload
 * @param objectType Salesforce object type (e.g., "Account", "Contact")
 * @param options Additional options
 */
export function buildSalesforceDescribeObjectPayload(
  objectType: string,
  options?: { timeoutMs?: number }
): ApiSalesforcePayload {
  return buildSalesforceInvokePayload(
    "GET",
    `/services/data/v63.0/sobjects/${objectType}/describe`,
    {
      timeoutMs: options?.timeoutMs,
    }
  );
}
