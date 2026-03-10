# Playbook: Research → Payload

How to transform raw research into a valid archive JSON payload.

## Read First

- `docs/MASTER_RESEARCH_PROMPT.md` — the canonical research prompt
- `docs/RESEARCH_GUIDE.md` — what sections to produce and why
- `docs/RENDERER_CONTRACT.md` — how to pick a renderer from research output
- `docs/DATA_PRINCIPLES.md` — schema rules, image policy, aiInsights spec
- `src/generation/selectCoreFromExtended.js` — how core selection works

## Inputs Required

- Raw research in `research/{slug}_research.txt`
- Anime MAL ID (`malId`) — look it up on myanimelist.net
- Chosen renderer (determined during research by system thesis)

## Outputs Expected

- `{slug}.extended.json` — full structured dataset (optional but recommended)
- `{slug}.core.json` — renderer-ready payload for the archive

---

## Step 1 — Determine the System Thesis

Before touching JSON, identify the structural thesis from research:

- Is the system defined by **causality** (A leads to B)? → `timeline`
- Is the system defined by **who knows/controls whom** (networks)? → `node-graph`
- Is the system defined by **how X defeats Y** (combat economy)? → `counter-tree`
- None fit cleanly? → `cards`

This determines `visualizationHint` and drives all structural profile targets.

See `docs/RENDERER_CONTRACT.md` — Structural Profiles table for the expected array lengths per renderer.

## Step 2 — Build the Extended Dataset (recommended)

Produce `{slug}.extended.json` with all collected data. No caps on array length here — retain everything useful.

Required top-level fields (same as core, see Step 3 below).

Validate:
```bash
npm run validate:payload path/to/{slug}.extended.json --extended
```

Extended validation is lighter than core validation. A few warnings here are acceptable.

## Step 3 — Generate the Core Payload

The core payload is what the archive renders. Every field must serve a renderer.

**Option A — Mechanical selection (recommended for large extended datasets):**

Use `src/generation/selectCoreFromExtended.js`:
```js
import { selectCoreFromExtended } from './src/generation/selectCoreFromExtended.js'
const core = selectCoreFromExtended(extended)
```

This ranks and caps each section using signal scores (dangerLevel, weight, severity, causalImportance, etc.) and applies per-renderer caps from `STARTER_PROFILES`.

**Option B — Manual construction (for small or simple datasets):**

Write the core payload directly, following the structural profile targets in `docs/RENDERER_CONTRACT.md`.

### Required Fields Checklist

```json
{
  "anime": "Anime Title",
  "malId": 123,
  "slug": "animeslug",
  "visualizationHint": "timeline|node-graph|counter-tree|cards",
  "visualizationReason": "One sentence: why this renderer fits this system.",
  "aiInsights": {
    "casual": "Fan-friendly system summary.",
    "deep": "Analytical system readout referencing mechanics and constraints."
  },
  "headerFlavor": {
    "loreQuote": "...",
    "sysWarning": "...",
    "sysWarningColor": "red|orange|purple|..."
  },
  "backgroundMotif": "jagged|noise|temporal|...",
  "revealOverlay": "hatch-red|pulse-purple|glow-border|...",
  "animeImageUrl": null,
  "characters": [...],
  "relationships": [...],
  "factions": [...],
  "rules": [...],
  "counterplay": [...],
  "causalEvents": [...],
  "anomalies": [...],
  "powerSystem": [...]
}
```

For `sysWarningColor`, `backgroundMotif`, and `revealOverlay` valid keys, check `src/config/universePresentation.js`.

### Image Fields

Set all image fields to `null` + `_fetchFailed: true` at this stage. The image patch step (Stage 3.5) fills them in:
```json
{ "name": "Character Name", "imageUrl": null, "_fetchFailed": true }
```

Do NOT fabricate MAL URLs. See [03-image-patch.md](./03-image-patch.md).

### aiInsights Quality Bar

- `casual`: Short. Intuitive. No jargon. Fan-readable in one pass.
- `deep`: Analytical. Must reference actual mechanics, constraints, or causal structures. Not a plot summary.

---

## Done When

- [ ] `{slug}.extended.json` validates with `--extended` flag (if using layered workflow)
- [ ] `{slug}.core.json` validates cleanly with `npm run validate:payload`
- [ ] All image fields are either real MAL URLs or `null` + `_fetchFailed: true`
- [ ] `visualizationReason` and both `aiInsights` strings are present
- [ ] Structural profile targets for the chosen renderer are met

## Common Mistakes

**Using research sections as array items directly.** Research is prose. Payload arrays need structured objects with specific keys (`name`, `description`, `weight`, `type`, etc.). Transform, don't paste.

**Skipping `aiInsights`.** This is a hard schema requirement for new universes. Both `casual` and `deep` must be non-empty strings.

**Oversizing the core payload.** The core is capped for renderer performance. If you have more data, put it in extended. The `selectCoreFromExtended` function handles capping automatically.

**Choosing the renderer by character count.** The renderer decision is about system thesis, not data volume. A 6-character universe can be a node graph if relationships are its structural core.

**Writing `aiInsights.deep` as a plot summary.** It must read like a system analysis, not a synopsis. Reference rules, constraints, and causal mechanics.
