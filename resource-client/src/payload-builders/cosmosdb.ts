import type {
  DbCosmosDBPayload,
  CosmosQueryPayload,
  CosmosReadPayload,
  CosmosCreatePayload,
  CosmosReplacePayload,
  CosmosUpsertPayload,
  CosmosDeletePayload,
  CosmosPatchPayload,
  CosmosValue,
  PartitionKey,
  CosmosQueryParameter,
  CosmosPatchOperation,
} from "../schemas";

/**
 * Build a CosmosDB invoke payload (raw payload passthrough)
 * @param payload The complete CosmosDB operation payload
 */
export function buildCosmosDBInvokePayload(
  payload: DbCosmosDBPayload
): DbCosmosDBPayload {
  return payload;
}

/**
 * Build a CosmosDB query payload
 */
export function buildCosmosDBQueryPayload(
  container: string,
  query: string,
  options?: {
    parameters?: CosmosQueryParameter[];
    partitionKey?: PartitionKey;
    maxItemCount?: number;
    continuationToken?: string;
    timeoutMs?: number;
  }
): CosmosQueryPayload {
  return {
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
}

/**
 * Build a CosmosDB read payload
 */
export function buildCosmosDBReadPayload(
  container: string,
  id: string,
  options?: { partitionKey?: PartitionKey; timeoutMs?: number }
): CosmosReadPayload {
  return {
    type: "database",
    subtype: "cosmosdb",
    operation: "read",
    container,
    id,
    partitionKey: options?.partitionKey,
    timeoutMs: options?.timeoutMs,
  };
}

/**
 * Build a CosmosDB create payload
 */
export function buildCosmosDBCreatePayload(
  container: string,
  body: Record<string, CosmosValue>,
  options?: { partitionKey?: PartitionKey; timeoutMs?: number }
): CosmosCreatePayload {
  return {
    type: "database",
    subtype: "cosmosdb",
    operation: "create",
    container,
    body,
    partitionKey: options?.partitionKey,
    timeoutMs: options?.timeoutMs,
  };
}

/**
 * Build a CosmosDB replace payload
 */
export function buildCosmosDBReplacePayload(
  container: string,
  id: string,
  body: Record<string, CosmosValue>,
  options?: { partitionKey?: PartitionKey; timeoutMs?: number }
): CosmosReplacePayload {
  return {
    type: "database",
    subtype: "cosmosdb",
    operation: "replace",
    container,
    id,
    body,
    partitionKey: options?.partitionKey,
    timeoutMs: options?.timeoutMs,
  };
}

/**
 * Build a CosmosDB upsert payload
 */
export function buildCosmosDBUpsertPayload(
  container: string,
  body: Record<string, CosmosValue>,
  options?: { partitionKey?: PartitionKey; timeoutMs?: number }
): CosmosUpsertPayload {
  return {
    type: "database",
    subtype: "cosmosdb",
    operation: "upsert",
    container,
    body,
    partitionKey: options?.partitionKey,
    timeoutMs: options?.timeoutMs,
  };
}

/**
 * Build a CosmosDB delete payload
 */
export function buildCosmosDBDeletePayload(
  container: string,
  id: string,
  options?: { partitionKey?: PartitionKey; timeoutMs?: number }
): CosmosDeletePayload {
  return {
    type: "database",
    subtype: "cosmosdb",
    operation: "delete",
    container,
    id,
    partitionKey: options?.partitionKey,
    timeoutMs: options?.timeoutMs,
  };
}

/**
 * Build a CosmosDB patch payload
 */
export function buildCosmosDBPatchPayload(
  container: string,
  id: string,
  patchOperations: CosmosPatchOperation[],
  options?: { partitionKey?: PartitionKey; condition?: string; timeoutMs?: number }
): CosmosPatchPayload {
  return {
    type: "database",
    subtype: "cosmosdb",
    operation: "patch",
    container,
    id,
    patchOperations,
    partitionKey: options?.partitionKey,
    condition: options?.condition,
    timeoutMs: options?.timeoutMs,
  };
}
