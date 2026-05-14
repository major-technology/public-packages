import type { ApiInvokeResponse } from "../schemas";
import { BaseResourceClient } from "../base";
import { buildPayloadCMSQueryPayload, buildPayloadCMSMutatePayload } from "../payload-builders/payloadcms";

export class PayloadCMSResourceClient extends BaseResourceClient {
  /**
   * Execute a GraphQL query against the Payload CMS API.
   *
   * @param query - GraphQL query string
   * @param invocationKey - Static string key for tracking
   * @param options - Optional variables, operationName, timeoutMs
   */
  async query(
    query: string,
    invocationKey: string,
    options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
  ): Promise<ApiInvokeResponse> {
    const payload = buildPayloadCMSQueryPayload(query, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * Execute a GraphQL mutation against the Payload CMS API.
   * Same signature as query but semantically for mutations.
   */
  async mutate(
    mutation: string,
    invocationKey: string,
    options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
  ): Promise<ApiInvokeResponse> {
    const payload = buildPayloadCMSMutatePayload(mutation, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
