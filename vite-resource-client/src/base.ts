import type {
  ResourceInvokePayload,
  InvokeResponse,
  InvokeRequest,
} from "./schemas";
import { ResourceInvokeError } from "./errors";

export interface BaseClientConfig {
  baseUrl: string;
  majorJwtToken?: string;
  applicationId: string;
  resourceId: string;
  fetch?: typeof fetch;
}

export abstract class BaseResourceClient {
  protected readonly config: {
    baseUrl: string;
    majorJwtToken?: string;
    applicationId: string;
    resourceId: string;
    fetch: typeof fetch;
  };

  constructor(config: BaseClientConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""),
      majorJwtToken: config.majorJwtToken,
      applicationId: config.applicationId,
      resourceId: config.resourceId,
      fetch: config.fetch || globalThis.fetch,
    };
  }

  protected async invokeRaw(
    payload: ResourceInvokePayload,
    invocationKey: string,
  ): Promise<InvokeResponse> {
    const url = `${this.config.baseUrl}/internal/apps/v1/${this.config.applicationId}/resource/${this.config.resourceId}/invoke`;
    
    const body: InvokeRequest = {
      payload,
      invocationKey,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.majorJwtToken) {
      headers["x-major-jwt"] = this.config.majorJwtToken;
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

