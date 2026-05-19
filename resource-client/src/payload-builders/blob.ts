import { BlobCommand, StorageBlobPayload } from "../schemas";

/**
 * Build an S3 invoke payload
 * @param command The managed blob command to execute
 * @param key Blob key
 * @param params Parameters for the managed blob command
 * @param options Additional options
 */
export function buildBlobInvokePayload(
  command: BlobCommand,
  key: string,
  params: Record<string, unknown>,
  options?: { timeoutMs?: number }
): StorageBlobPayload {
  return {
    type: "storage",
    subtype: "blob",
    key,
    command,
    params,
    timeoutMs: options?.timeoutMs,
  };
}
