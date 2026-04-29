# Duplicate Code Operation

**When**: User wants to find duplicated code — copy-pasted blocks, structurally equivalent helpers, or the same constant/type defined in multiple places.

## Tooling

Primary: **[jscpd](https://github.com/kucherenko/jscpd)** — already wired in this repo.

- Install if not present: `pnpm add -D jscpd`.
- Run: `pnpm dlx jscpd` at the repo root, or add a `jscpd` script to `package.json`.
- Config: `.jscpd.json` at the repo root (create if absent) — threshold 8, reporters `html,console`, ignores `node_modules`, `.next`, `out`, `cdk/cdk.out`.
- Output: HTML report under `report/`, console summary stdout.

> ⚠️ `pnpm jscpd` is wrapped in `|| true` and **always exits 0** — read the output, do not trust the exit code.

jscpd finds **textual** clones (token-based). Structural duplicates with different names but equivalent shape are caught by the verifier subagent in Step 4.

## Execution

### Step 1 — Resolve scope

| Argument               | Scope                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `duplicates` (no arg)  | Whole repo (jscpd default pattern)                                                    |
| `duplicates <pkg-dir>` | Pass `--pattern '<pkg-dir>/**/*'` to jscpd                                            |
| `duplicates <file>`    | Run repo-wide jscpd, then filter clones whose `firstFile` or `secondFile` is `<file>` |

### Step 2 — Run jscpd

Repo-wide:

```bash
pnpm jscpd
```

Scoped:

```bash
pnpm dlx jscpd --pattern '<pkg-dir>/**/*' --reporters json,console --output /tmp/jscpd-report
```

Always run with `--reporters json,console` (or add `json` to `.jscpd.json` temporarily) so the operation can parse `report/jscpd-report.json`. Each clone entry has:

```jsonc
{
  "format": "typescript",
  "lines": 12,
  "tokens": 80,
  "duplicationA": { "sourceId": "apps/frontend/.../utils.ts", "start": { "line": 70 }, "end": { "line": 82 } },
  "duplicationB": { "sourceId": "libs/common/.../helpers.ts", "start": { "line": 14 }, "end": { "line": 26 } },
}
```

### Step 3 — Parse and shortlist

Build candidates:

```ts
[{ fileA, linesA: [start, end], fileB, linesB: [start, end], tokens, lines }];
```

Filter:

- Drop clones where both sides are inside the same file (jscpd reports intra-file repetition; not actionable as "duplicate declaration").
- Drop clones where one side is a generated file, mock, or test (already in `.jscpd.json` ignore list, but double-check).
- Sort by `tokens` descending — biggest clones first.

### Step 4 — Verification subagents (structural equivalence + canonical-source pick)

For each candidate clone, launch a parallel `explore` subagent:

> Two code blocks were flagged as a clone by jscpd:
>
> - File A: `<fileA>` lines `<a1>-<a2>`
> - File B: `<fileB>` lines `<b1>-<b2>`
>
> Do these tasks:
>
> 1. Read both blocks and confirm they are functionally equivalent (same parameters, same return, same side effects). Account for renamed identifiers and reordered statements.
> 2. Classify the relationship as `identical | structurally-equivalent | partial | false-positive`.
> 3. Pick the **canonical source** — prefer files in shared/utility locations, in this priority order: `src/lib/*` > `src/components/*` > `src/app/*`. If both sides are in the same tier, prefer the one with the more general name and more callers.
> 4. List both declaration names if applicable: `{ "nameA": "...", "nameB": "..." }`.
>
> Return JSON: `{ relationship, canonical: "A"|"B", confidence: HIGH|MEDIUM|LOW, nameA, nameB, note }`.

Then a single `general` verifier subagent consolidates results, dedupes overlapping clones (block X duplicated in 3 files), and decides which side(s) get annotated:

- The **non-canonical** side(s) get annotated as `♻️ DUPLICATE`.
- The canonical side gets no annotation.
- Confidence `LOW` → flag in the report but do NOT annotate; require human review.

### Step 5 — Apply annotations

Edit only the **non-canonical** declaration (or the file containing the duplicated block, immediately above the relevant declaration if one is identifiable).

#### ♻️ DUPLICATE — same name, different file

```ts
/**
 * @deprecated Duplicate of `myHelper` in `libs/common/src/utils/helpers.ts`.
 * TODO: consolidate with the canonical declaration. Verify before removing.
 */
export const myHelper = (data: Record<string, unknown>) => { ... };
```

#### ♻️ DUPLICATE — different name, equivalent shape

```ts
/**
 * @deprecated Equivalent to `cleanData` in `libs/common/src/utils/helpers.ts` (structurally identical).
 * TODO: consider replacing with the shared utility. Verify before removing.
 */
export const getCleanData = (data: Record<string, unknown>) => { ... };
```

#### ♻️ DUPLICATE — block-level (no clean declaration boundary)

When the clone spans part of a function body or is otherwise not a whole declaration, leave a single TODO above the block start line:

```ts
// TODO: lines 70-82 are duplicated from libs/common/src/utils/helpers.ts:14-26. Extract a shared helper.
```

**Never delete** the duplicated code.

### Step 6 — Output verification table

```markdown
## Duplicate Code Audit

Tool: jscpd (config `.jscpd.json`), verified by N parallel explore subagents.

| Clone | Lines | Tokens | A (canonical)                                        | B (annotated)                                                       | Relationship            | Confidence | Action Taken                    |
| ----- | ----- | ------ | ---------------------------------------------------- | ------------------------------------------------------------------- | ----------------------- | ---------- | ------------------------------- |
| 1     | 13    | 84     | `libs/common/src/utils/helpers.ts:14-26 (cleanData)` | `apps/frontend/src/utils/incidents/utils.ts:70-82 (sanitizeInput)`  | structurally-equivalent | HIGH       | Added `@deprecated` + TODO on B |
| 2     | 9     | 52     | `libs/common/src/types/report.ts:5-13 (Report)`      | `apps/backend/src/handlers/report.ts:20-28 (Report)`                | identical               | HIGH       | Added `@deprecated` + TODO on B |
| 3     | 11    | 60     | n/a (block-level)                                    | `apps/frontend/src/foo.ts:40-50` ↔ `apps/frontend/src/bar.ts:30-40` | partial                 | LOW        | Reported only — human review    |
```

Status legend: see [SKILL.md](../SKILL.md#common-rules-apply-to-all-operations).

### Step 7 — Recommend follow-up

After the table, list extraction targets:

```markdown
## Suggested extractions

- Move `cleanData` (canonical) and remove `sanitizeInput` after consumers migrate.
- Promote `Report` type to `libs/common/src/types/report.ts`; have backend re-export it.
```

## Edge cases

- **Test-only duplication**: `.jscpd.json` already ignores `*.test.ts`. If clones are reported in tests anyway, skip — duplication in tests is often intentional (clarity over DRY).
- **Generated code**: ignored via `.jscpd.json` `generated/`, `cdk.out/`, `dist/`. If a new generator appears, propose adding its output dir to the ignore list rather than annotating.
- **Snapshot/fixture data**: large constant blocks (e.g. JSON fixtures) often trigger false positives. Verifier should classify as `false-positive` and skip annotation.
- **Cross-area duplication**: canonical home is usually `src/lib/`. Annotate both sides if neither is canonical and recommend moving to a shared utility.
