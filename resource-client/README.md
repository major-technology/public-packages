# @major-tech/resource-client

TS client: PostgreSQL/DynamoDB/CosmosDB/Snowflake/CustomAPI/HubSpot/S3. Type-safe, 0-dep, universal (Node/browser/edge), ESM+CJS.

## Install

```bash
pnpm add @major-tech/resource-client
```

## Config (All Clients)

```typescript
{ baseUrl: string; applicationId: string; resourceId: string; majorJwtToken?: string; fetch?: typeof fetch }
```

## Response Format

```typescript
{ ok: true; requestId: string; result: T } | { ok: false; requestId: string; error: { message: string; httpStatus?: number } }
```

## PostgresResourceClient

**Constructor:** `new PostgresResourceClient(config: BaseClientConfig)`

**Method:** `invoke(sql: string, params: DbParamPrimitive[] | undefined, invocationKey: string, timeoutMs?: number): Promise<DatabaseInvokeResponse>`

**Params:**

- `sql`: SQL query string
- `params`: `(string | number | boolean | null)[]` - positional params ($1, $2, etc)
- `invocationKey`: unique operation ID (regex: `[a-zA-Z0-9][a-zA-Z0-9._:-]*`)
- `timeoutMs`: optional timeout

**Result (ok=true):**

```typescript
{ kind: "database"; rows: Record<string, unknown>[]; rowsAffected?: number }
```

**Example:**

```typescript
import { PostgresResourceClient } from "@major-tech/resource-client";
const c = new PostgresResourceClient({
  baseUrl,
  applicationId,
  resourceId,
  majorJwtToken,
});
const r = await c.invoke(
  "SELECT * FROM users WHERE id = $1",
  [123],
  "fetch-user"
);
// r.ok ? r.result.rows : r.error.message
```

## DynamoDBResourceClient

**Constructor:** `new DynamoDBResourceClient(config: BaseClientConfig)`

**Method:** `invoke(command: DbDynamoDBPayload["command"], params: Record<string, unknown>, invocationKey: string, timeoutMs?: number): Promise<DatabaseInvokeResponse>`

**Params:**

- `command`: `"GetItem" | "PutItem" | "UpdateItem" | "DeleteItem" | "Query" | "Scan" | ...`
- `params`: Command parameters (e.g., `{ TableName: 'users', Key: { id: { S: '123' } } }`)
- `invocationKey`: unique operation ID
- `timeoutMs`: optional timeout

**Result (ok=true):**

```typescript
{
  kind: "database";
  command: string;
  data: unknown;
}
```

**Example:**

```typescript
import { DynamoDBResourceClient } from "@major-tech/resource-client";
const c = new DynamoDBResourceClient({ baseUrl, applicationId, resourceId });
const r = await c.invoke(
  "GetItem",
  { TableName: "users", Key: { id: { S: "123" } } },
  "get-user"
);
// r.ok ? r.result.data : r.error
```

## CustomApiResourceClient

**Constructor:** `new CustomApiResourceClient(config: BaseClientConfig)`

**Method:** `invoke(method: HttpMethod, path: string, invocationKey: string, options?: { query?: QueryParams; headers?: Record<string, string>; body?: BodyPayload; timeoutMs?: number }): Promise<ApiInvokeResponse>`

**Params:**

- `method`: `"GET" | "POST" | "PUT" | "PATCH" | "DELETE"`
- `path`: URL path (appended to resource baseUrl)
- `invocationKey`: unique operation ID
- `options.query`: `Record<string, string | string[]>` - query params
- `options.headers`: `Record<string, string>` - additional headers
- `options.body`: `{ type: "json"; value: unknown } | { type: "text"; value: string } | { type: "bytes"; base64: string; contentType: string }`
- `options.timeoutMs`: timeout (default: 30000)

**Result (ok=true):**

```typescript
{ kind: "api"; status: number; body: { kind: "json"; value: unknown } | { kind: "text"; value: string } | { kind: "bytes"; base64: string; contentType: string } }
```

**Example:**

```typescript
import { CustomApiResourceClient } from "@major-tech/resource-client";
const c = new CustomApiResourceClient({ baseUrl, applicationId, resourceId });
const r = await c.invoke("POST", "/v1/pay", "create-pay", {
  query: { currency: "USD" },
  headers: { "X-Key": "val" },
  body: { type: "json", value: { amt: 100 } },
  timeoutMs: 5000,
});
// r.ok ? r.result.status : r.error
```

## HubSpotResourceClient

**Constructor:** `new HubSpotResourceClient(config: BaseClientConfig)`

**Method:** `invoke(method: HttpMethod, path: string, invocationKey: string, options?: { query?: QueryParams; body?: { type: "json"; value: unknown }; timeoutMs?: number }): Promise<ApiInvokeResponse>`

**Params:**

- `method`: `"GET" | "POST" | "PUT" | "PATCH" | "DELETE"`
- `path`: HubSpot API path
- `invocationKey`: unique operation ID
- `options.query`: `Record<string, string | string[]>`
- `options.body`: `{ type: "json"; value: unknown }` - JSON only
- `options.timeoutMs`: timeout (default: 30000)

**Result:** Same as CustomApiResourceClient

**Example:**

```typescript
import { HubSpotResourceClient } from "@major-tech/resource-client";
const c = new HubSpotResourceClient({ baseUrl, applicationId, resourceId });
const r = await c.invoke("GET", "/crm/v3/objects/contacts", "fetch-contacts", {
  query: { limit: "10" },
});
// r.ok && r.result.body.kind === 'json' ? r.result.body.value : r.error
```

## SnowflakeResourceClient

**Constructor:** `new SnowflakeResourceClient(config: BaseClientConfig)`

**Methods:**

- `execute(statement: string, invocationKey: string, options?: SnowflakeExecuteOptions): Promise<SnowflakeInvokeResponse>`
- `status(statementHandle: string, invocationKey: string, options?: { partition?: number }): Promise<SnowflakeInvokeResponse>`
- `cancel(statementHandle: string, invocationKey: string): Promise<SnowflakeInvokeResponse>`
- `invoke(payload: DbSnowflakePayload, invocationKey: string): Promise<SnowflakeInvokeResponse>` - raw payload

**Execute Options:**

```typescript
{
  bindings?: Record<string, { type: SnowflakeBindingType; value: string | number | boolean | null }>;
  database?: string;      // Override default database
  schema?: string;        // Override default schema
  warehouse?: string;     // Override default warehouse
  role?: string;          // Override default role
  timeout?: number;       // Timeout in seconds (max 604800 = 7 days)
  async?: boolean;        // Execute asynchronously
  parameters?: SnowflakeSessionParameters;  // Session params (timezone, query_tag, etc.)
  nullable?: boolean;     // Return NULL as "null" string
  requestId?: string;     // Idempotency key
}
```

**Binding Types:** `"TEXT" | "FIXED" | "REAL" | "BOOLEAN" | "DATE" | "TIME" | "TIMESTAMP_LTZ" | "TIMESTAMP_NTZ" | "TIMESTAMP_TZ" | "BINARY" | "ARRAY" | "OBJECT" | "VARIANT"`

**Result (ok=true):**

```typescript
{
  kind: "snowflake";
  code?: string;                    // Snowflake response code
  message: string;                  // Response message
  statementHandle?: string;         // Handle for async operations
  statementHandles?: string[];      // Multi-statement handles
  statementStatusUrl?: string;      // URL to check status
  createdOn?: number;               // Timestamp
  resultSetMetaData?: {             // Column metadata
    numRows: number;
    format: string;
    rowType: SnowflakeColumnMetadata[];
    partitionInfo?: SnowflakePartitionInfo[];
  };
  data?: (string | null)[][];       // Result rows
  stats?: {                         // DML stats
    numRowsInserted?: number;
    numRowsUpdated?: number;
    numRowsDeleted?: number;
  };
}
```

**Example:**

```typescript
import { SnowflakeResourceClient } from "@major-tech/resource-client";
const c = new SnowflakeResourceClient({ baseUrl, applicationId, resourceId, majorJwtToken });

// Execute a query
const r = await c.execute(
  "SELECT * FROM users WHERE region = ?",
  "fetch-users",
  {
    bindings: { "1": { type: "TEXT", value: "US-WEST" } },
    warehouse: "COMPUTE_WH",
  }
);
// r.ok ? r.result.data : r.error.message

// Async execution for long-running queries
const async = await c.execute(
  "INSERT INTO large_table SELECT * FROM source",
  "bulk-insert",
  { async: true }
);
// async.ok ? async.result.statementHandle : async.error

// Check status of async query
const status = await c.status(async.result.statementHandle!, "check-status");
// status.result.code === "090001" means completed

// Cancel a running query
const cancel = await c.cancel(statementHandle, "cancel-query");
```

## S3ResourceClient

**Constructor:** `new S3ResourceClient(config: BaseClientConfig)`

**Method:** `invoke(command: S3Command, params: Record<string, unknown>, invocationKey: string, options?: { timeoutMs?: number }): Promise<StorageInvokeResponse>`

**Params:**

- `command`: `"ListObjectsV2" | "HeadObject" | "GetObjectTagging" | "PutObjectTagging" | "DeleteObject" | "DeleteObjects" | "CopyObject" | "ListBuckets" | "GetBucketLocation" | "GeneratePresignedUrl"`
- `params`: Command-specific params (e.g., `{ Bucket, Prefix, Key, expiresIn }`)
- `invocationKey`: unique operation ID
- `options.timeoutMs`: optional timeout

**Result (ok=true):**

```typescript
{ kind: "storage"; command: string; data: unknown } | { kind: "storage"; presignedUrl: string; expiresAt: string }
```

- Standard commands return `{ kind: "storage"; command; data }`
- `GeneratePresignedUrl` returns `{ kind: "storage"; presignedUrl; expiresAt }`

**Example:**

```typescript
import { S3ResourceClient } from "@major-tech/resource-client";
const c = new S3ResourceClient({ baseUrl, applicationId, resourceId });
const r = await c.invoke(
  "ListObjectsV2",
  { Bucket: "my-bucket", Prefix: "uploads/" },
  "list-uploads"
);
// r.ok ? r.result.data : r.error
const u = await c.invoke(
  "GeneratePresignedUrl",
  { Bucket: "my-bucket", Key: "file.pdf", expiresIn: 3600 },
  "presigned"
);
// u.ok && 'presignedUrl' in u.result ? u.result.presignedUrl : u.error
```

## Error Handling

```typescript
import { ResourceInvokeError } from '@major-tech/resource-client';
try { await client.invoke(...); }
catch (e) { if (e instanceof ResourceInvokeError) { e.message, e.httpStatus, e.requestId } }
```

## CLI - Singleton Generator

**Commands:**

- `npx major-client add <resourceId> <name> <type> <desc> <appId>` - Add resource, generate singleton
- `npx major-client list` - List all resources
- `npx major-client remove <name>` - Remove resource
- `npx major-client regenerate` - Regenerate all clients

**Types:** `database-postgresql | database-dynamodb | database-cosmosdb | database-snowflake | api-custom | api-hubspot | api-googlesheets | storage-s3`

**Generated Files:**

- `resources.json` - Resource registry
- `src/clients/<name>.ts` - Singleton client
- `src/clients/index.ts` - Exports

**Env Vars:** `MAJOR_API_BASE_URL`, `MAJOR_JWT_TOKEN`

**Example:**

```bash
npx major-client add "res_123" "orders-db" "database-postgresql" "Orders DB" "app_456"
```

```typescript
import { ordersDbClient } from "./clients";
const r = await ordersDbClient.invoke(
  "SELECT * FROM orders",
  [],
  "list-orders"
);
```

MIT License
