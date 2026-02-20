import type { ApiResult } from "./common";
import type { DbResult } from "./postgres";
import type { StorageS3Result } from "./s3";
import type { DbDynamoDBResult } from "./dynamodb";
import type { DbCosmosDBResult, DbCosmosDBResultGeneric } from "./cosmosdb";
import type { DbSnowflakeResult } from "./snowflake";
import type { ApiLambdaResult } from "./lambda";
import type { DbBigQueryResult } from "./bigquery";
import type { ApiOutreachResult } from "./api-outreach";
import type { DbNeo4jResult } from "./neo4j";
import type { AuthResult } from "./auth";
import type { ApiGoogleAnalyticsResult } from "./google-analytics";

/**
 * Union of all possible resource invocation result types
 */
export type ResourceInvokeSuccess = ApiResult | DbResult | StorageS3Result | DbDynamoDBResult | DbCosmosDBResult | DbSnowflakeResult | ApiLambdaResult | DbBigQueryResult | ApiOutreachResult | DbNeo4jResult | AuthResult | ApiGoogleAnalyticsResult;

/**
 * Base successful invocation response - generic over result type
 */
export interface BaseInvokeSuccess<T> {
  ok: true;
  /** Unique ID for this request */
  requestId: string;
  /** The result data from the resource */
  result: T;
}

/**
 * Successful invocation response (any resource type)
 */
export type InvokeSuccess = BaseInvokeSuccess<ResourceInvokeSuccess>;

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
 * Response from database resource invocation (generic for typed rows)
 */
export type DatabaseInvokeResponse<T = Record<string, unknown>> =
  | BaseInvokeSuccess<DbResult<T>>
  | InvokeFailure;

/**
 * Response from API resource invocation (custom or HubSpot)
 */
export type ApiInvokeResponse = BaseInvokeSuccess<ApiResult> | InvokeFailure;

/**
 * Response from S3 storage resource invocation
 */
export type StorageInvokeResponse = BaseInvokeSuccess<StorageS3Result> | InvokeFailure;

/**
 * Response from DynamoDB database resource invocation
 */
export type DynamoDBInvokeResponse = BaseInvokeSuccess<DbDynamoDBResult> | InvokeFailure;

/**
 * Response from CosmosDB database resource invocation (generic for typed documents)
 */
export type CosmosDBInvokeResponse<T = Record<string, unknown>> =
  | BaseInvokeSuccess<DbCosmosDBResultGeneric<T>>
  | InvokeFailure;

/**
 * Response from Snowflake database resource invocation
 */
export type SnowflakeInvokeResponse = BaseInvokeSuccess<DbSnowflakeResult> | InvokeFailure;

/**
 * Response from Lambda resource invocation
 */
export type LambdaInvokeResponse = BaseInvokeSuccess<ApiLambdaResult> | InvokeFailure;

/**
 * Response from BigQuery database resource invocation
 */
export type BigQueryInvokeResponse = BaseInvokeSuccess<DbBigQueryResult> | InvokeFailure;

/**
 * Response from Outreach API resource invocation
 */
export type OutreachInvokeResponse = BaseInvokeSuccess<ApiOutreachResult> | InvokeFailure;

/**
 * Response from Neo4j database resource invocation
 */
export type Neo4jInvokeResponse = BaseInvokeSuccess<DbNeo4jResult> | InvokeFailure;

/**
 * Response from Slack API resource invocation
 */
export type SlackInvokeResponse = BaseInvokeSuccess<ApiResult> | InvokeFailure;

/**
 * Response from Major Auth resource invocation
 */
export type AuthInvokeResponse = BaseInvokeSuccess<AuthResult> | InvokeFailure;

/**
 * Response from Google Analytics resource invocation
 */
export type GoogleAnalyticsInvokeResponse = BaseInvokeSuccess<ApiGoogleAnalyticsResult> | InvokeFailure;
