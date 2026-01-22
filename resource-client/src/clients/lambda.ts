import type {
  ApiLambdaPayload,
  ApiLambdaResult,
  LambdaInvocationType,
  LambdaLogType,
} from "../schemas";
import type { BaseInvokeSuccess, InvokeFailure } from "../schemas/response";
import { BaseResourceClient } from "../base";

/**
 * Options for Lambda invocation
 */
export interface LambdaInvokeOptions {
  /**
   * The invocation mode.
   * - RequestResponse (default): Synchronous invocation
   * - Event: Asynchronous invocation
   * - DryRun: Validate parameters and permissions only
   */
  InvocationType?: LambdaInvocationType;

  /**
   * Controls execution log inclusion in the response.
   * - None (default): Don't include logs
   * - Tail: Include the last 4 KB of execution log (sync only)
   */
  LogType?: LambdaLogType;

  /**
   * Specifies a version or alias to invoke.
   * If not specified, invokes $LATEST.
   */
  Qualifier?: string;

  /**
   * Up to 3,583 bytes of base64-encoded data about the invoking client
   * to pass to the function. Only for synchronous invocations.
   */
  ClientContext?: string;

  /**
   * A unique name for durable execution.
   * Length: 1-64 characters. Pattern: [a-zA-Z0-9-_]+
   */
  DurableExecutionName?: string;

  /**
   * The identifier for tenant in multi-tenant Lambda function.
   * Length: 1-256 characters.
   */
  TenantId?: string;
}

export class LambdaResourceClient extends BaseResourceClient {
  /**
   * Invoke a Lambda function
   *
   * @param functionName - The name, ARN, or partial ARN of the Lambda function
   * @param payload - The JSON input for the Lambda function (optional)
   * @param invocationKey - A unique key for tracking this invocation
   * @param options - Additional invocation options
   * @returns The Lambda invocation result
   *
   * @example
   * ```typescript
   * // Simple synchronous invocation
   * const result = await lambdaClient.invoke(
   *   "my-function",
   *   { key: "value" },
   *   "process-data"
   * );
   *
   * if (result.ok) {
   *   console.log("Response:", result.result.Payload);
   * }
   *
   * // Asynchronous invocation
   * const asyncResult = await lambdaClient.invoke(
   *   "my-function",
   *   { key: "value" },
   *   "async-process",
   *   { InvocationType: "Event" }
   * );
   *
   * // With execution logs
   * const debugResult = await lambdaClient.invoke(
   *   "my-function",
   *   { key: "value" },
   *   "debug-invocation",
   *   { LogType: "Tail" }
   * );
   *
   * if (debugResult.ok) {
   *   // LogResult is base64 encoded
   *   const logs = atob(debugResult.result.LogResult || "");
   *   console.log("Execution logs:", logs);
   * }
   * ```
   */
  async invoke(
    functionName: string,
    payload: unknown,
    invocationKey: string,
    options: LambdaInvokeOptions = {},
  ): Promise<BaseInvokeSuccess<ApiLambdaResult> | InvokeFailure> {
    const invokePayload: ApiLambdaPayload = {
      type: "api",
      subtype: "lambda",
      FunctionName: functionName,
      Payload: payload,
      ...options,
    };

    return this.invokeRaw(invokePayload, invocationKey) as Promise<
      BaseInvokeSuccess<ApiLambdaResult> | InvokeFailure
    >;
  }
}
