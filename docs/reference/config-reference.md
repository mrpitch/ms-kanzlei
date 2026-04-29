---
name: Site configuration reference
description: All fields in src/lib/config.json and how they are used by components.
tags: [config, reference, site-data, nav, contact, cookie]
kind: reference
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# Site configuration reference

`src/lib/config.json` is the single source of truth for site-wide content that does not belong in MDX pages. It is typed by `src/lib/types.ts` and imported directly by components.

## Top-level fields

### `title`

**Type:** `string`

The site title. Used in browser tab labels and the logo/header.

---

### `description`

**Type:** `string`

The site-wide meta description used as a fallback when a page does not provide its own.

---

### `navItems`

**Type:** `Array<{ href: string; label: string }>`

Primary navigation links shown in the header. Order determines display order.

```json
"navItems": [
  { "href": "/arbeitsrecht", "label": "Arbeitsrecht" }
]
```

---

### `legalNavItems`

**Type:** `Array<{ href: string; label: string }>`

Navigation links shown in the footer (legal pages such as Impressum).

```json
"legalNavItems": [
  { "href": "/impressum", "label": "Impressum" }
]
```

---

### `contact`

**Type:** `object`

Contact details rendered in the footer and contact popover.

| Field    | Type     | Description                                       |
| -------- | -------- | ------------------------------------------------- |
| `phone`  | `string` | Phone number (E.164 format, e.g. `+491234567890`) |
| `email`  | `string` | Contact email address                             |
| `street` | `string` | Street address                                    |
| `zip`    | `string` | Postal code                                       |
| `city`   | `string` | City (and district if relevant)                   |

---

### `testimonials`

**Type:** `Array<Testimonial>`

List of testimonials rendered by `<Testimonial>` component.

| Field        | Type     | Description                        |
| ------------ | -------- | ---------------------------------- |
| `name`       | `string` | Person's full name                 |
| `title`      | `string` | Job title                          |
| `company`    | `string` | Company name                       |
| `companyUrl` | `string` | URL for the company link           |
| `text`       | `string` | Quote text                         |
| `image`      | `string` | Path to profile image in `public/` |

---

### `cookie`

**Type:** `object`

Settings for the cookie consent banner rendered by `<CookieConsent>`.

| Field                | Type                          | Description                                    |
| -------------------- | ----------------------------- | ---------------------------------------------- |
| `title`              | `string`                      | Banner heading                                 |
| `description`        | `string`                      | Explanatory text                               |
| `consentDescription` | `string`                      | Text shown when prompting for explicit consent |
| `acceptLabel`        | `string`                      | Label for the accept button                    |
| `declineLabel`       | `string`                      | Label for the decline/necessary-only button    |
| `learnMoreLabel`     | `string`                      | Label for the learn-more link                  |
| `learnMoreHref`      | `string`                      | Path for the learn-more link                   |
| `cookieName`         | `string`                      | Name of the consent cookie                     |
| `acceptValue`        | `string`                      | Cookie value when user accepts                 |
| `declineValue`       | `string`                      | Cookie value when user declines                |
| `maxAgeDays`         | `number`                      | Cookie expiry in days                          |
| `path`               | `string`                      | Cookie path (typically `/`)                    |
| `sameSite`           | `"Lax" \| "Strict" \| "None"` | SameSite cookie attribute                      |
| `secure`             | `boolean`                     | Whether the cookie requires HTTPS              |

## See also

- `src/lib/types.ts` — TypeScript type definitions
- [MDX frontmatter reference](./mdx-frontmatter.md) — content that lives in MDX files instead of config
