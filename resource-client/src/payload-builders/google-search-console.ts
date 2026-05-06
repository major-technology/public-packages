import type {
  ApiGoogleSearchConsolePayload,
  GSCQueryAnalyticsOptions,
} from "../schemas";

/**
 * Build a Google Search Console queryAnalytics payload
 */
export function buildGoogleSearchConsoleQueryAnalyticsPayload(
  startDate: string,
  endDate: string,
  options?: GSCQueryAnalyticsOptions
): ApiGoogleSearchConsolePayload {
  return {
    type: "api",
    subtype: "googlesearchconsole",
    operation: "queryAnalytics",
    startDate,
    endDate,
    dimensions: options?.dimensions,
    searchType: options?.type,
    dimensionFilterGroups: options?.dimensionFilterGroups,
    aggregationType: options?.aggregationType,
    rowLimit: options?.rowLimit,
    startRow: options?.startRow,
    dataState: options?.dataState,
  };
}

/**
 * Build a Google Search Console listSites payload
 */
export function buildGoogleSearchConsoleListSitesPayload(): ApiGoogleSearchConsolePayload {
  return {
    type: "api",
    subtype: "googlesearchconsole",
    operation: "listSites",
  };
}

/**
 * Build a Google Search Console getSite payload
 */
export function buildGoogleSearchConsoleGetSitePayload(
  siteUrl: string
): ApiGoogleSearchConsolePayload {
  return {
    type: "api",
    subtype: "googlesearchconsole",
    operation: "getSite",
    siteUrl,
  };
}

/**
 * Build a Google Search Console listSitemaps payload
 */
export function buildGoogleSearchConsoleListSitemapsPayload(
  siteUrl: string
): ApiGoogleSearchConsolePayload {
  return {
    type: "api",
    subtype: "googlesearchconsole",
    operation: "listSitemaps",
    siteUrl,
  };
}

/**
 * Build a Google Search Console getSitemap payload
 */
export function buildGoogleSearchConsoleGetSitemapPayload(
  siteUrl: string,
  feedpath: string
): ApiGoogleSearchConsolePayload {
  return {
    type: "api",
    subtype: "googlesearchconsole",
    operation: "getSitemap",
    siteUrl,
    feedpath,
  };
}

/**
 * Build a Google Search Console inspectUrl payload
 */
export function buildGoogleSearchConsoleInspectUrlPayload(
  siteUrl: string,
  inspectionUrl: string
): ApiGoogleSearchConsolePayload {
  return {
    type: "api",
    subtype: "googlesearchconsole",
    operation: "inspectUrl",
    siteUrl,
    inspectionUrl,
  };
}

/**
 * Build a raw Google Search Console invoke payload
 */
export function buildGoogleSearchConsoleInvokePayload(
  payload: Record<string, unknown>
): ApiGoogleSearchConsolePayload {
  return {
    type: "api",
    subtype: "googlesearchconsole",
    ...payload,
  } as ApiGoogleSearchConsolePayload;
}
