import type {
  BigQueryInvokeResponse,
  BigQueryTableSchema,
  DbBigQueryPayload,
} from "../schemas";
import { BaseResourceClient } from "../base";
import {
  buildBigQueryQueryPayload,
  buildBigQueryListDatasetsPayload,
  buildBigQueryListTablesPayload,
  buildBigQueryGetTablePayload,
  buildBigQueryInsertRowsPayload,
  buildBigQueryCreateTablePayload,
  buildBigQueryInvokePayload,
} from "../payload-builders/bigquery";

export interface BigQueryQueryOptions {
  timeoutMs?: number;
  maxResults?: number;
}

export class BigQueryResourceClient extends BaseResourceClient {
  /**
   * Execute a SQL query
   * @param sql The SQL query to execute
   * @param params Optional query parameters (named parameters)
   * @param invocationKey Unique key for tracking this invocation
   * @param options Query options
   */
  async query(
    sql: string,
    params: Record<string, unknown> | undefined,
    invocationKey: string,
    options?: BigQueryQueryOptions
  ): Promise<BigQueryInvokeResponse> {
    const payload = buildBigQueryQueryPayload(sql, params, options);
    return this.invokeRaw(payload, invocationKey) as Promise<BigQueryInvokeResponse>;
  }

  /**
   * List all datasets in the project
   * @param invocationKey Unique key for tracking this invocation
   * @param options List options
   */
  async listDatasets(
    invocationKey: string,
    options?: { maxResults?: number }
  ): Promise<BigQueryInvokeResponse> {
    const payload = buildBigQueryListDatasetsPayload(options);
    return this.invokeRaw(payload, invocationKey) as Promise<BigQueryInvokeResponse>;
  }

  /**
   * List all tables in a dataset
   * @param datasetId The dataset ID
   * @param invocationKey Unique key for tracking this invocation
   * @param options List options
   */
  async listTables(
    datasetId: string,
    invocationKey: string,
    options?: { maxResults?: number }
  ): Promise<BigQueryInvokeResponse> {
    const payload = buildBigQueryListTablesPayload(datasetId, options);
    return this.invokeRaw(payload, invocationKey) as Promise<BigQueryInvokeResponse>;
  }

  /**
   * Get table metadata and schema
   * @param datasetId The dataset ID
   * @param tableId The table ID
   * @param invocationKey Unique key for tracking this invocation
   */
  async getTable(
    datasetId: string,
    tableId: string,
    invocationKey: string
  ): Promise<BigQueryInvokeResponse> {
    const payload = buildBigQueryGetTablePayload(datasetId, tableId);
    return this.invokeRaw(payload, invocationKey) as Promise<BigQueryInvokeResponse>;
  }

  /**
   * Insert rows into a table (streaming insert)
   * @param datasetId The dataset ID
   * @param tableId The table ID
   * @param rows Array of rows to insert
   * @param invocationKey Unique key for tracking this invocation
   */
  async insertRows(
    datasetId: string,
    tableId: string,
    rows: Record<string, unknown>[],
    invocationKey: string
  ): Promise<BigQueryInvokeResponse> {
    const payload = buildBigQueryInsertRowsPayload(datasetId, tableId, rows);
    return this.invokeRaw(payload, invocationKey) as Promise<BigQueryInvokeResponse>;
  }

  /**
   * Create a new table
   * @param datasetId The dataset ID
   * @param tableId The table ID
   * @param schema Table schema definition
   * @param invocationKey Unique key for tracking this invocation
   * @param options Table creation options
   */
  async createTable(
    datasetId: string,
    tableId: string,
    schema: BigQueryTableSchema,
    invocationKey: string,
    options?: { timeoutMs?: number }
  ): Promise<BigQueryInvokeResponse> {
    const payload = buildBigQueryCreateTablePayload(datasetId, tableId, schema, options);
    return this.invokeRaw(payload, invocationKey) as Promise<BigQueryInvokeResponse>;
  }

  /**
   * Raw invoke with a custom payload
   * @param payload The BigQuery payload
   * @param invocationKey Unique key for tracking this invocation
   */
  async invoke(
    payload: Omit<DbBigQueryPayload, "type" | "subtype">,
    invocationKey: string
  ): Promise<BigQueryInvokeResponse> {
    const fullPayload = buildBigQueryInvokePayload(payload);
    return this.invokeRaw(fullPayload, invocationKey) as Promise<BigQueryInvokeResponse>;
  }
}
