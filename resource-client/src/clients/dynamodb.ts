import type {
  DynamoDBCommandInputMap,
  DbDynamoDBResultForCommand,
} from "../schemas";
import type { BaseInvokeSuccess, InvokeFailure } from "../schemas/response";
import { BaseResourceClient } from "../base";
import { buildDynamoDBInvokePayload } from "../payload-builders/dynamodb";

export class DynamoDBResourceClient extends BaseResourceClient {
  async invoke<C extends keyof DynamoDBCommandInputMap>(
    command: C,
    params: DynamoDBCommandInputMap[C],
    invocationKey: string,
  ): Promise<BaseInvokeSuccess<DbDynamoDBResultForCommand<C>> | InvokeFailure> {
    const payload = buildDynamoDBInvokePayload(command, params);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<DbDynamoDBResultForCommand<C>> | InvokeFailure
    >;
  }
}
