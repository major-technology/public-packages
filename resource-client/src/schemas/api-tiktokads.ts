import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Common pagination options for TikTok Ads list requests.
 */
export interface TikTokAdsListOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Filtering options for listing TikTok Ads campaigns.
 */
export interface TikTokAdsListCampaignsOptions extends TikTokAdsListOptions {
  campaignIds?: string[];
  campaignName?: string;
}

/**
 * Options for running a TikTok Ads report via /report/integrated/get/.
 */
export interface TikTokAdsRunReportOptions extends TikTokAdsListOptions {
  reportType?: string;
  dataLevel?: string;
  dimensions?: string[];
  startDate?: string;
  endDate?: string;
}

export type TikTokAdsOperation =
  | "listAdvertisers"
  | "listCampaigns"
  | "getCampaign"
  | "runReport"
  | "invoke";

/**
 * Payload for invoking a TikTok Marketing API resource.
 * The TikTok access token is injected automatically by the API; advertiser_id
 * must be included in the query or body for advertiser-scoped endpoints.
 */
export interface ApiTikTokAdsPayload {
  type: "api";
  subtype: "tiktokads";
  operation?: TikTokAdsOperation;
  /** HTTP method to use */
  method?: HttpMethod;
  /** TikTok Marketing API REST path under /open_api/v1.3 (e.g., "/campaign/get/") */
  path?: string;
  /** Optional query parameters */
  query?: QueryParams;
  /** Optional JSON body */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
  advertiserId?: string;
  campaignId?: string;
  campaignIds?: string[];
  campaignName?: string;
  reportType?: string;
  dataLevel?: string;
  dimensions?: string[];
  metrics?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiTikTokAdsResult {
  kind: "tiktokads";
  operation: TikTokAdsOperation;
  data: unknown;
}
