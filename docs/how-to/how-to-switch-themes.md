---
name: How to switch the visual theme
description: Change the active color/font theme by swapping the imported variables file in globals.css.
tags: [theme, styling, tailwind, css-variables]
kind: how-to
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# How to switch the visual theme

The site's visual theme is a single CSS variables file imported at the top of `src/lib/styles/globals.css`. Swapping that import changes the entire color palette and typography.

## Available themes

| File                         | Theme name           |
| ---------------------------- | -------------------- |
| `variables-ms-kanzlei.css`   | MS Kanzlei (current) |
| `variables-caffeine.css`     | Caffeine             |
| `variables-amethysthaze.css` | Amethyst Haze        |
| `variables-bubblegum.css`    | Bubblegum            |
| `variables-candyland.css`    | Candyland            |
| `variables-gingerhero.css`   | Ginger Hero          |
| `variables-nature.css`       | Nature               |
| `variables-sageandsand.css`  | Sage and Sand        |
| `variables-vintagepaper.css` | Vintage Paper        |

## Steps

### 1. Open `src/lib/styles/globals.css`

Find the theme import near the top:

```css
@import './variables-ms-kanzlei.css';
```

### 2. Replace it with the desired theme file

```css
@import './variables-nature.css';
```

### 3. Verify

```bash
pnpm dev
```

Open the browser — colors, fonts, and radius values should update immediately.

## Notes

- Font definitions live in `src/lib/styles/fonts/`. Each theme file references a matching font config; switching themes automatically pulls in the correct font.
- To create a new theme, copy an existing `variables-*.css` file, adjust the CSS custom properties, and import it.
- Only one theme import should be active at a time.

## See also

- [About architecture](../explanation/about-architecture.md) — where theming fits in the styling layer
