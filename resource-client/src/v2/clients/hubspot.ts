import type {
  HttpMethod,
  QueryParams,
  ApiHubSpotPayloadV2,
} from "../../schemas/v2";
import type { ApiInvokeResponse } from "../../schemas/v2/response";
import { BaseResourceClientV2 } from "../base";

export class HubSpotResourceClientV2 extends BaseResourceClientV2 {
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
    const payload: ApiHubSpotPayloadV2 = {
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
