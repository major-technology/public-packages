import type {
  ApiLinkedInPayload,
  HttpMethod,
  JsonBody,
  LinkedInAdAnalyticsDateRange,
  LinkedInAdAnalyticsOptions,
  LinkedInListAdAccountsOptions,
  LinkedInListCampaignsOptions,
  LinkedInListCreativesOptions,
  QueryParams,
} from "../schemas";
import { normalizeQueryParams } from "./normalize-query";

/**
 * Build a LinkedIn Marketing API invoke payload.
 */
export function buildLinkedInInvokePayload(
  method: HttpMethod,
  path: string,
  options?: {
    query?: QueryParams;
    body?: JsonBody;
    timeoutMs?: number;
  }
): ApiLinkedInPayload {
  return {
    type: "api",
    subtype: "linkedin",
    method,
    path,
    query: normalizeQueryParams(options?.query),
    body: options?.body,
    timeoutMs: options?.timeoutMs ?? 30000,
  };
}

/**
 * Build a LinkedIn ad accounts list payload.
 */
export function buildLinkedInListAdAccountsPayload(
  options?: LinkedInListAdAccountsOptions
): ApiLinkedInPayload {
  const query: QueryParams = {
    q: "search",
    ...(options?.pageSize ? { pageSize: String(options.pageSize) } : {}),
    ...(options?.pageToken ? { pageToken: options.pageToken } : {}),
    ...(options?.status?.length ? { "search.status.values": options.status } : {}),
  };

  return buildLinkedInInvokePayload("GET", "/adAccounts", { query });
}

/**
 * Build a LinkedIn campaigns list payload.
 */
export function buildLinkedInListCampaignsPayload(
  adAccountId: string,
  options?: LinkedInListCampaignsOptions
): ApiLinkedInPayload {
  const query: QueryParams = {
    q: "search",
    ...(options?.pageSize ? { pageSize: String(options.pageSize) } : {}),
    ...(options?.pageToken ? { pageToken: options.pageToken } : {}),
    ...(options?.status?.length ? { "search.status.values": options.status } : {}),
  };

  return buildLinkedInInvokePayload(
    "GET",
    `/adAccounts/${linkedInAdAccountPathID(adAccountId)}/adCampaigns`,
    { query }
  );
}

/**
 * Build a LinkedIn creatives list payload.
 */
export function buildLinkedInListCreativesPayload(
  adAccountId: string,
  options?: LinkedInListCreativesOptions
): ApiLinkedInPayload {
  const query: QueryParams = {
    q: "criteria",
    ...(options?.pageSize ? { pageSize: String(options.pageSize) } : {}),
    ...(options?.pageToken ? { pageToken: options.pageToken } : {}),
    ...(options?.campaignIds?.length
      ? { campaigns: `List(${options.campaignIds.map(linkedInCampaignURN).join(",")})` }
      : {}),
  };

  return buildLinkedInInvokePayload(
    "GET",
    `/adAccounts/${linkedInAdAccountPathID(adAccountId)}/creatives`,
    { query }
  );
}

/**
 * Build a LinkedIn ad analytics payload.
 */
export function buildLinkedInGetAdAnalyticsPayload(
  adAccountId: string,
  dateRange: LinkedInAdAnalyticsDateRange,
  options: LinkedInAdAnalyticsOptions
): ApiLinkedInPayload {
  const query: QueryParams = {
    q: "analytics",
    accounts: `List(${linkedInSponsoredAccountURN(adAccountId)})`,
    dateRange: linkedInDateRange(dateRange),
    timeGranularity: "DAILY",
    pivot: options.pivot,
    ...(options.metrics?.length ? { fields: options.metrics.join(",") } : {}),
  };

  return buildLinkedInInvokePayload("GET", "/adAnalytics", { query });
}

function linkedInSponsoredAccountURN(id: string): string {
  return id.startsWith("urn:li:sponsoredAccount:") ? id : `urn:li:sponsoredAccount:${id}`;
}

function linkedInAdAccountPathID(id: string): string {
  return id.startsWith("urn:li:sponsoredAccount:")
    ? id.slice("urn:li:sponsoredAccount:".length)
    : id;
}

function linkedInCampaignURN(id: string): string {
  return id.startsWith("urn:li:sponsoredCampaign:") ? id : `urn:li:sponsoredCampaign:${id}`;
}

function linkedInDateRange(dateRange: LinkedInAdAnalyticsDateRange): string {
  return `(start:${linkedInDate(dateRange.start)},end:${linkedInDate(dateRange.end)})`;
}

function linkedInDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `(year:${year},month:${Number(month)},day:${Number(day)})`;
}
