/**
 * Primitive types allowed as database query parameters
 */
export type DbParamPrimitive = string | number | boolean | null;

/**
 * PostgreSQL specific invoke data
 */
export interface PostgresqlInvokeData {
  /** SQL query to execute */
  sql: string;
  /** Optional positional parameters for the query */
  params?: DbParamPrimitive[];
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Payload for invoking a PostgreSQL database resource
 * Uses embedded structure for direct Go unmarshaling
 */
export interface DbPostgresPayload {
  type: "database";
  subtype: "postgresql";
  /** Embedded PostgreSQL payload */
  postgresql: PostgresqlInvokeData;
}

/**
 * Result from a database query execution
 */
export interface DbResult {
  kind: "database";
  /** Array of row objects returned by the query */
  rows: Record<string, unknown>[];
  /** Number of rows affected by the query (for INSERT, UPDATE, DELETE) */
  rowsAffected?: number;
}
