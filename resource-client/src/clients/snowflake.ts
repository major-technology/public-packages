import type {
  DbSnowflakePayload,
  DbSnowflakeResult,
  SnowflakeBindingValue,
  SnowflakeSessionParameters,
} from "../schemas";
import type { BaseInvokeSuccess, InvokeFailure } from "../schemas/response";
import { BaseResourceClient } from "../base";
import {
  buildSnowflakeInvokePayload,
  buildSnowflakeExecutePayload,
  buildSnowflakeStatusPayload,
  buildSnowflakeCancelPayload,
} from "../payload-builders/snowflake";

/**
 * Response type for Snowflake operations
 */
export type SnowflakeInvokeResponse =
  | BaseInvokeSuccess<DbSnowflakeResult>
  | InvokeFailure;

/**
 * Options for execute operation
 */
export interface SnowflakeExecuteOptions {
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
 * Options for status operation
 */
export interface SnowflakeStatusOptions {
  /** For paginated results - retrieve specific partition (0-indexed) */
  partition?: number;
}

export class SnowflakeResourceClient extends BaseResourceClient {
  /**
   * Invoke a Snowflake operation with a raw payload
   * @param payload The complete operation payload
   * @param invocationKey Unique key for tracking this invocation
   */
  async invoke(
    payload: DbSnowflakePayload,
    invocationKey: string
  ): Promise<SnowflakeInvokeResponse> {
    return this.invokeRaw(buildSnowflakeInvokePayload(payload), invocationKey) as Promise<SnowflakeInvokeResponse>;
  }

  /**
   * Execute a SQL statement
   * @param statement The SQL statement to execute
   * @param invocationKey Unique key for tracking this invocation
   * @param options Execution options (bindings, database overrides, async, etc.)
   */
  async execute(
    statement: string,
    invocationKey: string,
    options: SnowflakeExecuteOptions = {}
  ): Promise<SnowflakeInvokeResponse> {
    const payload = buildSnowflakeExecutePayload(statement, options);
    return this.invokeRaw(payload, invocationKey) as Promise<SnowflakeInvokeResponse>;
  }

  /**
   * Get status or results of a statement
   * @param statementHandle The statement handle from execute operation
   * @param invocationKey Unique key for tracking this invocation
   * @param options Status options (partition for paginated results)
   */
  async status(
    statementHandle: string,
    invocationKey: string,
    options: SnowflakeStatusOptions = {}
  ): Promise<SnowflakeInvokeResponse> {
    const payload = buildSnowflakeStatusPayload(statementHandle, options);
    return this.invokeRaw(payload, invocationKey) as Promise<SnowflakeInvokeResponse>;
  }

  /**
   * Cancel a running statement
   * @param statementHandle The statement handle to cancel
   * @param invocationKey Unique key for tracking this invocation
   */
  async cancel(
    statementHandle: string,
    invocationKey: string
  ): Promise<SnowflakeInvokeResponse> {
    const payload = buildSnowflakeCancelPayload(statementHandle);
    return this.invokeRaw(payload, invocationKey) as Promise<SnowflakeInvokeResponse>;
  }
}
