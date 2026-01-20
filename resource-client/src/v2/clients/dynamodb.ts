import type {
  DbDynamoDBPayloadV2,
  DynamoDBCommandInputMap,
} from "../../schemas/v2";
import type { DynamoDBInvokeResponse } from "../../schemas/v2/response";
import { BaseResourceClientV2 } from "../base";

export class DynamoDBResourceClientV2 extends BaseResourceClientV2 {
  async invoke<C extends keyof DynamoDBCommandInputMap>(
    command: C,
    params: DynamoDBCommandInputMap[C],
    invocationKey: string,
  ): Promise<DynamoDBInvokeResponse<C>> {
    const payload: DbDynamoDBPayloadV2 = {
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
