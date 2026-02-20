import type {
  ApiGoogleAnalyticsPayload,
  GADimension,
  GAMetric,
  GADateRange,
  GARunReportOptions,
} from "../schemas";

/**
 * Build a Google Analytics runReport payload
 */
export function buildGoogleAnalyticsRunReportPayload(
  dimensions: GADimension[],
  metrics: GAMetric[],
  dateRanges: GADateRange[],
  options?: GARunReportOptions
): ApiGoogleAnalyticsPayload {
  return {
    type: "api",
    subtype: "googleanalytics",
    operation: "runReport",
    dimensions,
    metrics,
    dateRanges,
    dimensionFilter: options?.dimensionFilter,
    metricFilter: options?.metricFilter,
    orderBys: options?.orderBys,
    limit: options?.limit,
    offset: options?.offset,
  };
}

/**
 * Build a Google Analytics getMetadata payload
 */
export function buildGoogleAnalyticsGetMetadataPayload(): ApiGoogleAnalyticsPayload {
  return {
    type: "api",
    subtype: "googleanalytics",
    operation: "getMetadata",
  };
}

/**
 * Build a Google Analytics runRealtimeReport payload
 */
export function buildGoogleAnalyticsRunRealtimeReportPayload(
  metrics: GAMetric[],
  dimensions?: GADimension[],
  limit?: number
): ApiGoogleAnalyticsPayload {
  return {
    type: "api",
    subtype: "googleanalytics",
    operation: "runRealtimeReport",
    metrics,
    dimensions,
    limit,
  };
}

/**
 * Build a Google Analytics listAccounts payload
 */
export function buildGoogleAnalyticsListAccountsPayload(
  options?: { pageSize?: number; pageToken?: string }
): ApiGoogleAnalyticsPayload {
  return {
    type: "api",
    subtype: "googleanalytics",
    operation: "listAccounts",
    pageSize: options?.pageSize,
    pageToken: options?.pageToken,
  };
}

/**
 * Build a Google Analytics listProperties payload
 */
export function buildGoogleAnalyticsListPropertiesPayload(
  accountId?: string,
  options?: { pageSize?: number; pageToken?: string }
): ApiGoogleAnalyticsPayload {
  return {
    type: "api",
    subtype: "googleanalytics",
    operation: "listProperties",
    accountId,
    pageSize: options?.pageSize,
    pageToken: options?.pageToken,
  };
}

/**
 * Build a Google Analytics listDataStreams payload
 */
export function buildGoogleAnalyticsListDataStreamsPayload(
  propertyId?: string,
  options?: { pageSize?: number; pageToken?: string }
): ApiGoogleAnalyticsPayload {
  return {
    type: "api",
    subtype: "googleanalytics",
    operation: "listDataStreams",
    propertyId,
    pageSize: options?.pageSize,
    pageToken: options?.pageToken,
  };
}

/**
 * Build a raw Google Analytics invoke payload
 */
export function buildGoogleAnalyticsInvokePayload(
  payload: Record<string, unknown>
): ApiGoogleAnalyticsPayload {
  return {
    type: "api",
    subtype: "googleanalytics",
    ...payload,
  } as ApiGoogleAnalyticsPayload;
}
