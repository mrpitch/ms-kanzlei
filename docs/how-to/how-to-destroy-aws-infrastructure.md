---
name: How to destroy the AWS infrastructure
description: Permanently tears down all CDK stacks (CloudFront, S3, ACM certificate, Route53 records, IAM OIDC role) via the manual GitHub Actions workflow.
tags: [how-to, aws, cdk, github-actions, teardown]
kind: how-to
status: current
last_reviewed: 2026-04-30
authoritative: true
---

# How to destroy the AWS infrastructure

Use this guide to permanently remove all AWS resources created by CDK. This is a one-way operation — there is no rollback.

> **Warning:** This deletes the S3 bucket (and all site files), the CloudFront distribution, the ACM certificate, the Route53 records, and the OIDC IAM role. The site will go offline immediately and DNS resolution will stop working.

## Prerequisites

- Write access to the GitHub repository (to trigger `workflow_dispatch`)
- The `AWS_DEPLOY_ROLE_ARN` secret and all `vars.*` variables must be set (the same ones required for deployment — see [How to deploy to AWS](./how-to-deploy-to-aws.md#4-configure-github))

## Steps

### 1. Open the workflow in GitHub Actions

Navigate to: `Actions → Destroy AWS Infrastructure → Run workflow`

### 2. Enter the confirmation token

In the **"Type DESTROY to confirm full teardown (irreversible)"** input, type exactly:

```
DESTROY
```

Any other value causes the job to be skipped with no changes made.

### 3. Run the workflow

Click **Run workflow**. The single `destroy` job will:

1. Check out the repository
2. Authenticate to AWS via OIDC using `AWS_DEPLOY_ROLE_ARN`
3. Run `pnpm cdk destroy --all --force` inside `cdk/`

CDK destroys both stacks in dependency order:

| Stack               | Region         | Resources removed                              |
| ------------------- | -------------- | ---------------------------------------------- |
| `MsKanzleiStack`    | `eu-central-1` | S3 bucket, CloudFront, Route53 records, OIDC role |
| `MsKanzleiCertStack`| `us-east-1`    | ACM certificate                                |

### 4. Verify teardown

Once the workflow completes, confirm in the AWS Console that:

- The CloudFront distribution no longer exists
- The S3 bucket has been deleted
- The ACM certificate in `us-east-1` is gone
- The IAM role used for OIDC (`DEPLOY_ROLE_NAME`) has been removed

## Troubleshooting

### Job is skipped without running

**Cause:** The confirmation input did not exactly match `DESTROY` (e.g. lowercase, trailing space).  
**Fix:** Re-run the workflow and type `DESTROY` exactly.

### `AccessDenied` during destroy

**Cause:** The IAM role referenced by `AWS_DEPLOY_ROLE_ARN` lacks permissions to delete one or more resource types.  
**Fix:** Manually grant the required permission in the AWS IAM console, or delete the resource manually before re-running.

### Stack deletion fails due to non-empty S3 bucket

**Cause:** CDK cannot delete a bucket with objects unless the bucket has auto-delete configured.  
**Fix:** Manually empty the bucket in the S3 console (`Actions → Empty`), then re-run the workflow.

## See Also

- [How to deploy to AWS](./how-to-deploy-to-aws.md) — re-create the infrastructure after teardown
- [Environment variables reference](../reference/environment-variables.md) — variables and secrets required by the workflow
- [About architecture](../explanation/about-architecture.md) — overview of what CDK provisions
