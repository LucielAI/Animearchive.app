#!/usr/bin/env bash
# =============================================================================
# promote_public.sh — Promote allowlisted files from private → public repo
#
# Architecture:
# - Denylist check: scan all source files, grep for denylist patterns
# - Allowlist check: verify each path exists via git show, copy to staging
# - Push: clone public repo bare, copy staged files, force-push to target branch
#
# GitHub Actions: full clone, git ls-tree works normally
# Local shallow clone: git ls-tree -r may fail, fall back to known dirs
#
# Required env vars:
#   SOURCE_SHA        — commit SHA to promote
#   PUBLIC_REPO_TOKEN — fine-grained PAT with Contents:write on public repo
#   PUBLIC_REPO       — public repo name (e.g. Animearchive.app)
#   TARGET_BRANCH      — target branch in public repo (default: main)
#   DRY_RUN            — 'true' to validate without pushing
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_DIR="$REPO_ROOT/release"
STAGING_DIR=$(mktemp -d)
ALLOWLIST="$RELEASE_DIR/public-allowlist.txt"
DENYLIST="$RELEASE_DIR/public-denylist.txt"
PRIVATE_REPO="LucielAI/anime-database"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()   { echo -e "${GREEN}[promote]${NC} $*"; }
warn()  { echo -e "${YELLOW}[promote] WARNING:${NC} $*"; }
err()   { echo -e "${RED}[promote] ERROR:${NC} $*" >&2; }
fail()  { echo -e "${RED}[promote] FAILED:${NC} $*" >&2; exit 1; }

# Check if a blob (file) exists at path for a given SHA
blob_exists() { git show "${1}:${2}" &>/dev/null; }

# List files in a directory using git ls-tree -r with path prefix
list_tree_files() {
  local sha="$1"; local dir="$2"
  git ls-tree -r --name-only "${sha}" "${dir}/" 2>/dev/null || true
}

# Collect all source files into a temp file
collect_source_files() {
  local sha="$1"; local out="$2"
  > "$out"

  # Method 1: git ls-tree -r with path separator (works in full clones)
  if git ls-tree -r --name-only "${sha}" -- . > "$out" 2>/dev/null && [ -s "$out" ]; then
    log "File discovery: git ls-tree (full clone)"
    return 0
  fi
  > "$out"

  # Method 2 (shallow/fallback): iterate top-level dirs individually
  warn "File discovery: fallback mode (shallow clone detected)"
  local entries=$(git ls-tree "${sha}" 2>/dev/null | awk '{print $NF}' || true)
  for entry in $entries; do
    [[ -z "$entry" ]] && continue
    # Check if it's a tree (ends in / from awk, but awk NF=$NF on ls-tree output gives just name)
    local type=$(git ls-tree "${sha}" "${entry}" 2>/dev/null | awk '{print $1}' | head -1)
    if [[ "$type" == "tree" ]]; then
      list_tree_files "${sha}" "${entry}" >> "$out" 2>/dev/null || true
    fi
  done

  sort -u "$out" -o "$out" 2>/dev/null || true
  [ -s "$out" ] || warn "Could not enumerate source files."
}

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
log "============================================="
log "  Promote: Private → Public"
log "============================================="
[ -f "$ALLOWLIST" ] || fail "Missing: $ALLOWLIST"
[ -f "$DENYLIST" ]  || fail "Missing: $DENYLIST"
log "Source SHA:  $SOURCE_SHA"
log "Target:      LucielAI/$PUBLIC_REPO @ $TARGET_BRANCH"
log "Dry run:     $DRY_RUN"

# ---------------------------------------------------------------------------
# Step 1: Collect source files
# ---------------------------------------------------------------------------
log "Scanning source commit..."
SOURCE_FILES=$(mktemp)
collect_source_files "$SOURCE_SHA" "$SOURCE_FILES"
TOTAL_TREE=$(wc -l < "$SOURCE_FILES")
log "Source files found: $TOTAL_TREE"

# ---------------------------------------------------------------------------
# Step 2: Denylist check
# ---------------------------------------------------------------------------
log "Checking denylist violations..."
VIOLATIONS=0
while IFS= read -r pattern; do
  [[ -z "$pattern" || "$pattern" =~ ^# ]] && continue

  # Strip trailing $ for anchored-file patterns (grep -F doesn't support $)
  local plain="${pattern%$}"
  local matched=""

  if [[ "$pattern" =~ \$$ ]]; then
    # Anchored file pattern (e.g. ^public/universe/.*$)
    # Use grep -E for proper ERE matching
    matched=$(grep -E "$plain" "$SOURCE_FILES" 2>/dev/null || true)
  else
    # Prefix pattern — check if any source file starts with this path
    matched=$(grep -F -- "$plain" "$SOURCE_FILES" 2>/dev/null || true)
  fi

  if [ -n "$matched" ]; then
    err "DENYLIST VIOLATION: '$pattern'"
    echo "$matched" | head -10 | while read -r f; do [ -n "$f" ] && echo "    → $f"; done
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done < "$DENYLIST"

if [ "$VIOLATIONS" -gt 0 ]; then
  fail "$VIOLATIONS denylist violation(s) found. Fix before promoting."
fi
log "Denylist: PASS"

# ---------------------------------------------------------------------------
# Step 3: Copy allowlisted files to staging
# ---------------------------------------------------------------------------
log "Copying allowlisted files..."
MISSING=0; TOTAL_FILES=0
cd "$REPO_ROOT"

while IFS= read -r file; do
  [[ -z "$file" || "$file" =~ ^# ]] && continue
  file=$(echo "$file" | sed 's/#.*$//' | tr -d ' ')
  [[ -z "$file" ]] && continue

  if [[ "$file" == */ ]]; then
    # Directory
    local dir="${file%/}"; local count=0
    if blob_exists "$SOURCE_SHA" "$dir"; then
      while IFS= read -r sf; do
        [[ -z "$sf" ]] && continue
        mkdir -p "$STAGING_DIR/$(dirname "$sf")"
        if git show "${SOURCE_SHA}:${sf}" > "$STAGING_DIR/$sf" 2>/dev/null; then
          count=$((count + 1)); TOTAL_FILES=$((TOTAL_FILES + 1))
        fi
      done < <(list_tree_files "$SOURCE_SHA" "$dir")
    else
      err "Allowlisted directory missing: $dir"
      MISSING=$((MISSING + 1))
    fi
    [ "$count" -eq 0 ] && { err "Allowlisted directory empty: $dir"; MISSING=$((MISSING + 1)); }
  else
    # Single file
    if blob_exists "$SOURCE_SHA" "$file"; then
      mkdir -p "$STAGING_DIR/$(dirname "$file")"
      git show "$SOURCE_SHA:$file" > "$STAGING_DIR/$file"
      TOTAL_FILES=$((TOTAL_FILES + 1))
    else
      err "Allowlisted file missing: $file"
      MISSING=$((MISSING + 1))
    fi
  fi
done < "$ALLOWLIST"

rm -f "$SOURCE_FILES"

if [ "$MISSING" -gt 0 ]; then
  fail "$MISSING allowlisted file(s) missing."
fi
log "Staged $TOTAL_FILES file(s)."

# ---------------------------------------------------------------------------
# Step 4: Publish to public repo
# ---------------------------------------------------------------------------
if [ "$DRY_RUN" == "true" ]; then
  warn "DRY RUN — no files pushed."
  echo ""
  echo "=== WOULD PROMOTE ($TOTAL_FILES files) ==="
  find "$STAGING_DIR" -type f | sed "s|$STAGING_DIR/||" | sort
  echo ""
  echo "files_promoted_count=$TOTAL_FILES" >> $GITHUB_OUTPUT
  echo "vercel_triggered=false" >> $GITHUB_OUTPUT
  rm -rf "$STAGING_DIR"
  exit 0
fi

log "Pushing to LucielAI/$PUBLIC_REPO..."

# Clone public repo
git clone --bare \
  "https://x-access-token:${PUBLIC_REPO_TOKEN}@github.com/LucielAI/${PUBLIC_REPO}.git" \
  /tmp/public-repo 2>&1 | grep -v "Cloning" || true
cd /tmp/public-repo

PREV_SHA=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
git checkout "$TARGET_BRANCH" 2>/dev/null || git checkout -b "$TARGET_BRANCH"
git rm -rf . --quiet 2>/dev/null || true

cp -r "$STAGING_DIR"/* . 2>/dev/null || true
rm -rf "$STAGING_DIR"

git add -A
git commit -m "Promote ${SOURCE_SHA} → public

Source:  LucielAI/${PRIVATE_REPO} @ ${SOURCE_SHA}
Date:    $(date -u +%Y-%m-%dT%H:%M:%SZ)
Files:   ${TOTAL_FILES}
Automated by: promote-public.yml" 2>/dev/null \
  || warn "Nothing to commit — check allowlist."

git push -f \
  "https://x-access-token:${PUBLIC_REPO_TOKEN}@github.com/LucielAI/${PUBLIC_REPO}.git" \
  "$TARGET_BRANCH" 2>&1 || fail "Push to public repo failed."

NEW_SHA=$(git rev-parse HEAD)

echo ""
echo "============================================="
log "Promotion complete."
echo "Source:       $SOURCE_SHA"
echo "Files:        $TOTAL_FILES"
echo "Public repo:  LucielAI/$PUBLIC_REPO @ $TARGET_BRANCH"
echo "Prev SHA:     $PREV_SHA"
echo "New SHA:      $NEW_SHA"
echo ""
echo "Vercel: Auto-deploy queued (push to $TARGET_BRANCH)."
echo "files_promoted_count=$TOTAL_FILES" >> $GITHUB_OUTPUT
echo "vercel_triggered=true" >> $GITHUB_OUTPUT
