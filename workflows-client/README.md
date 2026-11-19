# @major-tech/workflows-client

Start Major workflow runs from a deployed Major app or sandbox preview.

```ts
import { leadEnrichmentWorkflowClient } from "./clients";

const { runId } = await leadEnrichmentWorkflowClient.run({ input: { leadId } });
```

- `run({ input? })` runs the published version from a deployed app. From a sandbox preview it runs the
  workflow's draft while the workflow is open in a sandbox, and the run's calls back to this app go to that preview.
- Generate a client per workflow: `npx @major-tech/workflows-client add <workflow_id> <name> --framework nextjs`.
  Deploy grants the app permission to start the workflows its generated clients name.
