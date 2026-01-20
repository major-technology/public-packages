import type {
  DbParamPrimitive,
  DbPostgresPayload,
} from "../schemas";
import type { DatabaseInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class PostgresResourceClient extends BaseResourceClient {
  /**
   * Execute a SQL query against PostgreSQL
   * @param sql The SQL query to execute
   * @param params Optional positional parameters ($1, $2, etc.)
   * @param invocationKey Unique key for tracking this invocation
   * @param timeoutMs Optional timeout in milliseconds
   * @returns Response with nested result: response.result.database.rows
   *
   * @example
   * ```ts
   * const response = await client.invoke(
   *   "SELECT id, name, email FROM users WHERE id = $1",
   *   [123],
   *   "get-user-123"
   * );
   *
   * if (response.ok) {
   *   const rows = response.result.database.rows;
   * }
   * ```
   */
  async invoke(
    sql: string,
    params: DbParamPrimitive[] | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse> {
    const payload: DbPostgresPayload = {
      type: "database",
      subtype: "postgresql",
      postgresql: {
        sql,
        params,
        timeoutMs,
      },
    };

    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse>;
  }
}
