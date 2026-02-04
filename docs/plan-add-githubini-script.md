# Plan: Refactor CDK Hardcoded Variables to Environment Config

## Overview

Move hardcoded AWS variables from CDK files to environment variables:

- **Local dev**: `.env.cdk` file
- **CI/CD**: GitHub repository variables

## Variables to Extract

| Variable | Current Location | Current Value |
|----------|-----------------|---------------|
| `DOMAIN_NAME` | cdk/bin/cdk.ts:8 | `mskanzlei.mrpitch.rocks` |
| `HOSTED_ZONE_ID` | cdk/bin/cdk.ts:9 | `Z101967436NINE8V1MY7N` |
| `AWS_REGION_CERT` | cdk/bin/cdk.ts:13 | `us-east-1` |
| `AWS_REGION_MAIN` | cdk/bin/cdk.ts:20 | `eu-central-1` |
| `GITHUB_DEPLOY_ROLE_NAME` | cdk/lib/cdk-stack.ts:110 | `ms-kanzlei-github-deploy` |
| `GITHUB_REPO_REF` | cdk/lib/cdk-stack.ts:117 | `repo:mrpitch/ms-kanzlei:ref:refs/heads/main` |

All are non-sensitive → GitHub **vars** (not secrets)

## Files to Change

### Create New Files

1. **`cdk/lib/config.ts`** — centralized config loader with validation
2. **`cdk/.env.cdk.example`** — template for local config
3. **`scripts/setup-github-vars.sh`** — script to set GitHub vars via `gh` CLI

### Modify Existing Files

4. **`cdk/package.json`** — add `dotenv` dependency
2. **`cdk/bin/cdk.ts`** — import config, remove hardcoded values
3. **`cdk/lib/cdk-stack.ts`** — extend props interface, use props for roleName/repoRef
4. **`.github/workflows/deploy.yml`** — inject GitHub vars into `deploy-cdk` job env

## Implementation Details

### 1. `cdk/lib/config.ts`

```typescript
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.cdk') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export const config = {
  domainName: requireEnv('DOMAIN_NAME'),
  hostedZoneId: requireEnv('HOSTED_ZONE_ID'),
  regionCert: requireEnv('AWS_REGION_CERT'),
  regionMain: requireEnv('AWS_REGION_MAIN'),
  githubDeployRoleName: requireEnv('GITHUB_DEPLOY_ROLE_NAME'),
  githubRepoRef: requireEnv('GITHUB_REPO_REF'),
};
```

### 2. `cdk/.env.cdk.example`

```bash
DOMAIN_NAME=your-domain.example.com
HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ
AWS_REGION_CERT=us-east-1
AWS_REGION_MAIN=eu-central-1
GITHUB_DEPLOY_ROLE_NAME=your-project-github-deploy
GITHUB_REPO_REF=repo:owner/repo:ref:refs/heads/main
```

### 3. `scripts/setup-github-vars.sh`

Non-interactive bash script using `gh variable set` to configure all 6 vars with project defaults. User edits script or `.env.cdk` manually if needed.

### 4. Update `cdk/bin/cdk.ts`

- Import `config` from `./lib/config`
- Use `config.domainName`, `config.hostedZoneId`, `config.regionCert`, `config.regionMain`
- Pass `githubDeployRoleName`, `githubRepoRef`, `regionCert`, `regionMain` as props to `MsKanzleiStack`

### 5. Update `cdk/lib/cdk-stack.ts`

- Add to `MsKanzleiStackProps`: `githubDeployRoleName: string`, `githubRepoRef: string`, `regionCert: string`, `regionMain: string`
- Line 110: `roleName: props.githubDeployRoleName`
- Line 117: use `props.githubRepoRef`
- Lines 141-142: use `props.regionCert` and `props.regionMain` for SSM paths

### 6. Update `.github/workflows/deploy.yml`

Add to `deploy-cdk` job:

```yaml
env:
  DOMAIN_NAME: ${{ vars.DOMAIN_NAME }}
  HOSTED_ZONE_ID: ${{ vars.HOSTED_ZONE_ID }}
  AWS_REGION_CERT: ${{ vars.AWS_REGION_CERT }}
  AWS_REGION_MAIN: ${{ vars.AWS_REGION_MAIN }}
  GITHUB_DEPLOY_ROLE_NAME: ${{ vars.GITHUB_DEPLOY_ROLE_NAME }}
  GITHUB_REPO_REF: ${{ vars.GITHUB_REPO_REF }}
```

Also update global `AWS_REGION` to use `${{ vars.AWS_REGION_MAIN }}`.

## Verification

1. Create `cdk/.env.cdk` from example, run `pnpm cdk synth` locally
2. Run `scripts/setup-github-vars.sh` to set GitHub vars
3. Push changes, verify workflow runs successfully
4. Check CloudFormation outputs match expected values

## Unresolved Questions

None — ready to implement.
