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
  GetItemCommandOutput,
  PutItemCommandOutput,
  UpdateItemCommandOutput,
  DeleteItemCommandOutput,
  QueryCommandOutput,
  ScanCommandOutput,
  BatchGetItemCommandOutput,
  BatchWriteItemCommandOutput,
  TransactGetItemsCommandOutput,
  TransactWriteItemsCommandOutput,
  ListTablesCommandOutput,
  DescribeTableCommandOutput,
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

/**
 * DynamoDB command input type map
 */
export type DynamoDBCommandInputMap = {
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

/**
 * DynamoDB command output type map
 */
export type DynamoDBCommandOutputMap = {
  GetItem: GetItemCommandOutput;
  PutItem: PutItemCommandOutput;
  UpdateItem: UpdateItemCommandOutput;
  DeleteItem: DeleteItemCommandOutput;
  Query: QueryCommandOutput;
  Scan: ScanCommandOutput;
  BatchGetItem: BatchGetItemCommandOutput;
  BatchWriteItem: BatchWriteItemCommandOutput;
  TransactGetItems: TransactGetItemsCommandOutput;
  TransactWriteItems: TransactWriteItemsCommandOutput;
  ListTables: ListTablesCommandOutput;
  DescribeTable: DescribeTableCommandOutput;
};

/**
 * Extract the result type for a specific DynamoDB command
 */
export type DbDynamoDBResultForCommand<C extends keyof DynamoDBCommandOutputMap> = {
  kind: "dynamodb";
  command: C;
  data: DynamoDBCommandOutputMap[C];
};

/**
 * Result from a DynamoDB database resource invocation
 * Matches the backend DatabaseDynamoDBResult structure
 */
export type DbDynamoDBResult =
  | {
      kind: "dynamodb";
      command: "GetItem";
      data: GetItemCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "PutItem";
      data: PutItemCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "UpdateItem";
      data: UpdateItemCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "DeleteItem";
      data: DeleteItemCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "Query";
      data: QueryCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "Scan";
      data: ScanCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "BatchGetItem";
      data: BatchGetItemCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "BatchWriteItem";
      data: BatchWriteItemCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "TransactGetItems";
      data: TransactGetItemsCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "TransactWriteItems";
      data: TransactWriteItemsCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "ListTables";
      data: ListTablesCommandOutput;
    }
  | {
      kind: "dynamodb";
      command: "DescribeTable";
      data: DescribeTableCommandOutput;
    };
