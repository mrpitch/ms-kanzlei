---
name: How to add a new content page
description: Steps to create a new Rechtsgebiet or legal information page using MDX.
tags: [content, mdx, routing, pages]
kind: how-to
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# How to add a new content page

This guide walks you through adding a new page to the site. Pages are MDX files in `content/` and are served at `/<slug>`.

## Steps

### 1. Create the MDX file

Create `content/<slug>.mdx` where `<slug>` becomes the URL path.

```mdx
---
title: Erbrecht
description: Beratung bei Testament, Erbauseinandersetzung und Pflichtteil.
icon: BookOpen
---

## Leistungen

- Testamentserstellung und -prüfung
- Erbauseinandersetzung
- Pflichtteilsansprüche
```

Required frontmatter fields: `title`, `description`. Optional: `icon` (Lucide icon name — see step 2).

### 2. Add the icon (if using one)

If you set an `icon` in frontmatter, register it in the icon map in **both** of these files:

**`src/app/page.tsx`** (homepage cards):

```tsx
import {
	Briefcase,
	AlertCircle,
	Building2,
	Home as HomeIcon,
	BookOpen,
	LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
	Briefcase,
	AlertCircle,
	Building2,
	Home: HomeIcon,
	BookOpen, // add this
}
```

**`src/app/[slug]/page.tsx`** (detail page header):

```tsx
import {
	Briefcase,
	AlertCircle,
	Building2,
	Home as HomeIcon,
	BookOpen,
	LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
	Briefcase,
	AlertCircle,
	Building2,
	Home: HomeIcon,
	BookOpen, // add this
}
```

### 3. Verify the result

```bash
pnpm dev
```

- The homepage shows a new card for your page (unless the slug is `impressum` or `datenschutz` — those are filtered out of the Rechtsgebiete grid).
- Navigating to `http://localhost:3000/<slug>` renders your MDX content.

### 4. Run the checks

```bash
pnpm check
```

## Notes

- `home`, `impressum`, and `datenschutz` are special slugs. `home` renders the root `/`; the other two are excluded from the Rechtsgebiete cards.
- The `icon` value must exactly match a key in `iconMap`. An unregistered icon name silently renders no icon.
- `generateStaticParams()` in `src/app/[slug]/page.tsx` automatically picks up any new `.mdx` file — no extra registration needed.

## See also

- [MDX frontmatter reference](../reference/mdx-frontmatter.md)
- [How to add an icon](./how-to-add-an-icon.md)
- [About the content system](../explanation/about-content-system.md)
