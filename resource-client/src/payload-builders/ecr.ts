import type { ApiECRPayload, ECRCommand } from "../schemas";

/**
 * Build an ECR invoke payload
 * @param command The ECR command to execute
 * @param params Parameters for the ECR command
 * @param options Additional options
 */
export function buildECRInvokePayload(
  command: ECRCommand,
  params: Record<string, unknown>,
  options?: { timeoutMs?: number }
): ApiECRPayload {
  return {
    type: "api",
    subtype: "ecr",
    command,
    params,
    timeoutMs: options?.timeoutMs,
  };
}
