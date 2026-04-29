---
name: code-health-review
description: 'Code-health audits for the codebase. Three operations: (1) all — run both unused and duplicates in sequence, (2) unused — find dead code via knip + parallel subagent verification, (3) duplicates — find duplicated code via jscpd + structural verification. Annotates findings in-place (TODO comments, @deprecated JSDoc) without deleting code. Use when asked to: find dead code, check unused exports, audit unused declarations, find duplicate code, clean up a file, or run a code-health check.'
argument-hint: '[all|unused|duplicates] [path]'
---

# Code Health Audit

## Overview

This skill audits source files (or whole packages) for two health problems and annotates the findings without deleting anything:

| Operation    | Problem                    | Primary tool     | Details                                                |
| ------------ | -------------------------- | ---------------- | ------------------------------------------------------ |
| `unused`     | Dead code / unused exports | **`knip`**       | [operations/unused.md](./operations/unused.md)         |
| `duplicates` | Duplicated code            | **`pnpm jscpd`** | [operations/duplicates.md](./operations/duplicates.md) |
| `all`        | Both of the above          | knip + jscpd     | Run `unused` first, then `duplicates`                  |

Every operation:

1. Runs the tooling first to get a candidate list (cheap, deterministic).
2. Uses parallel `explore` subagents to verify edge cases (re-exports, dynamic imports, structural equivalence).
3. Annotates the source with `// TODO:` comments and `@deprecated` JSDoc — **never delete**.
4. Outputs a verification table.
5. Saves an audit report to `docs/audit-reports/`.

## When to Use

| User says…                                                     | Operation    |
| -------------------------------------------------------------- | ------------ |
| "find dead code in X", "check unused exports", "audit X"       | `unused`     |
| "find duplicate code", "are there duplicates of X", "DRY this" | `duplicates` |
| "code health check", "clean up this file", "full audit"        | `all`        |

## Usage

```
/code-health-review [all|unused|duplicates] [path]
```

- No args → ask which operation; default scope = current package
- `all [path]` → run `unused` then `duplicates` on `[path]`; generate a single combined audit report
- `unused [path]` → run [operations/unused.md](./operations/unused.md) on `[path]`
- `duplicates [path]` → run [operations/duplicates.md](./operations/duplicates.md) on `[path]` (default: whole repo, since jscpd needs corpus context)

## Common Rules (apply to all operations)

- **Never delete** declarations or files — only annotate. Deletion is the human's decision.
- **Never modify** a declaration's implementation while annotating.
- The verification subagent result is the source of truth — if a tool flags something but the verifier finds a real usage, classify as `USED` and skip annotation.
- Treat barrel/index files (`index.ts`) with extra care: re-exports in barrels are usually intentional; flag prominently before annotating.
- Search the **whole repo**, not just the current file, when verifying usages.
- Excluded from "production used" determination (but reported separately): `*.test.ts`, `*.spec.ts`, `*.test.tsx`, `*.spec.tsx`, `*.stories.tsx`.

## Tooling Notes

- **knip** — install if not present: `pnpm add -D knip`. Run with `pnpm knip` (or `npx knip`). The `unused` operation drives it directly.
- **jscpd** — install if not present: `pnpm add -D jscpd`. Run with `pnpm dlx jscpd`. The `duplicates` operation drives it directly.
- Both tools may produce false positives. The verification subagent step exists specifically to filter those.

## Audit Report

After all annotation steps are complete, generate a comprehensive audit report and save it to `docs/audit-reports/code-health-<date>.md` (e.g. `code-health-2026-04-24.md`). Present the report to the user.

### Report Template

```markdown
# Code Health Audit Report

## Summary

- **Date**: <date>
- **Scope**: <package(s) or file(s) audited>
- **Operations**: <unused | duplicates | both>
- **Tool versions**: knip <version>, jscpd <version>

## Unused Declarations

### Statistics

| Metric                 | Count |
| ---------------------- | ----- |
| Declarations scanned   | X     |
| Knip candidates        | X     |
| Verified UNUSED        | X     |
| Verified TEST-ONLY     | X     |
| Verified INTERNAL-ONLY | X     |
| Verified SHADOWED      | X     |
| Knip false positives   | X     |
| Annotations added      | X     |

### Findings

| Declaration | Kind     | File                             | Line | Status       | Action Taken       |
| ----------- | -------- | -------------------------------- | ---- | ------------ | ------------------ |
| `myFn`      | function | `apps/frontend/src/utils/foo.ts` | 12   | ❌ UNUSED    | Added TODO comment |
| `MyType`    | type     | `apps/frontend/src/types/bar.ts` | 5    | ⚠️ TEST-ONLY | Added TODO comment |
| ...         | ...      | ...                              | ...  | ...          | ...                |

### For Human Review (not auto-annotated)

- **Unused files**: list files flagged by knip
- **Unused dependencies**: list deps flagged by knip

## Duplicate Code

### Statistics

| Metric                   | Count |
| ------------------------ | ----- |
| Clone pairs found        | X     |
| Identical                | X     |
| Structurally equivalent  | X     |
| Partial / low confidence | X     |
| False positives          | X     |
| Annotations added        | X     |

### Findings

| Clone | Lines | Tokens | Canonical                                | Duplicate (annotated)                  | Relationship            | Confidence | Action Taken               |
| ----- | ----- | ------ | ---------------------------------------- | -------------------------------------- | ----------------------- | ---------- | -------------------------- |
| 1     | 13    | 84     | `libs/common/src/utils/helpers.ts:14-26` | `apps/frontend/src/utils/foo.ts:70-82` | structurally-equivalent | HIGH       | Added `@deprecated` + TODO |
| ...   | ...   | ...    | ...                                      | ...                                    | ...                     | ...        | ...                        |

### Suggested Extractions

- List consolidation targets and recommended shared locations.

## Verification Results

| Check                          | Result |
| ------------------------------ | ------ |
| knip run completed             | PASS   |
| jscpd run completed            | PASS   |
| Parallel subagent verification | PASS   |
| Annotations applied cleanly    | PASS   |

## Notes

- Any non-obvious decisions, caveats, or items requiring follow-up.
```

Status legend: ❌ `UNUSED` · ⚠️ `TEST-ONLY` · 📦 `INTERNAL-ONLY` · 🔁 `SHADOWED` · ♻️ `DUPLICATE`

Omit sections that were not part of the requested operation (e.g. skip "Duplicate Code" when only `unused` was run).

## References

- [operations/unused.md](./operations/unused.md) — knip workflow, classification, annotation patterns, verification table
- [operations/duplicates.md](./operations/duplicates.md) — jscpd workflow, structural equivalence rules, annotation patterns
- [`.jscpd.json`](../../../.jscpd.json) — repo-wide duplicate-detection config
- [knip docs](https://knip.dev/) — external
