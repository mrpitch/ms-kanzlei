---
name: About the content system
description: Explains how MDX files in content/ become pages, what the rendering pipeline looks like, and why this design was chosen.
tags: [content, mdx, routing, rendering, explanation]
kind: explanation
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# About the content system

## How content becomes pages

Each `.mdx` file in `content/` maps to exactly one route on the site:

| File                       | URL             |
| -------------------------- | --------------- |
| `content/home.mdx`         | `/`             |
| `content/arbeitsrecht.mdx` | `/arbeitsrecht` |
| `content/<slug>.mdx`       | `/<slug>`       |

The mapping is mechanical — the filename (without `.mdx`) is the slug, and the slug is the URL path. No routing table needs to be updated when a file is added.

## The rendering pipeline

```
content/<slug>.mdx
        │
        ▼
 gray-matter           ← splits frontmatter (title, description, icon)
        │                from the MDX body
        ▼
 next-mdx-remote/rsc  ← compiles MDX to a React Server Component
        │
        ▼
 CustomMDX wrapper     ← injects custom components: HeroSection, CustomLink
        │
        ▼
 Next.js page          ← wraps output in layout (Header, Footer, etc.)
```

`src/lib/mdx.ts` handles the file I/O:

- `getPosts()` — reads all `.mdx` files, returns metadata + slug
- `getPostBySlug(slug)` — returns one file's metadata and body

These functions run at build time (React Server Components). There is no runtime file access.

## Two rendering contexts

### Homepage (`/`)

`src/app/page.tsx` is special-cased:

1. Renders `content/home.mdx` via `CustomMDX` (the hero section lives here)
2. Calls `getPosts()` and renders a card grid for every slug that is not `home`, `impressum`, or `datenschutz`

### Detail pages (`/[slug]`)

`src/app/[slug]/page.tsx` handles every other route:

1. `generateStaticParams()` returns all slugs except `home`
2. The page reads the matching MDX file and renders its content with a consistent header (icon + title + description)

## Custom MDX components

MDX authors can use standard HTML elements plus two custom components registered in `src/components/mdx-components.tsx`:

| Component        | Usage                                                  | Notes                                                                                               |
| ---------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `HeroSection`    | `<HeroSection tagline="…" headline="…" subline="…" />` | Full-width hero used in `home.mdx`                                                                  |
| `a` (overridden) | Standard markdown links                                | Internal links use Next.js `<Link>`, external links get `target="_blank" rel="noopener noreferrer"` |

## Frontmatter and the icon system

Frontmatter drives two UI elements: the page card on the homepage and the page header on detail pages. The `icon` field bridges content and code — a string in the MDX file maps to a React component via `iconMap` in both route files.

This design keeps icon choices visible to content authors (they're in the MDX file) while keeping the actual icon components in TypeScript where tree-shaking and type safety apply.

## Why MDX

The site content is mostly prose with occasional structured elements (lists, headings). MDX gives authors:

- Standard Markdown syntax for prose
- The ability to embed React components (like `HeroSection`) for richer sections
- Frontmatter for metadata without any CMS dependency

The trade-off is that adding a new custom component requires a code change to register it in `mdx-components.tsx`. For a small, stable component set (currently just `HeroSection`), this is acceptable.

## See also

- [MDX frontmatter reference](../reference/mdx-frontmatter.md)
- [How to add a page](../how-to/how-to-add-a-page.md)
- [About architecture](./about-architecture.md)
