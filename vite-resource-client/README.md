# @major-tech/resource-client

TypeScript client for Major resources (PostgreSQL, Custom APIs, HubSpot, S3). Type-safe, zero dependencies, universal (Node/browser/edge), ESM & CJS.

## Install
```bash
pnpm install @major-tech/resource-client
```

## Usage

**Config (all clients):**
```typescript
{ baseUrl: string; applicationId: string; resourceId: string; majorJwtToken?: string; fetch?: typeof fetch }
```

**Response:** `{ ok: true; requestId: string; result: T } | { ok: false; requestId: string; error: { message: string; httpStatus?: number } }`

**PostgreSQL:**
```typescript
import { PostgresResourceClient } from '@major-tech/resource-client';
const client = new PostgresResourceClient({ baseUrl, applicationId, resourceId, majorJwtToken? });
const res = await client.invoke('SELECT * FROM users WHERE id = $1', [123], 'fetch-user-by-id');
// res.ok ? res.result.rows / res.result.rowsAffected : res.error.message
```

**Custom API:**
```typescript
import { CustomApiResourceClient } from '@major-tech/resource-client';
const client = new CustomApiResourceClient({ baseUrl, applicationId, resourceId });
const res = await client.invoke('POST', '/v1/payments', 'create-payment', {
  query: { currency: 'USD' }, headers: { 'X-Custom': 'value' },
  body: { type: 'json', value: { amount: 100 } }, timeoutMs: 5000
});
// res.ok ? res.result.status / res.result.body : res.error
```

**HubSpot:**
```typescript
import { HubSpotResourceClient } from '@major-tech/resource-client';
const client = new HubSpotResourceClient({ baseUrl, applicationId, resourceId });
const res = await client.invoke('GET', '/crm/v3/objects/contacts', 'fetch-contacts', { query: { limit: '10' } });
// res.ok && res.result.body.kind === 'json' ? res.result.body.value : res.error
```

**S3:**
```typescript
import { S3ResourceClient } from '@major-tech/resource-client';
const client = new S3ResourceClient({ baseUrl, applicationId, resourceId });
const res = await client.invoke('ListObjectsV2', { Bucket: 'my-bucket', Prefix: 'uploads/' }, 'list-uploads');
// res.ok ? res.result.data : res.error
const url = await client.invoke('GeneratePresignedUrl', { Bucket: 'my-bucket', Key: 'file.pdf', expiresIn: 3600 }, 'presigned-url');
// url.ok && 'presignedUrl' in url.result ? url.result.presignedUrl / url.result.expiresAt : url.error
```

**Error Handling:**
```typescript
import { ResourceInvokeError } from '@major-tech/resource-client';
try { await client.invoke(...); }
catch (e) { if (e instanceof ResourceInvokeError) { e.message, e.httpStatus, e.requestId } }
```

**Invocation Keys:** Unique operation identifiers for tracking (format: `[a-zA-Z0-9][a-zA-Z0-9._:-]*`). Examples: `fetch-user-by-id`, `create-payment`, `hubspot:get-contacts`, `s3.list-uploads`

**Types:** All exported: `BaseClientConfig`, `DatabaseInvokeResponse`, `ApiInvokeResponse`, `StorageInvokeResponse`, `HttpMethod`, `QueryParams`, `BodyPayload`, `S3Command`, etc.

## 🛠️ CLI Tool - Generate Singleton Clients

The package includes a CLI tool to generate pre-configured singleton clients for your resources:

```bash
# Add a resource
npx major-client add "resource-123" "orders-db" "database-postgresql" "Orders database" "app-456"

# List all resources
npx major-client list

# Remove a resource
npx major-client remove "orders-db"
```

This generates TypeScript files in `src/clients/` that you can import:
```typescript
import { ordersDbClient } from './clients';
const result = await ordersDbClient.invoke('SELECT * FROM orders', [], 'list-orders');
```

**Types:** `database-postgresql` | `api-custom` | `api-hubspot` | `storage-s3`

MIT License