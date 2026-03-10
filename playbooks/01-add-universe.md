# Playbook: Add a Universe

End-to-end guide for adding a new anime universe to the archive.

## Read First

- `docs/UNIVERSE_PIPELINE.md` — authoritative pipeline stages
- `docs/RENDERER_CONTRACT.md` — renderer selection and structural profiles
- `docs/DATA_PRINCIPLES.md` — image policy, aiInsights requirements, schema rules
- `scripts/README.md` — CLI commands

## Inputs Required

- Anime name and MAL ID (`malId`)
- Research file at `research/{slug}_research.txt`
- Chosen renderer and justification (`visualizationHint`, `visualizationReason`)

---

## Stages

### Stage 1 — Research

Use `docs/MASTER_RESEARCH_PROMPT.md` to guide structural research. Focus on the system (rules, factions, causality, counterplay), not plot.

Save output to:
```
research/{slug}_research.txt
```

See `docs/RESEARCH_GUIDE.md` for what sections to produce.

### Stage 2 — Extended Dataset (recommended)

Build `{slug}.extended.json` with the full deep dataset. Use `selectCoreFromExtended` (in `src/generation/selectCoreFromExtended.js`) to rank and cap sections for the core payload.

Extended datasets are NOT rendered by the UI. They exist for research retention and future re-compression.

Validate:
```bash
npm run validate:payload path/to/{slug}.extended.json
# or
npm run validate:payload path/to/{slug}.extended.json --extended
```

### Stage 3 — Core Payload

Generate `{slug}.core.json` (preferred) or `{slug}.json` (legacy).

Required fields (enforced by `validateCorePayload`):
- `anime`, `malId`, `slug`
- `visualizationHint` — one of: `timeline`, `node-graph`, `counter-tree`, `cards`
- `visualizationReason` — one sentence explaining the renderer choice
- `aiInsights.casual` and `aiInsights.deep`
- `headerFlavor` — `{ loreQuote, sysWarning, sysWarningColor }`
- `backgroundMotif`, `revealOverlay`
- `characters`, `relationships`, `factions`, `rules`, `counterplay`, `causalEvents`, `anomalies`, `powerSystem`

For renderer selection logic, see `docs/RENDERER_CONTRACT.md`. Choose by **system thesis**, not data volume.

### Stage 3.5 — Image Patch

Before validating images, run the Jikan patcher to inject real MAL images:
```bash
python scripts/patch_jikan_images.py --file path/to/{slug}.json
```

The script reads `malId` from the payload and fetches the official cast list. Do not fabricate image URLs. See [03-image-patch.md](./03-image-patch.md).

### Stage 4 — Validation

```bash
npm run validate:payload path/to/{slug}.core.json
```

A clean pass (`CLEAN PASS` or `PASSED WITH WARNINGS`) is required before integration. `FAILED` blocks integration.

See [04-verify-universe.md](./04-verify-universe.md) for QA checklist.

### Stage 5 — Integration

```bash
# Legacy mode (writes src/data/{slug}.json)
npm run add:universe path/to/payload.json [slug]

# Layered mode (writes src/data/{slug}.core.json)
npm run add:universe path/to/{slug}.core.json [slug]

# With extended dataset
npm run add:universe path/to/{slug}.core.json [slug] path/to/{slug}.extended.json
```

The script:
- Validates the payload again
- Copies files to `src/data/`
- Removes the universe from `PENDING_UNIVERSES` stubs in `ExploreAnotherUniverse.jsx` if it was listed there

### Stage 6 — Deployment

1. Update docs (see [05-docs-sync.md](./05-docs-sync.md))
2. Commit all changes
3. Push to branch → Vercel auto-deploys on merge

---

## Done When

- [ ] `src/data/{slug}.json` or `src/data/{slug}.core.json` exists
- [ ] `npm run validate:payload` passes with no `FAILED` output
- [ ] Universe appears in the archive at `/universe/{slug}`
- [ ] OG image route resolves (check `docs/OG_SYSTEM.md` if needed)
- [ ] `BLUEPRINT.md` and `REPO_AUDIT_SUMMARY.md` updated

## Common Mistakes

**Fabricating image URLs.** Do not invent `cdn.myanimelist.net` URLs. Run the image patch script or set `imageUrl: null, _fetchFailed: true`.

**Wrong renderer choice.** Renderer is chosen by system thesis, not entity count. A universe with 20 characters is not automatically a node graph.

**Missing `aiInsights`.** Required for all new universes. Must have both `casual` and `deep` strings. Not optional.

**Missing `visualizationReason`.** Every payload must explain its renderer choice. This displays in the `WhyThisRenderer` component.

**Confusing extended and core payloads.** Extended is for research retention. Core is what the UI renders. Do not pass an extended dataset to `add:universe` as the first argument.

**Not running image patch before validation.** Image validation will flag missing hosts. Run the patcher first.
