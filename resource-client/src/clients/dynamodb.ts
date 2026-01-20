import type {
  DbDynamoDBPayload,
  DynamoDBCommandInputMap,
} from "../schemas";
import type { DynamoDBInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class DynamoDBResourceClient extends BaseResourceClient {
  /**
   * Execute a DynamoDB command
   * @param command The DynamoDB command to execute
   * @param params Parameters for the command (AWS SDK input type)
   * @param invocationKey Unique key for tracking this invocation
   * @returns Response with nested result: response.result.dynamodb.data
   *
   * @example
   * ```ts
   * const response = await client.invoke(
   *   "GetItem",
   *   { TableName: "users", Key: { id: { S: "123" } } },
   *   "get-user-123"
   * );
   *
   * if (response.ok) {
   *   const item = response.result.dynamodb.data.Item;
   * }
   * ```
   */
  async invoke<C extends keyof DynamoDBCommandInputMap>(
    command: C,
    params: DynamoDBCommandInputMap[C],
    invocationKey: string,
  ): Promise<DynamoDBInvokeResponse<C>> {
    const payload: DbDynamoDBPayload = {
      type: "database",
      subtype: "dynamodb",
      dynamodb: {
        command,
        params,
      },
    };

    return this.invokeRaw(payload, invocationKey) as Promise<DynamoDBInvokeResponse<C>>;
  }
}
