---
name: How to add a Lucide icon to the icon map
description: Register a new Lucide icon so it can be used in MDX frontmatter.
tags: [icons, lucide, mdx, frontmatter]
kind: how-to
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# How to add a Lucide icon to the icon map

MDX frontmatter can specify an `icon` field. The value must be registered in `iconMap` in two files or the icon will silently not render.

## Steps

### 1. Find the icon name on lucide.dev

Go to [lucide.dev/icons](https://lucide.dev/icons) and pick an icon. Note the **PascalCase** export name (e.g. `BookOpen`, `Scale`, `Gavel`).

### 2. Add the import and map entry in `src/app/page.tsx`

```tsx
// src/app/page.tsx
import {
	Briefcase,
	AlertCircle,
	Building2,
	Home as HomeIcon,
	Scale,
	LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
	Briefcase,
	AlertCircle,
	Building2,
	Home: HomeIcon,
	Scale, // new
}
```

### 3. Repeat in `src/app/[slug]/page.tsx`

```tsx
// src/app/[slug]/page.tsx
import {
	Briefcase,
	AlertCircle,
	Building2,
	Home as HomeIcon,
	Scale,
	LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
	Briefcase,
	AlertCircle,
	Building2,
	Home: HomeIcon,
	Scale, // new
}
```

### 4. Use it in MDX frontmatter

```mdx
---
title: Vertragsrecht
description: Prüfung und Gestaltung von Verträgen.
icon: Scale
---
```

### 5. Verify

```bash
pnpm dev
```

Check the homepage card and the detail page header — the icon should appear in both places.

## Notes

- The map key must match the frontmatter `icon` value exactly (case-sensitive).
- `Home` is the only icon that requires an alias (`Home as HomeIcon`) because `Home` conflicts with Next.js routing conventions. All other icons can be imported and mapped under their native name.
- `lucide-react` is already a dependency — no installation needed.
