---
name: Environment variables reference
description: All environment variables used by the CDK stacks and the GitHub Actions workflow.
tags: [environment-variables, cdk, aws, github-actions, deploy, reference]
kind: reference
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# Environment variables reference

The Next.js application itself requires no environment variables for local development. All variables listed here are used by the CDK infrastructure code and the GitHub Actions deployment workflow.

## CDK variables (`cdk/.env.cdk`)

Set these locally by copying `cdk/.env.cdk.example` to `cdk/.env.cdk`.

| Variable           | Required | Description                                                             | Example                                       |
| ------------------ | -------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| `DOMAIN_NAME`      | Yes      | The custom domain for the CloudFront distribution                       | `mskanzlei.example.com`                       |
| `HOSTED_ZONE_ID`   | Yes      | Route53 hosted zone ID for DNS record creation                          | `Z0123456789ABCDEFGHIJ`                       |
| `AWS_REGION_CERT`  | Yes      | AWS region for the ACM certificate (must be `us-east-1` for CloudFront) | `us-east-1`                                   |
| `AWS_REGION_MAIN`  | Yes      | AWS region for all other resources (S3, CloudFront, Route53, IAM)       | `eu-central-1`                                |
| `DEPLOY_ROLE_NAME` | Yes      | IAM role name assumed by GitHub Actions                                 | `ms-kanzlei-github-deploy`                    |
| `DEPLOY_REPO_REF`  | Yes      | OIDC subject condition limiting which GitHub ref can assume the role    | `repo:mrpitch/ms-kanzlei:ref:refs/heads/main` |

## GitHub Actions secrets

Set once with `gh secret set <NAME> --body "<value>"`.

| Secret                | Description                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `AWS_DEPLOY_ROLE_ARN` | Full ARN of the IAM deploy role created by CDK (e.g. `arn:aws:iam::123456789012:role/ms-kanzlei-github-deploy`) |

## GitHub Actions variables

Set with `gh variable set <NAME> --body "<value>"`. These mirror the CDK `.env.cdk` values so the workflow can pass them to CDK during CI deployments.

| Variable           | Description                   |
| ------------------ | ----------------------------- |
| `DOMAIN_NAME`      | Custom domain                 |
| `HOSTED_ZONE_ID`   | Route53 hosted zone ID        |
| `AWS_REGION_CERT`  | Certificate region            |
| `AWS_REGION_MAIN`  | Main AWS region               |
| `DEPLOY_ROLE_NAME` | IAM role name                 |
| `DEPLOY_REPO_REF`  | OIDC subject condition string |

## Notes

- `cdk/.env.cdk` is gitignored. Never commit it.
- `DEPLOY_REPO_REF` uses the OIDC sub claim format. Changing this value after the role exists requires redeploying the CDK stack.
- `AWS_REGION_CERT` **must** be `us-east-1` — ACM certificates for CloudFront can only be issued in `us-east-1`.

## See also

- [How to deploy to AWS](../how-to/how-to-deploy-to-aws.md)
- [About architecture](../explanation/about-architecture.md)
