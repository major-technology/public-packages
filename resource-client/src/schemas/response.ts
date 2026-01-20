import type { ApiResult } from "./common";
import type { DbResult } from "./postgres";
import type { StorageS3Result } from "./s3";
import type { DbDynamoDBResult, DbDynamoDBResultForCommand, DynamoDBCommandOutputMap } from "./dynamodb";
import type { DbCosmosDBResult, DbCosmosDBResultGeneric } from "./cosmosdb";
import type { DbSnowflakeResult } from "./snowflake";

// ============================================================================
// Invoke Result Wrapper (nested structure)
// ============================================================================

/**
 * Result kind discriminator values
 */
export type InvokeResultKind = "api" | "database" | "storage" | "dynamodb" | "cosmosdb" | "snowflake";

/**
 * Invoke result wrapper with nested structure.
 * The `kind` field determines which nested result is populated.
 * This matches the Go InvokeResult structure.
 */
export interface InvokeResultWrapper<K extends InvokeResultKind = InvokeResultKind> {
  /** Discriminator for the result type */
  kind: K;
  /** API result (when kind is "api") */
  api?: ApiResult;
  /** Database result (when kind is "database") */
  database?: DbResult;
  /** Storage result (when kind is "storage") */
  storage?: StorageS3Result;
  /** DynamoDB result (when kind is "dynamodb") */
  dynamodb?: DbDynamoDBResult;
  /** CosmosDB result (when kind is "cosmosdb") */
  cosmosdb?: DbCosmosDBResult;
  /** Snowflake result (when kind is "snowflake") */
  snowflake?: DbSnowflakeResult;
}

/**
 * Typed result wrapper for specific result kinds
 */
export interface ApiInvokeResultWrapper extends InvokeResultWrapper<"api"> {
  kind: "api";
  api: ApiResult;
}

export interface DatabaseInvokeResultWrapper extends InvokeResultWrapper<"database"> {
  kind: "database";
  database: DbResult;
}

export interface StorageInvokeResultWrapper extends InvokeResultWrapper<"storage"> {
  kind: "storage";
  storage: StorageS3Result;
}

export interface DynamoDBInvokeResultWrapper<C extends keyof DynamoDBCommandOutputMap = keyof DynamoDBCommandOutputMap> extends InvokeResultWrapper<"dynamodb"> {
  kind: "dynamodb";
  dynamodb: DbDynamoDBResultForCommand<C>;
}

export interface CosmosDBInvokeResultWrapper<T = Record<string, unknown>> extends InvokeResultWrapper<"cosmosdb"> {
  kind: "cosmosdb";
  cosmosdb: DbCosmosDBResultGeneric<T>;
}

export interface SnowflakeInvokeResultWrapper extends InvokeResultWrapper<"snowflake"> {
  kind: "snowflake";
  snowflake: DbSnowflakeResult;
}

/**
 * Union of all possible resource invocation result wrappers
 */
export type ResourceInvokeResult =
  | ApiInvokeResultWrapper
  | DatabaseInvokeResultWrapper
  | StorageInvokeResultWrapper
  | DynamoDBInvokeResultWrapper
  | CosmosDBInvokeResultWrapper
  | SnowflakeInvokeResultWrapper;

// ============================================================================
// Response Types
// ============================================================================

/**
 * Base successful invocation response - generic over result wrapper type
 */
export interface BaseInvokeSuccess<T = InvokeResultWrapper> {
  ok: true;
  /** Unique ID for this request */
  requestId: string;
  /** The result wrapper containing the resource result */
  result: T;
}

/**
 * Successful invocation response (any resource type)
 */
export type InvokeSuccess = BaseInvokeSuccess<ResourceInvokeResult>;

/**
 * Failed invocation response
 */
export interface InvokeFailure {
  ok: false;
  /** Unique ID for this request */
  requestId: string;
  /** Error details */
  error: {
    message: string;
    httpStatus?: number;
  };
}

/**
 * Response envelope for resource invocation (any resource type)
 */
export type InvokeResponse = InvokeSuccess | InvokeFailure;

// ============================================================================
// Resource-specific typed responses
// ============================================================================

/**
 * Response from database resource invocation
 */
export type DatabaseInvokeResponse = BaseInvokeSuccess<DatabaseInvokeResultWrapper> | InvokeFailure;

/**
 * Response from API resource invocation (custom, HubSpot, or Google Sheets)
 */
export type ApiInvokeResponse = BaseInvokeSuccess<ApiInvokeResultWrapper> | InvokeFailure;

/**
 * Response from S3 storage resource invocation
 */
export type StorageInvokeResponse = BaseInvokeSuccess<StorageInvokeResultWrapper> | InvokeFailure;

/**
 * Response from DynamoDB database resource invocation
 */
export type DynamoDBInvokeResponse<C extends keyof DynamoDBCommandOutputMap = keyof DynamoDBCommandOutputMap> = 
  | BaseInvokeSuccess<DynamoDBInvokeResultWrapper<C>> 
  | InvokeFailure;

/**
 * Response from CosmosDB database resource invocation
 */
export type CosmosDBInvokeResponse<T = Record<string, unknown>> =
  | BaseInvokeSuccess<CosmosDBInvokeResultWrapper<T>>
  | InvokeFailure;

/**
 * Response from Snowflake database resource invocation
 */
export type SnowflakeInvokeResponse = BaseInvokeSuccess<SnowflakeInvokeResultWrapper> | InvokeFailure;
