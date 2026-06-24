import type { ApiInvokeResponse } from "../schemas";
import type { PlaidTransactionsOptions } from "../schemas/api-plaid";
import { BaseResourceClient } from "../base";
import {
  buildPlaidGetTransactionsPayload,
  buildPlaidGetAccountsPayload,
} from "../payload-builders/plaid";

export class PlaidResourceClient extends BaseResourceClient {
  /**
   * Fetch bank transactions for a date range from the linked Plaid account.
   * @param startDate Start date, inclusive (YYYY-MM-DD)
   * @param endDate End date, inclusive (YYYY-MM-DD)
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional filters (accountIds, count, offset)
   */
  async getTransactions(
    startDate: string,
    endDate: string,
    invocationKey: string,
    options?: PlaidTransactionsOptions
  ): Promise<ApiInvokeResponse> {
    const payload = buildPlaidGetTransactionsPayload(startDate, endDate, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  /**
   * List the linked bank accounts and their current/available balances.
   * @param invocationKey Unique key for tracking this invocation
   */
  async getAccounts(invocationKey: string): Promise<ApiInvokeResponse> {
    const payload = buildPlaidGetAccountsPayload();
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
