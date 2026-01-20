import type {
  HttpMethod,
  QueryParams,
  JsonBody,
  ApiHubSpotPayload,
} from "../schemas";
import type { ApiInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class HubSpotResourceClient extends BaseResourceClient {
  /**
   * Make an HTTP request to the HubSpot API
   * @param method HTTP method
   * @param path HubSpot API path (e.g., "/crm/v3/objects/deals")
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional query, body, and timeout
   * @returns Response with nested result: response.result.api
   *
   * @example
   * ```ts
   * const response = await client.invoke(
   *   "GET",
   *   "/crm/v3/objects/deals",
   *   "list-deals"
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
      body?: JsonBody;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload: ApiHubSpotPayload = {
      type: "api",
      subtype: "hubspot",
      hubspot: {
        method,
        path,
        query: options.query,
        body: options.body,
        timeoutMs: options.timeoutMs || 30000,
      },
    };

    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
