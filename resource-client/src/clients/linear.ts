import type { ApiInvokeResponse } from "../schemas";
import { BaseResourceClient } from "../base";
import { buildLinearGraphQLPayload } from "../payload-builders/linear";

export class LinearResourceClient extends BaseResourceClient {
  async graphql(
    query: string,
    invocationKey: string,
    options: {
      variables?: Record<string, unknown>;
      operationName?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildLinearGraphQLPayload(query, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
