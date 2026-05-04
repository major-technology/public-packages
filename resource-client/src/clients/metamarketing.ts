import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
  MetaMarketingInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildMetaMarketingInvokePayload } from "../payload-builders/metamarketing";

export class MetaMarketingResourceClient extends BaseResourceClient {
  /**
   * Make an HTTP request to the Meta Marketing API.
   *
   * @typeParam T - Shape of the expected JSON response
   * @param method - HTTP method (GET, POST, DELETE)
   * @param path - Graph API path (e.g. "/v21.0/act_123/campaigns")
   * @param invocationKey - Static string key for tracking this invocation
   * @param options - Optional query params, JSON body, and timeout
   * @returns Flattened response — check .ok, then access .json directly
   */
  async invoke<T = unknown>(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<MetaMarketingInvokeResponse<T>> {
    const payload = buildMetaMarketingInvokePayload(method, path, options);
    const raw = (await this.invokeRaw(
      payload,
      invocationKey
    )) as ApiInvokeResponse;

    if (!raw.ok) {
      return { ok: false, requestId: raw.requestId, error: raw.error };
    }

    if (raw.result.body.kind !== "json") {
      throw new Error(
        `Expected JSON response from Meta Marketing API, got ${raw.result.body.kind}`
      );
    }

    return {
      ok: true,
      requestId: raw.requestId,
      status: raw.result.status,
      json: raw.result.body.value as T,
    };
  }
}
