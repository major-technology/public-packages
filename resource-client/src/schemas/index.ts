// Re-export all types
export * from "./common";
export * from "./postgres";
export * from "./dynamodb";
export * from "./cosmosdb";
export * from "./s3";
export * from "./api-custom";
export * from "./api-hubspot";
export * from "./api-googlesheets";
export * from "./request";
export * from "./response";

// Import for discriminated union
import type { ApiCustomPayload } from "./api-custom";
import type { ApiHubSpotPayload } from "./api-hubspot";
import type { ApiGoogleSheetsPayload } from "./api-googlesheets";
import type { DbPostgresPayload } from "./postgres";
import type { DbDynamoDBPayload } from "./dynamodb";
import type { DbCosmosDBPayload } from "./cosmosdb";
import type { StorageS3Payload } from "./s3";

/**
 * Discriminated union of all resource payload types
 * Use the 'subtype' field to narrow the type
 */
export type ResourceInvokePayload =
  | ApiCustomPayload
  | DbPostgresPayload
  | DbDynamoDBPayload
  | DbCosmosDBPayload
  | ApiHubSpotPayload
  | ApiGoogleSheetsPayload
  | StorageS3Payload;

