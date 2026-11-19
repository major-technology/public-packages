# @major-tech/workflows-client

Start Major workflow runs from a deployed Major app or sandbox preview.

```ts
import { leadEnrichmentWorkflowClient } from "./clients";

const { runId } = await leadEnrichmentWorkflowClient.run({ input: { leadId } });
```

- `run({ input? })` runs the workflow's published version. From a sandbox preview, the run's calls back to this
  app go to that preview.
- Generate a client per workflow: `npx @major-tech/workflows-client add <workflow_id> <name> --framework nextjs`.
  Deploy grants the app permission to start the workflows its generated clients name.
