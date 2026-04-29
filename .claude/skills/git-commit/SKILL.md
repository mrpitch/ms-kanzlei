---
name: git-commit
description: 'Execute git commit with conventional commit message analysis, intelligent staging, and message generation. Use when user asks to commit changes, create a git commit, or mentions "/commit". Supports: (1) Auto-detecting type and scope from changes, (2) Generating conventional commit messages from diff, (3) Interactive commit with optional type/scope/description overrides, (4) Intelligent file staging for logical grouping'
license: MIT
allowed-tools: Bash
source: https://github.com/github/awesome-copilot/blob/main/skills/git-commit/SKILL.md
---

# Git Commit with Conventional Commits

## Overview

Create standardized, semantic git commits using the Conventional Commits specification. Analyze the actual diff to determine appropriate type, scope, and message.

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
AI-Assisted-By: <Tool> (<Model>)
```

**MANDATORY:** Every commit MUST include an `AI-Assisted-By:` trailer as the last line. This is enforced by commitlint and is required for audit trail compliance.

- AI-generated commits: `AI-Assisted-By: GitHub Copilot (Claude Opus 4.6)` — use the actual tool and model name
- Human-only commits: `AI-Assisted-By: None`

## Commit Types

| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Breaking Changes

```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint

# BREAKING CHANGE footer
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## Workflow

### 1. Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Also check status
git status --porcelain
```

### 2. Stage Files (if needed)

If nothing is staged or you want to group changes differently:

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add *.test.*
git add src/components/*

# Interactive staging
git add -p
```

**Never commit secrets** (.env, credentials.json, private keys).

### 3. Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: What area/module is affected?
- **Description**: One-line summary of what changed (present tense, imperative mood, <72 chars)

### 4. Interactive Overrides

Give the user the option to override type/scope/description before finalizing the commit message.

```bash
# Example prompt for user input
read -p "Enter commit type (feat, fix, docs, etc.): " type
read -p "Enter optional scope (e.g. component, module): " scope
read -p "Enter commit description: " description
```

### 5. Execute Commit

Always include the `AI-Assisted-By` trailer. Separate it from the body/footers with a blank line.

```bash
# Single line (no body)
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>

AI-Assisted-By: GitHub Copilot (Claude Opus 4.6)
EOF
)"

# Multi-line with body/footer
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>

<optional body>

<optional footer>
AI-Assisted-By: GitHub Copilot (Claude Opus 4.6)
EOF
)"
```

## Commitlint Rules (enforced — commit will be rejected on violation)

These rules are enforced by `commitlint.config.ts` (extends `@commitlint/config-conventional`):

| Rule                      | Constraint                                                   | Notes                                         |
| ------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `header-max-length`       | **≤ 100 chars**                                              | Entire first line: `type(scope): description` |
| `type-enum`               | Must be one of the types in the table above                  | `error`                                       |
| `type-case`               | lower-case                                                   | `error`                                       |
| `type-empty`              | Must not be empty                                            | `error`                                       |
| `scope-case`              | lower-case                                                   | `error`                                       |
| `subject-empty`           | Must not be empty                                            | `error`                                       |
| `subject-full-stop`       | Must not end with `.`                                        | `error`                                       |
| `body-leading-blank`      | Blank line required before body                              | `warning`                                     |
| `footer-leading-blank`    | Blank line required before footer                            | `warning`                                     |
| `body-max-line-length`    | Disabled (no limit)                                          | overridden in repo config                     |
| `footer-max-line-length`  | Disabled (no limit)                                          | overridden in repo config                     |
| `subject-case`            | Disabled (any case allowed)                                  | overridden in repo config                     |
| `ai-assisted-by-required` | `AI-Assisted-By:` trailer mandatory                          | custom rule                                   |
| `ai-assisted-by-format`   | `AI-Assisted-By: <Tool> (<Model>)` or `AI-Assisted-By: None` | custom rule                                   |
| `ticket-number-format`    | `BSD` must be followed by `-<number>` (e.g. `BSD-1234`)      | custom rule                                   |

**Key constraint to check before every commit:** the full header line must be **≤ 100 characters**. Count `type(scope): description` including the prefix.

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep header (type + scope + description) **under 100 characters** — this is enforced by commitlint
- Ticket references must use the full pattern `BSD-<number>` — bare `BSD` will be rejected

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix and create NEW commit (don't amend)
