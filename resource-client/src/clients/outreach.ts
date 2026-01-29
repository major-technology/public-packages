import type {
  HttpMethod,
  QueryParams,
  ApiOutreachPayload,
  OutreachInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";

export class OutreachResourceClient extends BaseResourceClient {
  /**
   * Invoke an Outreach API endpoint
   *
   * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @param path - Outreach API path (e.g., "/api/v2/prospects")
   * @param invocationKey - Unique key for this invocation (for idempotency/tracking)
   * @param options - Optional query params, body, and timeout
   */
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      queryParams?: QueryParams;
      body?: Record<string, unknown>;
      timeoutMs?: number;
    } = {}
  ): Promise<OutreachInvokeResponse> {
    const payload: ApiOutreachPayload = {
      type: "api",
      subtype: "outreach",
      method,
      path,
      queryParams: options.queryParams,
      body: options.body,
      timeoutMs: options.timeoutMs || 30000,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<OutreachInvokeResponse>;
  }
}
