import type { ApiInvokeResponse } from "../schemas";
import { BaseResourceClient } from "../base";
import { buildSlackInvokePayload } from "../payload-builders/slack";

export class SlackResourceClient extends BaseResourceClient {
  async invoke(
    method: string,
    invocationKey: string,
    options: {
      body?: Record<string, unknown>;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildSlackInvokePayload(method, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
