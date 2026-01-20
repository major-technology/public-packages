import type {
  HttpMethod,
  QueryParams,
  BodyPayload,
  ApiCustomPayloadV2,
} from "../../schemas/v2";
import type { ApiInvokeResponse } from "../../schemas/v2/response";
import { BaseResourceClientV2 } from "../base";

export class CustomApiResourceClientV2 extends BaseResourceClientV2 {
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
    const payload: ApiCustomPayloadV2 = {
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
