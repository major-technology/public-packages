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

/**
 * Payload for invoking a DynamoDB database resource
 */
export type DbDynamoDBPayload =
  | {
      type: "database";
      subtype: "dynamodb";
      command: "GetItem";
      params: GetItemCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "PutItem";
      params: PutItemCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "UpdateItem";
      params: UpdateItemCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "DeleteItem";
      params: DeleteItemCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "Query";
      params: QueryCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "Scan";
      params: ScanCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "BatchGetItem";
      params: BatchGetItemCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "BatchWriteItem";
      params: BatchWriteItemCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "TransactGetItems";
      params: TransactGetItemsCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "TransactWriteItems";
      params: TransactWriteItemsCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "ListTables";
      params: ListTablesCommandInput;
    }
  | {
      type: "database";
      subtype: "dynamodb";
      command: "DescribeTable";
      params: DescribeTableCommandInput;
    };
