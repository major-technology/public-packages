// Re-export all types
export * from "./common";
export * from "./postgres";
export * from "./mssql";
export * from "./dynamodb";
export * from "./cosmosdb";
export * from "./snowflake";
export * from "./s3";
export * from "./api-custom";
export * from "./api-graphql";
export * from "./api-hubspot";
export * from "./api-linkedin";
export * from "./api-googlecalendar";
export * from "./api-salesforce";
export * from "./api-googlesheets";
export * from "./api-outreach";
export * from "./api-slack";
export * from "./api-quickbooks";
export * from "./api-gong";
export * from "./api-dynamics";
export * from "./lambda";
export * from "./bigquery";
export * from "./neo4j";
export * from "./auth";
export * from "./google-analytics";
export * from "./api-linear";
export * from "./api-ringcentral";
export * from "./api-clerk";
export * from "./api-stripe";
export * from "./api-fireflies";
export * from "./api-attio";
export * from "./api-tiktokads";
export * from "./api-zohodesk";
export * from "./api-zohoprojects";
export * from "./sqs";
export * from "./request";
export * from "./response";

// Import for discriminated union
import type { ApiCustomPayload } from "./api-custom";
import type { ApiGraphQLPayload } from "./api-graphql";
import type { ApiHubSpotPayload } from "./api-hubspot";
import type { ApiLinkedInPayload } from "./api-linkedin";
import type { ApiGoogleCalendarPayload } from "./api-googlecalendar";
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
import type { ApiQuickBooksPayload } from "./api-quickbooks";
import type { ApiGongPayload } from "./api-gong";
import type { ApiDynamicsPayload } from "./api-dynamics";
import type { AuthPayload } from "./auth";
import type { ApiGoogleAnalyticsPayload } from "./google-analytics";
import type { ApiLinearPayload } from "./api-linear";
import type { ApiRingCentralPayload } from "./api-ringcentral";
import type { ApiClerkPayload } from "./api-clerk";
import type { ApiStripePayload } from "./api-stripe";
import type { ApiFirefliesPayload } from "./api-fireflies";
import type { ApiAttioPayload } from "./api-attio";
import type { ApiTikTokAdsPayload } from "./api-tiktokads";
import type { ApiZohoDeskPayload } from "./api-zohodesk";
import type { ApiZohoProjectsPayload } from "./api-zohoprojects";
import type { ApiSqsPayload } from "./sqs";

/**
 * Discriminated union of all resource payload types
 * Use the 'subtype' field to narrow the type
 */
export type ResourceInvokePayload =
  | ApiCustomPayload
  | ApiGraphQLPayload
  | DbPostgresPayload
  | DbMssqlPayload
  | DbDynamoDBPayload
  | DbCosmosDBPayload
  | DbSnowflakePayload
  | ApiHubSpotPayload
  | ApiLinkedInPayload
  | ApiGoogleCalendarPayload
  | ApiSalesforcePayload
  | ApiGoogleSheetsPayload
  | ApiOutreachPayload
  | StorageS3Payload
  | ApiLambdaPayload
  | DbBigQueryPayload
  | DbNeo4jPayload
  | ApiSlackPayload
  | ApiQuickBooksPayload
  | AuthPayload
  | ApiGoogleAnalyticsPayload
  | ApiGongPayload
  | ApiDynamicsPayload
  | ApiLinearPayload
  | ApiRingCentralPayload
  | ApiClerkPayload
  | ApiStripePayload
  | ApiFirefliesPayload
  | ApiAttioPayload
  | ApiTikTokAdsPayload
  | ApiZohoDeskPayload
  | ApiZohoProjectsPayload
  | ApiSqsPayload;
