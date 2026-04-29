import type {
  ApiTikTokAdsPayload,
  HttpMethod,
  JsonBody,
  QueryParams,
  TikTokAdsListCampaignsOptions,
  TikTokAdsListOptions,
  TikTokAdsRunReportOptions,
} from "../schemas";
import { normalizeQueryParams } from "./normalize-query";

/**
 * Build a TikTok Marketing API invoke payload.
 */
export function buildTikTokAdsInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiTikTokAdsPayload {
  return {
    type: "api",
    subtype: "tiktokads",
    method,
    path,
    query: normalizeQueryParams(options?.query),
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

/**
 * Build a TikTok Ads list-advertisers payload.
 * The /oauth2/advertiser/get/ endpoint authenticates the app — app_id + secret
 * are injected by the connector at request time, so callers should not include
 * them in `query`.
 */
export function buildTikTokAdsListAdvertisersPayload(): ApiTikTokAdsPayload {
  return {
    type: "api",
    subtype: "tiktokads",
    operation: "listAdvertisers",
  };
}

/**
 * Build a TikTok Ads list-campaigns payload for one advertiser.
 */
export function buildTikTokAdsListCampaignsPayload(
  advertiserId: string,
  options?: TikTokAdsListCampaignsOptions
): ApiTikTokAdsPayload {
  return {
    type: "api",
    subtype: "tiktokads",
    operation: "listCampaigns",
    advertiserId,
    campaignIds: options?.campaignIds,
    campaignName: options?.campaignName,
    page: options?.page,
    pageSize: options?.pageSize,
  };
}

/**
 * Build a TikTok Ads get-campaign payload for one advertiser/campaign pair.
 * TikTok exposes single-campaign reads via the same /campaign/get/ endpoint
 * with a one-element campaign_ids filter.
 */
export function buildTikTokAdsGetCampaignPayload(
  advertiserId: string,
  campaignId: string
): ApiTikTokAdsPayload {
  return {
    type: "api",
    subtype: "tiktokads",
    operation: "getCampaign",
    advertiserId,
    campaignId,
  };
}

/**
 * Build a TikTok Ads report payload via /report/integrated/get/.
 */
export function buildTikTokAdsRunReportPayload(
  advertiserId: string,
  metrics: string[],
  options?: TikTokAdsRunReportOptions
): ApiTikTokAdsPayload {
  return {
    type: "api",
    subtype: "tiktokads",
    operation: "runReport",
    advertiserId,
    metrics,
    reportType: options?.reportType,
    dataLevel: options?.dataLevel,
    dimensions: options?.dimensions,
    startDate: options?.startDate,
    endDate: options?.endDate,
    page: options?.page,
    pageSize: options?.pageSize,
  };
}

/**
 * Re-exported type alias so callers don't have to remember the schema name.
 */
export type { TikTokAdsListOptions };
