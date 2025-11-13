# CLI Tool - Client Generator

The `@major-tech/resource-client` package includes a CLI tool to generate pre-configured singleton clients for your Major resources.

## Installation

The CLI is automatically available when you install the package:

```bash
pnpm add @major-tech/resource-client
```

## Usage

### Add a Resource

```bash
npx major-client add <resource_id> <name> <type> <description> <application_id>
```

**Example:**
```bash
npx major-client add "res_abc123" "orders-db" "database-postgresql" "Orders database" "app_xyz789"
```

This will:
1. Add the resource to `resources.json`
2. Generate a singleton client in `src/clients/ordersDb.ts`
3. Update `src/clients/index.ts` with the export

### List Resources

```bash
npx major-client list
```

Shows all configured resources with their IDs and generated client names.

### Remove a Resource

```bash
npx major-client remove <name>
```

**Example:**
```bash
npx major-client remove "orders-db"
```

This will:
1. Remove the resource from `resources.json`
2. Delete the client file
3. Update `src/clients/index.ts`

### Regenerate Clients

```bash
npx major-client regenerate
```

Regenerates all client files from `resources.json`. Useful after updating the package version.

## Resource Types

- `database-postgresql` - PostgreSQL database
- `api-custom` - Custom REST API
- `api-hubspot` - HubSpot CRM API
- `storage-s3` - AWS S3 storage

## Generated Files

### `resources.json`
```json
[
  {
    "id": "res_abc123",
    "name": "orders-db",
    "type": "database-postgresql",
    "description": "Orders database",
    "applicationId": "app_xyz789"
  }
]
```

### `src/clients/ordersDb.ts`
```typescript
import { PostgresResourceClient } from '@major-tech/resource-client';

const BASE_URL = import.meta.env.MAJOR_API_BASE_URL || 'https://api.major.tech';
const MAJOR_JWT_TOKEN = import.meta.env.MAJOR_JWT_TOKEN;

class OrdersDbClientSingleton {
  private static instance: PostgresResourceClient | null = null;

  static getInstance(): PostgresResourceClient {
    if (!OrdersDbClientSingleton.instance) {
      OrdersDbClientSingleton.instance = new PostgresResourceClient({
        baseUrl: BASE_URL,
        majorJwtToken: MAJOR_JWT_TOKEN,
        applicationId: 'app_xyz789',
        resourceId: 'res_abc123',
      });
    }
    return OrdersDbClientSingleton.instance;
  }
}

export const ordersDbClient = OrdersDbClientSingleton.getInstance();
```

### `src/clients/index.ts`
```typescript
export { ordersDbClient } from './ordersDb';
```

## Usage in Your App

```typescript
import { ordersDbClient } from './clients';

// Use the pre-configured client
const result = await ordersDbClient.invoke(
  'SELECT * FROM orders WHERE user_id = $1',
  [userId],
  'fetch-user-orders'
);

if (result.ok) {
  console.log(result.result.rows);
}
```

## Environment Variables

Set these in your `.env` file:

```bash
MAJOR_API_BASE_URL=https://api.major.tech
MAJOR_JWT_TOKEN=your-jwt-token
```

## Package Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "clients:add": "major-client add",
    "clients:remove": "major-client remove",
    "clients:list": "major-client list"
  }
}
```

Then use:
```bash
pnpm clients:add "res_123" "my-db" "database-postgresql" "My Database" "app_456"
pnpm clients:list
pnpm clients:remove "my-db"
```

## Benefits

✅ **Type-safe** - Full TypeScript support  
✅ **Singleton pattern** - One instance per resource  
✅ **Environment-aware** - Uses env vars for config  
✅ **Version-locked** - CLI version matches package version  
✅ **Auto-generated** - No manual client setup  
✅ **Git-friendly** - Track resources in `resources.json`

