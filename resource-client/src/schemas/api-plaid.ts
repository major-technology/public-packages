/**
 * Payload and types for invoking a Plaid API resource.
 * Plaid authentication (client_id / secret / access_token) is injected
 * server-side; callers only choose the method and its parameters.
 */

export type PlaidMethod = "getTransactions" | "getAccounts";

export interface PlaidTransactionsOptions {
  /** Restrict results to specific Plaid account IDs */
  accountIds?: string[];
  /** Max transactions to return (default 100, max 500) */
  count?: number;
  /** Number of transactions to skip, for pagination */
  offset?: number;
}

export interface ApiPlaidPayload {
  type: "api";
  subtype: "plaid";
  /** Operation to perform */
  method: PlaidMethod;
  /** getTransactions: start date, inclusive (YYYY-MM-DD) */
  startDate?: string;
  /** getTransactions: end date, inclusive (YYYY-MM-DD) */
  endDate?: string;
  /** getTransactions: optional filters */
  options?: PlaidTransactionsOptions;
}
