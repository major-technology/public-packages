import type {
  S3Command,
  StorageS3Payload,
  StorageInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";

export class S3ResourceClient extends BaseResourceClient {
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
      command,
      params,
      timeoutMs: options.timeoutMs,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<StorageInvokeResponse>;
  }
}

