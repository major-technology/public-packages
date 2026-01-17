/**
 * Snowflake binding value types matching Snowflake's supported types
 */
export interface SnowflakeBindingValue {
  type:
    | "TEXT"
    | "FIXED"
    | "REAL"
    | "BOOLEAN"
    | "DATE"
    | "TIME"
    | "TIMESTAMP_LTZ"
    | "TIMESTAMP_NTZ"
    | "TIMESTAMP_TZ"
    | "BINARY"
    | "ARRAY"
    | "OBJECT"
    | "VARIANT";
  value: string | number | boolean | null;
}

/**
 * Snowflake session parameters for query execution
 */
export interface SnowflakeSessionParameters {
  binary_output_format?: "HEX" | "BASE64";
  date_output_format?: string;
  time_output_format?: string;
  timestamp_ltz_output_format?: string;
  timestamp_ntz_output_format?: string;
  timestamp_tz_output_format?: string;
  timestamp_output_format?: string;
  timezone?: string;
  query_tag?: string;
  rows_per_resultset?: number;
  use_cached_result?: boolean;
  client_result_chunk_size?: number;
  /** For multi-statement execution (0 = variable count, 1 = single, >1 = exact count) */
  multi_statement_count?: string;
  /** Additional parameters */
  [key: string]: string | number | boolean | undefined;
}

/**
 * Execute operation payload - submit a SQL statement
 */
export interface SnowflakeExecutePayload {
  type: "database";
  subtype: "snowflake";
  operation: "execute";
  /** SQL statement to execute */
  statement: string;
  /** Parameter bindings */
  bindings?: Record<string, SnowflakeBindingValue>;
  /** Override default database */
  database?: string;
  /** Override default schema */
  schema?: string;
  /** Override default warehouse */
  warehouse?: string;
  /** Override default role */
  role?: string;
  /** Timeout in seconds (0 = max timeout of 604800s / 7 days) */
  timeout?: number;
  /** Execute asynchronously - returns statementHandle immediately */
  async?: boolean;
  /** Session parameters for this execution */
  parameters?: SnowflakeSessionParameters;
  /** Return SQL NULL as string "null" instead of JSON null */
  nullable?: boolean;
  /** Request ID for idempotency (auto-generated if not provided) */
  requestId?: string;
}

/**
 * Status operation payload - get status/results of a running query
 */
export interface SnowflakeStatusPayload {
  type: "database";
  subtype: "snowflake";
  operation: "status";
  /** Statement handle from execute operation */
  statementHandle: string;
  /** For paginated results - retrieve specific partition (0-indexed) */
  partition?: number;
}

/**
 * Cancel operation payload - cancel a running query
 */
export interface SnowflakeCancelPayload {
  type: "database";
  subtype: "snowflake";
  operation: "cancel";
  /** Statement handle to cancel */
  statementHandle: string;
}

/**
 * Discriminated union of all Snowflake operation payloads
 */
export type DbSnowflakePayload =
  | SnowflakeExecutePayload
  | SnowflakeStatusPayload
  | SnowflakeCancelPayload;

/**
 * Column metadata from Snowflake result set
 */
export interface SnowflakeColumnMetadata {
  name: string;
  type: string;
  length?: number | null;
  precision?: number | null;
  scale?: number | null;
  nullable: boolean;
  byteLength?: number | null;
  collation?: string | null;
  database?: string;
  schema?: string;
  table?: string;
}

/**
 * Partition info for large result sets
 */
export interface SnowflakePartitionInfo {
  rowCount: number;
  uncompressedSize: number;
  compressedSize?: number;
}

/**
 * Result set metadata
 */
export interface SnowflakeResultSetMetadata {
  numRows: number;
  format: string;
  rowType: SnowflakeColumnMetadata[];
  partitionInfo?: SnowflakePartitionInfo[];
}

/**
 * DML statistics
 */
export interface SnowflakeStats {
  numRowsInserted?: number;
  numRowsUpdated?: number;
  numRowsDeleted?: number;
  numDuplicateRowsUpdated?: number;
}

/**
 * Result from a Snowflake operation
 * This is a thin passthrough of Snowflake's SQL API response with `kind` added
 */
export interface DbSnowflakeResult {
  kind: "snowflake";
  /** Snowflake response code */
  code?: string;
  /** Response message */
  message: string;
  /** SQL state code for errors */
  sqlState?: string;
  /** Handle for the executed statement */
  statementHandle?: string;
  /** Handles for multi-statement execution */
  statementHandles?: string[];
  /** URL to check statement status */
  statementStatusUrl?: string;
  /** Timestamp when statement was created */
  createdOn?: number;
  /** Metadata about the result set */
  resultSetMetaData?: SnowflakeResultSetMetadata;
  /** Result data as array of arrays (each inner array is a row) */
  data?: (string | null)[][];
  /** DML operation statistics */
  stats?: SnowflakeStats;
}
