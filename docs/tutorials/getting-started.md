---
name: Getting started with MS Kanzlei
description: A step-by-step guide for first-time contributors to run the site locally and make their first content change.
tags: [getting-started, setup, local-dev, mdx, content]
kind: tutorial
status: current
last_reviewed: 2026-04-29
authoritative: true
---

# Getting started with MS Kanzlei

By the end of this tutorial you will have the site running locally and have made a visible change to a content page.

**Prerequisites**

- Node.js 22 or later
- pnpm 10 or later (`npm install -g pnpm`)
- Git

---

## 1. Clone the repository

```bash
git clone https://github.com/mrpitch/ms-kanzlei.git
cd ms-kanzlei
```

## 2. Install dependencies

```bash
pnpm install
```

## 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the MS Kanzlei homepage with the hero section and Rechtsgebiete cards.

## 4. Edit a content page

Open `content/arbeitsrecht.mdx` in your editor. Change the description line in the frontmatter:

```mdx
---
title: Arbeitsrecht
description: Beratung für Arbeitgeber und Arbeitnehmer.
icon: Briefcase
---
```

Save the file. The browser will hot-reload and the card on the homepage will reflect the new description within a second.

## 5. Build the static export

```bash
pnpm build
```

This creates the `out/` directory. Serve it locally with:

```bash
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) and confirm the built site matches what you saw in dev mode.

## 6. Run the checks

```bash
pnpm check
```

ESLint and TypeScript type-check must both pass before opening a pull request.

---

**You're done.** You've set up the project, edited content, and verified the build. Next steps:

- [How to add a new page](../how-to/how-to-add-a-page.md)
- [MDX frontmatter reference](../reference/mdx-frontmatter.md)
- [About the content system](../explanation/about-content-system.md)
