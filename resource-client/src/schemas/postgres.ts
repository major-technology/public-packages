/**
 * Primitive types allowed as database query parameters
 */
export type DbParamPrimitive = string | number | boolean | null;

/**
 * Payload for invoking a PostgreSQL database resource
 */
export interface DbPostgresPayload {
  type: "database";
  subtype: "postgresql";
  /** SQL query to execute */
  sql: string;
  /** Optional positional parameters for the query */
  params?: DbParamPrimitive[];
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Result from a database query execution with typed rows
 */
export interface DbResult<T = Record<string, unknown>> {
  kind: "database";
  /** Array of row objects returned by the query */
  rows: T[];
  /** Number of rows affected by the query (for INSERT, UPDATE, DELETE) */
  rowsAffected?: number;
}

