/**
 * Supported SQS commands
 */
export type SQSCommand =
  | "SendMessage"
  | "ReceiveMessage"
  | "DeleteMessage"
  | "DeleteMessageBatch"
  | "GetQueueAttributes"
  | "ListQueues"
  | "ChangeMessageVisibility";

/**
 * Payload for invoking an SQS resource
 */
export interface ApiSqsPayload {
  type: "api";
  subtype: "sqs";
  /** SQS command to execute */
  command: SQSCommand;
  /** The URL of the SQS queue */
  queueUrl?: string;
  /** Parameters for the SQS command (varies by command) */
  params?: Record<string, unknown>;
  /** Optional timeout in milliseconds */
  timeoutMs?: number;
}

/**
 * Result from an SQS operation
 */
export interface ApiSqsResult {
  kind: "sqs";
  command: string;
  /** Raw AWS SDK response data */
  data: unknown;
}
