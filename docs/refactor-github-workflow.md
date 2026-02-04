# Plan: Refactor deploy.yml to Multi-Step Workflow

## Overview

Split single-job deploy into 5 jobs with conditional execution based on path changes or manual dispatch.

## Job Dependency Graph

```
detect-changes
    │
    ├──► deploy-cdk (if run_cdk)
    │
    ├──► build-next (if run_next)
    │        │
    │        ▼
    └──► resolve-infra-outputs (if run_cdk OR run_next)
                │
                ▼
         publish-site (if run_next)
                │
                ▼
         notify-failure (if: failure())
```

## Workflow Triggers

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      deploy_mode:
        type: choice
        options: [next, cdk, full]
        default: full
```

## Jobs

### 1. detect-changes

- Compute `run_cdk` and `run_next` outputs
- Push: diff `${{ github.event.before }}...${{ github.sha }}`
- Manual: use `deploy_mode` input

**Path patterns:**

- CDK: `^cdk/`
- Site: `^(content/|src/|public/|next\.config\.ts|export-images\.config\.js|package\.json|pnpm-lock\.yaml|tailwind\.config\.|postcss\.config\.|tsconfig\.json)`

### 2. deploy-cdk

- Condition: `run_cdk == 'true'`
- OIDC auth → install CDK deps → `pnpm cdk deploy --all --require-approval never`

### 3. build-next

- Condition: `run_next == 'true'`
- Install deps → `pnpm build` → upload `out/` artifact

### 4. resolve-infra-outputs

- Condition: `run_cdk == 'true' OR run_next == 'true'`
- Needs: deploy-cdk (if ran), build-next (if ran)
- Use `aws cloudformation describe-stacks --stack-name MsKanzleiStack`
- Export: `bucket`, `distribution_id`

### 5. publish-site

- Condition: `run_next == 'true'`
- Needs: build-next, resolve-infra-outputs
- Download artifact
- S3 sync with cache headers:
  - `_next/static/`, `_optimized/`: `max-age=31536000,immutable`
  - Everything else: `max-age=0,must-revalidate`
- CloudFront invalidation (selective paths, fallback to `/*`)

### 6. notify-failure

- Condition: `if: failure()` (runs if any job fails)
- Needs: all jobs
- Create GitHub issue via `gh issue create` with:
  - Title: `Deploy failed: ${{ github.run_id }}`
  - Body: workflow URL, commit SHA, failed job name

## Cache Headers Strategy

| Path | Cache-Control |
|------|---------------|
| `_next/static/*` | `public,max-age=31536000,immutable` |
| `_optimized/*` | `public,max-age=31536000,immutable` |
| `*.html`, `/` | `public,max-age=0,must-revalidate` |

## CloudFront Invalidation

Default paths: `/ /index.html /404.html /sitemap.xml /robots.txt`
- All `*.html` files converted to URL paths
Fallback to `/*` if >15 paths

## Validation Matrix

| Trigger | run_cdk | run_next | Jobs |
|---------|---------|----------|------|
| Push: only `cdk/**` | true | false | detect → deploy-cdk → resolve |
| Push: only site files | false | true | detect → build-next → resolve → publish |
| Push: both | true | true | all jobs |
| Push: unrelated files | false | false | detect only |
| Manual: next | false | true | detect → build-next → resolve → publish |
| Manual: cdk | true | false | detect → deploy-cdk → resolve |
| Manual: full | true | true | all jobs |

## Files to Modify

- `.github/workflows/deploy.yml` - complete rewrite

## Failure Notification

Add `notify-failure` job that runs on failure:

- Condition: `if: failure()`
- Create GitHub Issue with workflow run link and failed job info
- Use `peter-evans/create-issue-from-file@v5` or inline `gh issue create`

## Verification

1. Push commit touching only `cdk/lib/cdk-stack.ts` → only CDK deploys
2. Push commit touching only `content/home.mdx` → only site builds/publishes
3. Manual dispatch with `deploy_mode=next` → site-only
4. Manual dispatch with `deploy_mode=full` → all jobs run
5. Check CloudFormation console for stack outputs
6. Verify S3 cache headers via `aws s3api head-object`
7. Verify CloudFront invalidation completes
8. Test failure notification by introducing intentional error
