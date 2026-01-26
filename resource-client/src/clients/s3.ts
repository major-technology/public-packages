import type {
  S3Command,
  StorageInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildS3InvokePayload } from "../payload-builders/s3";

export class S3ResourceClient extends BaseResourceClient {
  async invoke(
    command: S3Command,
    params: Record<string, unknown>,
    invocationKey: string,
    options: {
      timeoutMs?: number;
    } = {}
  ): Promise<StorageInvokeResponse> {
    const payload = buildS3InvokePayload(command, params, options);
    return this.invokeRaw(payload, invocationKey) as Promise<StorageInvokeResponse>;
  }
}

