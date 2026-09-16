# @major-tech/error-reporter

Error reporting for Major apps.

## Next.js setup

Wrap your layout's children:

```tsx
import { ErrorReporterProvider } from "@major-tech/error-reporter/next";

<ErrorReporterProvider>{children}</ErrorReporterProvider>
```

Configuration is read from the app's server environment. No provider props are needed.

`ErrorBoundary` and `useReportError` are also available from the same import path.

## Upgrading

Update to version 0.2.9 or later and remove the `endpoint`, `jwtToken`, and
`applicationId` props from `ErrorReporterProvider`.
