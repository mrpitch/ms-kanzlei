---
name: MDX frontmatter reference
description: All frontmatter fields recognized in content/*.mdx files and their effect on the UI.
tags: [mdx, frontmatter, content, reference]
kind: reference
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# MDX frontmatter reference

Every file in `content/` is an MDX file processed by `src/lib/mdx.ts` using `gray-matter`. The frontmatter fields below are recognized by the application.

## Fields

### `title` (required)

**Type:** `string`

The page title. Used in:

- `<title>` and `<meta name="description">` via `generateMetadata()`
- The `<CardTitle>` on the homepage Rechtsgebiete grid
- The `<h1>` header on detail pages (`/[slug]`)

```mdx
---
title: Arbeitsrecht
---
```

---

### `description` (required)

**Type:** `string`

A short summary of the page. Used in:

- `<meta name="description">` for SEO
- The card body text on the homepage Rechtsgebiete grid

```mdx
---
description: Beratung für Arbeitgeber und Arbeitnehmer.
---
```

---

### `icon` (optional)

**Type:** `string` — a PascalCase Lucide icon name

An icon displayed on the homepage card and on the detail page header. The value must be registered in `iconMap` in both `src/app/page.tsx` and `src/app/[slug]/page.tsx`.

Currently registered values:

| Value         | Lucide icon  |
| ------------- | ------------ |
| `Briefcase`   | Briefcase    |
| `AlertCircle` | Alert Circle |
| `Building2`   | Building 2   |
| `Home`        | Home         |

An unregistered value silently renders no icon.

```mdx
---
icon: Briefcase
---
```

See [How to add an icon](../how-to/how-to-add-an-icon.md) to register additional icons.

---

### `date` (optional)

**Type:** `string` (ISO 8601)

Not rendered in the current UI but included in `MDXMetadata` for future use.

---

## Special slugs

The filename (without `.mdx`) becomes the URL slug with special handling:

| Filename          | URL            | Notes                                                                  |
| ----------------- | -------------- | ---------------------------------------------------------------------- |
| `home.mdx`        | `/`            | Rendered by `src/app/page.tsx`; excluded from `generateStaticParams()` |
| `impressum.mdx`   | `/impressum`   | Legal page; excluded from Rechtsgebiete cards                          |
| `datenschutz.mdx` | `/datenschutz` | Privacy page; excluded from Rechtsgebiete cards                        |
| Everything else   | `/<slug>`      | Appears as a card on the homepage and as a detail page                 |

## See also

- [How to add a page](../how-to/how-to-add-a-page.md)
- [How to add an icon](../how-to/how-to-add-an-icon.md)
- [About the content system](../explanation/about-content-system.md)
