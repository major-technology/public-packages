import type {
  DbParamPrimitive,
  DbPostgresPayloadV2,
} from "../../schemas/v2";
import type { DatabaseInvokeResponse } from "../../schemas/v2/response";
import { BaseResourceClientV2 } from "../base";

export class PostgresResourceClientV2 extends BaseResourceClientV2 {
  async invoke(
    sql: string,
    params: DbParamPrimitive[] | undefined,
    invocationKey: string,
    timeoutMs?: number
  ): Promise<DatabaseInvokeResponse> {
    const payload: DbPostgresPayloadV2 = {
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
