import type { DbBigQueryPayload, BigQueryTableSchema } from "../schemas";

/**
 * Build a BigQuery query payload
 * @param sql The SQL query to execute
 * @param params Optional query parameters
 * @param options Query options
 */
export function buildBigQueryQueryPayload(
  sql: string,
  params?: Record<string, unknown>,
  options?: { timeoutMs?: number; maxResults?: number }
): DbBigQueryPayload {
  return {
    type: "database",
    subtype: "bigquery",
    operation: "query",
    sql,
    params,
    timeoutMs: options?.timeoutMs,
    maxResults: options?.maxResults,
  };
}

/**
 * Build a BigQuery listDatasets payload
 * @param options List options
 */
export function buildBigQueryListDatasetsPayload(
  options?: { maxResults?: number }
): DbBigQueryPayload {
  return {
    type: "database",
    subtype: "bigquery",
    operation: "listDatasets",
    maxResults: options?.maxResults,
  };
}

/**
 * Build a BigQuery listTables payload
 * @param datasetId The dataset ID
 * @param options List options
 */
export function buildBigQueryListTablesPayload(
  datasetId: string,
  options?: { maxResults?: number }
): DbBigQueryPayload {
  return {
    type: "database",
    subtype: "bigquery",
    operation: "listTables",
    datasetId,
    maxResults: options?.maxResults,
  };
}

/**
 * Build a BigQuery getTable payload
 * @param datasetId The dataset ID
 * @param tableId The table ID
 */
export function buildBigQueryGetTablePayload(
  datasetId: string,
  tableId: string
): DbBigQueryPayload {
  return {
    type: "database",
    subtype: "bigquery",
    operation: "getTable",
    datasetId,
    tableId,
  };
}

/**
 * Build a BigQuery insertRows payload
 * @param datasetId The dataset ID
 * @param tableId The table ID
 * @param rows Array of rows to insert
 */
export function buildBigQueryInsertRowsPayload(
  datasetId: string,
  tableId: string,
  rows: Record<string, unknown>[]
): DbBigQueryPayload {
  return {
    type: "database",
    subtype: "bigquery",
    operation: "insertRows",
    datasetId,
    tableId,
    rows,
  };
}

/**
 * Build a BigQuery createTable payload
 * @param datasetId The dataset ID
 * @param tableId The table ID
 * @param schema Table schema
 * @param options Creation options
 */
export function buildBigQueryCreateTablePayload(
  datasetId: string,
  tableId: string,
  schema: BigQueryTableSchema,
  options?: { timeoutMs?: number }
): DbBigQueryPayload {
  return {
    type: "database",
    subtype: "bigquery",
    operation: "createTable",
    datasetId,
    tableId,
    schema,
    timeoutMs: options?.timeoutMs,
  };
}

/**
 * Build a raw BigQuery invoke payload
 * @param payload The partial payload
 */
export function buildBigQueryInvokePayload(
  payload: Omit<DbBigQueryPayload, "type" | "subtype">
): DbBigQueryPayload {
  return {
    type: "database",
    subtype: "bigquery",
    ...payload,
  };
}
