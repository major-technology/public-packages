/**
 * Dimension for a Google Analytics report
 */
export interface GADimension {
  name: string;
}

/**
 * Metric for a Google Analytics report
 */
export interface GAMetric {
  name: string;
}

/**
 * Date range for a Google Analytics report
 */
export interface GADateRange {
  startDate: string;
  endDate: string;
}

/**
 * Order by clause for a Google Analytics report
 */
export interface GAOrderBy {
  dimension?: { dimensionName: string; orderType?: string };
  metric?: { metricName: string };
  desc?: boolean;
}

/**
 * Filter expression for Google Analytics reports
 */
export interface GAFilterExpression {
  filter?: GAFilter;
  andGroup?: { expressions: GAFilterExpression[] };
  orGroup?: { expressions: GAFilterExpression[] };
  notExpression?: GAFilterExpression;
}

/**
 * Individual filter for a dimension or metric
 */
export interface GAFilter {
  fieldName: string;
  stringFilter?: { value: string; matchType?: string };
  inListFilter?: { values: string[] };
  numericFilter?: {
    operation: string;
    value: { int64Value?: number; doubleValue?: number };
  };
}

/**
 * A single report request (used in batch operations)
 */
export interface GAReportRequest {
  dimensions?: GADimension[];
  metrics?: GAMetric[];
  dateRanges?: GADateRange[];
  dimensionFilter?: GAFilterExpression;
  metricFilter?: GAFilterExpression;
  orderBys?: GAOrderBy[];
  limit?: number;
  offset?: number;
}

/**
 * Report options for runReport
 */
export interface GARunReportOptions {
  dimensionFilter?: GAFilterExpression;
  metricFilter?: GAFilterExpression;
  orderBys?: GAOrderBy[];
  limit?: number;
  offset?: number;
}

/**
 * Payload for invoking a Google Analytics resource
 */
export interface ApiGoogleAnalyticsPayload {
  type: "api";
  subtype: "googleanalytics";
  operation:
    | "runReport"
    | "batchRunReports"
    | "getMetadata"
    | "runRealtimeReport"
    | "listAccounts"
    | "listProperties"
    | "listDataStreams";

  /** Dimensions (for report operations) */
  dimensions?: GADimension[];
  /** Metrics (for report operations) */
  metrics?: GAMetric[];
  /** Date ranges (for runReport) */
  dateRanges?: GADateRange[];
  /** Dimension filter */
  dimensionFilter?: GAFilterExpression;
  /** Metric filter */
  metricFilter?: GAFilterExpression;
  /** Order by clauses */
  orderBys?: GAOrderBy[];
  /** Row limit */
  limit?: number;
  /** Row offset */
  offset?: number;

  /** Report requests (for batchRunReports) */
  requests?: GAReportRequest[];

  /** Account ID (for listProperties) */
  accountId?: string;
  /** Property ID (for listDataStreams) */
  propertyId?: string;

  /** Page size for list operations */
  pageSize?: number;
  /** Page token for pagination */
  pageToken?: string;
}

/**
 * Result from a Google Analytics operation
 */
export interface ApiGoogleAnalyticsResult {
  kind: "googleanalytics";
  /** The operation that was performed */
  operation: string;
  /** Operation-specific result data */
  data: unknown;
}
