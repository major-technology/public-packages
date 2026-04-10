import type {
  SQSCommand,
  ApiSqsResult,
} from "../schemas";
import type { BaseInvokeSuccess, InvokeFailure } from "../schemas/response";
import { BaseResourceClient } from "../base";
import { buildSqsInvokePayload } from "../payload-builders/sqs";

export class SqsResourceClient extends BaseResourceClient {
  /**
   * Execute an SQS command
   *
   * @param command - The SQS command to execute
   * @param params - Command-specific parameters
   * @param invocationKey - A unique static string key for tracking
   * @param options - Additional options (queueUrl, timeoutMs)
   */
  async invoke(
    command: SQSCommand,
    params: Record<string, unknown>,
    invocationKey: string,
    options: {
      queueUrl?: string;
      timeoutMs?: number;
    } = {},
  ): Promise<BaseInvokeSuccess<ApiSqsResult> | InvokeFailure> {
    const payload = buildSqsInvokePayload(command, params, options);
    return this.invokeRaw(payload, invocationKey) as Promise<
      BaseInvokeSuccess<ApiSqsResult> | InvokeFailure
    >;
  }
}
