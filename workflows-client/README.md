# @major-tech/workflows-client

Start Major workflow runs from a deployed Major app or sandbox preview.

```ts
import { leadEnrichmentWorkflowClient } from "./clients";

const { runId } = await leadEnrichmentWorkflowClient.run({ input: { leadId } });
```

- `run({ input? })` runs the workflow's published version. From a sandbox preview, the run's calls back to this
  app go to that preview.
- `getRun({ runId })` reads back a run this app started: `run.status`, then `document.output` once it completed or
  `run.error` once it failed or was canceled.
- Generate a client per workflow: `npx @major-tech/workflows-client add <workflow_id> <name> --framework nextjs`.
  Deploy grants the app permission to start the workflows its generated clients name.
- For a Vite app with a Hono backend, run the generator in the backend package with `--framework hono`. The backend must install Hono’s `contextStorage()` middleware to forward the viewer JWT.
- A `human_approval` node with an `app` channel POSTs an `AppApprovalRequest` to the app's `path`; store it keyed by
  `(runId, executionId)` and answer later with `approvals.respond({ runId, executionId, choice })`.
