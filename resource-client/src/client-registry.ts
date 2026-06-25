/**
 * Canonical map: resource subtype → the typed client class this package exports for it.
 *
 * Single source of truth for "which subtypes have a typed client." Both the public API and
 * the code generator read from here:
 *  - `ResourceSubtype` (the union of supported subtypes) is derived from the keys.
 *  - `bin/generate-clients.mjs` derives its valid-type list and its typed-vs-proxy decision
 *    from this map — a subtype absent here has no typed client and is generated as a
 *    `createProxyFetch` handle instead.
 *
 * Values are class-NAME strings (not the classes) on purpose: the generator emits them into
 * `import { X } from "@major-tech/resource-client"` / `new X(...)`, so a string is what it
 * needs, and it stays correct even when a bundler renames the class binding.
 */
export const CLIENT_REGISTRY = {
  postgresql: "PostgresResourceClient",
  mssql: "MssqlResourceClient",
  mysql: "MysqlResourceClient",
  dynamodb: "DynamoDBResourceClient",
  cosmosdb: "CosmosDBResourceClient",
  snowflake: "SnowflakeResourceClient",
  bigquery: "BigQueryResourceClient",
  neo4j: "Neo4jResourceClient",
  custom: "CustomApiResourceClient",
  hubspot: "HubSpotResourceClient",
  plaid: "PlaidResourceClient",
  linkedin: "LinkedInResourceClient",
  googlecalendar: "GoogleCalendarResourceClient",
  gmail: "GmailResourceClient",
  googledrive: "GoogleDriveResourceClient",
  googlesheets: "GoogleSheetsResourceClient",
  lambda: "LambdaResourceClient",
  outreach: "OutreachResourceClient",
  salesforce: "SalesforceResourceClient",
  s3: "S3ResourceClient",
  slack: "SlackResourceClient",
  majorauth: "MajorAuthResourceClient",
  googleanalytics: "GoogleAnalyticsResourceClient",
  graphql: "GraphQLResourceClient",
  quickbooks: "QuickBooksResourceClient",
  gong: "GongResourceClient",
  clerk: "ClerkResourceClient",
  stripe: "StripeResourceClient",
  fireflies: "FirefliesResourceClient",
  attio: "AttioResourceClient",
  tiktokads: "TikTokAdsResourceClient",
  dynamics: "DynamicsResourceClient",
  linear: "LinearResourceClient",
  zohodesk: "ZohoDeskResourceClient",
  zohoprojects: "ZohoProjectsResourceClient",
  sqs: "SqsResourceClient",
  metamarketing: "MetaMarketingResourceClient",
  sharepoint: "SharePointResourceClient",
  googlesearchconsole: "GoogleSearchConsoleResourceClient",
  notion: "NotionResourceClient",
  blob: "BlobResourceClient",
  github: "GitHubResourceClient",
} as const;

/** A resource subtype with a typed client in this package. */
export type ResourceSubtype = keyof typeof CLIENT_REGISTRY;
