import type {
  DbDynamoDBPayload,
  DatabaseInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";

export class DynamoDBResourceClient extends BaseResourceClient {
  async invoke(
    command: DbDynamoDBPayload["command"],
    params: DbDynamoDBPayload["params"],
    invocationKey: string,
  ): Promise<DatabaseInvokeResponse> {
    const payload: DbDynamoDBPayload = {
      type: "database",
      subtype: "dynamodb",
      command,
      params,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<DatabaseInvokeResponse>;
  }
}
