import type {
  HttpMethod,
  QueryParams,
  ApiHubSpotPayload,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";

export class HubSpotResourceClient extends BaseResourceClient {
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
    const payload: ApiHubSpotPayload = {
      type: "api",
      subtype: "hubspot",
      method,
      path,
      query: options.query,
      body: options.body,
      timeoutMs: options.timeoutMs || 30000,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}

