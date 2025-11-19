/**
 * Payload for invoking a DynamoDB database resource
 */
export interface DbDynamoDBPayload {
  type: "database";
  subtype: "dynamodb";
  /** DynamoDB command to execute */
  command:
    | "GetItem"
    | "PutItem"
    | "UpdateItem"
    | "DeleteItem"
    | "Query"
    | "Scan"
    | "BatchGetItem"
    | "BatchWriteItem"
    | "TransactGetItems"
    | "TransactWriteItems"
    | "ListTables"
    | "DescribeTable";
  /** Parameters for the command */
  params: Record<string, unknown>;
}
