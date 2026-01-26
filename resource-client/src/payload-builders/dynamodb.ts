import type { DbDynamoDBPayload, DynamoDBCommandInputMap } from "../schemas";

/**
 * Build a DynamoDB invoke payload
 * @param command The DynamoDB command to execute
 * @param params The command parameters
 */
export function buildDynamoDBInvokePayload<C extends keyof DynamoDBCommandInputMap>(
  command: C,
  params: DynamoDBCommandInputMap[C]
): DbDynamoDBPayload {
  return {
    type: "database",
    subtype: "dynamodb",
    command,
    params,
  } as DbDynamoDBPayload;
}
