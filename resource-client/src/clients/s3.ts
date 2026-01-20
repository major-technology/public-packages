import type {
  S3Command,
  StorageS3Payload,
} from "../schemas";
import type { StorageInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class S3ResourceClient extends BaseResourceClient {
  /**
   * Execute an S3 command
   * @param command The S3 command to execute
   * @param params Parameters for the command
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional configuration (timeoutMs)
   * @returns Response with nested result: response.result.storage
   *
   * @example
   * ```ts
   * const response = await client.invoke(
   *   "ListObjectsV2",
   *   { Bucket: "my-bucket", Prefix: "uploads/" },
   *   "list-uploads"
   * );
   *
   * if (response.ok) {
   *   const objects = response.result.storage.data;
   * }
   * ```
   */
  async invoke(
    command: S3Command,
    params: Record<string, unknown>,
    invocationKey: string,
    options: {
      timeoutMs?: number;
    } = {}
  ): Promise<StorageInvokeResponse> {
    const payload: StorageS3Payload = {
      type: "storage",
      subtype: "s3",
      s3: {
        command,
        params,
        timeoutMs: options.timeoutMs,
      },
    };

    return this.invokeRaw(payload, invocationKey) as Promise<StorageInvokeResponse>;
  }
}
