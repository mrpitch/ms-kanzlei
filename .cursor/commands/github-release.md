# Create GitHub Release

## Overview
Create a GitHub release with automatic semantic versioning based on commit messages. This command analyzes commits since the last release to determine the appropriate version bump, generates release notes, and publishes the release.

## Prerequisites
- Working directory is clean (all changes committed)
- GitHub CLI (`gh`) is installed and authenticated
- Current branch is up to date with remote
- You have permission to create releases in the repository

## Steps

### 1. **Check Repository State**
   - Verify working directory is clean
   - Check current version in `package.json`
   - Find last release tag
   - Analyze commits since last tag

### 2. **Determine Version Bump**
   - Analyze commit messages for conventional commits
   - Determine version bump type:
     - **Major (x.0.0)**: Breaking changes (`BREAKING CHANGE:`, `feat!:`)
     - **Minor (x.y.0)**: New features (`feat:`)
     - **Patch (x.y.z)**: Bug fixes, chores, refactors (`fix:`, `chore:`, `refactor:`, etc.)
   - Suggest version bump type based on commits
   - Allow user override if needed

### 3. **Generate Release Notes**
   - Group commits by type (feat, fix, chore, docs, refactor, etc.)
   - Format using conventional commit format
   - Include PR references if available in commit messages
   - List contributors if applicable
   - Highlight breaking changes prominently

### 4. **Prepare Release**
   - Update `package.json` version
   - Create git tag (e.g., `v1.2.3`)
   - Push tag to remote
   - Verify tag was created successfully

### 5. **Create GitHub Release**
   - Use `gh release create` command
   - Include generated release notes
   - Mark as latest/pre-release as appropriate
   - Optionally attach release assets

## Version Detection Logic

The command analyzes commits since the last tag (or since initial commit if no tags exist) to determine version bump:

### Priority Order
1. **Major Version (x.0.0)**
   - Commits with `BREAKING CHANGE:` in footer
   - Commits with `!` after type (e.g., `feat!:`, `fix!:`)
   - Any commit that introduces breaking changes

2. **Minor Version (x.y.0)**
   - Commits with `feat:` prefix (new features)
   - New functionality that doesn't break existing APIs

3. **Patch Version (x.y.z)**
   - Commits with `fix:` prefix (bug fixes)
   - Commits with `chore:` prefix (maintenance)
   - Commits with `refactor:` prefix (code improvements)
   - Commits with `docs:` prefix (documentation)
   - Commits with `style:` prefix (formatting)
   - Commits with `perf:` prefix (performance)
   - Commits with `test:` prefix (tests)
   - Other non-feature commits

### Conventional Commit Format
The command recognizes commits following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `perf`, `test`, `ci`, `build`, `revert`

## Release Notes Format

Release notes are generated from commit messages and organized as:

```markdown
## What's Changed

### Features
- feat: add new navigation system (#123)
- feat: implement dark mode toggle (#124)

### Bug Fixes
- fix: resolve authentication issue (#125)
- fix: correct typo in documentation (#126)

### Chores
- chore: update dependencies (#127)
- chore: improve build process (#128)

### Breaking Changes
- feat!: refactor API endpoints (#129)
  - BREAKING CHANGE: API endpoints now require authentication

**Full Changelog**: https://github.com/owner/repo/compare/v1.0.0...v1.1.0
```

## Release Checklist

Before creating a release:

- [ ] All changes are committed and pushed
- [ ] Working directory is clean
- [ ] Current branch is up to date with remote
- [ ] Version bump type determined
- [ ] Release notes generated and reviewed
- [ ] `package.json` version updated
- [ ] Git tag created
- [ ] Tag pushed to remote
- [ ] GitHub release created
- [ ] Release verified on GitHub

## Commands Reference

### Check Current Version
```bash
# Read version from package.json
cat package.json | grep '"version"' | head -1

# List all git tags
git tag --list --sort=-v:refname

# Get last tag
git describe --tags --abbrev=0 2>/dev/null || echo "No tags found"
```

### Analyze Commits
```bash
# Get commits since last tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)
if [ -z "$LAST_TAG" ]; then
  git log --oneline
else
  git log ${LAST_TAG}..HEAD --oneline
fi

# Count commit types
git log --oneline --grep="^feat" | wc -l
git log --oneline --grep="^fix" | wc -l
```

### Create Release
```bash
# Update package.json version (example: 1.2.3)
# Then create tag
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3

# Create GitHub release
gh release create v1.2.3 \
  --title "Release v1.2.3" \
  --notes "$(cat release-notes.md)"
```

### Draft Release
```bash
# Create draft release
gh release create v1.2.3 \
  --draft \
  --title "Release v1.2.3" \
  --notes "$(cat release-notes.md)"
```

### Pre-release
```bash
# Create pre-release (alpha, beta, rc)
gh release create v1.2.3-alpha.1 \
  --prerelease \
  --title "Release v1.2.3-alpha.1" \
  --notes "$(cat release-notes.md)"
```

## Examples

### Example 1: Patch Release
If commits since last tag include only fixes and chores:
- Last version: `1.2.3`
- Suggested version: `1.2.4` (patch bump)

### Example 2: Minor Release
If commits include new features:
- Last version: `1.2.3`
- Suggested version: `1.3.0` (minor bump)

### Example 3: Major Release
If commits include breaking changes:
- Last version: `1.2.3`
- Suggested version: `2.0.0` (major bump)

## Troubleshooting

### No Tags Found
If no tags exist, the command will analyze all commits from the beginning. The first release should typically be `v1.0.0` or `v0.1.0` depending on project maturity.

### Tag Already Exists
If a tag for the version already exists, you'll need to either:
- Use a different version number
- Delete the existing tag (if it wasn't published): `git tag -d v1.2.3 && git push origin :refs/tags/v1.2.3`

### GitHub CLI Not Authenticated
Ensure you're authenticated:
```bash
gh auth login
```

### Permission Denied
Ensure you have write access to the repository and permission to create releases.

## Best Practices

1. **Semantic Versioning**: Always follow semantic versioning (MAJOR.MINOR.PATCH)
2. **Conventional Commits**: Use conventional commit format for automatic version detection
3. **Release Notes**: Always include comprehensive release notes
4. **Tag Format**: Use `v` prefix for tags (e.g., `v1.2.3`)
5. **Pre-releases**: Use pre-release tags for testing (alpha, beta, rc)
6. **Changelog**: Consider maintaining a CHANGELOG.md file
7. **Testing**: Test the release process in a draft release first

## Related Documentation

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [GitHub CLI Releases](https://cli.github.com/manual/gh_release)
