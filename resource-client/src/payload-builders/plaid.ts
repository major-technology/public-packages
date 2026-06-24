import type { ApiPlaidPayload, PlaidTransactionsOptions } from "../schemas/api-plaid";

/**
 * Build a Plaid getTransactions payload.
 * @param startDate Start date, inclusive (YYYY-MM-DD)
 * @param endDate End date, inclusive (YYYY-MM-DD)
 * @param options Optional filters (accountIds, count, offset)
 */
export function buildPlaidGetTransactionsPayload(
  startDate: string,
  endDate: string,
  options?: PlaidTransactionsOptions
): ApiPlaidPayload {
  return {
    type: "api",
    subtype: "plaid",
    method: "getTransactions",
    startDate,
    endDate,
    options,
  };
}

/**
 * Build a Plaid getAccounts payload.
 */
export function buildPlaidGetAccountsPayload(): ApiPlaidPayload {
  return {
    type: "api",
    subtype: "plaid",
    method: "getAccounts",
  };
}
