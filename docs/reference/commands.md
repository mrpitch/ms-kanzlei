---
name: CLI commands reference
description: All pnpm scripts available in the project and what they do.
tags: [commands, cli, pnpm, scripts, build, test]
kind: reference
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# CLI commands reference

All commands are run from the repository root with `pnpm <command>`.

## Development

| Command      | Description                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------- |
| `pnpm dev`   | Start Next.js development server with hot reload at `http://localhost:3000`                 |
| `pnpm build` | Build static export to `out/` (runs `next build` + image optimization + sitemap generation) |
| `pnpm start` | Serve the `out/` directory locally for verifying the production build                       |

## Code quality

| Command          | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `pnpm check`     | Run ESLint + TypeScript type-check together (both must pass) |
| `pnpm lint`      | Run ESLint only                                              |
| `pnpm typecheck` | Run `tsc --noEmit` only                                      |
| `pnpm format`    | Format all files with Prettier                               |

## Testing

| Command            | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `pnpm test:e2e`    | Run Playwright end-to-end tests (spins up a production build internally) |
| `pnpm test:e2e:ui` | Run Playwright in UI mode for interactive debugging                      |

## Maintenance

| Command     | Description                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `pnpm nuke` | Remove `node_modules`, `pnpm-lock.yaml`, `.next`, and `out` — use when you need a completely clean slate |

## CDK commands (run from `cdk/`)

| Command                 | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| `pnpm cdk synth`        | Synthesize CloudFormation templates (validate without deploying) |
| `pnpm cdk deploy --all` | Deploy both CDK stacks to AWS                                    |
| `pnpm cdk diff`         | Show pending infrastructure changes                              |
| `pnpm cdk bootstrap`    | Bootstrap CDK toolkit in an AWS region (one-time per region)     |

## See also

- [Getting started tutorial](../tutorials/getting-started.md)
- [How to deploy to AWS](../how-to/how-to-deploy-to-aws.md)
