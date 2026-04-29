# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MS Kanzlei is a German law firm website built with Next.js 16, using static export for deployment. Content is managed through MDX files.

## Common Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production (includes image optimization + sitemap)
pnpm start        # Serve the static export from ./out
pnpm check        # Run ESLint + TypeScript type-check together
pnpm lint         # Run ESLint only
pnpm typecheck    # Run tsc --noEmit only
pnpm format       # Format code with Prettier
pnpm test:e2e     # Run Playwright e2e tests (webServer builds + serves app)
pnpm test:e2e:ui  # Run Playwright e2e tests in UI mode for debugging
pnpm nuke         # Remove node_modules, lock file, .next, and out directories
```

## Architecture

Next.js 16, TypeScript, shadcn/ui, Tailwind CSS v4, React 19.

### Site Configuration

All site-wide data lives in `src/lib/config.json` (typed via `src/lib/types.ts`): nav items, contact info, testimonials, and cookie consent settings. Components import this directly — it is the single source of truth for content that doesn't belong in MDX.

### Content System

- MDX files in `/content/` define pages (`home.mdx`, `arbeitsrecht.mdx`, etc.)
- `src/lib/mdx.ts` reads files with gray-matter; exposes `getPosts()`, `getPostBySlug(slug)`
- `src/components/mdx-components.tsx` provides `CustomMDX` wrapper (next-mdx-remote/rsc); registers `HeroSection` as a usable MDX component
- MDX frontmatter fields: `title`, `description`, `icon` (Lucide icon name, e.g. `Briefcase`)

### Routing

- `/` renders `content/home.mdx` (special-cased in `src/app/page.tsx`)
- `/[slug]` renders matching `content/*.mdx` via `src/app/[slug]/page.tsx`
- `home` slug is excluded from `generateStaticParams()`; pages `impressum` and `datenschutz` are excluded from the Rechtsgebiete cards on the home page
- Static export generates all pages at build time

### Icon Mapping

Both `src/app/page.tsx` and `src/app/[slug]/page.tsx` maintain a local `iconMap` mapping frontmatter `icon` strings to Lucide components. When adding a new icon, update the map in both files.

### Styling

- Tailwind CSS v4 with custom CSS variables
- `src/lib/styles/globals.css` — entry point; imports the theme and Tailwind
- `src/lib/styles/variables-ms-kanzlei.css` — project theme (color tokens, radius, etc.)
- `src/lib/styles/theme.css` — applies variables to Tailwind's design system
- `src/lib/styles/fonts/` — font definitions referenced in `layout.tsx`
- `cn()` utility in `src/lib/utils/cn.ts` for class merging
- Icons: use `lucide-react`

### Image Optimization

- Uses `next-export-optimize-images` — converts PNG/JPG to WebP at build time
- Config in `export-images.config.js`; optimized images output to `_optimized/`
- Images live in `public/images/`

### Path Aliases

```
@/*              → ./src/*
@/components/*   → ./src/components/*
@/lib/*          → ./src/lib/*
@/img/*          → ./public/images/*
```

### Infrastructure (CDK)

AWS deployment infrastructure lives in `cdk/` with its own `CLAUDE.md`. Two stacks: ACM cert in `us-east-1`, main stack (S3 + CloudFront + Route53) in `eu-central-1`. GitHub Actions deploys via OIDC (no long-lived AWS keys).

## Key Files

- `next.config.ts` — static export config with image optimization
- `src/app/layout.tsx` — root layout: Header, main, Footer, CookieConsent, ThemeProvider
- `src/lib/config.json` — site data (nav, contact, cookie settings)
- `src/lib/mdx.ts` — MDX file reading utilities
- `src/components/mdx-components.tsx` — MDX component registry
