# Architectural Decision Records (ADRs)

This document serves as the historical log of major structural decisions for the Anime Architecture Archive. It records not just *what* the system does, but *why* the choices were made, reflecting the intentional design required for a serious intelligence platform.

---

## ADR-001 — Renderer-First Architecture

* **Decision:** The platform is built around unique visualization engines (Node Graph, Counter Tree, Timeline) driven by a universe's underlying mechanical thesis, rather than attempting to render a flat, one-size-fits-all wiki template.
* **Context:** Traditional fan wikis present lore sequentially. This strips away the unique structural rules—such as Jujutsu Kaisen's economy or Attack on Titan's deterministic loops—making complex universes feel generic. 
* **Why this choice was made:** A renderer-first architecture forces the data ingestion process to extract the absolute core mechanics of a universe instead of bloat. It creates immediate cognitive payoff instead of requiring users to read paragraphs of text.
* **Tradeoffs:** It is significantly harder to normalize data structures. Some anime may not easily fit an existing renderer, requiring custom engine development.
* **Consequences:** We established a visualization registry (`src/visualizations/registry.js`). Every incoming payload must be explicitly evaluated for its structural identity (`visualizationHint`) before data entry.

---

## ADR-002 — LORE / SYS Dual Narrative Model

* **Decision:** Every structural data point within a universe payload supports both a human-readable narrative framing (`loreDesc`) and an analytical, systems-level interpretation (`systemDesc`), toggleable via a global UI state.
* **Context:** The archive serves two primary audiences: traditional fans seeking aesthetic lore, and analytical users looking for "anime-as-code" structural breakdowns.
* **Why this choice was made:** Including both modes doubles the audience appeal and creates immediate visual contrast (the TikTok "wow" factor) without requiring a completely separate database. It leans into the "Classified Government Archive" aesthetic.
* **Tradeoffs:** Doubles the writing and curation workload during the research ingestion pipeline.
* **Consequences:** The entire React UI (`Dashboard.jsx`, dynamic visualizers) must subscribe to and flawlessly respect the `isSystemMode` state across all text rendering.

---

## ADR-003 — Renderer-Aware Soft Schema Validation

* **Decision:** Payload validation (`validatePayload.js`) shifted from enforcing rigid global element limits (e.g., exactly 6 characters, exactly 3 rules) to "soft guidance" warning systems that judge density based on the requested renderer.
* **Context:** Early architectural drafts strictly required specific node counts to ensure the UI didn't break. However, anime scaling is wildly diverse.
* **Why this choice was made:** A 12-episode show has a smaller causal footprint than a 10-year shonen epic. Forcing a rigid mold resulted in either hallucinated filler data to meet a quota or truncated mechanics that failed the universe's complexity.
* **Tradeoffs:** The frontend UI components require significantly more internal resilience to handle variable payload sizes without looking empty or breaking layouts.
* **Consequences:** The CLI validation tool now guides optimal render density (e.g., warning if a timeline has fewer than 2 events) without hard-blocking edge cases.

---

## ADR-004 — Research-to-Payload Generation Pipeline

* **Decision:** The universe generator script (`generateUniversePayload.js`) is designed strictly as a "formatting transformer" that consumes externally curated research documents, explicitly avoiding the hallucination of a full universe schema from just a title prompt.
* **Context:** While LLMs are powerful, attempting to generate a highly interconnected layout of combat strategies, character dependencies, and lore directly from an anime's name frequently results in hallucinated power mechanics or generic relationships.
* **Why this choice was made:** Quality, canonical accuracy, and structural insight are the product's primary value propositions. The generator must faithfully map human/AI research into the strict JSON schema rather than inventing rules.
* **Tradeoffs:** Requires upfront curation and research documentation before running the ingestion pipeline, slowing down the sheer volume of universes that can be added simultaneously.
* **Consequences:** The pipeline expects a source file to parse, anchoring the structural logic in verified data.

---

## ADR-005 — StandardCards Fallback & Error Boundary Strategy

* **Decision:** Dynamic visualization components are wrapped in a React `ErrorBoundary` that gracefully degrades to the `StandardCardsExplorer` if the primary renderer fails.
* **Context:** Complex D3 node-graph physics and highly targeted SVG visualizers are brittle. If a payload misses a required relationship edge or causal node, the engine could crash.
* **Why this choice was made:** A degraded UI (entity cards) is vastly superior to a white screen of death, especially for users discovering the platform on mobile via social links. 
* **Tradeoffs:** This approach can mask underlying schema deficiencies if developers aren't actively monitoring the terminal warnings.
* **Consequences:** Required robust, visible console logging within the Error Boundary to surface silent rendering failures for local development.

---

## ADR-006 — Route-Based Universe Architecture

* **Decision:** The platform utilizes `react-router-dom` to dynamically map and serve distinct URLs (`/universe/:slug`) rather than relying purely on localized component state to swap datasets.
* **Context:** The archive started as a single-page dashboard prototype that toggled JSON files on the fly. 
* **Why this choice was made:** Social shareability is king. Users cannot share a specific "Wow Moment" or direct a friend to the Jujutsu Kaisen system breakdown without a distinct, canonical URL.
* **Tradeoffs:** Complicates local state persistence during page swaps and requires configuring Vercel routing rewrite rules.
* **Consequences:** Required the creation of a static global manifest (`ANIME_LIST` in `src/data/index.js`) to expose available routes to the router engine natively.

---

## ADR-007 — Dynamic Open Graph Generation

* **Decision:** The project utilizes Vercel Edge functions (`api/og.jsx`) to dynamically generate rich metadata card images specific to each `/universe/:slug` route.
* **Context:** Social sharing platforms (Twitter, Discord, iMessage) rely heavily on `og:image` tags. Static, generic repository images dramatically reduce click-through rates.
* **Why this choice was made:** High-impact social linking requires specific universe branding to signal value immediately in a feed. If a user shares the HxH page, the preview card must scream HxH.
* **Tradeoffs:** Introduces Edge runtime complexity, strict font loading protocols, and API latency considerations.
* **Consequences:** Necessitated local font buffering (`RobotoMono-Bold.ttf`) to bypass Vercel Edge remote fetch timeouts and guarantee reliable card generation.

---

## ADR-008 — Product Positioning Strategy

* **Decision:** The archive's architecture, pacing, and visual language are intentionally optimized to serve dual purposes: acting as a senior-level portfolio piece (React/Vite/D3 architecture) and a viral content generator (TikTok/Reels shareability).
* **Context:** Many side projects fail because they are either visually stunning but technically hollow, or technically brilliant but visually sterile. 
* **Why this choice was made:** A highly polished, performant UI with dramatic visual reveals inherently serves both audiences. Code quality enables the visual impact, and visual impact drives traffic to the code.
* **Tradeoffs:** Deprioritizes certain traditional web accessibility or standard design system patterns in favor of stylized, high-contrast brutalist aesthetics and "wow" visual interactions.
* **Consequences:** Driven major architectural decisions, including the `initialReveal` strategic delay on graphs, the strict non-white background UI constraint, and dynamic tone switching.
