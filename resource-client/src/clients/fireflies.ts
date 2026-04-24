import type {
  ApiInvokeResponse,
  FirefliesInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildFirefliesQueryPayload, buildFirefliesMutatePayload } from "../payload-builders/fireflies";

export class FirefliesResourceClient extends BaseResourceClient {
  /**
   * Execute a GraphQL query against the Fireflies API.
   *
   * @typeParam T - Shape of the expected data payload from Fireflies
   * @param query - GraphQL query string
   * @param invocationKey - Static string key for tracking
   * @param options - Optional variables, operationName, timeoutMs
   * @returns Flattened response — check .ok, then access .data directly
   */
  async query<T = unknown>(
    query: string,
    invocationKey: string,
    options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
  ): Promise<FirefliesInvokeResponse<T>> {
    const payload = buildFirefliesQueryPayload(query, options);
    const raw = await this.invokeRaw(payload, invocationKey) as ApiInvokeResponse;
    return this.flattenResponse<T>(raw);
  }

  /**
   * Execute a GraphQL mutation against the Fireflies API.
   * Same signature as query but semantically for mutations.
   */
  async mutate<T = unknown>(
    mutation: string,
    invocationKey: string,
    options?: { variables?: Record<string, unknown>; operationName?: string; timeoutMs?: number }
  ): Promise<FirefliesInvokeResponse<T>> {
    const payload = buildFirefliesMutatePayload(mutation, options);
    const raw = await this.invokeRaw(payload, invocationKey) as ApiInvokeResponse;
    return this.flattenResponse<T>(raw);
  }

  /** Flatten the raw API envelope into the Fireflies response shape */
  private flattenResponse<T>(raw: ApiInvokeResponse): FirefliesInvokeResponse<T> {
    if (!raw.ok) {
      return { ok: false, requestId: raw.requestId, error: raw.error };
    }

    if (raw.result.body.kind !== "json") {
      throw new Error(`Expected JSON response from Fireflies, got ${raw.result.body.kind}`);
    }

    const body = raw.result.body.value as { data?: T; errors?: Array<{ message: string; path?: string[] }> };

    if (body.errors?.length) {
      return {
        ok: false,
        requestId: raw.requestId,
        error: {
          message: body.errors[0].message,
          graphqlErrors: body.errors,
        },
      };
    }

    return { ok: true, requestId: raw.requestId, data: body.data as T };
  }
}
