// Export all schemas and types
export * from "./schemas";

// Export base client and config
export { BaseResourceClient, type BaseClientConfig } from "./base";

// Export errors
export { ResourceInvokeError } from "./errors";

// Export individual clients
export { PostgresResourceClient } from "./clients/postgres";
export { DynamoDBResourceClient } from "./clients/dynamodb";
export { CustomApiResourceClient } from "./clients/api-custom";
export { HubSpotResourceClient } from "./clients/hubspot";
export { S3ResourceClient } from "./clients/s3";

// Re-export common response types for convenience
export type {
  DatabaseInvokeResponse,
  ApiInvokeResponse,
  StorageInvokeResponse,
  BaseInvokeSuccess,
} from "./schemas/response";

