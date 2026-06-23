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
  // When neither applicationId nor toolId is set, the client runs in "skill"
  // mode: identity is resolved entirely from the deployment-identity JWT and the
  // invoke is routed to /internal/skills/v1/resource/:resourceId/invoke.
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
    // Path precedence: toolId → tool mode, applicationId → app mode, neither →
    // skill mode (identity comes purely from the deployment-identity JWT).
    let url: string;

    if (this.config.toolId) {
      url = `${this.config.baseUrl}/internal/tools/v1/${this.config.toolId}/resource/${this.config.resourceId}/invoke`;
    } else if (this.config.applicationId) {
      url = `${this.config.baseUrl}/internal/apps/v1/${this.config.applicationId}/resource/${this.config.resourceId}/invoke`;
    } else {
      url = `${this.config.baseUrl}/internal/skills/v1/resource/${this.config.resourceId}/invoke`;
    }

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
      return normalizeInvokeResponse(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ResourceInvokeError(`Failed to invoke resource: ${message}`);
    }
  }
}

function normalizeInvokeResponse(data: unknown): InvokeResponse {
  const response = data as InvokeResponse;

  if (
    response &&
    typeof response === "object" &&
    "ok" in response &&
    response.ok === false &&
    response.error &&
    !response.error.message &&
    typeof response.error.error_string === "string"
  ) {
    response.error.message = response.error.error_string;
  }

  return response;
}
