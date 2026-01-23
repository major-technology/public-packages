import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Salesforce API resource
 * Note: Salesforce authentication is handled automatically by the API
 *
 * Common usage patterns:
 * - SOQL Query: GET /services/data/v63.0/query?q=SELECT+Id,Name+FROM+Account
 * - Get Record: GET /services/data/v63.0/sobjects/Account/{id}
 * - Create Record: POST /services/data/v63.0/sobjects/Account
 * - Update Record: PATCH /services/data/v63.0/sobjects/Account/{id}
 * - Delete Record: DELETE /services/data/v63.0/sobjects/Account/{id}
 * - Describe Object: GET /services/data/v63.0/sobjects/Account/describe
 */
export interface ApiSalesforcePayload {
  type: "api";
  subtype: "salesforce";
  /** HTTP method to use */
  method: HttpMethod;
  /** Salesforce API path (e.g., "/services/data/v63.0/query" or "/services/data/v63.0/sobjects/Account") */
  path: string;
  /** Optional query parameters (e.g., { q: ["SELECT Id FROM Account"] } for SOQL) */
  query?: QueryParams;
  /** Optional JSON body (for POST/PATCH requests) */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
