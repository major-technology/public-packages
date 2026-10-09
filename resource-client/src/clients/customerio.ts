import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildCustomerIOInvokePayload } from "../payload-builders/customerio";

export class CustomerIOResourceClient extends BaseResourceClient {
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
    const payload = buildCustomerIOInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
