import type {
  S3Command,
  StorageS3PayloadV2,
} from "../../schemas/v2";
import type { StorageInvokeResponse } from "../../schemas/v2/response";
import { BaseResourceClientV2 } from "../base";

export class S3ResourceClientV2 extends BaseResourceClientV2 {
  async invoke(
    command: S3Command,
    params: Record<string, unknown>,
    invocationKey: string,
    options: {
      timeoutMs?: number;
    } = {}
  ): Promise<StorageInvokeResponse> {
    const payload: StorageS3PayloadV2 = {
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
