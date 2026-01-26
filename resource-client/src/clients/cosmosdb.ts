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
import {
  buildCosmosDBInvokePayload,
  buildCosmosDBQueryPayload,
  buildCosmosDBReadPayload,
  buildCosmosDBCreatePayload,
  buildCosmosDBReplacePayload,
  buildCosmosDBUpsertPayload,
  buildCosmosDBDeletePayload,
  buildCosmosDBPatchPayload,
} from "../payload-builders/cosmosdb";

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
    return this.invokeRaw(buildCosmosDBInvokePayload(payload), invocationKey) as Promise<
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
    const payload = buildCosmosDBQueryPayload(container, query, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosQueryResult<T>> | InvokeFailure
    >;
  }

  /**
   * Read a single document by ID
   * @param container The container name
   * @param id The document ID
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (partitionKey, timeoutMs)
   */
  async read<T = Record<string, unknown>>(
    container: string,
    id: string,
    invocationKey: string,
    options?: { partitionKey?: PartitionKey; timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosReadResult<T>> | InvokeFailure> {
    const payload = buildCosmosDBReadPayload(container, id, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosReadResult<T>> | InvokeFailure
    >;
  }

  /**
   * Create a new document
   * @param container The container name
   * @param body The document body (must include id and partition key properties)
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (partitionKey, timeoutMs)
   */
  async create<T = Record<string, unknown>>(
    container: string,
    body: Record<string, CosmosValue>,
    invocationKey: string,
    options?: { partitionKey?: PartitionKey; timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosCreateResult<T>> | InvokeFailure> {
    const payload = buildCosmosDBCreatePayload(container, body, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosCreateResult<T>> | InvokeFailure
    >;
  }

  /**
   * Replace an existing document
   * @param container The container name
   * @param id The document ID
   * @param body The new document body
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (partitionKey, timeoutMs)
   */
  async replace<T = Record<string, unknown>>(
    container: string,
    id: string,
    body: Record<string, CosmosValue>,
    invocationKey: string,
    options?: { partitionKey?: PartitionKey; timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosReplaceResult<T>> | InvokeFailure> {
    const payload = buildCosmosDBReplacePayload(container, id, body, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosReplaceResult<T>> | InvokeFailure
    >;
  }

  /**
   * Upsert a document (insert or replace)
   * @param container The container name
   * @param body The document body (must include id and partition key properties)
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (partitionKey, timeoutMs)
   */
  async upsert<T = Record<string, unknown>>(
    container: string,
    body: Record<string, CosmosValue>,
    invocationKey: string,
    options?: { partitionKey?: PartitionKey; timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosUpsertResult<T>> | InvokeFailure> {
    const payload = buildCosmosDBUpsertPayload(container, body, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosUpsertResult<T>> | InvokeFailure
    >;
  }

  /**
   * Delete a document
   * @param container The container name
   * @param id The document ID
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (partitionKey, timeoutMs)
   */
  async delete(
    container: string,
    id: string,
    invocationKey: string,
    options?: { partitionKey?: PartitionKey; timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosDeleteResult> | InvokeFailure> {
    const payload = buildCosmosDBDeletePayload(container, id, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosDeleteResult> | InvokeFailure
    >;
  }

  /**
   * Patch a document with partial updates
   * @param container The container name
   * @param id The document ID
   * @param patchOperations Array of patch operations
   * @param invocationKey Unique key for tracking this invocation
   * @param options Additional options (partitionKey, condition, timeoutMs)
   */
  async patch<T = Record<string, unknown>>(
    container: string,
    id: string,
    patchOperations: CosmosPatchOperation[],
    invocationKey: string,
    options?: { partitionKey?: PartitionKey; condition?: string; timeoutMs?: number }
  ): Promise<BaseInvokeSuccess<CosmosPatchResult<T>> | InvokeFailure> {
    const payload = buildCosmosDBPatchPayload(container, id, patchOperations, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<CosmosPatchResult<T>> | InvokeFailure
    >;
  }
}
