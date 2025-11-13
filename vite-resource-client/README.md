# @major-tech/resource-client

TS client: PostgreSQL/CustomAPI/HubSpot/S3. Type-safe, 0-dep, universal (Node/browser/edge), ESM+CJS.

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
import { PostgresResourceClient } from '@major-tech/resource-client';
const c = new PostgresResourceClient({ baseUrl, applicationId, resourceId, majorJwtToken });
const r = await c.invoke('SELECT * FROM users WHERE id = $1', [123], 'fetch-user');
// r.ok ? r.result.rows : r.error.message
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
import { CustomApiResourceClient } from '@major-tech/resource-client';
const c = new CustomApiResourceClient({ baseUrl, applicationId, resourceId });
const r = await c.invoke('POST', '/v1/pay', 'create-pay', {
  query: { currency: 'USD' }, headers: { 'X-Key': 'val' },
  body: { type: 'json', value: { amt: 100 } }, timeoutMs: 5000
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
import { HubSpotResourceClient } from '@major-tech/resource-client';
const c = new HubSpotResourceClient({ baseUrl, applicationId, resourceId });
const r = await c.invoke('GET', '/crm/v3/objects/contacts', 'fetch-contacts', { query: { limit: '10' } });
// r.ok && r.result.body.kind === 'json' ? r.result.body.value : r.error
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
import { S3ResourceClient } from '@major-tech/resource-client';
const c = new S3ResourceClient({ baseUrl, applicationId, resourceId });
const r = await c.invoke('ListObjectsV2', { Bucket: 'my-bucket', Prefix: 'uploads/' }, 'list-uploads');
// r.ok ? r.result.data : r.error
const u = await c.invoke('GeneratePresignedUrl', { Bucket: 'my-bucket', Key: 'file.pdf', expiresIn: 3600 }, 'presigned');
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

**Types:** `database-postgresql | api-custom | api-hubspot | storage-s3`

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
import { ordersDbClient } from './clients';
const r = await ordersDbClient.invoke('SELECT * FROM orders', [], 'list-orders');
```

MIT License