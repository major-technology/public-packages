import type { JsonBody, HttpMethod } from "./common";

/**
 * Date range for LinkedIn ad analytics.
 */
export interface LinkedInAdAnalyticsDateRange {
  start: string;
  end: string;
}

/**
 * Common pagination options for LinkedIn list requests.
 */
export interface LinkedInListOptions {
  pageSize?: number;
  pageToken?: string;
}

/**
 * Options for listing LinkedIn ad accounts.
 */
export interface LinkedInListAdAccountsOptions extends LinkedInListOptions {
  status?: string[];
}

/**
 * Options for listing LinkedIn campaigns.
 */
export interface LinkedInListCampaignsOptions extends LinkedInListOptions {
  status?: string[];
}

/**
 * Options for listing LinkedIn creatives.
 */
export interface LinkedInListCreativesOptions extends LinkedInListOptions {
  campaignIds?: string[];
}

/**
 * Options for LinkedIn ad analytics.
 */
export interface LinkedInAdAnalyticsOptions {
  pivot: "ACCOUNT" | "CAMPAIGN" | "CREATIVE" | string;
  metrics?: string[];
}

/**
 * Payload for invoking a LinkedIn Marketing API resource.
 * LinkedIn OAuth and required REST headers are handled automatically by the API.
 */
export interface ApiLinkedInPayload {
  type: "api";
  subtype: "linkedin";
  /** HTTP method to use */
  method: HttpMethod;
  /** LinkedIn Marketing API REST path (e.g., "/adAccounts") */
  path: string;
  /** Optional query parameters. Values are normalized to string arrays for the connector backend. */
  query?: Record<string, string[]>;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
