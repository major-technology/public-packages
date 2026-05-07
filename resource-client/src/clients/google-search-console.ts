import type {
  GSCQueryAnalyticsOptions,
  GoogleSearchConsoleInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import {
  buildGoogleSearchConsoleGetSitePayload,
  buildGoogleSearchConsoleGetSitemapPayload,
  buildGoogleSearchConsoleInspectUrlPayload,
  buildGoogleSearchConsoleInvokePayload,
  buildGoogleSearchConsoleListSitemapsPayload,
  buildGoogleSearchConsoleListSitesPayload,
  buildGoogleSearchConsoleQueryAnalyticsPayload,
} from "../payload-builders/google-search-console";

export class GoogleSearchConsoleResourceClient extends BaseResourceClient {
  /**
   * Query Search Console search analytics data.
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional query options (dimensions, filters, row limits)
   */
  async queryAnalytics(
    startDate: string,
    endDate: string,
    invocationKey: string,
    options?: GSCQueryAnalyticsOptions
  ): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleQueryAnalyticsPayload(startDate, endDate, options);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * List verified sites accessible to the authenticated Search Console user.
   * @param invocationKey Unique key for tracking this invocation
   */
  async listSites(invocationKey: string): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleListSitesPayload();
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * Get info for a specific verified site.
   * @param siteUrl Site URL as shown in Search Console
   * @param invocationKey Unique key for tracking this invocation
   */
  async getSite(siteUrl: string, invocationKey: string): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleGetSitePayload(siteUrl);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * List sitemaps for a verified site.
   * @param siteUrl Site URL as shown in Search Console
   * @param invocationKey Unique key for tracking this invocation
   */
  async listSitemaps(siteUrl: string, invocationKey: string): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleListSitemapsPayload(siteUrl);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * Get one sitemap for a verified site.
   * @param siteUrl Site URL as shown in Search Console
   * @param feedpath Sitemap URL/path
   * @param invocationKey Unique key for tracking this invocation
   */
  async getSitemap(
    siteUrl: string,
    feedpath: string,
    invocationKey: string
  ): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleGetSitemapPayload(siteUrl, feedpath);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * Inspect URL index status for a URL under a verified site.
   * @param siteUrl Site URL as shown in Search Console
   * @param inspectionUrl URL to inspect
   * @param invocationKey Unique key for tracking this invocation
   */
  async inspectUrl(
    siteUrl: string,
    inspectionUrl: string,
    invocationKey: string
  ): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleInspectUrlPayload(siteUrl, inspectionUrl);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * Execute a raw Google Search Console operation.
   * @param payload The raw operation payload
   * @param invocationKey Unique key for tracking this invocation
   */
  async invoke(
    payload: Record<string, unknown>,
    invocationKey: string
  ): Promise<GoogleSearchConsoleInvokeResponse> {
    const p = buildGoogleSearchConsoleInvokePayload(payload);
    return this.invokeRaw(p, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }
}
