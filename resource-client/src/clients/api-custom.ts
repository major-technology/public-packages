import type {
  HttpMethod,
  QueryParams,
  BodyPayload,
  ApiCustomPayload,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";

export class CustomApiResourceClient extends BaseResourceClient {
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
      method,
      path,
      query: options.query,
      headers: options.headers,
      body: options.body,
      timeoutMs: options.timeoutMs || 30000,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}

