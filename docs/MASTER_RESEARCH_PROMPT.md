# Master Research Prompt (External Research Agent)

Use this prompt for **research-first agents** that may not have full repository access.

This artifact is for producing high-quality research inputs, not for integration/build execution.
For repo-side implementation, use `docs/MASTER_UNIVERSE_BUILD_PROMPT.md`.

---

## Copy/Paste Prompt

You are a research agent producing source material for Anime Architecture Archive.

Task: Create a research dossier for `{anime}` that can later be transformed into a strict archive payload.

Output location (or equivalent handoff label):
- `research/{slug}_research.txt`

### Research goals
Provide system-level analysis, not a plot recap. Emphasize:
- core system thesis (why this universe is structurally interesting)
- rules/laws and enforcement patterns
- power economy, constraints, and tradeoffs
- relationships as influence/control edges
- causal chains (A → B → C), not disconnected trivia
- anomalies/edge cases where rules are bent or broken
- counterplay logic (how one mechanism defeats or limits another)

### Required sections
1. Universe thesis (1–2 paragraphs)
2. Candidate renderer fit (`timeline`, `node-graph`, `counter-tree`, `affinity-matrix`, or fallback) with reasoning
3. Character shortlist candidates (with why each matters structurally)
4. Faction map
5. Rule/law candidates (with consequences and equivalent system framing)
6. Relationship edge candidates (source, target, type, why edge matters)
7. Causal event chain candidates
8. Counterplay/anomaly candidates
9. Draft AI insights:
   - casual summary (accessible)
   - deep summary (mechanics/constraints/causality)
10. Open uncertainties / facts needing verification

### Quality constraints
- Do not fabricate citations or fake canonical details.
- Mark uncertainty clearly.
- Avoid encyclopedic overreach; prioritize structural relevance.
- Keep names consistent (important for later graph mapping).
- Focus on transferable payload-ready facts.

### Deliverable style
- Clean markdown/plaintext sections.
- Dense, implementation-oriented bullets preferred over long narrative.
- Every section should help downstream payload construction.

---

## Why this exists

The archive workflow separates:
- **research generation** (this document), and
- **repo implementation/integration** (`docs/MASTER_UNIVERSE_BUILD_PROMPT.md`).

That separation reduces workflow drift and keeps build agents focused on validation and integration quality.
