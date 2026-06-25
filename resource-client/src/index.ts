// Export all schemas and types
export * from "./schemas";

// Export base client and config
export { BaseResourceClient, type BaseClientConfig } from "./base";

// Canonical subtype → client-class map + the supported-subtype union. Single source of
// truth shared by the runtime API and the code generator (bin/generate-clients.mjs).
export { CLIENT_REGISTRY, type ResourceSubtype } from "./client-registry";

// Slot → id resolution: the readers app code calls (getResourceId/getAgentId/getApplicationId),
// the registration the generated app entry uses, and the generate/strip helpers the platform
// uses to materialize / templatize bindings.json.
export {
  registerBindings,
  getResourceId,
  getAgentId,
  getApplicationId,
  generateBindings,
  stripBindingsIds,
  type BindingsManifest,
  type BindingsContract,
  type BindingEntry,
} from "./bindings";

// Export the HTTP proxy fetch helper (Node-safe, no `next` dependency).
// Next app code should import `createProxyFetch` from "@major-tech/resource-client/next".
export { createProxyFetch, type CreateProxyFetchConfig } from "./proxy-fetch";

// Export errors
export { ResourceInvokeError } from "./errors";

// Export individual clients
export { PostgresResourceClient } from "./clients/postgres";
export { MssqlResourceClient } from "./clients/mssql";
export { MysqlResourceClient } from "./clients/mysql";
export { DynamoDBResourceClient } from "./clients/dynamodb";
export { CosmosDBResourceClient } from "./clients/cosmosdb";
export { SnowflakeResourceClient } from "./clients/snowflake";
export { CustomApiResourceClient } from "./clients/api-custom";
export { HubSpotResourceClient } from "./clients/hubspot";
export { PlaidResourceClient } from "./clients/plaid";
export { LinkedInResourceClient } from "./clients/linkedin";
export { GoogleCalendarResourceClient } from "./clients/googlecalendar";
export { GmailResourceClient } from "./clients/gmail";
export { GoogleDriveResourceClient } from "./clients/googledrive";
export { SalesforceResourceClient } from "./clients/salesforce";
export { GoogleSheetsResourceClient } from "./clients/googlesheets";
export { S3ResourceClient } from "./clients/s3";
export { LambdaResourceClient } from "./clients/lambda";
export { BigQueryResourceClient } from "./clients/bigquery";
export { OutreachResourceClient } from "./clients/outreach";
export { Neo4jResourceClient } from "./clients/neo4j";
export { SlackResourceClient } from "./clients/slack";
export { QuickBooksResourceClient } from "./clients/quickbooks";
export { MajorAuthResourceClient } from "./clients/auth";
export { GoogleAnalyticsResourceClient } from "./clients/google-analytics";
export { GraphQLResourceClient } from "./clients/api-graphql";
export { GongResourceClient } from "./clients/gong";
export { ClerkResourceClient } from "./clients/clerk";
export { StripeResourceClient } from "./clients/stripe";
export { FirefliesResourceClient } from "./clients/fireflies";
export { AttioResourceClient } from "./clients/attio";
export { TikTokAdsResourceClient } from "./clients/tiktokads";
export { DynamicsResourceClient } from "./clients/dynamics";
export { LinearResourceClient } from "./clients/linear";
export { ZohoDeskResourceClient } from "./clients/zohodesk";
export { ZohoProjectsResourceClient } from "./clients/zohoprojects";
export { SqsResourceClient } from "./clients/sqs";
export { MetaMarketingResourceClient } from "./clients/metamarketing";
export { SharePointResourceClient } from "./clients/sharepoint";
export { GoogleSearchConsoleResourceClient } from "./clients/google-search-console";
export { NotionResourceClient } from "./clients/notion";
export { BlobResourceClient } from "./clients/blob";
export { GitHubResourceClient } from "./clients/github";

// MCP-subtype connectors (custom remote MCP, Linear, …) share one generic
// runtime client instead of a per-subtype class — tool name + args are defined
// by the upstream server, so there's no typed surface to generate.
export { createMcpClient, type CreateMcpClientConfig, type McpClient } from "./mcp-client";

// Export payload builders (for use in testing UIs, etc.)
export * from "./payload-builders";

// Re-export common response types for convenience
export type {
  DatabaseInvokeResponse,
  DynamoDBInvokeResponse,
  CosmosDBInvokeResponse,
  SnowflakeInvokeResponse,
  ApiInvokeResponse,
  StorageInvokeResponse,
  LambdaInvokeResponse,
  BigQueryInvokeResponse,
  OutreachInvokeResponse,
  Neo4jInvokeResponse,
  SlackInvokeResponse,
  QuickBooksInvokeResponse,
  AuthInvokeResponse,
  GoogleAnalyticsInvokeResponse,
  GraphQLInvokeResponse,
  GongInvokeResponse,
  ClerkInvokeResponse,
  StripeRawInvokeResponse,
  FirefliesRawInvokeResponse,
  AttioRawInvokeResponse,
  TikTokAdsInvokeResponse,
  MetaMarketingRawInvokeResponse,
  GoogleSearchConsoleInvokeResponse,
  NotionInvokeResponse,
  DynamicsInvokeResponse,
  LinearInvokeResponse,
  ZohoDeskInvokeResponse,
  ZohoProjectsInvokeResponse,
  SqsInvokeResponse,
  MysqlInvokeResponse,
  BaseInvokeSuccess,
  StorageBlobInvokeResponse,
  GitHubInvokeResponse
} from "./schemas/response";
