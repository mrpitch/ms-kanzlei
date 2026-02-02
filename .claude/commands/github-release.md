```md
# Create GitHub Release
$ARGUMENTS

Pre: clean git; up-to-date; gh auth; release perms.

Semver (since last tag): BREAKING/! => major; feat => minor; else => patch.
Do: bump package.json; tag vX.Y.Z; push tag; gh release create (notes grouped by type; highlight breaking).
```
