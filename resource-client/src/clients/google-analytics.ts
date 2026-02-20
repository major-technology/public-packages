import type {
  GADimension,
  GAMetric,
  GADateRange,
  GARunReportOptions,
  GoogleAnalyticsInvokeResponse,
} from "../schemas";
import { BaseResourceClient } from "../base";
import {
  buildGoogleAnalyticsRunReportPayload,
  buildGoogleAnalyticsGetMetadataPayload,
  buildGoogleAnalyticsRunRealtimeReportPayload,
  buildGoogleAnalyticsListAccountsPayload,
  buildGoogleAnalyticsListPropertiesPayload,
  buildGoogleAnalyticsListDataStreamsPayload,
  buildGoogleAnalyticsInvokePayload,
} from "../payload-builders/google-analytics";

export class GoogleAnalyticsResourceClient extends BaseResourceClient {
  /**
   * Run a GA4 report with dimensions, metrics, and date ranges
   * @param dimensions Dimensions to group by (e.g. [{name: 'country'}])
   * @param metrics Metrics to retrieve (e.g. [{name: 'activeUsers'}])
   * @param dateRanges Date ranges (e.g. [{startDate: '2024-01-01', endDate: '2024-01-31'}])
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional report options (filters, ordering, limit, offset)
   */
  async runReport(
    dimensions: GADimension[],
    metrics: GAMetric[],
    dateRanges: GADateRange[],
    invocationKey: string,
    options?: GARunReportOptions
  ): Promise<GoogleAnalyticsInvokeResponse> {
    const payload = buildGoogleAnalyticsRunReportPayload(dimensions, metrics, dateRanges, options);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleAnalyticsInvokeResponse>;
  }

  /**
   * Get available dimensions and metrics for the GA4 property
   * @param invocationKey Unique key for tracking this invocation
   */
  async getMetadata(
    invocationKey: string
  ): Promise<GoogleAnalyticsInvokeResponse> {
    const payload = buildGoogleAnalyticsGetMetadataPayload();
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleAnalyticsInvokeResponse>;
  }

  /**
   * Run a realtime report showing current live user activity
   * @param metrics Metrics to retrieve (e.g. [{name: 'activeUsers'}])
   * @param invocationKey Unique key for tracking this invocation
   * @param dimensions Optional dimensions to group by
   * @param limit Optional row limit
   */
  async runRealtimeReport(
    metrics: GAMetric[],
    invocationKey: string,
    dimensions?: GADimension[],
    limit?: number
  ): Promise<GoogleAnalyticsInvokeResponse> {
    const payload = buildGoogleAnalyticsRunRealtimeReportPayload(metrics, dimensions, limit);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleAnalyticsInvokeResponse>;
  }

  /**
   * List all GA4 accounts accessible to the authenticated user
   * @param invocationKey Unique key for tracking this invocation
   * @param options Optional pagination options
   */
  async listAccounts(
    invocationKey: string,
    options?: { pageSize?: number; pageToken?: string }
  ): Promise<GoogleAnalyticsInvokeResponse> {
    const payload = buildGoogleAnalyticsListAccountsPayload(options);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleAnalyticsInvokeResponse>;
  }

  /**
   * List GA4 properties, optionally filtered by account
   * @param invocationKey Unique key for tracking this invocation
   * @param accountId Optional account filter (e.g. 'accounts/12345')
   * @param options Optional pagination options
   */
  async listProperties(
    invocationKey: string,
    accountId?: string,
    options?: { pageSize?: number; pageToken?: string }
  ): Promise<GoogleAnalyticsInvokeResponse> {
    const payload = buildGoogleAnalyticsListPropertiesPayload(accountId, options);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleAnalyticsInvokeResponse>;
  }

  /**
   * List data streams for a GA4 property
   * @param invocationKey Unique key for tracking this invocation
   * @param propertyId Optional property ID (defaults to configured property)
   * @param options Optional pagination options
   */
  async listDataStreams(
    invocationKey: string,
    propertyId?: string,
    options?: { pageSize?: number; pageToken?: string }
  ): Promise<GoogleAnalyticsInvokeResponse> {
    const payload = buildGoogleAnalyticsListDataStreamsPayload(propertyId, options);
    return this.invokeRaw(payload, invocationKey) as Promise<GoogleAnalyticsInvokeResponse>;
  }

  /**
   * Execute a raw Google Analytics operation
   * @param payload The raw operation payload
   * @param invocationKey Unique key for tracking this invocation
   */
  async invoke(
    payload: Record<string, unknown>,
    invocationKey: string
  ): Promise<GoogleAnalyticsInvokeResponse> {
    const p = buildGoogleAnalyticsInvokePayload(payload);
    return this.invokeRaw(p, invocationKey) as Promise<GoogleAnalyticsInvokeResponse>;
  }
}
