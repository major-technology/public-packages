import type {
  HttpMethod,
  QueryParams,
  DynamicsInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import {
  buildDynamicsInvokePayload,
  buildDynamicsListEntitiesPayload,
  buildDynamicsGetRecordsPayload,
  buildDynamicsGetRecordPayload,
} from "../payload-builders/dynamics";

/**
 * Client for interacting with Microsoft Dynamics 365 (Dataverse Web API) resources.
 *
 * This client provides convenience methods for common Dataverse operations.
 * Authentication (OAuth) is handled automatically.
 *
 * @example
 * ```typescript
 * // List all entity definitions
 * const entities = await client.listEntities("list-entities");
 *
 * // Get account records with OData options
 * const accounts = await client.getRecords("accounts", "get-accounts", {
 *   select: "name,revenue",
 *   filter: "revenue gt 1000000",
 *   top: 50,
 * });
 *
 * // Get a single contact by GUID
 * const contact = await client.getRecord(
 *   "contacts",
 *   "00000000-0000-0000-0000-000000000001",
 *   "get-contact",
 *   { select: "firstname,lastname,emailaddress1" }
 * );
 *
 * // Generic passthrough for any Dataverse endpoint
 * const result = await client.invoke(
 *   "POST",
 *   "accounts",
 *   "create-account",
 *   { body: { type: "json", value: { name: "Acme Corp" } } }
 * );
 * ```
 */
export class DynamicsResourceClient extends BaseResourceClient {
  /**
   * List available entity definitions from the Dataverse metadata endpoint.
   *
   * @param invocationKey - Unique key for this invocation (for tracking)
   * @param options - Optional timeout
   * @returns Entity definitions including LogicalName, DisplayName, EntitySetName
   */
  async listEntities(
    invocationKey: string,
    options: { timeoutMs?: number } = {}
  ): Promise<DynamicsInvokeResponse> {
    const payload = buildDynamicsListEntitiesPayload(options);
    return this.invokeRaw(payload, invocationKey) as Promise<DynamicsInvokeResponse>;
  }

  /**
   * Get multiple records from an entity set with optional OData query options.
   *
   * @param entitySet - Entity set name (e.g. "accounts", "contacts", "opportunities")
   * @param invocationKey - Unique key for this invocation (for tracking)
   * @param options - OData query options and timeout
   * @returns The records matching the query
   *
   * @example
   * ```typescript
   * const result = await client.getRecords("accounts", "list-accounts", {
   *   select: "name,revenue,createdon",
   *   filter: "statecode eq 0",
   *   orderBy: "name asc",
   *   top: 100,
   * });
   * ```
   */
  async getRecords(
    entitySet: string,
    invocationKey: string,
    options: {
      select?: string;
      filter?: string;
      orderBy?: string;
      top?: number;
      expand?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<DynamicsInvokeResponse> {
    const payload = buildDynamicsGetRecordsPayload(entitySet, options);
    return this.invokeRaw(payload, invocationKey) as Promise<DynamicsInvokeResponse>;
  }

  /**
   * Get a single record by its GUID.
   *
   * @param entitySet - Entity set name (e.g. "accounts", "contacts")
   * @param recordId - The GUID of the record
   * @param invocationKey - Unique key for this invocation (for tracking)
   * @param options - Optional select/expand fields and timeout
   * @returns The record data
   *
   * @example
   * ```typescript
   * const result = await client.getRecord(
   *   "contacts",
   *   "00000000-0000-0000-0000-000000000001",
   *   "get-contact",
   *   { select: "firstname,lastname,emailaddress1" }
   * );
   * ```
   */
  async getRecord(
    entitySet: string,
    recordId: string,
    invocationKey: string,
    options: {
      select?: string;
      expand?: string;
      timeoutMs?: number;
    } = {}
  ): Promise<DynamicsInvokeResponse> {
    const payload = buildDynamicsGetRecordPayload(entitySet, recordId, options);
    return this.invokeRaw(payload, invocationKey) as Promise<DynamicsInvokeResponse>;
  }

  /**
   * Generic passthrough for any Dataverse Web API request.
   *
   * @param method - HTTP method (GET, POST, PATCH, DELETE)
   * @param path - Dataverse API path (e.g. "accounts", "contacts(guid)")
   * @param invocationKey - Unique key for this invocation (for tracking)
   * @param options - Optional query params, body, and timeout
   * @returns The API response with status and body
   */
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<DynamicsInvokeResponse> {
    const payload = buildDynamicsInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<DynamicsInvokeResponse>;
  }
}
