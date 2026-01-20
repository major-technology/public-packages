import type {
  DbSnowflakePayload,
  SnowflakeInvokeData,
} from "../schemas";
import type { SnowflakeInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class SnowflakeResourceClient extends BaseResourceClient {
  /**
   * Execute a Snowflake operation
   * @param invokeData The operation data (execute, status, or cancel)
   * @param invocationKey Unique key for tracking this invocation
   * @returns Response with nested result: response.result.snowflake
   */
  async invoke(
    invokeData: SnowflakeInvokeData,
    invocationKey: string,
  ): Promise<SnowflakeInvokeResponse> {
    const payload: DbSnowflakePayload = {
      type: "database",
      subtype: "snowflake",
      snowflake: invokeData,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<SnowflakeInvokeResponse>;
  }
}
