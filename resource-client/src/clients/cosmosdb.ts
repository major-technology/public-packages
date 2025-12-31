import type {
  DbCosmosDBPayload,
  CosmosValue,
  PartitionKey,
  CosmosQueryParameter,
  CosmosPatchOperation,
  CosmosQueryResult,
  CosmosReadResult,
  CosmosCreateResult,
  CosmosReplaceResult,
  CosmosUpsertResult,
  CosmosDeleteResult,
  CosmosPatchResult,
  DbCosmosDBResultGeneric,
} from "../schemas";
import type { BaseInvokeSuccess, InvokeFailure } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class CosmosDBResourceClient extends BaseResourceClient {
  /**
   * Invoke a CosmosDB operation with a raw payload
   * @param payload The complete operation payload
   * @param invocationKey Unique key for tracking this invocation
   */
  async invoke<T = Record<string, unknown>>(
    payload: DbCosmosDBPayload,
    invocationKey: string
  ): Promise<BaseInvokeSuccess<DbCosmosDBResultGeneric<T>> | InvokeFailure> {
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<DbCosmosDBResultGeneric<T>> | InvokeFailure
    >;
  }

  /**
   * Execute a SQL query against a container
   * @param container The container name
   * @param query The SQL query string
   * @param invocationKey Unique key for tracking this invocation
   * @param options Query options (parameters, partitionKey, pagination)
   */
  async query<T = Record<string, unknown>>(
    container: string,
    query: string,
    invocationKey: string,
    options?: {
      parameters?: CosmosQueryParameter[];
      partitionKey?: PartitionKey;
      maxItemCount?: number;
      continuationToken?: string;
      timeoutMs?: number;
    }
  ): Promise<BaseInvokeSuccess<CosmosQueryResult<T>> | InvokeFailure> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      operation: "query",
      container,
      query,
      parameters: options?.parameters,
      partitionKey: options?.partitionKey,
      maxItemCount: options?.maxItemCount,
      continuationToken: options?.continuationToken,
      timeoutMs: options?.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosQueryResult<T>> | InvokeFailure
    >;
  }

  /**
   * Read a single document by ID
   * @param container The container name
   * @param id The document ID
   * @param partitionKey The partition key value
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options
   */
  async read<T = Record<string, unknown>>(
    container: string,
    id: string,
    partitionKey: PartitionKey,
    invocationKey: string,
    options?: { timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosReadResult<T>> | InvokeFailure> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      operation: "read",
      container,
      id,
      partitionKey,
      timeoutMs: options?.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosReadResult<T>> | InvokeFailure
    >;
  }

  /**
   * Create a new document
   * @param container The container name
   * @param body The document body (must include id and partition key properties)
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options
   */
  async create<T = Record<string, unknown>>(
    container: string,
    body: Record<string, CosmosValue>,
    invocationKey: string,
    options?: { timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosCreateResult<T>> | InvokeFailure> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      operation: "create",
      container,
      body,
      timeoutMs: options?.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosCreateResult<T>> | InvokeFailure
    >;
  }

  /**
   * Replace an existing document
   * @param container The container name
   * @param id The document ID
   * @param partitionKey The partition key value
   * @param body The new document body
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options
   */
  async replace<T = Record<string, unknown>>(
    container: string,
    id: string,
    partitionKey: PartitionKey,
    body: Record<string, CosmosValue>,
    invocationKey: string,
    options?: { timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosReplaceResult<T>> | InvokeFailure> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      operation: "replace",
      container,
      id,
      partitionKey,
      body,
      timeoutMs: options?.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosReplaceResult<T>> | InvokeFailure
    >;
  }

  /**
   * Upsert a document (insert or replace)
   * @param container The container name
   * @param body The document body (must include id and partition key properties)
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options
   */
  async upsert<T = Record<string, unknown>>(
    container: string,
    body: Record<string, CosmosValue>,
    invocationKey: string,
    options?: { timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosUpsertResult<T>> | InvokeFailure> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      operation: "upsert",
      container,
      body,
      timeoutMs: options?.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosUpsertResult<T>> | InvokeFailure
    >;
  }

  /**
   * Delete a document
   * @param container The container name
   * @param id The document ID
   * @param partitionKey The partition key value
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options
   */
  async delete(
    container: string,
    id: string,
    partitionKey: PartitionKey,
    invocationKey: string,
    options?: { timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosDeleteResult> | InvokeFailure> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      operation: "delete",
      container,
      id,
      partitionKey,
      timeoutMs: options?.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosDeleteResult> | InvokeFailure
    >;
  }

  /**
   * Patch a document with partial updates
   * @param container The container name
   * @param id The document ID
   * @param partitionKey The partition key value
   * @param patchOperations Array of patch operations
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (condition, timeoutMs)
   */
  async patch<T = Record<string, unknown>>(
    container: string,
    id: string,
    partitionKey: PartitionKey,
    patchOperations: CosmosPatchOperation[],
    invocationKey: string,
    options?: { condition?: string; timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosPatchResult<T>> | InvokeFailure> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      operation: "patch",
      container,
      id,
      partitionKey,
      patchOperations,
      condition: options?.condition,
      timeoutMs: options?.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosPatchResult<T>> | InvokeFailure
    >;
  }
}
