# Master Universe Build Prompt (Repo-Native Implementation)

Use this prompt for **repo-aware implementation agents** (Codex/Claude Code/Cursor) that already have repository access.

> This is intentionally different from `docs/MASTER_RESEARCH_PROMPT.md`, which is for upstream research generation with minimal repo access.

---

## Copy/Paste Prompt

You are working inside the Anime Architecture Archive repository.

Task: Build and integrate a new universe from an already-provided research file at `research/{slug}_research.txt`.

### Non-negotiable flow
1. Read operational sources first:
   - `AGENTS.md`
   - `CLAUDE.md`
   - `playbooks/README.md`
   - `scripts/README.md`
2. Read playbooks `01` through `06` and follow them in order.
3. Before authoring payloads, inspect:
   - one legacy payload (`src/data/aot.json` or `src/data/jjk.json` or `src/data/hxh.json`)
   - one newer core payload (`src/data/deathnote.core.json` or `src/data/fmab.core.json`)
4. Build the implementation payload as `src/data/{slug}.core.json` unless legacy mode is explicitly required.
5. Choose renderer from thesis using `docs/RENDERER_CONTRACT.md`, and provide a strong `visualizationReason`.
6. Enforce runtime-critical schema from `src/utils/validateSchema.js` and `playbooks/06-payload-field-reference.md`.
7. Run image patch before validation:
   - `python scripts/patch_jikan_images.py --file src/data/{slug}.core.json`
8. Run verification commands:
   - `npm run validate:payload src/data/{slug}.core.json`
   - `npm run validate:all`
   - `npm run test`
   - `npm run build`
9. Perform visual verification:
   - `/`
   - `/universe/{slug}`
   - representative existing universe routes (no regressions)
10. Sync required docs after integration:
   - `README.md`
   - `docs/BLUEPRINT.md`
   - `docs/REPO_AUDIT_SUMMARY.md`
   - `src/data/index.js` (`preferredOrder` when appropriate)

### Quality constraints (hard)
- Do not fabricate image URLs.
- Do not add anime-specific runtime branches in components.
- Preserve dual LORE/SYS voice fields.
- `aiInsights.casual` and `aiInsights.deep` must both be meaningful, non-empty strings.
- `rules` quality is mandatory: enforce useful law text (`name`, `loreConsequence`, `systemEquivalent`, valid `severity`).
- Ensure UI-critical key correctness for `counterplay`, `anomalies`, and `causalEvents`.
- Prefer focused, thesis-driven payloads over bloated wiki-style dumps.

### Required final report
Return:
1. Files read first.
2. Legacy + modern payload references inspected.
3. Renderer chosen and why.
4. Files created/modified.
5. Image patch result.
6. Validation (`validate:payload`, `validate:all`) result.
7. Test result.
8. Build result.
9. Visual verification result.
10. Final merge-readiness judgment.

---

## Short Trigger Prompt

> Read `docs/MASTER_UNIVERSE_BUILD_PROMPT.md` and implement universe `{slug}` from `research/`, including image patch, payload validation, archive-wide validation, tests, build, docs sync, visual checks, commit, and PR.
