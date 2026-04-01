import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildZohoDeskInvokePayload } from "../payload-builders/zohodesk";

export class ZohoDeskResourceClient extends BaseResourceClient {
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
    const payload = buildZohoDeskInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
