import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildQuickBooksInvokePayload, buildQuickBooksQueryPayload } from "../payload-builders/quickbooks";

export class QuickBooksResourceClient extends BaseResourceClient {
  /**
   * Invoke a QuickBooks API request
   *
   * @param method - HTTP method (GET, POST, PUT, DELETE)
   * @param path - QuickBooks API path relative to /v3/company/{realmId}
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
    const payload = buildQuickBooksInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * Execute a QuickBooks query using SQL-like syntax
   *
   * @param query - QuickBooks query string (e.g., "SELECT * FROM Customer WHERE DisplayName LIKE 'A%'")
   * @param invocationKey - Unique key for this invocation
   * @param options - Optional timeout
   * @returns Query results
   *
   * @example
   * ```typescript
   * const result = await client.query(
   *   "SELECT * FROM Invoice WHERE TotalAmt > '100.00'",
   *   "recent-invoices"
   * );
   * ```
   */
  async query(
    query: string,
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildQuickBooksQueryPayload(query, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
