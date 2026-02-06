# Plan: AWS Static Hosting for MS Kanzlei

## Summary

- S3 (private, OAC-only) + CloudFront (PriceClass_100) for static Next.js site
- CloudFront Function rewrites URLs (`/foo` → `/foo.html`, `/` → `/index.html`)
- GitHub Actions CI/CD with OIDC → IAM role (no long-lived AWS keys)
- Two CDK stacks: `MsKanzleiCertStack` (us-east-1, ACM cert) + `MsKanzleiStack` (eu-central-1, everything else)
- Custom domain via Route53 alias to CloudFront (existing hosted zone)
- S3 sync uses differentiated cache headers: immutable for `_next/static/` and `_optimized/`, no-cache for HTML
- First deploy requires manual CDK bootstrap (both regions) + deploy to create OIDC role
- Cost-efficient: PriceClass_100, no versioning, S3_MANAGED encryption

## Architecture

```
GitHub (push main) ──OIDC──▶ IAM Role
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              CDK Deploy            S3 Sync + CF Invalidation
              (2 stacks)                    │
                    │                       ▼
    ┌───────────────┼──────────┐    S3 Bucket (private)
    ▼               ▼          │            │
ACM Cert      CloudFront       │            │
(us-east-1)   Distribution ◄──┘────────────┘
    │           (OAC, eu-central-1)
    └──────▶  domainNames + cert
                    │
              CF Function (URL rewrite)
                    │
              Route53 A/AAAA alias
                    │
              <DOMAIN_NAME> ──▶ Visitors (HTTPS)
```

## Files to Create/Modify

```
cdk/bin/cdk.ts                ← modify: two stacks, set envs, cross-region refs
cdk/lib/cdk-stack.ts          ← rewrite: S3 + CloudFront + OAC + OIDC + IAM + Route53
cdk/lib/cert-stack.ts         ← create: ACM certificate in us-east-1
cdk/test/cdk.test.ts          ← rewrite: real assertions
.github/workflows/deploy.yml  ← create: CI/CD pipeline
```

## Infrastructure (CDK)

### `cdk/bin/cdk.ts`

- Create `MsKanzleiCertStack` in `us-east-1` (ACM cert for CloudFront must be in us-east-1)
- Create `MsKanzleiStack` in `eu-central-1` (S3, CloudFront, OIDC, IAM, Route53)
- Enable `crossRegionReferences: true` on both stacks to pass cert ARN cross-region
- Use `CDK_DEFAULT_ACCOUNT` env var for account
- Domain name passed as CDK context or hardcoded

```typescript
const certStack = new MsKanzleiCertStack(app, 'MsKanzleiCertStack', {
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
	crossRegionReferences: true,
	domainName: '<DOMAIN_NAME>',
})

new MsKanzleiStack(app, 'MsKanzleiStack', {
	env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-central-1' },
	crossRegionReferences: true,
	certificate: certStack.certificate,
	domainName: '<DOMAIN_NAME>',
})
```

### `cdk/lib/cert-stack.ts` (NEW)

- ACM `Certificate` with DNS validation via Route53 hosted zone lookup
- Exports `certificate` property for cross-stack reference

### `cdk/lib/cdk-stack.ts`

**S3 Bucket:**

- `blockPublicAccess: BLOCK_ALL`
- `encryption: S3_MANAGED`, `enforceSSL: true`
- `versioned: false` (static site, no need)
- `removalPolicy: DESTROY`, `autoDeleteObjects: true`

**CloudFront Function (viewer-request URL rewrite):**

```javascript
function handler(event) {
	var request = event.request
	var uri = request.uri
	if (uri.endsWith('/')) {
		request.uri = uri + 'index.html'
	} else if (!uri.includes('.', uri.lastIndexOf('/'))) {
		request.uri = uri + '.html'
	}
	return request
}
```

**CloudFront Distribution:**

- `S3BucketOrigin.withOriginAccessControl(bucket)` — CDK L2 auto-creates OAC + bucket policy
- `defaultRootObject: 'index.html'`
- `domainNames: ['<DOMAIN_NAME>']`
- `certificate` — cross-region ref from CertStack
- `PriceClass.PRICE_CLASS_100` (NA + EU only — cheapest)
- `TLS_V1_2_2021`, `HTTP2_AND_3`
- `viewerProtocolPolicy: REDIRECT_TO_HTTPS`
- `cachePolicy: CACHING_OPTIMIZED` (default behavior)
- Error responses: 403→`/404.html` (404), 404→`/404.html` (404) — S3 returns 403 for missing objects
- Function association: URL rewrite on viewer-request

**Route53:**

- Look up existing hosted zone by domain name
- Create A + AAAA alias records pointing to CloudFront distribution

**GitHub OIDC + IAM Role:**

- Create `OpenIdConnectProvider` for `token.actions.githubusercontent.com`
- Create IAM role `ms-kanzlei-github-deploy` with trust policy:
  - `aud: sts.amazonaws.com`
  - `sub: repo:mrpitch/ms-kanzlei:ref:refs/heads/main`
- Permissions: `s3:PutObject/DeleteObject/ListBucket` on bucket, `cloudfront:CreateInvalidation` on distribution

**CfnOutputs:** `BucketName`, `DistributionId`, `DistributionDomain`, `DeployRoleArn`

### `cdk/test/cdk.test.ts`

Assertions for:

- S3 bucket has public access blocked
- CloudFront distribution exists with PriceClass_100 and custom domain
- OIDC provider created
- IAM deploy role created
- Route53 alias records created

## CI/CD (GitHub Actions)

### `.github/workflows/deploy.yml`

```yaml
name: Deploy
on:
  push:
    branches: [main]

permissions:
  id-token: write
  contents: read

concurrency:
  group: deploy-production
  cancel-in-progress: false

env:
  AWS_REGION: eu-central-1

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      # Build site
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      # AWS auth via OIDC
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      # CDK deploy (both stacks, idempotent)
      - run: pnpm install --frozen-lockfile
        working-directory: cdk
      - run: pnpm cdk deploy --all --require-approval never --outputs-file cdk-outputs.json
        working-directory: cdk

      # Extract outputs
      - id: outputs
        working-directory: cdk
        run: |
          echo "bucket=$(jq -r '.MsKanzleiStack.BucketName' cdk-outputs.json)" >> "$GITHUB_OUTPUT"
          echo "dist-id=$(jq -r '.MsKanzleiStack.DistributionId' cdk-outputs.json)" >> "$GITHUB_OUTPUT"

      # S3 sync (differentiated cache headers)
      - run: |
          aws s3 sync out/_next/static s3://${{ steps.outputs.outputs.bucket }}/_next/static \
            --cache-control "public,max-age=31536000,immutable" --delete
      - run: |
          aws s3 sync out/_optimized s3://${{ steps.outputs.outputs.bucket }}/_optimized \
            --cache-control "public,max-age=31536000,immutable" --delete
      - run: |
          aws s3 sync out s3://${{ steps.outputs.outputs.bucket }} \
            --exclude "_next/*" --exclude "_optimized/*" \
            --cache-control "public,max-age=0,must-revalidate" --delete

      # Invalidate CloudFront
      - run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ steps.outputs.outputs.dist-id }} \
            --paths "/*"
```

**S3 sync strategy:**

1. `_next/static/` — immutable, 1yr cache (hashed filenames)
2. `_optimized/` — immutable, 1yr cache (hashed filenames)
3. Everything else (HTML, favicon, etc.) — `max-age=0,must-revalidate`

**GitHub secret required:** `AWS_DEPLOY_ROLE_ARN` (set after first manual deploy)

## First Deploy (Manual Bootstrap)

```bash
cd cdk
# Bootstrap BOTH regions (cross-region refs need bootstrap in both)
CDK_DEFAULT_ACCOUNT=<ACCOUNT_ID> pnpm cdk bootstrap aws://<ACCOUNT_ID>/eu-central-1
CDK_DEFAULT_ACCOUNT=<ACCOUNT_ID> pnpm cdk bootstrap aws://<ACCOUNT_ID>/us-east-1
# Deploy all stacks
CDK_DEFAULT_ACCOUNT=<ACCOUNT_ID> pnpm cdk deploy --all
# Copy DeployRoleArn output, then:
gh secret set AWS_DEPLOY_ROLE_ARN --body "<role-arn>"
```

## Verification

- [ ] `cdk synth` produces valid CloudFormation for both stacks
- [ ] `pnpm test` passes in `cdk/`
- [ ] After deploy: S3 bucket is NOT publicly accessible (direct S3 URL returns 403)
- [ ] CloudFront serves site over HTTPS at `<DOMAIN_NAME>`
- [ ] `/` serves `index.html`, `/arbeitsrecht` serves `arbeitsrecht.html`
- [ ] `/nonexistent` returns 404 page
- [ ] GitHub Actions workflow succeeds on push to main
- [ ] CloudFront invalidation completes after deploy
- [ ] DNS resolves `<DOMAIN_NAME>` to CloudFront

## Pitfalls

- **OIDC provider uniqueness**: only ONE per AWS account. If one already exists, must use `fromOpenIdConnectProviderArn()` instead — stack fails with `EntityAlreadyExistsException`
- **ACM cert must be in us-east-1** for CloudFront — hence the separate CertStack
- **Cross-region bootstrap**: must `cdk bootstrap` in BOTH `eu-central-1` and `us-east-1`
- **No `trailingSlash`**: Next.js generates `foo.html` not `foo/index.html` — CF function handles this
- **`next/image`**: already using `next-export-optimize-images`, no changes needed
- **S3 returns 403 for missing objects** (not 404) — error response mapping handles this
- **CloudFront invalidation cost**: first 1000 paths/month free, `/*` counts as 1 path
- **`autoDeleteObjects`** deploys a Lambda custom resource (negligible cost, only runs on stack deletion)
- **DNS propagation**: after first deploy, Route53 alias is instant but CloudFront distribution takes ~5-15min to deploy

## Optional Enhancements (Not in Scope)

- WAF for bot protection
- CloudFront response headers policy (security headers: CSP, HSTS, X-Frame-Options)
- Multi-environment (staging/production)
- Preview deploys for PRs
- S3 access logging
- www ↔ apex redirect (if needed)
