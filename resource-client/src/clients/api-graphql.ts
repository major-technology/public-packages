import type { ApiInvokeResponse } from "../schemas";
import { BaseResourceClient } from "../base";
import { buildGraphQLInvokePayload } from "../payload-builders/graphql";

export class GraphQLResourceClient extends BaseResourceClient {
  async query(
    query: string,
    invocationKey: string,
    options: {
      variables?: Record<string, unknown>;
      operationName?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildGraphQLInvokePayload(query, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  async mutate(
    mutation: string,
    invocationKey: string,
    options: {
      variables?: Record<string, unknown>;
      operationName?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildGraphQLInvokePayload(mutation, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
