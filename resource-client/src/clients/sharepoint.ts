import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildSharePointInvokePayload } from "../payload-builders/sharepoint";

/**
 * Flattened success response for SharePoint API calls.
 */
export interface SharePointInvokeSuccess<T> {
  ok: true;
  requestId: string;
  status: number;
  json: T;
}

export interface SharePointInvokeFailure {
  ok: false;
  requestId: string;
  error: { message: string; httpStatus?: number };
}

export type SharePointInvokeResponse<T = unknown> =
  | SharePointInvokeSuccess<T>
  | SharePointInvokeFailure;

/**
 * Client for interacting with Microsoft SharePoint via Microsoft Graph API.
 *
 * This client provides a generic `invoke()` method for all Graph API operations.
 * Authentication (OAuth) is handled automatically.
 *
 * @example
 * ```typescript
 * // List all sites
 * const sites = await client.invoke("GET", "/v1.0/sites?search=*", "list-sites");
 *
 * // Get list items
 * const items = await client.invoke(
 *   "GET",
 *   "/v1.0/sites/{site-id}/lists/{list-id}/items?$expand=fields",
 *   "get-list-items"
 * );
 *
 * // Create a list item (body is a plain object)
 * const newItem = await client.invoke(
 *   "POST",
 *   "/v1.0/sites/{site-id}/lists/{list-id}/items",
 *   "create-item",
 *   { body: { fields: { Title: "New Item" } } }
 * );
 * ```
 */
export class SharePointResourceClient extends BaseResourceClient {
  /**
   * Generic passthrough for any Microsoft Graph API request.
   *
   * @param method - HTTP method (GET, POST, PATCH, DELETE)
   * @param path - Microsoft Graph API path (e.g. "/v1.0/sites?search=*")
   * @param invocationKey - Unique key for this invocation (for tracking)
   * @param options - Optional query params, body, and timeout
   * @returns The API response with status and body
   */
  async invoke<T = unknown>(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: Record<string, unknown>;
      timeoutMs?: number;
    } = {}
  ): Promise<SharePointInvokeResponse<T>> {
    const payload = buildSharePointInvokePayload(method, path, options);
    const raw = (await this.invokeRaw(payload, invocationKey)) as ApiInvokeResponse;

    if (!raw.ok) {
      return { ok: false, requestId: raw.requestId, error: raw.error };
    }

    if (raw.result.body.kind !== "json") {
      throw new Error(
        `Expected JSON response from SharePoint API, got ${raw.result.body.kind}`
      );
    }

    return {
      ok: true,
      requestId: raw.requestId,
      status: raw.result.status,
      json: raw.result.body.value as T,
    };
  }
}
