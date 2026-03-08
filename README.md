# Anime Architecture Archive

**Live:** https://animearchive.app/

A dark cyberpunk-styled interactive archive that deconstructs fictional universes through two interpretive lenses: **LORE** (narrative) and **SYS** (strategic/systemic). 

This is not intended to be an encyclopedic wiki. It is a structural intelligence platform designed to reveal the hidden mechanics of fictional worlds—energy economies, permission hierarchies, counterplay graphs, and causal chains. 

Every universe is treated as a deterministic system. The archive renders these systems via specialized visualization engines rather than static text pages.

The platform is engineered to simultaneously serve two primary goals:
1. **Elite Frontend Portfolio:** A meticulously crafted React/Tailwind codebase showcasing complex state management, data visualization (D3/custom SVGs), and premium "Classified Government Archive" glassmorphism aesthetics.
2. **Social Viral Engine:** Designed to generate highly engaging, visually striking "wow moments" (such as dynamic node graphs or combat counter-trees) optimized closely for TikTok and short-form video content reach.

## Architecture & Visualizers

```
src/
├── App.jsx                    # Landing page + universe selector
├── Dashboard.jsx              # Universe detail view with tabs
├── data/
│   ├── index.js               # Import, validate, export all payloads
│   └── *.json                 # Hand-curated JSON intelligence schemas
├── components/
│   ├── ImageWithFallback.jsx  # Portrait with gradient fallback
│   ├── DangerBar.jsx          # Animated threat level bar
│   ├── SeverityBadge.jsx      # Rule severity indicator
│   ├── Toggle.jsx             # LORE / SYS mode switch
│   ├── Timeline.jsx           # Causality tree visualization
│   ├── NodeGraph.jsx          # Relationship graph (SVG)
│   ├── AffinityMatrix.jsx     # Faction/Character chemistry grid
│   ├── CounterTree.jsx        # Sub-system matchup/counterplay tree
│   ├── TabContent.jsx         # Tab router
│   └── tabs/                  # Logical tab sections
├── visualizations/
│   ├── registry.js            # Maps visualizationHint → explorer
│   ├── TimelineExplorer.jsx
│   ├── NodeGraphExplorer.jsx
│   ├── CounterTreeExplorer.jsx
│   ├── AffinityMatrixExplorer.jsx
│   └── StandardCardsExplorer.jsx
└── utils/
    ├── validateSchema.js      # Strict runtime payload validation
    └── resolveColor.js        # Tailwind color name → hex
```

## Data Schema & Engine Contract

Every universe payload is built via a two-stage workflow: broad system research followed by strict schema validation. The engine strictly enforces structural density over completeness.

- **Top-level:** `anime`, `tagline`, `malId`, `themeColors` (9 fields), `visualizationHint`, `visualizationReason`
- **Characters:** Strategically selected "hub" actors.
- **Power Systems:** Raw energy architectures and hardware/software analogies.
- **Rules:** The unyielding constraints governing the system.
- **Factions:** Organizations competing for system control.
- **Relationships:** Directed edges defining alliances, dependency, or betrayal.
- **Anomalies:** Instances where the system breaks or is hacked.
- **Counterplay:** Exact mechanical breakdowns of how abilities nullify or exploit each other.

### The LORE / SYS Dual Narrative
A core differentiator of the project. Every description field within a universe JSON supports two framings:
- **LORE Mode:** Human-readable, narrative-focused.
- **SYS Mode:** Root-access system-level analogy (e.g. treating a spell as "Proprietary Software" or an assassin as a "System Exploit").

## Visualization Modes

| Mode | Hint Parameter | Structural Use Case |
|---|---|---|
| Timeline | `timeline` | Linear causality, escalating stakes, event cascades |
| Node Graph | `node-graph` | Conditional alliances, betrayal webs, shifting strategic interdependence |
| Counter Tree | `counter-tree` | Technical combat matchups, counter-abilities, and power mechanics |
| Affinity Matrix | `affinity-matrix` | Faction alignment, character chemistry, compatibility scores |
| Standard Cards | `standard-cards` | Fallback component architecture |

Each payload declares its required rendering engine via `visualizationHint`.

## Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4** (PostCSS, strictly utility classes)
- **Lucide React** for UI iconography
- **D3** (for SVG layouts)
- Pure state-driven architecture within the Dashboards (No internal complex sub-routers)
- Deployed on **Vercel** with Edge-function dynamic Open Graph imagery.

## Development

```bash
npm install
npm run dev               # Dev server
npm run build             # Production build
npm run preview           # Preview production build
npm run validate:payload  # Custom CLI tool for JSON structure checking
```

## Adding a New Universe

Integrating a new system safely involves:
1. Running research utilizing `docs/MASTER_RESEARCH_PROMPT.md` to identify the structural thesis.
2. Generating a strict JSON schema conforming to `validateSchema.js`.
3. Using the custom CLI ingest command: `npm run add:universe <path-to-payload> <slug>`
4. The pipeline automatically wires the schema, tests fallbacks, and assigns the correct routing endpoints.

## License

MIT
