import type {
  HttpMethod,
  QueryParams,
  BodyPayload,
  ApiCustomPayload,
} from "../schemas";
import type { ApiInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class CustomApiResourceClient extends BaseResourceClient {
  /**
   * Make an HTTP request to a custom API resource
   * @param method HTTP method
   * @param path Path to append to the resource's base URL
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional query, headers, body, and timeout
   * @returns Response with nested result: response.result.api
   *
   * @example
   * ```ts
   * const response = await client.invoke(
   *   "GET",
   *   "/users/123",
   *   "get-user-123"
   * );
   *
   * if (response.ok) {
   *   const { status, body } = response.result.api;
   *   if (body.kind === "json") {
   *     console.log(body.value);
   *   }
   * }
   * ```
   */
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      headers?: Record<string, string>;
      body?: BodyPayload;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload: ApiCustomPayload = {
      type: "api",
      subtype: "custom",
      custom: {
        method,
        path,
        query: options.query,
        headers: options.headers,
        body: options.body,
        timeoutMs: options.timeoutMs || 30000,
      },
    };

    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
