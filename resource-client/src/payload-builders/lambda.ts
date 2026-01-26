import type {
  ApiLambdaPayload,
  LambdaInvocationType,
  LambdaLogType,
} from "../schemas";

/**
 * Options for Lambda invocation
 */
export interface LambdaInvokeOptions {
  InvocationType?: LambdaInvocationType;
  LogType?: LambdaLogType;
  Qualifier?: string;
  ClientContext?: string;
  DurableExecutionName?: string;
  TenantId?: string;
}

/**
 * Build a Lambda invoke payload
 * @param functionName The name, ARN, or partial ARN of the Lambda function
 * @param payload The JSON input for the Lambda function
 * @param options Additional invocation options
 */
export function buildLambdaInvokePayload(
  functionName: string,
  payload?: unknown,
  options?: LambdaInvokeOptions
): ApiLambdaPayload {
  return {
    type: "api",
    subtype: "lambda",
    FunctionName: functionName,
    Payload: payload,
    ...options,
  };
}
