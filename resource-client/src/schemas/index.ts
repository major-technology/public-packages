// Re-export all types
export * from "./common";
export * from "./postgres";
export * from "./mssql";
export * from "./dynamodb";
export * from "./cosmosdb";
export * from "./snowflake";
export * from "./s3";
export * from "./api-custom";
export * from "./api-hubspot";
export * from "./api-salesforce";
export * from "./api-googlesheets";
export * from "./api-outreach";
export * from "./api-slack";
export * from "./lambda";
export * from "./bigquery";
export * from "./neo4j";
export * from "./request";
export * from "./response";

// Import for discriminated union
import type { ApiCustomPayload } from "./api-custom";
import type { ApiHubSpotPayload } from "./api-hubspot";
import type { ApiSalesforcePayload } from "./api-salesforce";
import type { ApiGoogleSheetsPayload } from "./api-googlesheets";
import type { ApiOutreachPayload } from "./api-outreach";
import type { ApiSlackPayload } from "./api-slack";
import type { DbPostgresPayload } from "./postgres";
import type { DbMssqlPayload } from "./mssql";
import type { DbDynamoDBPayload } from "./dynamodb";
import type { DbCosmosDBPayload } from "./cosmosdb";
import type { DbSnowflakePayload } from "./snowflake";
import type { StorageS3Payload } from "./s3";
import type { ApiLambdaPayload } from "./lambda";
import type { DbBigQueryPayload } from "./bigquery";
import type { DbNeo4jPayload } from "./neo4j";

/**
 * Discriminated union of all resource payload types
 * Use the 'subtype' field to narrow the type
 */
export type ResourceInvokePayload =
  | ApiCustomPayload
  | DbPostgresPayload
  | DbMssqlPayload
  | DbDynamoDBPayload
  | DbCosmosDBPayload
  | DbSnowflakePayload
  | ApiHubSpotPayload
  | ApiSalesforcePayload
  | ApiGoogleSheetsPayload
  | ApiOutreachPayload
  | StorageS3Payload
  | ApiLambdaPayload
  | DbBigQueryPayload
  | DbNeo4jPayload
  | ApiSlackPayload;

