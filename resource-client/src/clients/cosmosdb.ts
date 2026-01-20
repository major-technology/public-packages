import type {
  DbCosmosDBPayload,
  CosmosDBInvokeData,
} from "../schemas";
import type { CosmosDBInvokeResponse } from "../schemas/response";
import { BaseResourceClient } from "../base";

export class CosmosDBResourceClient extends BaseResourceClient {
  /**
   * Execute a CosmosDB operation
   * @param invokeData The operation data (query, read, create, etc.)
   * @param invocationKey Unique key for tracking this invocation
   * @returns Response with nested result: response.result.cosmosdb
   */
  async invoke<T = Record<string, unknown>>(
    invokeData: CosmosDBInvokeData,
    invocationKey: string,
  ): Promise<CosmosDBInvokeResponse<T>> {
    const payload: DbCosmosDBPayload = {
      type: "database",
      subtype: "cosmosdb",
      cosmosdb: invokeData,
    };

    return this.invokeRaw(payload, invocationKey) as Promise<CosmosDBInvokeResponse<T>>;
  }
}
