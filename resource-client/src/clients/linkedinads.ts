import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildLinkedInAdsInvokePayload } from "../payload-builders/linkedinads";

export class LinkedInAdsResourceClient extends BaseResourceClient {
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
    const payload = buildLinkedInAdsInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
