// PostgreSQL
export { buildPostgresInvokePayload } from "./postgres";

// DynamoDB
export { buildDynamoDBInvokePayload } from "./dynamodb";

// CosmosDB
export {
  buildCosmosDBInvokePayload,
  buildCosmosDBQueryPayload,
  buildCosmosDBReadPayload,
  buildCosmosDBCreatePayload,
  buildCosmosDBReplacePayload,
  buildCosmosDBUpsertPayload,
  buildCosmosDBDeletePayload,
  buildCosmosDBPatchPayload,
} from "./cosmosdb";

// MSSQL
export { buildMssqlInvokePayload } from "./mssql";

// Snowflake
export {
  buildSnowflakeInvokePayload,
  buildSnowflakeExecutePayload,
  buildSnowflakeStatusPayload,
  buildSnowflakeCancelPayload,
} from "./snowflake";

// S3
export { buildS3InvokePayload } from "./s3";

// Lambda
export { buildLambdaInvokePayload } from "./lambda";
export type { LambdaInvokeOptions } from "./lambda";

// Google Sheets
export {
  buildGoogleSheetsInvokePayload,
  buildGoogleSheetsGetValuesPayload,
  buildGoogleSheetsUpdateValuesPayload,
  buildGoogleSheetsAppendValuesPayload,
  buildGoogleSheetsClearValuesPayload,
  buildGoogleSheetsBatchGetValuesPayload,
  buildGoogleSheetsBatchUpdateValuesPayload,
  buildGoogleSheetsGetSpreadsheetPayload,
  buildGoogleSheetsBatchUpdatePayload,
} from "./googlesheets";

// HubSpot
export { buildHubSpotInvokePayload } from "./hubspot";

// Salesforce
export {
  buildSalesforceInvokePayload,
  buildSalesforceQueryPayload,
  buildSalesforceGetRecordPayload,
  buildSalesforceCreateRecordPayload,
  buildSalesforceUpdateRecordPayload,
  buildSalesforceDeleteRecordPayload,
  buildSalesforceDescribeObjectPayload,
} from "./salesforce";

// Custom API
export { buildCustomApiInvokePayload } from "./custom";

// Universal builder from extracted params
export { buildPayloadFromExtractedParams } from "./from-extracted-params";
export type { ExtractedParam } from "./from-extracted-params";
