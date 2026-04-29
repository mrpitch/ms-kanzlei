---
name: How to deploy to AWS
description: One-time setup and ongoing deployment of the site to AWS via CDK and GitHub Actions.
tags: [deploy, aws, cdk, cloudfront, s3, github-actions, oidc]
kind: how-to
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# How to deploy to AWS

The site is hosted on AWS (S3 + CloudFront) and deployed via GitHub Actions with OIDC authentication. This guide covers the one-time bootstrap and the ongoing automated workflow.

## Prerequisites

- AWS account with access to `eu-central-1` and `us-east-1`
- AWS CLI configured locally (`aws configure`)
- AWS CDK CLI: `npm install -g aws-cdk`
- `gh` CLI authenticated to the GitHub repository

## One-time setup

### 1. Configure CDK environment variables

```bash
cp cdk/.env.cdk.example cdk/.env.cdk
```

Edit `cdk/.env.cdk` with your values:

```bash
DOMAIN_NAME=ms-kanzlei.example.com
HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ
AWS_REGION_CERT=us-east-1
AWS_REGION_MAIN=eu-central-1
DEPLOY_ROLE_NAME=ms-kanzlei-github-deploy
DEPLOY_REPO_REF=repo:mrpitch/ms-kanzlei:ref:refs/heads/main
```

See [CDK environment variables reference](../reference/environment-variables.md) for all fields.

### 2. Bootstrap CDK in both regions

CDK requires bootstrapping in every region it deploys to. Cross-region certificate references require both regions:

```bash
cd cdk
pnpm install
CDK_DEFAULT_ACCOUNT=<YOUR_ACCOUNT_ID> pnpm cdk bootstrap aws://<YOUR_ACCOUNT_ID>/eu-central-1
CDK_DEFAULT_ACCOUNT=<YOUR_ACCOUNT_ID> pnpm cdk bootstrap aws://<YOUR_ACCOUNT_ID>/us-east-1
```

### 3. Deploy all stacks manually (first time)

```bash
CDK_DEFAULT_ACCOUNT=<YOUR_ACCOUNT_ID> pnpm cdk deploy --all
```

This creates:

- `MsKanzleiCertStack` in `us-east-1` (ACM certificate)
- `MsKanzleiStack` in `eu-central-1` (S3, CloudFront, Route53, OIDC IAM role)

Note the `DeployRoleArn` output from the stack.

### 4. Configure GitHub

Set the deploy role ARN as a GitHub Actions secret:

```bash
gh secret set AWS_DEPLOY_ROLE_ARN --body "<DeployRoleArn from stack output>"
```

Set the remaining values as GitHub repository variables:

```bash
gh variable set DOMAIN_NAME --body "ms-kanzlei.example.com"
gh variable set HOSTED_ZONE_ID --body "Z0123456789ABCDEFGHIJ"
gh variable set AWS_REGION_CERT --body "us-east-1"
gh variable set AWS_REGION_MAIN --body "eu-central-1"
gh variable set DEPLOY_ROLE_NAME --body "ms-kanzlei-github-deploy"
gh variable set DEPLOY_REPO_REF --body "repo:mrpitch/ms-kanzlei:ref:refs/heads/main"
```

## Ongoing deployment

After the one-time setup, all deployments are automated:

- **Push to `main`**: GitHub Actions detects changed paths and runs only the needed jobs.
- **Manual trigger**: Use `Actions → Deploy → Run workflow` in GitHub UI and choose `next`, `cdk`, or `full`.

### What the workflow does

| Job                     | Runs when          | Action                                     |
| ----------------------- | ------------------ | ------------------------------------------ |
| `detect-changes`        | Always             | Decides which jobs to run                  |
| `deploy-cdk`            | `cdk/**` changed   | Runs `pnpm cdk deploy --all`               |
| `build-next`            | Site files changed | Runs `pnpm build`, uploads `out/` artifact |
| `resolve-infra-outputs` | CDK or Next ran    | Reads S3 bucket + CloudFront ID from stack |
| `publish-site`          | Next ran           | S3 sync + CloudFront invalidation          |
| `notify-failure`        | Any job failed     | Opens a GitHub issue with the failure link |

## Pitfalls

- **OIDC provider must be unique**: only one `token.actions.githubusercontent.com` provider per AWS account. If one already exists, CDK deployment will fail with `EntityAlreadyExistsException`. Import the existing provider instead of creating a new one.
- **Cross-region bootstrap is required**: omitting `us-east-1` bootstrap causes the cert stack to fail.
- **DNS propagation**: after first deploy, the CloudFront distribution takes 5–15 minutes to become globally available.

## See also

- [Environment variables reference](../reference/environment-variables.md)
- [About architecture](../explanation/about-architecture.md)
