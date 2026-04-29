# Scaffold Operation

**When**: User wants to create a Diataxis documentation structure for the repo root or for an `apps/*` / `libs/*` package.

## Purpose

Creates the standard four-quadrant directory structure with README templates that explain each type's purpose and BSI-specific conventions.

## Execution

### Step 1: Determine Target Location

Ask (or infer from arguments) whether scaffolding is for:

1. **Repo root** → `docs/`
2. **A specific package** → `apps/<pkg>/docs/` or `libs/<pkg>/docs/`

Then check what already exists:

```
Glob(pattern: "<target>/**/*.md")
```

Scenarios:

| State                                           | Action                                                                       |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| Target empty / does not exist                   | Create the full structure                                                    |
| Target has Diataxis subdirs already             | Stop and report; offer `audit` instead                                       |
| Target has flat docs (the current `docs/` case) | Run `audit` first, then propose moves; only scaffold the _missing_ quadrants |

For the BSI Portal repo root, the existing `docs/` already contains `concepts/`, `contracts/`, `security/`, `audit-reports/`, and several flat files. Default behavior is to **add the four Diataxis subdirectories alongside** existing folders, not delete them. Migration is left to `audit`.

### Step 2: Create Directory Structure

```bash
mkdir -p <target>/{tutorials,how-to,reference,explanation}
```

### Step 3: Create or Update Top-Level README

Write `<target>/README.md` (only if it does not already exist; otherwise propose an edit and ask):

```markdown
# Documentation

This directory uses the [Diataxis](https://diataxis.fr/) framework.

## Quick Links

| Type                        | Purpose                 | Start Here          |
| --------------------------- | ----------------------- | ------------------- |
| [Tutorials](tutorials/)     | Learn by doing          | New contributors    |
| [How-to Guides](how-to/)    | Solve a specific task   | Day-to-day work     |
| [Reference](reference/)     | Look up technical facts | API / config lookup |
| [Explanation](explanation/) | Understand the "why"    | Onboarding, design  |

## Finding What You Need

- **New to BSI Portal?** Start with [tutorials](tutorials/) and the root [`AGENTS.md`](../AGENTS.md).
- **Need to ship a change?** See [how-to guides](how-to/) and the OpenSpec workflow in `openspec/`.
- **Looking up an API, CDK construct, or config?** See [reference](reference/).
- **Want context on architecture or security choices?** See [explanation](explanation/).

## Other Documentation in This Repo

- `openspec/` — Change proposals and capability specs (managed by OpenSpec)
- `.github/instructions/` — Constitution, security, OpenSpec instruction files
- `apps/<pkg>/docs/`, `libs/<pkg>/docs/` — Package-scoped documentation
- `docs/audit-reports/` — Dated audit artifacts (not Diataxis)

## Contributing

When adding documentation, pick exactly one type. If a doc seems to need two,
split it. Every doc must start with the repo frontmatter contract (`name`,
`description`, `tags`, plus `kind`, `status`, `last_reviewed`) — agents use the
`docs-frontmatter` tool to discover and rank docs, so weak frontmatter makes
your doc harder to find. See [Diataxis framework](https://diataxis.fr/) for
guidance, or load the `diataxis` skill (`/skill diataxis`).
```

### Step 4: Create Section READMEs

Write each section README using the templates below. Adapt the wording to the package being scaffolded (root, frontend, backend, lib).

**`<target>/tutorials/README.md`:**

```markdown
# Tutorials

**Learning-oriented**, hands-on lessons that take a beginner from zero to first success.

## Guidelines (BSI Portal)

- Pick one concrete deliverable (e.g. "Add a new feature flag", "Wire a Lambda to an SQS queue").
- Use the project toolchain exactly as a real contributor would: `pnpm`, `vitest`, `cdk`, etc.
- Always provide commands the reader can copy-paste verbatim.
- Test the tutorial end-to-end on a clean clone before merging.
- Link to OpenSpec when the tutorial relates to creating a new capability.

## Structure

1. What you'll build / learn
2. Prerequisites (Node 22+, pnpm 10.27+, AWS access if needed)
3. Step-by-step actions with code blocks and expected output
4. What you've built (recap)
5. Next steps (link to how-to / reference / explanation)

## Avoid

- Offering choices ("you can use X or Y")
- Explaining concepts at length (link to `../explanation/`)
- Skipping verification steps
```

**`<target>/how-to/README.md`:**

```markdown
# How-to Guides

**Task-oriented** recipes for practitioners who already know what they want to do.

## Guidelines (BSI Portal)

- Title starts with "How to …" and names the task, not the feature.
- Assume the reader has run `pnpm local:init` and read root `AGENTS.md`.
- One problem per guide. Split if it grows.
- Always include a verification step (`pnpm test`, `pnpm build`, `pnpm cdk diff`, etc.).
- Add a Troubleshooting section for known failure modes.

## Examples of good how-to titles

- How to deploy the backend to `dev`
- How to add a new SQS interface contract
- How to rotate a SOPS-encrypted secret
- How to add a Storybook story for a component

## Avoid

- Concept explanations (link to `../explanation/`)
- API tables (those belong in `../reference/`)
- Multiple unrelated tasks in one guide
```

**`<target>/reference/README.md`:**

```markdown
# Reference

**Information-oriented** technical descriptions. Dry, accurate, comprehensive.

## Guidelines (BSI Portal)

- Structured around the code: one doc per CDK construct, Lambda handler group, React hook, Zustand slice, config file, or interface contract.
- Consistent format across siblings — copy the template, do not invent a new layout.
- TypeScript signatures in fenced code blocks.
- Tables for parameters, return values, errors, env vars.
- No instructions — link to `../how-to/` instead.

## Common reference docs to maintain

- API endpoints (`apps/backend` handlers grouped by route)
- CDK constructs (`services/cdk-*`, `libs/cdk-*`)
- Frontend hooks and stores (`apps/frontend/src/hooks`, `src/stores`)
- Config files (`.env*`, `cdk.json`, `vite.config.ts`)
- Interface contracts (`docs/contracts/if*.md` — generated, link from here)
- Pseudo error codes (link to the registry)
- Environment matrix (`local | dev | dev001 | lab | sit | venus | earth | prod`)

## Avoid

- Step-by-step instructions
- Background or rationale (that's `../explanation/`)
- Inconsistent formatting between sibling docs
```

**`<target>/explanation/README.md`:**

```markdown
# Explanation

**Understanding-oriented** discussion. Clarify the _why_ behind decisions.

## Guidelines (BSI Portal)

- Frame each doc with the question it answers ("Why DynamoDB single-table?", "Why Zustand over Redux?").
- Provide context: when the decision was made, what alternatives were rejected.
- Use diagrams (Mermaid) for architecture or data-flow topics.
- Cross-link OpenSpec change proposals when relevant.

## Topics that belong here

- Architecture overview (frontend SPA + backend Lambda + CDK)
- Domain model and bounded contexts
- Why specific libraries were chosen (Middy, TanStack Query, React Hook Form, Zod)
- Security model and threat assumptions (link to STRIDE reviews)
- Multi-environment strategy and SOPS approach
- Trade-offs documented during major refactors

## Avoid

- Step-by-step instructions (link to `../how-to/`)
- API parameter lists (`../reference/`)
- Pure rhetoric without concrete examples or code
```

### Step 5: Run Formatter

After writing files:

```bash
pnpm prettier --write <target>/README.md <target>/*/README.md
```

### Step 6: Report

Output a summary like:

```
Scaffolded Diataxis structure at: <target>/

Created:
  <target>/README.md
  <target>/tutorials/README.md
  <target>/how-to/README.md
  <target>/reference/README.md
  <target>/explanation/README.md

Pre-existing folders left in place: <list>

Next steps:
  1. Review and edit the section READMEs to fit this package's scope
  2. Run `diataxis audit <target>` to classify existing docs
  3. Move/rename existing docs into the new quadrants (audit will propose)
```

## Error Handling

| Condition                                  | Response                                               |
| ------------------------------------------ | ------------------------------------------------------ |
| Target already has Diataxis subdirs        | Stop, suggest `diataxis audit <target>` instead        |
| `<target>/README.md` already exists        | Do not overwrite — show diff and ask whether to update |
| Target is inside `openspec/` or `.github/` | Refuse — these are not Diataxis territory              |
| Not in a git repo                          | Warn but continue                                      |
