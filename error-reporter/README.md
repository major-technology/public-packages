# @major-tech/error-reporter

## Next.js App Router

Wrap your layout's children without passing credentials:

```tsx
import { ErrorReporterProvider } from "@major-tech/error-reporter/next";

<ErrorReporterProvider>{children}</ErrorReporterProvider>
```

The client provider captures browser errors and forwards them through the
package's `submitClientErrors` server action. The action reads
`MAJOR_API_BASE_URL`, `MAJOR_JWT_TOKEN`, and `APPLICATION_ID` (falling back to
`MAJOR_APPLICATION_ID`) from the app server's runtime environment and attaches
the credential when forwarding to Major. Browser requests contain error data,
not the app credential.

`ErrorBoundary` and `useReportError` remain available from the same entry point.
`useReportError` also forwards errors when no provider is mounted, such as from
`app/global-error.tsx`.

### Updating an existing app

Remove `endpoint`, `jwtToken`, and `applicationId` from every
`ErrorReporterProvider` usage. These props remain accepted for compatibility but
are ignored by the provider. **Updating the package alone does not remove token
exposure:** a token passed from a server component to a client component is still
serialized into the RSC payload, even if the client ignores it.

The root package's server-side reporting and direct HTTP transport are unchanged.

## Development

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

Validate browser reporting in a Next.js app using the packed package.
See [PUBLISHING.md](PUBLISHING.md) for the separate release process.
