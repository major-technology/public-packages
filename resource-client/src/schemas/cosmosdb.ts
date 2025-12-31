/**
 * Recursive type for CosmosDB document values
 */
export type CosmosValue =
  | string
  | number
  | boolean
  | null
  | CosmosValue[]
  | { [key: string]: CosmosValue };

/**
 * Partition key type - single value or hierarchical array
 */
export type PartitionKey =
  | string
  | number
  | boolean
  | null
  | (string | number | boolean | null)[];

/**
 * Query parameter for parameterized SQL queries
 */
export interface CosmosQueryParameter {
  name: string;
  value: CosmosValue;
}

/**
 * Patch operation for partial document updates
 */
export interface CosmosPatchOperation {
  op: "add" | "set" | "replace" | "remove" | "incr";
  path: string;
  value?: CosmosValue;
}

// ============================================================================
// Operation Payloads
// ============================================================================

interface CosmosDBPayloadBase {
  type: "database";
  subtype: "cosmosdb";
  container: string;
  timeoutMs?: number;
}

export interface CosmosQueryPayload extends CosmosDBPayloadBase {
  operation: "query";
  query: string;
  parameters?: CosmosQueryParameter[];
  partitionKey?: PartitionKey;
  maxItemCount?: number;
  continuationToken?: string;
}

export interface CosmosReadPayload extends CosmosDBPayloadBase {
  operation: "read";
  id: string;
  partitionKey: PartitionKey;
}

export interface CosmosCreatePayload extends CosmosDBPayloadBase {
  operation: "create";
  body: Record<string, CosmosValue>;
}

export interface CosmosReplacePayload extends CosmosDBPayloadBase {
  operation: "replace";
  id: string;
  partitionKey: PartitionKey;
  body: Record<string, CosmosValue>;
}

export interface CosmosUpsertPayload extends CosmosDBPayloadBase {
  operation: "upsert";
  body: Record<string, CosmosValue>;
}

export interface CosmosDeletePayload extends CosmosDBPayloadBase {
  operation: "delete";
  id: string;
  partitionKey: PartitionKey;
}

export interface CosmosPatchPayload extends CosmosDBPayloadBase {
  operation: "patch";
  id: string;
  partitionKey: PartitionKey;
  patchOperations: CosmosPatchOperation[];
  condition?: string;
}

/**
 * Discriminated union of all CosmosDB operation payloads
 */
export type DbCosmosDBPayload =
  | CosmosQueryPayload
  | CosmosReadPayload
  | CosmosCreatePayload
  | CosmosReplacePayload
  | CosmosUpsertPayload
  | CosmosDeletePayload
  | CosmosPatchPayload;

// ============================================================================
// Operation Results
// ============================================================================

export interface CosmosQueryResult<T = Record<string, unknown>> {
  kind: "cosmosdb";
  operation: "query";
  documents: T[];
  count: number;
  continuationToken?: string;
}

export interface CosmosReadResult<T = Record<string, unknown>> {
  kind: "cosmosdb";
  operation: "read";
  document: T;
  etag: string;
}

export interface CosmosCreateResult<T = Record<string, unknown>> {
  kind: "cosmosdb";
  operation: "create";
  document: T;
}

export interface CosmosReplaceResult<T = Record<string, unknown>> {
  kind: "cosmosdb";
  operation: "replace";
  document: T;
}

export interface CosmosUpsertResult<T = Record<string, unknown>> {
  kind: "cosmosdb";
  operation: "upsert";
  document: T;
}

export interface CosmosDeleteResult {
  kind: "cosmosdb";
  operation: "delete";
}

export interface CosmosPatchResult<T = Record<string, unknown>> {
  kind: "cosmosdb";
  operation: "patch";
  document: T;
}

/**
 * Union of all CosmosDB operation results (non-generic version)
 */
export type DbCosmosDBResult =
  | CosmosQueryResult
  | CosmosReadResult
  | CosmosCreateResult
  | CosmosReplaceResult
  | CosmosUpsertResult
  | CosmosDeleteResult
  | CosmosPatchResult;

/**
 * Generic result type for typed document access
 */
export type DbCosmosDBResultGeneric<T = Record<string, unknown>> =
  | CosmosQueryResult<T>
  | CosmosReadResult<T>
  | CosmosCreateResult<T>
  | CosmosReplaceResult<T>
  | CosmosUpsertResult<T>
  | CosmosDeleteResult
  | CosmosPatchResult<T>;

// ============================================================================
// Type Maps for Generic Invoke
// ============================================================================

/**
 * Map of operation names to their result types
 */
export type CosmosDBOperationResultMap<T = Record<string, unknown>> = {
  query: CosmosQueryResult<T>;
  read: CosmosReadResult<T>;
  create: CosmosCreateResult<T>;
  replace: CosmosReplaceResult<T>;
  upsert: CosmosUpsertResult<T>;
  delete: CosmosDeleteResult;
  patch: CosmosPatchResult<T>;
};

/**
 * Extract result type for a specific operation
 */
export type DbCosmosDBResultForOperation<
  O extends keyof CosmosDBOperationResultMap,
  T = Record<string, unknown>,
> = CosmosDBOperationResultMap<T>[O];
