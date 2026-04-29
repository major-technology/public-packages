import type {
  ApiInvokeResponse,
  HttpMethod,
  LinkedInAdAnalyticsDateRange,
  LinkedInAdAnalyticsOptions,
  LinkedInListAdAccountsOptions,
  LinkedInListCampaignsOptions,
  LinkedInListCreativesOptions,
  QueryParams,
} from "../schemas";
import { BaseResourceClient } from "../base";
import {
  buildLinkedInGetAdAnalyticsPayload,
  buildLinkedInInvokePayload,
  buildLinkedInListAdAccountsPayload,
  buildLinkedInListCampaignsPayload,
  buildLinkedInListCreativesPayload,
} from "../payload-builders/linkedin";

export class LinkedInResourceClient extends BaseResourceClient {
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<ApiInvokeResponse> {
    const payload = buildLinkedInInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  async listAdAccounts(
    invocationKey: string,
    options?: LinkedInListAdAccountsOptions
  ): Promise<ApiInvokeResponse> {
    const payload = buildLinkedInListAdAccountsPayload(options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  async listCampaigns(
    adAccountId: string,
    invocationKey: string,
    options?: LinkedInListCampaignsOptions
  ): Promise<ApiInvokeResponse> {
    const payload = buildLinkedInListCampaignsPayload(adAccountId, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  async listCreatives(
    adAccountId: string,
    invocationKey: string,
    options?: LinkedInListCreativesOptions
  ): Promise<ApiInvokeResponse> {
    const payload = buildLinkedInListCreativesPayload(adAccountId, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }

  async getAdAnalytics(
    adAccountId: string,
    dateRange: LinkedInAdAnalyticsDateRange,
    invocationKey: string,
    options: LinkedInAdAnalyticsOptions
  ): Promise<ApiInvokeResponse> {
    const payload = buildLinkedInGetAdAnalyticsPayload(adAccountId, dateRange, options);
    return this.invokeRaw(payload, invocationKey) as Promise<ApiInvokeResponse>;
  }
}
