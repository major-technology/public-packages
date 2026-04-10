import type { ApiSqsPayload, SQSCommand } from "../schemas";

/**
 * Build an SQS invoke payload
 * @param command The SQS command to execute
 * @param params Parameters for the SQS command
 * @param options Additional options
 */
export function buildSqsInvokePayload(
  command: SQSCommand,
  params: Record<string, unknown>,
  options?: { queueUrl?: string; timeoutMs?: number },
): ApiSqsPayload {
  return {
    type: "api",
    subtype: "sqs",
    command,
    queueUrl: options?.queueUrl,
    params,
    timeoutMs: options?.timeoutMs,
  };
}
