/**
 * Dimension filter for Google Search Console search analytics queries.
 */
export interface GSCDimensionFilter {
  dimension: string;
  operator: string;
  expression: string;
}

/**
 * Filter group for Google Search Console search analytics queries.
 */
export interface GSCDimensionFilterGroup {
  groupType?: string;
  filters: GSCDimensionFilter[];
}

/**
 * Query options for Google Search Console search analytics.
 */
export interface GSCQueryAnalyticsOptions {
  dimensions?: string[];
  searchType?: string;
  dimensionFilterGroups?: GSCDimensionFilterGroup[];
  aggregationType?: string;
  rowLimit?: number;
  startRow?: number;
  dataState?: string;
}

/**
 * Payload for invoking a Google Search Console resource.
 */
export interface ApiGoogleSearchConsolePayload {
  type: "api";
  subtype: "googlesearchconsole";
  operation:
    | "queryAnalytics"
    | "listSites"
    | "getSite"
    | "listSitemaps"
    | "getSitemap"
    | "inspectUrl";

  /** Start date in YYYY-MM-DD format (for queryAnalytics) */
  startDate?: string;
  /** End date in YYYY-MM-DD format (for queryAnalytics) */
  endDate?: string;
  /** Dimensions to group by (for queryAnalytics) */
  dimensions?: string[];
  /** Search type: web, image, video, news, discover, googleNews */
  searchType?: string;
  /** Dimension filter groups (for queryAnalytics) */
  dimensionFilterGroups?: GSCDimensionFilterGroup[];
  /** Aggregation type: auto, byPage, byProperty */
  aggregationType?: string;
  /** Maximum rows to return */
  rowLimit?: number;
  /** Row offset for pagination */
  startRow?: number;
  /** Data state: all or final */
  dataState?: string;

  /** Site URL as shown in Search Console */
  siteUrl?: string;
  /** Sitemap URL/path (for getSitemap) */
  feedpath?: string;
  /** URL to inspect (for inspectUrl) */
  inspectionUrl?: string;
}

/**
 * Result from a Google Search Console operation.
 */
export interface ApiGoogleSearchConsoleResult {
  kind: "googlesearchconsole";
  /** The operation that was performed */
  operation: string;
  /** Operation-specific result data */
  data: unknown;
}
