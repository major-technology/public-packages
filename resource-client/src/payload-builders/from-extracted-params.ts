import type { ResourceInvokePayload, CosmosValue } from "../schemas";
import { buildPostgresInvokePayload } from "./postgres";
import { buildDynamoDBInvokePayload } from "./dynamodb";
import {
  buildCosmosDBInvokePayload,
  buildCosmosDBQueryPayload,
  buildCosmosDBReadPayload,
  buildCosmosDBCreatePayload,
  buildCosmosDBReplacePayload,
  buildCosmosDBUpsertPayload,
  buildCosmosDBDeletePayload,
  buildCosmosDBPatchPayload,
} from "./cosmosdb";
import { buildMssqlInvokePayload } from "./mssql";
import {
  buildSnowflakeInvokePayload,
  buildSnowflakeExecutePayload,
  buildSnowflakeStatusPayload,
  buildSnowflakeCancelPayload,
} from "./snowflake";
import { buildS3InvokePayload } from "./s3";
import { buildLambdaInvokePayload } from "./lambda";
import {
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
import { buildHubSpotInvokePayload } from "./hubspot";
import {
  buildSalesforceInvokePayload,
  buildSalesforceQueryPayload,
  buildSalesforceGetRecordPayload,
  buildSalesforceCreateRecordPayload,
  buildSalesforceUpdateRecordPayload,
  buildSalesforceDeleteRecordPayload,
  buildSalesforceDescribeObjectPayload,
} from "./salesforce";
import { buildCustomApiInvokePayload } from "./custom";
import {
  buildBigQueryQueryPayload,
  buildBigQueryListDatasetsPayload,
  buildBigQueryListTablesPayload,
  buildBigQueryGetTablePayload,
  buildBigQueryInsertRowsPayload,
  buildBigQueryCreateTablePayload,
  buildBigQueryInvokePayload,
} from "./bigquery";
import { buildOutreachInvokePayload } from "./outreach";
import { buildNeo4jInvokePayload } from "./neo4j";
import { buildSlackInvokePayload } from "./slack";
import { buildAuthShareAccessPayload, buildAuthRevokeAccessPayload } from "./auth";
import {
  buildGoogleAnalyticsRunReportPayload,
  buildGoogleAnalyticsGetMetadataPayload,
  buildGoogleAnalyticsListAccountsPayload,
  buildGoogleAnalyticsListPropertiesPayload,
  buildGoogleAnalyticsInvokePayload,
} from "./google-analytics";

/**
 * Extracted parameter from query extraction
 */
export interface ExtractedParam {
  name: string;
  value: string;
  valueType: string;
  /** Whether the value was statically resolvable from source code */
  known?: boolean;
  /** Original expression if not known */
  expression?: string;
}

/**
 * Check if a param represents an undefined value
 * An undefined param is one that is not statically known and has expression "undefined"
 */
function isUndefinedParam(param: ExtractedParam): boolean {
  return param.known === false && param.expression === "undefined";
}

/**
 * Parse a param value based on its type
 */
function parseParamValue(value: string, valueType: string): unknown {
  if (valueType === "object" || valueType === "list") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  if (valueType === "number") {
    const num = Number(value);
    return isNaN(num) ? value : num;
  }
  if (valueType === "boolean") {
    return value === "true";
  }
  return value;
}

/**
 * Find a param by name (case-insensitive)
 * Returns undefined if param is not found or if param is an undefined expression
 */
function findParam(params: ExtractedParam[], name: string): unknown {
  const param = params.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (!param) return undefined;
  // If param is not known and expression is "undefined", treat it as undefined
  if (isUndefinedParam(param)) return undefined;
  return parseParamValue(param.value, param.valueType);
}

/**
 * Build a payload from extracted params
 * This is the universal builder that routes to the correct resource-specific builder
 *
 * @param subtype The resource subtype (e.g., "postgresql", "dynamodb", "cosmosdb")
 * @param methodName The method name being invoked (e.g., "invoke", "query", "execute")
 * @param extractedParams Array of extracted parameters with their values
 * @returns The complete payload ready to send to the API
 */
export function buildPayloadFromExtractedParams(
  subtype: string,
  methodName: string,
  extractedParams: ExtractedParam[]
): ResourceInvokePayload {
  switch (subtype) {
    // =========================================================================
    // PostgreSQL
    // =========================================================================
    case "postgresql": {
      const sql = findParam(extractedParams, "SQL") as string;
      const params = findParam(extractedParams, "Params") as unknown[] | undefined;
      const timeoutMs = findParam(extractedParams, "Timeout") as number | undefined;
      return buildPostgresInvokePayload(sql, params as (string | number | boolean | null)[], timeoutMs);
    }

    // =========================================================================
    // DynamoDB
    // =========================================================================
    case "dynamodb": {
      const command = findParam(extractedParams, "Command") as string;
      const params = findParam(extractedParams, "Params") as Record<string, unknown>;
      return buildDynamoDBInvokePayload(command as "Query", params as never);
    }

    // =========================================================================
    // CosmosDB
    // =========================================================================
    case "cosmosdb": {
      if (methodName === "invoke") {
        // Raw payload passthrough
        const payload = findParam(extractedParams, "Payload");
        return buildCosmosDBInvokePayload(payload as never);
      }
      if (methodName === "query") {
        const container = findParam(extractedParams, "Container") as string;
        const query = findParam(extractedParams, "Query") as string;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildCosmosDBQueryPayload(container, query, options);
      }
      if (methodName === "read") {
        const container = findParam(extractedParams, "Container") as string;
        const id = findParam(extractedParams, "Id") as string;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildCosmosDBReadPayload(container, id, options);
      }
      if (methodName === "create") {
        const container = findParam(extractedParams, "Container") as string;
        const body = findParam(extractedParams, "Body") as Record<string, CosmosValue>;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildCosmosDBCreatePayload(container, body, options);
      }
      if (methodName === "replace") {
        const container = findParam(extractedParams, "Container") as string;
        const id = findParam(extractedParams, "Id") as string;
        const body = findParam(extractedParams, "Body") as Record<string, CosmosValue>;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildCosmosDBReplacePayload(container, id, body, options);
      }
      if (methodName === "upsert") {
        const container = findParam(extractedParams, "Container") as string;
        const body = findParam(extractedParams, "Body") as Record<string, CosmosValue>;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildCosmosDBUpsertPayload(container, body, options);
      }
      if (methodName === "delete") {
        const container = findParam(extractedParams, "Container") as string;
        const id = findParam(extractedParams, "Id") as string;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildCosmosDBDeletePayload(container, id, options);
      }
      if (methodName === "patch") {
        const container = findParam(extractedParams, "Container") as string;
        const id = findParam(extractedParams, "Id") as string;
        const patchOperations = findParam(extractedParams, "PatchOperations") as never[];
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildCosmosDBPatchPayload(container, id, patchOperations, options);
      }
      // Default: try raw payload
      const payload = findParam(extractedParams, "Payload");
      return buildCosmosDBInvokePayload(payload as never);
    }

    // =========================================================================
    // MSSQL
    // =========================================================================
    case "mssql": {
      const sql = findParam(extractedParams, "SQL") as string;
      const params = findParam(extractedParams, "Params") as Record<string, unknown> | undefined;
      const timeoutMs = findParam(extractedParams, "Timeout") as number | undefined;
      return buildMssqlInvokePayload(sql, params as never, timeoutMs);
    }

    // =========================================================================
    // Snowflake
    // =========================================================================
    case "snowflake": {
      if (methodName === "invoke") {
        const payload = findParam(extractedParams, "Payload");
        return buildSnowflakeInvokePayload(payload as never);
      }
      if (methodName === "execute") {
        const statement = findParam(extractedParams, "Statement") as string;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildSnowflakeExecutePayload(statement, options);
      }
      if (methodName === "status") {
        const statementHandle = findParam(extractedParams, "StatementHandle") as string;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildSnowflakeStatusPayload(statementHandle, options);
      }
      if (methodName === "cancel") {
        const statementHandle = findParam(extractedParams, "StatementHandle") as string;
        return buildSnowflakeCancelPayload(statementHandle);
      }
      // Default: try raw payload
      const payload = findParam(extractedParams, "Payload");
      return buildSnowflakeInvokePayload(payload as never);
    }

    // =========================================================================
    // S3
    // =========================================================================
    case "s3": {
      const command = findParam(extractedParams, "Command") as string;
      const params = findParam(extractedParams, "Params") as Record<string, unknown>;
      const options = findParam(extractedParams, "Options") as { timeoutMs?: number } | undefined;
      return buildS3InvokePayload(command as never, params, options);
    }

    // =========================================================================
    // Lambda
    // =========================================================================
    case "lambda": {
      const functionName = findParam(extractedParams, "FunctionName") as string;
      const payload = findParam(extractedParams, "Payload");
      const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
      return buildLambdaInvokePayload(functionName, payload, options);
    }

    // =========================================================================
    // Google Sheets
    // =========================================================================
    case "googlesheets": {
      if (methodName === "getValues") {
        const range = findParam(extractedParams, "Range") as string;
        return buildGoogleSheetsGetValuesPayload(range);
      }
      if (methodName === "updateValues") {
        const range = findParam(extractedParams, "Range") as string;
        const values = findParam(extractedParams, "Values") as unknown[][];
        const valueInputOption = (findParam(extractedParams, "ValueInputOption") as "RAW" | "USER_ENTERED") ?? "USER_ENTERED";
        return buildGoogleSheetsUpdateValuesPayload(range, values, valueInputOption);
      }
      if (methodName === "appendValues") {
        const range = findParam(extractedParams, "Range") as string;
        const values = findParam(extractedParams, "Values") as unknown[][];
        const valueInputOption = (findParam(extractedParams, "ValueInputOption") as "RAW" | "USER_ENTERED") ?? "USER_ENTERED";
        return buildGoogleSheetsAppendValuesPayload(range, values, valueInputOption);
      }
      if (methodName === "clearValues") {
        const range = findParam(extractedParams, "Range") as string;
        return buildGoogleSheetsClearValuesPayload(range);
      }
      if (methodName === "batchGetValues") {
        const ranges = findParam(extractedParams, "Ranges") as string[];
        return buildGoogleSheetsBatchGetValuesPayload(ranges);
      }
      if (methodName === "batchUpdateValues") {
        const data = findParam(extractedParams, "Data") as Array<{ range: string; values: unknown[][] }>;
        const valueInputOption = (findParam(extractedParams, "ValueInputOption") as "RAW" | "USER_ENTERED") ?? "USER_ENTERED";
        return buildGoogleSheetsBatchUpdateValuesPayload(data, valueInputOption);
      }
      if (methodName === "getSpreadsheet") {
        return buildGoogleSheetsGetSpreadsheetPayload();
      }
      if (methodName === "batchUpdate") {
        const requests = findParam(extractedParams, "Requests") as unknown[];
        return buildGoogleSheetsBatchUpdatePayload(requests);
      }
      // Default: invoke method
      const method = findParam(extractedParams, "Method") as "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      const path = findParam(extractedParams, "Path") as string;
      const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
      return buildGoogleSheetsInvokePayload(method, path, options);
    }

    // =========================================================================
    // HubSpot
    // =========================================================================
    case "hubspot": {
      const method = findParam(extractedParams, "Method") as "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      const path = findParam(extractedParams, "Path") as string;
      const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
      return buildHubSpotInvokePayload(method, path, options);
    }

    // =========================================================================
    // Salesforce
    // =========================================================================
    case "salesforce": {
      if (methodName === "query") {
        const query = findParam(extractedParams, "Query") as string;
        return buildSalesforceQueryPayload(query);
      }
      if (methodName === "getRecord") {
        const objectType = findParam(extractedParams, "ObjectType") as string;
        const recordId = findParam(extractedParams, "RecordId") as string;
        return buildSalesforceGetRecordPayload(objectType, recordId);
      }
      if (methodName === "createRecord") {
        const objectType = findParam(extractedParams, "ObjectType") as string;
        const data = findParam(extractedParams, "Data") as Record<string, unknown>;
        return buildSalesforceCreateRecordPayload(objectType, data);
      }
      if (methodName === "updateRecord") {
        const objectType = findParam(extractedParams, "ObjectType") as string;
        const recordId = findParam(extractedParams, "RecordId") as string;
        const data = findParam(extractedParams, "Data") as Record<string, unknown>;
        return buildSalesforceUpdateRecordPayload(objectType, recordId, data);
      }
      if (methodName === "deleteRecord") {
        const objectType = findParam(extractedParams, "ObjectType") as string;
        const recordId = findParam(extractedParams, "RecordId") as string;
        return buildSalesforceDeleteRecordPayload(objectType, recordId);
      }
      if (methodName === "describeObject") {
        const objectType = findParam(extractedParams, "ObjectType") as string;
        return buildSalesforceDescribeObjectPayload(objectType);
      }
      // Default: invoke method
      const method = findParam(extractedParams, "Method") as "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      const path = findParam(extractedParams, "Path") as string;
      const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
      return buildSalesforceInvokePayload(method, path, options);
    }

    // =========================================================================
    // Custom API
    // =========================================================================
    case "custom": {
      const method = findParam(extractedParams, "Method") as "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      const path = findParam(extractedParams, "Path") as string;
      const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
      return buildCustomApiInvokePayload(method, path, options);
    }

    // =========================================================================
    // BigQuery
    // =========================================================================
    case "bigquery": {
      if (methodName === "query") {
        const sql = findParam(extractedParams, "SQL") as string;
        const params = findParam(extractedParams, "Params") as Record<string, unknown> | undefined;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildBigQueryQueryPayload(sql, params, options);
      }
      if (methodName === "listDatasets") {
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildBigQueryListDatasetsPayload(options);
      }
      if (methodName === "listTables") {
        const datasetId = findParam(extractedParams, "DatasetId") as string;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildBigQueryListTablesPayload(datasetId, options);
      }
      if (methodName === "getTable") {
        const datasetId = findParam(extractedParams, "DatasetId") as string;
        const tableId = findParam(extractedParams, "TableId") as string;
        return buildBigQueryGetTablePayload(datasetId, tableId);
      }
      if (methodName === "insertRows") {
        const datasetId = findParam(extractedParams, "DatasetId") as string;
        const tableId = findParam(extractedParams, "TableId") as string;
        const rows = findParam(extractedParams, "Rows") as Record<string, unknown>[];
        return buildBigQueryInsertRowsPayload(datasetId, tableId, rows);
      }
      if (methodName === "createTable") {
        const datasetId = findParam(extractedParams, "DatasetId") as string;
        const tableId = findParam(extractedParams, "TableId") as string;
        const schema = findParam(extractedParams, "Schema") as { fields: Array<{ name: string; type: string; mode?: string; description?: string }> };
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildBigQueryCreateTablePayload(datasetId, tableId, schema, options);
      }
      // Default: invoke method
      const payload = findParam(extractedParams, "Payload") as Record<string, unknown>;
      return buildBigQueryInvokePayload(payload as never);
    }

    // =========================================================================
    // Outreach
    // =========================================================================
    case "outreach": {
      const method = findParam(extractedParams, "Method") as "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      const path = findParam(extractedParams, "Path") as string;
      const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
      return buildOutreachInvokePayload(method, path, options);
    }

    // =========================================================================
    // Neo4j
    // =========================================================================
    case "neo4j": {
      const cypher = findParam(extractedParams, "Cypher") as string;
      const params = findParam(extractedParams, "Params") as Record<string, unknown> | undefined;
      const timeoutMs = findParam(extractedParams, "Timeout") as number | undefined;
      return buildNeo4jInvokePayload(cypher, params, timeoutMs);
    }

    // =========================================================================
    // Slack
    // =========================================================================
    case "slack": {
      const method = findParam(extractedParams, "Method") as string;
      const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
      return buildSlackInvokePayload(method, options);
    }

    // =========================================================================
    // Major Auth
    // =========================================================================
    case "majorauth": {
      const email = findParam(extractedParams, "Email") as string;
      if (methodName === "revokeAccess") {
        return buildAuthRevokeAccessPayload(email);
      }
      return buildAuthShareAccessPayload(email);
    }

    // =========================================================================
    // Google Analytics
    // =========================================================================
    case "googleanalytics": {
      if (methodName === "runReport") {
        const dimensions = findParam(extractedParams, "Dimensions") as { name: string }[] | undefined;
        const metrics = findParam(extractedParams, "Metrics") as { name: string }[] | undefined;
        const dateRanges = findParam(extractedParams, "DateRanges") as { startDate: string; endDate: string }[] | undefined;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildGoogleAnalyticsRunReportPayload(
          dimensions ?? [],
          metrics ?? [],
          dateRanges ?? [],
          options as never
        );
      }
      if (methodName === "getMetadata") {
        return buildGoogleAnalyticsGetMetadataPayload();
      }
      if (methodName === "listAccounts") {
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildGoogleAnalyticsListAccountsPayload(options as never);
      }
      if (methodName === "listProperties") {
        const accountId = findParam(extractedParams, "AccountId") as string | undefined;
        const options = findParam(extractedParams, "Options") as Record<string, unknown> | undefined;
        return buildGoogleAnalyticsListPropertiesPayload(accountId, options as never);
      }
      // Default: invoke method
      const payload = findParam(extractedParams, "Payload") as Record<string, unknown>;
      return buildGoogleAnalyticsInvokePayload(payload as never);
    }

    default:
      throw new Error(`Unsupported resource subtype: ${subtype}`);
  }
}
