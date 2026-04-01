import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildZohoProjectsInvokePayload } from "../payload-builders/zohoprojects";

export class ZohoProjectsResourceClient extends BaseResourceClient {
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
    const payload = buildZohoProjectsInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
