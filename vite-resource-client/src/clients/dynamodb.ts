import type {
  DbDynamoDBPayload,
  DatabaseInvokeResponse,
} from "../schemas";
import type {
  GetItemCommandInput,
  PutItemCommandInput,
  UpdateItemCommandInput,
  DeleteItemCommandInput,
  QueryCommandInput,
  ScanCommandInput,
  BatchGetItemCommandInput,
  BatchWriteItemCommandInput,
  TransactGetItemsCommandInput,
  TransactWriteItemsCommandInput,
  ListTablesCommandInput,
  DescribeTableCommandInput,
} from "@aws-sdk/client-dynamodb";
import { BaseResourceClient } from "../base";

type DynamoDBCommandMap = {
  GetItem: GetItemCommandInput;
  PutItem: PutItemCommandInput;
  UpdateItem: UpdateItemCommandInput;
  DeleteItem: DeleteItemCommandInput;
  Query: QueryCommandInput;
  Scan: ScanCommandInput;
  BatchGetItem: BatchGetItemCommandInput;
  BatchWriteItem: BatchWriteItemCommandInput;
  TransactGetItems: TransactGetItemsCommandInput;
  TransactWriteItems: TransactWriteItemsCommandInput;
  ListTables: ListTablesCommandInput;
  DescribeTable: DescribeTableCommandInput;
};

export class DynamoDBResourceClient extends BaseResourceClient {
  async invoke<C extends keyof DynamoDBCommandMap>(
    command: C,
    params: DynamoDBCommandMap[C],
    invocationKey: string,
  ): Promise<DatabaseInvokeResponse> {
    const payload = {
      type: "database" as const,
      subtype: "dynamodb" as const,
      command,
      params,
    };

    return this.invokeRaw(payload as DbDynamoDBPayload, invocationKey) as Promise<DatabaseInvokeResponse>;
  }
}
