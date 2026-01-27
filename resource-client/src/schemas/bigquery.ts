/**
 * BigQuery payload and response types
 */

export type BigQueryOperation =
  | "query"
  | "listDatasets"
  | "listTables"
  | "getTable"
  | "insertRows"
  | "createTable";

export interface BigQueryFieldSchema {
  name: string;
  type: string; // STRING, INTEGER, FLOAT, BOOLEAN, TIMESTAMP, RECORD, etc.
  mode?: string; // NULLABLE, REQUIRED, REPEATED
  description?: string;
  fields?: BigQueryFieldSchema[]; // For RECORD type
}

export interface BigQueryTableSchema {
  fields: BigQueryFieldSchema[];
}

export interface DbBigQueryPayload {
  type: "database";
  subtype: "bigquery";
  operation: BigQueryOperation;

  // For query operation
  sql?: string;
  params?: Record<string, unknown>;

  // For table operations
  datasetId?: string;
  tableId?: string;

  // For insertRows
  rows?: Record<string, unknown>[];

  // For createTable
  schema?: BigQueryTableSchema;

  // Options
  timeoutMs?: number;
  maxResults?: number;
}

export interface BigQueryQueryResult {
  rows: Record<string, unknown>[];
  totalRows: number;
  schema: BigQueryFieldSchema[];
}

export interface BigQueryListDatasetsResult {
  datasets: Array<{
    datasetId: string;
    projectId: string;
  }>;
}

export interface BigQueryListTablesResult {
  tables: Array<{
    tableId: string;
    datasetId: string;
    projectId: string;
  }>;
}

export interface BigQueryGetTableResult {
  tableId: string;
  datasetId: string;
  schema: BigQueryFieldSchema[];
  numRows: number;
  numBytes: number;
  creationTime: string;
  lastModifiedTime: string;
  description?: string;
  type: string;
}

export interface BigQueryInsertRowsResult {
  insertedRows: number;
}

export interface BigQueryCreateTableResult {
  tableId: string;
  datasetId: string;
  created: boolean;
}

export interface BigQueryInvokeResponse {
  kind: "bigquery";
  operation: string;
  data:
    | BigQueryQueryResult
    | BigQueryListDatasetsResult
    | BigQueryListTablesResult
    | BigQueryGetTableResult
    | BigQueryInsertRowsResult
    | BigQueryCreateTableResult;
}
