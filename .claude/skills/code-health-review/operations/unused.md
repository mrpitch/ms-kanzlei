# Unused Declarations Operation

**When**: User wants to find dead code — declarations that are exported but never imported, files that are never reached, or `export` keywords that are unnecessary.

## Tooling

Primary: **[knip](https://knip.dev/)**. Knip understands TypeScript, monorepos, barrel files, dynamic imports, and most common test/build setups, so it produces a much better candidate list than ad-hoc grep.

Knip setup:

- Install if not present: `pnpm add -D knip`.
- Run: `pnpm knip` (or `npx knip`) at the repo root.
- Config: `knip.json` at the repo root (create if absent).

Run:

```bash
pnpm knip                                       # whole monorepo (uses knip.json)
pnpm knip --workspace apps/frontend             # single workspace
pnpm knip --reporter json > /tmp/knip.json      # machine-readable for this operation
pnpm knip --include exports,types,duplicates    # narrow categories
```

Knip categories the operation acts on:

| Knip category                        | Mapped status (this operation)                           |
| ------------------------------------ | -------------------------------------------------------- |
| `exports`                            | candidate `UNUSED` / `INTERNAL-ONLY`                     |
| `types`                              | candidate `UNUSED` (type-only export)                    |
| `duplicates`                         | hand off to [duplicates.md](./duplicates.md)             |
| `files`                              | report only — do not annotate; suggest review            |
| `dependencies`, `devDependencies`    | report only — link to `security-dependency-update` skill |
| `unlisted`, `binaries`, `unresolved` | report only                                              |

## Execution

### Step 1 — Resolve scope

| Argument           | Scope                                                                            |
| ------------------ | -------------------------------------------------------------------------------- |
| `unused <file>`    | Run knip in the file's package; intersect findings with declarations in `<file>` |
| `unused <pkg-dir>` | Run knip in that package                                                         |
| `unused` (no arg)  | Ask the user; default to the package containing the most recently edited file    |

### Step 2 — Run knip

```bash
pnpm knip --workspace <pkg> --reporter json > /tmp/knip.json
```

Parse the JSON. Build a candidate list per file:

```ts
[{ file, name, kind, line, knipCategory }];
```

If the target was a single file, drop everything outside that file.

### Step 3 — Read each target file

For each file with candidates, read the full file. Capture the exact declaration kind (`const | function | class | enum | type | interface | default-export | re-export`) and line number.

### Step 4 — Parallel verification subagents

Knip is good but not perfect. For every candidate, launch a parallel `explore` subagent to verify there is no usage knip missed.

Each subagent receives:

> Search the entire codebase for any usage of `<name>` exported from `<file>`. Look for:
>
> - Direct imports: `import { <name> }`, `import <name>`, namespace imports (`import * as X` then `X.<name>`)
> - Dynamic imports: `import('<module>').then(m => m.<name>)`
> - Re-exports through barrels: `export { <name> } from`
> - String-based dynamic access: `obj['<name>']`, `require(...).['<name>']`
> - JSX usage, type-only imports, decorators
>
> Also check **within `<file>` itself** whether `<name>` is referenced by other declarations in the same file.
>
> Exclude the source file from external counts. Test/spec/story files count separately.
>
> Return JSON: `{ name, externalUsages: [{file,line}], internalUsages: [line], shadowedBy: null|"path" }`

### Step 5 — Single verifier subagent

Pass all results to one `general` verifier subagent that:

1. Confirms each "no usage" with alternative search patterns (aliased imports, barrel re-exports, `tsconfig.json` `paths`).
2. Flags **shadowing**: same name exported by another module that consumers actually import.
3. Distinguishes test-only from production usage.
4. Assigns each declaration a final status using the priority below (first match wins).

### Step 6 — Classification (priority order)

| #   | Status             | Meaning                                                                                         |
| --- | ------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | 🔁 `SHADOWED`      | Another module exports the same name and that other module is what consumers import             |
| 2   | ✅ `USED`          | At least one non-test production file outside the source file imports/references it             |
| 3   | ⚠️ `TEST-ONLY`     | Only test/spec/story files import it                                                            |
| 4   | 📦 `INTERNAL-ONLY` | Zero external references but referenced within the source file itself — `export` is unnecessary |
| 5   | ❌ `UNUSED`        | No references anywhere outside the declaration line itself                                      |

(Duplicates are handled by [duplicates.md](./duplicates.md), not here.)

### Step 7 — Apply annotations

**Never delete.** Only edit the source file to add comments above the declaration.

#### ❌ UNUSED

```ts
// TODO: is unused — verify before removing
export const myUnusedConstant = [...];
```

#### ⚠️ TEST-ONLY

```ts
// TODO: only used in tests — consider making internal or removing
export const myTestHelperConstant = [...];
```

#### 🔁 SHADOWED

```ts
/**
 * @deprecated Use `MyDeclaration` from `<canonical-module>` instead.
 * TODO: shadowed by canonical export. Verify before removing.
 */
export enum MyDeclaration { ... }
```

#### 📦 INTERNAL-ONLY

```ts
// TODO: export is unnecessary — only used internally in this file. Remove the `export` keyword.
export const myInternalHelper = [...];
```

Do **not** remove the `export` keyword yourself.

#### ✅ USED

No annotation. If a previous incorrect TODO exists, remove it.

### Step 8 — Output verification table

```markdown
## Unused Declaration Audit: `path/to/file.ts`

Tool: knip (workspace `<pkg>`), verified by 1 verifier + N parallel explore subagents.

| Declaration      | Kind     | Line | Status           | Knip flagged | Verified usages                                    | Action Taken                     |
| ---------------- | -------- | ---- | ---------------- | ------------ | -------------------------------------------------- | -------------------------------- |
| `ReportCategory` | enum     | 2    | 🔁 SHADOWED      | yes          | 0 here; canonical in `@bsi-portal/common/entities` | Added `@deprecated` JSDoc + TODO |
| `listOrders`     | const    | 26   | ❌ UNUSED        | yes          | 0                                                  | Added TODO comment               |
| `getCleanData`   | function | 98   | ✅ USED          | yes (FP)     | `IncidentReportModal.tsx:24`                       | No change (knip false positive)  |
| `helperUtil`     | function | 55   | 📦 INTERNAL-ONLY | yes          | 1 internal at line 88; 0 external                  | Added TODO to remove `export`    |
```

Status legend: see [SKILL.md](../SKILL.md#common-rules-apply-to-all-operations).

### Step 9 — Report unactionable knip findings

If knip reported `unused files` or `unused dependencies`, list them in a separate "For human review" section — do **not** annotate or modify those.

```markdown
## For human review (knip findings not auto-annotated)

- **Unused files** (verify before deleting):
  - `apps/frontend/src/legacy/oldFlow.ts`
- **Unused dependencies** (consider removing from `package.json`):
  - `lodash` in `apps/frontend`
```

## Edge cases

- **Barrel files** (`index.ts`): re-exports are almost always intentional. Stop and warn before annotating any re-export as unused.
- **Type-only exports** (`export type`): knip handles these; verifier should still check for `import type` usages.
- **Framework-consumed exports**: Next.js page/layout exports (`default`, `generateStaticParams`, `generateMetadata`) are consumed by the framework, not by direct imports. Never annotate these.
