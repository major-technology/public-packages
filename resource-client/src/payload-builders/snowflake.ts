import type {
  DbSnowflakePayload,
  SnowflakeExecutePayload,
  SnowflakeStatusPayload,
  SnowflakeCancelPayload,
  SnowflakeBindingValue,
  SnowflakeSessionParameters,
} from "../schemas";

/**
 * Build a Snowflake invoke payload (raw payload passthrough)
 * @param payload The complete Snowflake operation payload
 */
export function buildSnowflakeInvokePayload(
  payload: DbSnowflakePayload
): DbSnowflakePayload {
  return payload;
}

/**
 * Build a Snowflake execute payload
 * @param statement The SQL statement to execute
 * @param options Execution options
 */
export function buildSnowflakeExecutePayload(
  statement: string,
  options?: {
    bindings?: Record<string, SnowflakeBindingValue>;
    database?: string;
    schema?: string;
    warehouse?: string;
    role?: string;
    timeout?: number;
    async?: boolean;
    parameters?: SnowflakeSessionParameters;
    nullable?: boolean;
    requestId?: string;
  }
): SnowflakeExecutePayload {
  return {
    type: "database",
    subtype: "snowflake",
    operation: "execute",
    statement,
    bindings: options?.bindings,
    database: options?.database,
    schema: options?.schema,
    warehouse: options?.warehouse,
    role: options?.role,
    timeout: options?.timeout,
    async: options?.async,
    parameters: options?.parameters,
    nullable: options?.nullable,
    requestId: options?.requestId,
  };
}

/**
 * Build a Snowflake status payload
 * @param statementHandle The statement handle from execute operation
 * @param options Status options
 */
export function buildSnowflakeStatusPayload(
  statementHandle: string,
  options?: { partition?: number }
): SnowflakeStatusPayload {
  return {
    type: "database",
    subtype: "snowflake",
    operation: "status",
    statementHandle,
    partition: options?.partition,
  };
}

/**
 * Build a Snowflake cancel payload
 * @param statementHandle The statement handle to cancel
 */
export function buildSnowflakeCancelPayload(
  statementHandle: string
): SnowflakeCancelPayload {
  return {
    type: "database",
    subtype: "snowflake",
    operation: "cancel",
    statementHandle,
  };
}
