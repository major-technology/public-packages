import type { StorageS3Payload, S3Command } from "../schemas";

/**
 * Build an S3 invoke payload
 * @param command The S3 command to execute
 * @param params Parameters for the S3 command
 * @param options Additional options
 */
export function buildS3InvokePayload(
  command: S3Command,
  params: Record<string, unknown>,
  options?: { timeoutMs?: number }
): StorageS3Payload {
  return {
    type: "storage",
    subtype: "s3",
    command,
    params,
    timeoutMs: options?.timeoutMs,
  };
}
