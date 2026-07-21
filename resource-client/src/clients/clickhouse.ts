import type {
  DbClickhouseParam,
  DatabaseInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildClickhouseInvokePayload } from "../payload-builders/clickhouse";

export class ClickhouseResourceClient extends BaseResourceClient {
  /**
   * Execute a SQL query against ClickHouse
   * @param sql The SQL query to execute
   * @param params Optional positional parameters (? placeholders)
   * @param invocationKey Unique key for tracking this invocation
   * @param timeoutMs Optional timeout in milliseconds
   * @returns Typed response with rows of type T
   */
  async invoke<T = Record<string, unknown>>(
    sql: string,
    params: DbClickhouseParam[] | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse<T>> {
    const payload = buildClickhouseInvokePayload(sql, params, timeoutMs);
    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse<T>>;
  }
}
