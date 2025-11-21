import type {
  DbDynamoDBPayload,
  DynamoDBCommandInputMap,
  DbDynamoDBResultForCommand,
} from "../schemas";
import type { BaseInvokeSuccess, InvokeFailure } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class DynamoDBResourceClient extends BaseResourceClient {
  async invoke<C extends keyof DynamoDBCommandInputMap>(
    command: C,
    params: DynamoDBCommandInputMap[C],
    invocationKey: string,
  ): Promise<BaseInvokeSuccess<DbDynamoDBResultForCommand<C>> | InvokeFailure> {
    const payload = {
      type: "database" as const,
      subtype: "dynamodb" as const,
      command,
      params,
    };

    return this.invokeRaw(payload as DbDynamoDBPayload, invocationKey) as Promise<
      BaseInvokeSuccess<DbDynamoDBResultForCommand<C>> | InvokeFailure
    >;
  }
}
