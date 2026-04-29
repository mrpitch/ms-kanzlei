---
name: About the site architecture
description: Explains why the site uses Next.js static export with AWS S3/CloudFront instead of a server-rendered or managed-hosting approach.
tags: [architecture, aws, nextjs, static-export, cloudfront, s3, explanation]
kind: explanation
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# About the site architecture

## Overview

MS Kanzlei is a static website: Next.js builds every page to plain HTML at build time and the resulting files are served from S3 via CloudFront. There is no server process running at runtime.

```
Content authors (MDX) ──► Next.js build ──► out/ (HTML/CSS/JS)
                                                │
                                          GitHub Actions
                                                │
                                         S3 sync + CF invalidation
                                                │
                                         CloudFront (CDN)
                                                │
                                          Visitors (HTTPS)
```

## Why static export

A law firm website is content-driven and changes infrequently. Static export is the right choice because:

- **No server to operate.** There is no Node.js process to keep running, update, or monitor. The site simply serves files.
- **Cost.** S3 + CloudFront at this traffic level costs cents per month. A managed Next.js host (Vercel, Render) would add ongoing service cost without a meaningful benefit for a static site.
- **Performance.** Every page is pre-rendered HTML delivered from the nearest CloudFront edge location — no cold starts, no SSR latency.
- **Security posture.** No server means a dramatically reduced attack surface. The S3 bucket is fully private; only CloudFront (via OAC) can read it.

## Infrastructure layers

### ACM certificate (`us-east-1`)

CloudFront requires TLS certificates to be issued in `us-east-1` regardless of where the distribution is hosted. A separate CDK stack (`MsKanzleiCertStack`) creates the certificate in that region and exports the ARN for cross-region reference.

### S3 bucket (`eu-central-1`)

Stores the static export. Configured with:

- Public access fully blocked
- HTTPS-only bucket policy
- Origin Access Control (OAC) so only CloudFront can fetch objects

### CloudFront distribution (`eu-central-1`)

Serves the site globally. Key configuration decisions:

- **PriceClass_100** (North America + Europe only) — matches the law firm's audience and is the cheapest option.
- **URL rewriting via CloudFront Function** — Next.js static export generates `foo.html`, not `foo/index.html`. A viewer-request function rewrites `/foo` → `/foo.html` and `/` → `/index.html` at the edge, with no additional latency.
- **Error mapping** — S3 returns HTTP 403 for missing objects (not 404, because of private bucket policy). CloudFront maps both 403 and 404 responses to the `/404.html` error page.
- **Cache headers differentiated by path:**
  - `_next/static/*` and `_optimized/*` — `max-age=31536000,immutable` (content-addressed by Next.js, safe to cache forever)
  - All other files (HTML, favicon, sitemap) — `max-age=0,must-revalidate` (fetched fresh on every visit)

### Route53

An A and AAAA alias record in the existing hosted zone points the custom domain to the CloudFront distribution. Alias records have no per-query cost and respond instantly.

### GitHub OIDC role

GitHub Actions authenticates to AWS using OIDC — no long-lived access keys are stored in GitHub secrets. The CDK stack creates a trust policy scoped to a specific repository ref (`repo:mrpitch/ms-kanzlei:ref:refs/heads/main`), so only pushes to `main` can assume the deploy role.

## Styling architecture

The styling system has three layers:

1. **Tailwind CSS v4** — utility classes, applied via `@import 'tailwindcss'` in `globals.css`
2. **Theme variables** (`variables-*.css`) — CSS custom properties for color, radius, and font tokens
3. **Theme application** (`theme.css`) — maps the custom properties into Tailwind's design system

Swapping the imported `variables-*.css` file changes the entire visual theme without touching component code.

## Content rendering pipeline

MDX files flow through:

1. `gray-matter` parses frontmatter and splits it from the body
2. `next-mdx-remote/rsc` compiles the MDX body to a React Server Component
3. `CustomMDX` in `mdx-components.tsx` registers custom components (`HeroSection`, `CustomLink`) that MDX authors can use

## See also

- [About the content system](./about-content-system.md)
- [How to deploy to AWS](../how-to/how-to-deploy-to-aws.md)
- [Environment variables reference](../reference/environment-variables.md)
