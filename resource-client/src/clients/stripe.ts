import type {
  HttpMethod,
  QueryParams,
  ApiInvokeResponse,
  StripeInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildStripeInvokePayload } from "../payload-builders/stripe";

export class StripeResourceClient extends BaseResourceClient {
  /**
   * Make an HTTP request to the Stripe API.
   *
   * @typeParam T - Shape of the expected JSON response from Stripe
   * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @param path - Stripe API path (e.g. "/v1/customers")
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
  ): Promise<StripeInvokeResponse<T>> {
    const payload = buildStripeInvokePayload(method, path, options);
    const raw = (await this.invokeRaw(
      payload,
      invocationKey
    )) as ApiInvokeResponse;

    if (!raw.ok) {
      return { ok: false, requestId: raw.requestId, error: raw.error };
    }

    if (raw.result.body.kind !== "json") {
      throw new Error(
        `Expected JSON response from Stripe, got ${raw.result.body.kind}`
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
