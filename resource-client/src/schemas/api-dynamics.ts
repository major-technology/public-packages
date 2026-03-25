import type { JsonBody, HttpMethod, QueryParams } from "./common";

/**
 * Payload for invoking a Microsoft Dynamics 365 (Dataverse Web API) resource.
 * Authentication (OAuth) is handled automatically by the API.
 *
 * Common usage patterns:
 * - List Records:     GET  accounts?$select=name,revenue
 * - Get Record:       GET  contacts(guid)?$select=firstname,lastname
 * - Create Record:    POST accounts
 * - Update Record:    PATCH accounts(guid)
 * - Delete Record:    DELETE accounts(guid)
 * - List Entities:    GET  EntityDefinitions?$select=LogicalName,DisplayName,EntitySetName
 */
export interface ApiDynamicsPayload {
  type: "api";
  subtype: "dynamics";
  /** HTTP method to use */
  method: HttpMethod;
  /** Dataverse Web API path (e.g. "accounts", "contacts(guid)", "EntityDefinitions") */
  path: string;
  /** Optional OData query parameters (e.g. { "$select": ["name,revenue"], "$filter": ["..."] }) */
  query?: QueryParams;
  /** Optional JSON body (for POST/PATCH requests) */
  body?: JsonBody;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}
