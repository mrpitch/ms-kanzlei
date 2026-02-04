# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AWS CDK infrastructure for MS Kanzlei — static Next.js site hosted on S3 + CloudFront with custom domain via Route53.

## Commands

```bash
pnpm build             # Compile TypeScript
pnpm watch             # Compile in watch mode
pnpm test              # Run Jest tests
pnpm cdk synth         # Synthesize CloudFormation templates
pnpm cdk deploy --all  # Deploy both stacks to AWS
pnpm cdk diff          # Preview changes vs deployed stacks
pnpm cdk destroy --all # Tear down all stacks
```

## Architecture

Two stacks with cross-region references:

- **`MsKanzleiCertStack`** (`us-east-1`): ACM certificate with DNS validation (CloudFront requires certs in us-east-1)
- **`MsKanzleiStack`** (`eu-central-1`): S3 bucket (private, OAC), CloudFront distribution, CF Function (URL rewrite), GitHub OIDC + IAM deploy role, Route53 A/AAAA alias records

### Key Files

- `bin/cdk.ts` — entry point, instantiates both stacks
- `lib/cert-stack.ts` — ACM certificate stack
- `lib/cdk-stack.ts` — main infrastructure stack
- `test/cdk.test.ts` — assertions for all resources

### CI/CD

- `.github/workflows/deploy.yml` — GitHub Actions pipeline
- OIDC-based auth (no long-lived AWS keys)
- S3 sync with differentiated cache headers (immutable for hashed assets, no-cache for HTML)
- CloudFront invalidation after deploy

### Domain

- Domain: `mskanzlei.mrpitch.rocks`
- Hosted zone ID: `Z101967436NINE8V1MY7N`

## Tech Stack

- AWS CDK v2 (aws-cdk-lib ^2.232.2)
- TypeScript 5.9, ES2022 target, NodeNext modules
- Jest 30 with ts-jest for testing
- pnpm package manager
