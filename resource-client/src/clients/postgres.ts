import type {
  DbParamPrimitive,
  DbPostgresPayload,
  DatabaseInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";

export class PostgresResourceClient extends BaseResourceClient {
  async invoke(
    sql: string,
    params: DbParamPrimitive[] | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse> {
    const payload: DbPostgresPayload = {
      type: "database",
      subtype: "postgresql",
      sql,
      params,
      timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse>;
  }
}

