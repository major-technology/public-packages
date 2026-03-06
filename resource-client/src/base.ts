import type {
  ResourceInvokePayload,
  InvokeResponse,
  InvokeRequest,
} from "./schemas";
import { ResourceInvokeError } from "./errors";

export interface BaseClientConfig {
  baseUrl: string;
  majorJwtToken?: string;
  applicationId?: string;  // For app mode
  toolId?: string;         // For tool mode — mutually exclusive with applicationId
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
    applicationId?: string;
    toolId?: string;
    resourceId: string;
    fetch: typeof fetch;
    getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
  };

  constructor(config: BaseClientConfig) {
    if (!config.applicationId && !config.toolId) {
      throw new Error("BaseResourceClient requires either applicationId or toolId");
    }

    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""),
      majorJwtToken: config.majorJwtToken,
      applicationId: config.applicationId,
      toolId: config.toolId,
      resourceId: config.resourceId,
      fetch: config.fetch || globalThis.fetch,
      getHeaders: config.getHeaders,
    };
  }

  protected async invokeRaw(
    payload: ResourceInvokePayload,
    invocationKey: string,
  ): Promise<InvokeResponse> {
    const entityType = this.config.toolId ? "tools" : "apps";
    const entityId = this.config.toolId || this.config.applicationId;
    const url = `${this.config.baseUrl}/internal/${entityType}/v1/${entityId}/resource/${this.config.resourceId}/invoke`;
    
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

