/** Dimension filter for Search Console queries */
export interface GSCDimensionFilter {
  dimension: "query" | "page" | "country" | "device" | "searchAppearance";
  operator: "contains" | "equals" | "notContains" | "notEquals" | "includingRegex" | "excludingRegex";
  expression: string;
}

/** Dimension filter group */
export interface GSCDimensionFilterGroup {
  groupType?: "and";
  filters: GSCDimensionFilter[];
}

/** Query analytics options */
export interface GSCQueryAnalyticsOptions {
  dimensions?: ("query" | "page" | "country" | "device" | "date" | "searchAppearance")[];
  type?: "web" | "image" | "video" | "news" | "discover" | "googleNews";
  dimensionFilterGroups?: GSCDimensionFilterGroup[];
  aggregationType?: "auto" | "byPage" | "byProperty";
  rowLimit?: number;
  startRow?: number;
  dataState?: "all" | "final";
}

/** Payload for invoking a Google Search Console resource */
export interface ApiGoogleSearchConsolePayload {
  type: "api";
  subtype: "googlesearchconsole";
  operation: "queryAnalytics" | "listSites" | "getSite" | "listSitemaps" | "getSitemap" | "inspectUrl";
  // For queryAnalytics
  startDate?: string;
  endDate?: string;
  dimensions?: string[];
  searchType?: string;
  dimensionFilterGroups?: GSCDimensionFilterGroup[];
  aggregationType?: string;
  rowLimit?: number;
  startRow?: number;
  dataState?: string;
  // For sitemaps/sites/inspect
  siteUrl?: string;
  feedpath?: string;
  inspectionUrl?: string;
}

/** Result from a Google Search Console operation */
export interface ApiGoogleSearchConsoleResult {
  kind: "googlesearchconsole";
  operation: string;
  data: unknown;
}
