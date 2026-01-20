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
 * DynamoDB specific invoke data for each command type
 */
export type DynamoDBInvokeData =
  | { command: "GetItem"; params: GetItemCommandInput }
  | { command: "PutItem"; params: PutItemCommandInput }
  | { command: "UpdateItem"; params: UpdateItemCommandInput }
  | { command: "DeleteItem"; params: DeleteItemCommandInput }
  | { command: "Query"; params: QueryCommandInput }
  | { command: "Scan"; params: ScanCommandInput }
  | { command: "BatchGetItem"; params: BatchGetItemCommandInput }
  | { command: "BatchWriteItem"; params: BatchWriteItemCommandInput }
  | { command: "TransactGetItems"; params: TransactGetItemsCommandInput }
  | { command: "TransactWriteItems"; params: TransactWriteItemsCommandInput }
  | { command: "ListTables"; params: ListTablesCommandInput }
  | { command: "DescribeTable"; params: DescribeTableCommandInput };

/**
 * Payload for invoking a DynamoDB database resource
 * Uses embedded structure for direct Go unmarshaling
 */
export interface DbDynamoDBPayload {
  type: "database";
  subtype: "dynamodb";
  /** Embedded DynamoDB payload */
  dynamodb: DynamoDBInvokeData;
}

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
