# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MS Kanzlei is a German law firm website built with Next.js 16, using static export for deployment. Content is managed through MDX files.

## Common Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production (includes image optimization)
pnpm start        # Serve the static export from ./out
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm nuke         # Remove node_modules, lock file, .next, and out directories
```

## Architecture

- next.js 16, typescript, shadcn, tailwindcss 4

### Content System

- MDX files in `/content/` define pages (home.mdx, ueber-uns.mdx, etc.)
- `src/lib/mdx.ts` reads and parses MDX files with gray-matter frontmatter
- `src/components/mdx-components.tsx` provides custom MDX rendering with next-mdx-remote
- Dynamic routes via `src/app/[slug]/page.tsx` with `generateStaticParams()`

### Routing

- `/` renders content/home.mdx
- `/[slug]` renders matching content/*.mdx file (excluding home)
- Static export generates all pages at build time

### Styling

- Tailwind CSS v4 with custom theme variables
- Theme files in `src/lib/styles/` (variables-*.css for different themes)
- Currently using "gingerhero" theme (imported in globals.css)
- To switch themes, change the import in `globals.css` (available: amethysthaze, bubblegum, candyland, gingerhero, nature, sageandsand, vintagepaper)
- `cn()` utility in `src/lib/utils.ts` for class merging
- Icons: use `lucide-react` for icons

### Image Optimization

- Uses `next-export-optimize-images` for static image optimization
- Config in `export-images.config.js` - converts PNG/JPG to WebP
- Optimized images output to `_optimized/` directory

### Path Aliases

```
@/*           → ./src/*
@/components/* → ./src/components/*
@/lib/*       → ./src/lib/*
@/img/*       → ./public/img/*
```

## Key Files

- `next.config.ts` - Static export config with image optimization
- `src/app/layout.tsx` - Root layout with Nav and Footer
- `src/lib/mdx.ts` - MDX file reading utilities
