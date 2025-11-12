import type {
  ResourceInvokePayload,
  InvokeResponse,
  InvokeRequest,
  DbPostgresPayload,
  ApiCustomPayload,
  ApiHubSpotPayload,
  StorageS3Payload,
  HttpMethod,
  QueryParams,
  BodyPayload,
  S3Command,
  DatabaseInvokeResponse,
  ApiInvokeResponse,
  StorageInvokeResponse,
  DbParamPrimitive,
} from "./schemas";
import { ResourceInvokeError } from "./errors";

export interface BaseClientConfig {
  baseUrl: string;
  majorJwtToken?: string;
  applicationId: string;
  resourceId: string;
  fetch?: typeof fetch;
}

abstract class BaseResourceClient {
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

export class PostgresResourceClient extends BaseResourceClient {
  async invoke(
    sql: string,
    params: DbParamPrimitive[] | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse> {
    const payload: DbPostgresPayload = {
      type: "database",
      subtype: "postgresql",
      sql,
      params,
      timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse>;
  }
}

export class CustomApiResourceClient extends BaseResourceClient {
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      headers?: Record<string, string>;
      body?: BodyPayload;
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload: ApiCustomPayload = {
      type: "api",
      subtype: "custom",
      method,
      path,
      query: options.query,
      headers: options.headers,
      body: options.body,
      timeoutMs: options.timeoutMs || 30000,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}

export class HubSpotResourceClient extends BaseResourceClient {
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload: ApiHubSpotPayload = {
      type: "api",
      subtype: "hubspot",
      method,
      path,
      query: options.query,
      body: options.body,
      timeoutMs: options.timeoutMs || 30000,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}

export class S3ResourceClient extends BaseResourceClient {
  async invoke(
    command: S3Command,
    params: Record<string, unknown>,
    invocationKey: string,
    options: {
      timeoutMs?: number;
    } = {}
  ): Promise<StorageInvokeResponse> {
    const payload: StorageS3Payload = {
      type: "storage",
      subtype: "s3",
      command,
      params,
      timeoutMs: options.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<StorageInvokeResponse>;
  }
}

