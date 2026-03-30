# Promotion Pipeline Setup Guide

## Overview

This pipeline promotes clean, public-safe snapshots from `LucielAI/anime-database` (private) to `LucielAI/Animearchive.app` (public). Vercel deploys from the public repo.

---

## Secrets Required (set in GitHub repo settings)

### 1. `PUBLIC_REPO_SYNC_TOKEN`
Fine-grained GitHub PAT with write access to `LucielAI/Animearchive.app`.

**How to create:**
1. Go to: https://github.com/settings/tokens?type=beta
2. "Generate new token" → Fine-grained token
3. **Repository access:** Select "Only select repositories" → choose `LucielAI/Animearchive.app`
4. **Permissions:**
   - Contents: **Read and write** (needed to push to main)
5. Generate and copy the token

**Scope note:** Do NOT use the default `GITHUB_TOKEN` — it cannot push to a different repository.

### 2. `VERCEL_DEPLOY_HOOK_URL` (optional)
Vercel deploy hook URL. If not set, Vercel will still auto-deploy on push to public `main` — this is just a fallback trigger.

**How to get:**
1. Go to your Vercel project → Settings → Git → Deploy Hooks
2. Create a hook for the `main` branch
3. Copy the URL and add as a secret

---

## Repository Setup

### In GitHub: Enable the workflow

1. Go to: https://github.com/LucielAI/anime-database/settings/secrets/actions
2. Add `PUBLIC_REPO_SYNC_TOKEN` with the token from step 1
3. (Optional) Add `VERCEL_DEPLOY_HOOK_URL`

### In Vercel: Connect the public repo

1. Go to: https://vercel.com/dashboard
2. Import `LucielAI/Animearchive.app` as a new project (or update the existing project's git connection)
3. Set build command: `npm run build`
4. Set root directory: `.` (or leave blank)
5. Set environment variables if needed (Vercel will read from its own settings, not from the repo)
6. Vercel will now auto-deploy on every push to `Animearchive.app/main`

---

## How to Promote

### Auto-trigger (on merge to Main)
When a PR merges to `Main` in the private repo, the workflow automatically checks if allowlisted files changed. If yes → promotes to public. If only internal files changed → silently skips.

### Manual trigger
1. Go to: https://github.com/LucielAI/anime-database/actions/workflows/promote-public.yml
2. Click "Run workflow"
3. Optionally set:
   - `dry_run`: `true` to validate without pushing
   - `source_sha`: specific commit to promote (defaults to HEAD)

---

## How It Works

```
PR merges to Main (private repo)
         │
         ▼
GitHub Actions: promote-public.yml triggers
         │
         ▼
Checkout source commit at SOURCE_SHA
         │
         ▼
promote_public.sh runs:
  1. Check denylist violations → FAIL if found
  2. Verify allowlisted files exist → FAIL if missing
  3. Copy allowlisted files to staging dir
  4. Push staged snapshot to Animearchive.app/main
         │
         ▼
Vercel auto-deploys on push to public/main
```

---

## What Gets Promoted

Files/directories in `release/public-allowlist.txt`:
- `src/` — React app source
- `public/` — public assets (without pre-rendered HTML for SPA routes)
- `content/` — blog posts and universe data
- `index.html`, `package.json`, `vite.config.js`, `vercel.json` — build/deploy config
- `README.md`, `CHANGELOG.md` — public docs

## What Gets Blocked

Files matching `release/public-denylist.txt` patterns:
- Agent prompts, memory files, internal docs
- Pipeline scripts (`scripts/generate*.js`, `scripts/publish*.js`, etc.)
- Secrets, credentials, `.env` files
- `.github/workflows/promote-public.yml` (stays in private only)
- `hashi-collab/`, `memory/`, pipeline cache

---

## Denylist Violation — What Happens

If the workflow detects a denylist match:
1. Workflow **fails at the check step**
2. No files are pushed to public
3. You get a clear error message showing which file triggered the violation

---

## Vercel Auto-Deploy

Vercel is connected to `Animearchive.app`. Every push to `main` on that repo triggers a deploy automatically — no extra configuration needed. The `VERCEL_DEPLOY_HOOK_URL` secret is optional fallback.

---

## Troubleshooting

### "Nothing to promote" / empty allowlist result
- Check that `release/public-allowlist.txt` matches your repo structure
- Run with `dry_run: true` to see what would be promoted

### Push fails with 403
- `PUBLIC_REPO_SYNC_TOKEN` may have insufficient permissions
- Verify the fine-grained token has "Contents: Read and write" on `Animearchive.app`

### Vercel not auto-deploying
- Check Vercel project is connected to `Animearchive.app`, not `anime-database`
- Check Vercel deploy logs for build errors

---

## Long-Term Maintenance

When you add new files to the project:
- New internal scripts → add to denylist if they contain logic you don't want public
- New public assets → should already be under `src/` or `public/` (allowlisted by default)
- New root config files → add to allowlist explicitly if needed

The denylist is the safety net. The allowlist is the source of truth.
