import type {
  ECRCommand,
  ECRInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import { buildECRInvokePayload } from "../payload-builders/ecr";

export class ECRResourceClient extends BaseResourceClient {
  async invoke(
    command: ECRCommand,
    params: Record<string, unknown>,
    invocationKey: string,
    options: {
      timeoutMs?: number;
    } = {}
  ): Promise<ECRInvokeResponse> {
    const payload = buildECRInvokePayload(command, params, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ECRInvokeResponse>;
  }
}
