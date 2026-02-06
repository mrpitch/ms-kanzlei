# MS Kanzlei

MS Kanzlei is a static Next.js 16 website for a German law firm. Content is authored in MDX and exported as static HTML. The build pipeline also optimizes images for static hosting.

**Tech Stack**

- Next.js 16 (App Router) with static export
- React 19, TypeScript
- MDX via `next-mdx-remote`
- Tailwind CSS v4 + shadcn/ui
- AWS CDK for S3/CloudFront/Route53 deployment

**Project Structure**

- `content/` MDX pages. `home.mdx` renders `/` and other files render `/<slug>`.
- `src/app/` Next.js routes and layouts.
- `src/components/` UI components and MDX components.
- `src/lib/` MDX loading, utilities, styles, and theme variables.
- `public/` Static assets.
- `e2e/` Playwright end-to-end tests.
- `cdk/` AWS CDK app for infrastructure and deployment.
- `export-images.config.js` Image optimization settings for static export.

**Configuration**

- Node.js `>= 22` and pnpm `>= 10` are required. See `package.json`.
- AWS CDK config lives in `cdk/.env.cdk`. Start from `cdk/.env.cdk.example`.
- CDK env vars: `DOMAIN_NAME`, `HOSTED_ZONE_ID`, `AWS_REGION_CERT`, `AWS_REGION_MAIN`, `DEPLOY_ROLE_NAME`, `DEPLOY_REPO_REF` (see `cdk/.env.cdk.example` for the expected formats).
- The Next.js app itself does not require environment variables for local development.
- Theme selection is controlled by the import in `src/lib/styles/globals.css`.
- Current theme import is `variables-caffeine`.
- Path aliases are defined in `tsconfig.json`.

**Getting Started (App)**

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. Build static export: `pnpm build` (outputs to `out/`)
4. Serve the export locally: `pnpm start`

**Common Commands**

- `pnpm lint` Run ESLint
- `pnpm typecheck` Run TypeScript typecheck
- `pnpm test:e2e` Run Playwright tests
- `pnpm format` Run Prettier
- `pnpm nuke` Remove build artifacts and dependencies

**Content Authoring (MDX)**

- Each `content/*.mdx` file becomes a route.
- Frontmatter fields used in the UI: `title` (page title), `description` (page summary), `icon` (optional, maps to a Lucide icon name).
- `content/home.mdx` renders the home page `/`.
- Supported icons for `icon`: `Briefcase`, `AlertCircle`, `Building2`, `Home`.
- Example frontmatter:

```mdx
---
title: Arbeitsrecht
description: Beratung für Arbeitgeber und Arbeitnehmer.
icon: Briefcase
---

## Leistungen

- Beispielpunkt
```

- Example MDX with components (see `src/components/mdx-components.tsx` for available components):

```mdx
<HeroSection
	tagline="Rechtsanwaltskanzlei Mark Schilling"
	headline="Kompetente Rechtsberatung mit persönlichem Engagement"
	subline="Wir begleiten Sie durch alle rechtlichen Herausforderungen."
/>
```

**Themes and Styling**

- Tailwind CSS v4 is configured in `src/lib/styles/globals.css`.
- Theme variables live in `src/lib/styles/variables-*.css`.
- To switch themes, change the imported variables file in `src/lib/styles/globals.css`.

**Deployment (AWS CDK)**
The `cdk/` project provisions:

- S3 bucket for static hosting
- CloudFront distribution with URL rewriting for `.html`
- ACM certificate (in the cert region)
- Route53 DNS records
- GitHub Actions OIDC role for deployments and invalidations

Setup steps:

1. Copy `cdk/.env.cdk.example` to `cdk/.env.cdk` and fill in values.
2. From `cdk/`, install dependencies: `pnpm install`.
3. Bootstrap and deploy as needed with `pnpm cdk bootstrap` and `pnpm cdk deploy`.

Notes:

- The certificate is created in `AWS_REGION_CERT` and the main stack in `AWS_REGION_MAIN`.
- The GitHub deploy role is restricted to the `DEPLOY_REPO_REF` condition.
- The GitHub OIDC provider `token.actions.githubusercontent.com` must exist in the AWS account.

**Deployment Workflow (GitHub Actions)**

- Workflow: `/.github/workflows/deploy.yml`
- Triggers on `push` to `main` and manual `workflow_dispatch` with `deploy_mode` (`next`, `cdk`, or `full`).
- Detects changes and runs only the needed jobs.
- `deploy-cdk` assumes `AWS_DEPLOY_ROLE_ARN` and runs `pnpm cdk deploy --all`.
- `build-next` builds the static export and uploads the `out/` artifact.
- `resolve-infra-outputs` reads `BucketName` and `DistributionId` from the stack outputs.
- `publish-site` syncs assets to S3 with cache headers and invalidates CloudFront.
- `notify-failure` opens a GitHub issue if any deployment job fails.

**Required GitHub Settings**

- Repo secrets: `AWS_DEPLOY_ROLE_ARN`.
- Repo variables: `DOMAIN_NAME`, `HOSTED_ZONE_ID`, `AWS_REGION_CERT`, `AWS_REGION_MAIN`, `DEPLOY_ROLE_NAME`, `DEPLOY_REPO_REF`.

**Static Assets and Images**

- Image optimization runs after `next build` using `next-export-optimize-images`.
- Optimized images are written to `out/_optimized/`.
