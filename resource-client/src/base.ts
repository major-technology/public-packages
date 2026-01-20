import type {
  ResourceInvokePayload,
  InvokeResponse,
  InvokeRequest,
} from "./schemas";
import { ResourceInvokeError } from "./errors";

export interface BaseClientConfig {
  /** Base URL for the Go API service */
  baseUrl: string;
  majorJwtToken?: string;
  applicationId: string;
  resourceId: string;
  fetch?: typeof fetch;
  /**
   * Optional function to get additional headers (e.g. for auth)
   * Useful for Next.js Server Components where headers() must be called dynamically
   */
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
}

export abstract class BaseResourceClient {
  protected readonly config: {
    baseUrl: string;
    majorJwtToken?: string;
    applicationId: string;
    resourceId: string;
    fetch: typeof fetch;
    getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
  };

  constructor(config: BaseClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""),
      majorJwtToken: config.majorJwtToken,
      applicationId: config.applicationId,
      resourceId: config.resourceId,
      fetch: config.fetch || globalThis.fetch,
      getHeaders: config.getHeaders,
    };
  }

  protected async invokeRaw(
    payload: ResourceInvokePayload,
    invocationKey: string,
  ): Promise<InvokeResponse> {
    // V2 endpoint on the Go service
    const url = `${this.config.baseUrl}/v2/apps/${this.config.applicationId}/resources/${this.config.resourceId}/invoke`;
    
    const body: InvokeRequest = {
      payload,
      invocationKey,
    };

    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.majorJwtToken) {
      headers["x-major-jwt"] = this.config.majorJwtToken;
    }

    if (this.config.getHeaders) {
      const extraHeaders = await this.config.getHeaders();
      headers = { ...headers, ...extraHeaders };
    }

    try {
      const response = await this.config.fetch(url, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data as InvokeResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ResourceInvokeError(`Failed to invoke resource: ${message}`);
    }
  }
}
