import type {
  GSCQueryAnalyticsOptions,
  GoogleSearchConsoleInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import {
  buildGoogleSearchConsoleQueryAnalyticsPayload,
  buildGoogleSearchConsoleListSitesPayload,
  buildGoogleSearchConsoleGetSitePayload,
  buildGoogleSearchConsoleListSitemapsPayload,
  buildGoogleSearchConsoleGetSitemapPayload,
  buildGoogleSearchConsoleInspectUrlPayload,
  buildGoogleSearchConsoleInvokePayload,
} from "../payload-builders/google-search-console";

export class GoogleSearchConsoleResourceClient extends BaseResourceClient {
  /**
   * Query search analytics data (clicks, impressions, CTR, position)
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional query options (dimensions, filters, rowLimit, etc.)
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
   * List all verified sites in Search Console
   * @param invocationKey Unique key for tracking this invocation
   */
  async listSites(
    invocationKey: string
  ): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleListSitesPayload();
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * Get info about a specific site
   * @param siteUrl Site URL (e.g. 'https://example.com/' or 'sc-domain:example.com')
   * @param invocationKey Unique key for tracking this invocation
   */
  async getSite(
    siteUrl: string,
    invocationKey: string
  ): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleGetSitePayload(siteUrl);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * List sitemaps for a site
   * @param siteUrl Site URL
   * @param invocationKey Unique key for tracking this invocation
   */
  async listSitemaps(
    siteUrl: string,
    invocationKey: string
  ): Promise<GoogleSearchConsoleInvokeResponse> {
    const payload = buildGoogleSearchConsoleListSitemapsPayload(siteUrl);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleSearchConsoleInvokeResponse>;
  }

  /**
   * Get details about a specific sitemap
   * @param siteUrl Site URL
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
   * Inspect a URL's index status
   * @param siteUrl Site URL
   * @param inspectionUrl The URL to inspect
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
   * Execute a raw Google Search Console operation
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
