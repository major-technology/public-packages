import type {
  HttpMethod,
  QueryParams,
  TikTokAdsInvokeResponse,
  TikTokAdsListCampaignsOptions,
  TikTokAdsRunReportOptions,
} from "../schemas";
import { BaseResourceClient } from "../base";
import {
  buildTikTokAdsGetCampaignPayload,
  buildTikTokAdsInvokePayload,
  buildTikTokAdsListAdvertisersPayload,
  buildTikTokAdsListCampaignsPayload,
  buildTikTokAdsRunReportPayload,
} from "../payload-builders/tiktokads";

export class TikTokAdsResourceClient extends BaseResourceClient {
  async invoke(
    method: HttpMethod,
    path: string,
    invocationKey: string,
    options: {
      query?: QueryParams;
      body?: { type: "json"; value: unknown };
      timeoutMs?: number;
    } = {}
  ): Promise<TikTokAdsInvokeResponse> {
    const payload = buildTikTokAdsInvokePayload(method, path, options);
    return this.invokeRaw(payload, invocationKey) as Promise<TikTokAdsInvokeResponse>;
  }

  async listAdvertisers(invocationKey: string): Promise<TikTokAdsInvokeResponse> {
    const payload = buildTikTokAdsListAdvertisersPayload();
    return this.invokeRaw(payload, invocationKey) as Promise<TikTokAdsInvokeResponse>;
  }

  async listCampaigns(
    advertiserId: string,
    invocationKey: string,
    options?: TikTokAdsListCampaignsOptions
  ): Promise<TikTokAdsInvokeResponse> {
    const payload = buildTikTokAdsListCampaignsPayload(advertiserId, options);
    return this.invokeRaw(payload, invocationKey) as Promise<TikTokAdsInvokeResponse>;
  }

  async getCampaign(
    advertiserId: string,
    campaignId: string,
    invocationKey: string
  ): Promise<TikTokAdsInvokeResponse> {
    const payload = buildTikTokAdsGetCampaignPayload(advertiserId, campaignId);
    return this.invokeRaw(payload, invocationKey) as Promise<TikTokAdsInvokeResponse>;
  }

  async runReport(
    advertiserId: string,
    metrics: string[],
    invocationKey: string,
    options?: TikTokAdsRunReportOptions
  ): Promise<TikTokAdsInvokeResponse> {
    const payload = buildTikTokAdsRunReportPayload(advertiserId, metrics, options);
    return this.invokeRaw(payload, invocationKey) as Promise<TikTokAdsInvokeResponse>;
  }
}
