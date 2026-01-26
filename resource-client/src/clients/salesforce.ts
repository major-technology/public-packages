import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildSalesforceInvokePayload } from "../payload-builders/salesforce";

/**
 * Client for interacting with Salesforce API resources.
 *
 * This client provides a simple interface for making authenticated requests
 * to the Salesforce REST API. Authentication is handled automatically.
 *
 * @example
 * ```typescript
 * // Query accounts using SOQL
 * const result = await client.invoke(
 *   "GET",
 *   "/services/data/v63.0/query",
 *   "query-accounts",
 *   { query: { q: ["SELECT Id, Name FROM Account LIMIT 10"] } }
 * );
 *
 * // Get a specific account
 * const account = await client.invoke(
 *   "GET",
 *   "/services/data/v63.0/sobjects/Account/001xx000003ABCDEF",
 *   "get-account"
 * );
 *
 * // Create a new account
 * const newAccount = await client.invoke(
 *   "POST",
 *   "/services/data/v63.0/sobjects/Account",
 *   "create-account",
 *   { body: { type: "json", value: { Name: "Acme Corp" } } }
 * );
 *
 * // Update an account
 * await client.invoke(
 *   "PATCH",
 *   "/services/data/v63.0/sobjects/Account/001xx000003ABCDEF",
 *   "update-account",
 *   { body: { type: "json", value: { Name: "Updated Name" } } }
 * );
 * ```
 */
export class SalesforceResourceClient extends BaseResourceClient {
  /**
   * Invoke a Salesforce API request
   *
   * @param method - HTTP method (GET, POST, PATCH, DELETE)
   * @param path - Salesforce API path (e.g., "/services/data/v63.0/query")
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
  ): Promise<ApiInvokeResponse> {
    const payload = buildSalesforceInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * Execute a SOQL query
   *
   * @param query - SOQL query string
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional timeout
   * @returns Query results
   *
   * @example
   * ```typescript
   * const result = await client.query(
   *   "SELECT Id, Name, CreatedDate FROM Account WHERE CreatedDate > 2024-01-01T00:00:00Z",
   *   "recent-accounts"
   * );
   * ```
   */
  async query(
    query: string,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<ApiInvokeResponse> {
    return this.invoke("GET", "/services/data/v63.0/query", invocationKey, {
      query: { q: [query] },
      timeoutMs: options.timeoutMs,
    });
  }

  /**
   * Get a single record by ID
   *
   * @param objectType - Salesforce object type (e.g., "Account", "Contact")
   * @param recordId - The record ID
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional fields to retrieve and timeout
   * @returns The record data
   */
  async getRecord(
    objectType: string,
    recordId: string,
    invocationKey: string,
    options: { fields?: string[]; timeoutMs?: number } = {}
  ): Promise<ApiInvokeResponse> {
    const query: QueryParams = {};
    if (options.fields && options.fields.length > 0) {
      query.fields = [options.fields.join(",")];
    }

    return this.invoke(
      "GET",
      `/services/data/v63.0/sobjects/${objectType}/${recordId}`,
      invocationKey,
      { query: Object.keys(query).length > 0 ? query : undefined, timeoutMs: options.timeoutMs }
    );
  }

  /**
   * Create a new record
   *
   * @param objectType - Salesforce object type (e.g., "Account", "Contact")
   * @param data - Record data
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional timeout
   * @returns The created record ID
   */
  async createRecord(
    objectType: string,
    data: Record<string, unknown>,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "POST",
      `/services/data/v63.0/sobjects/${objectType}`,
      invocationKey,
      { body: { type: "json", value: data }, timeoutMs: options.timeoutMs }
    );
  }

  /**
   * Update an existing record
   *
   * @param objectType - Salesforce object type (e.g., "Account", "Contact")
   * @param recordId - The record ID to update
   * @param data - Fields to update
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional timeout
   * @returns Empty response on success
   */
  async updateRecord(
    objectType: string,
    recordId: string,
    data: Record<string, unknown>,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "PATCH",
      `/services/data/v63.0/sobjects/${objectType}/${recordId}`,
      invocationKey,
      { body: { type: "json", value: data }, timeoutMs: options.timeoutMs }
    );
  }

  /**
   * Delete a record
   *
   * @param objectType - Salesforce object type (e.g., "Account", "Contact")
   * @param recordId - The record ID to delete
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional timeout
   * @returns Empty response on success
   */
  async deleteRecord(
    objectType: string,
    recordId: string,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "DELETE",
      `/services/data/v63.0/sobjects/${objectType}/${recordId}`,
      invocationKey,
      { timeoutMs: options.timeoutMs }
    );
  }

  /**
   * Describe an object to get its metadata
   *
   * @param objectType - Salesforce object type (e.g., "Account", "Contact")
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional timeout
   * @returns Object metadata including fields, relationships, etc.
   */
  async describeObject(
    objectType: string,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<ApiInvokeResponse> {
    return this.invoke(
      "GET",
      `/services/data/v63.0/sobjects/${objectType}/describe`,
      invocationKey,
      { timeoutMs: options.timeoutMs }
    );
  }
}
