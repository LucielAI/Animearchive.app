# Anime Architecture Archive

**Live:** https://animearchive.app/

A dark cyberpunk-styled interactive archive that deconstructs anime universes through two interpretive lenses: **LORE** (narrative) and **SYS** (strategic/systemic). Each universe is a dense, hand-curated payload rendered through a visualization mode chosen to match the series' structural identity.

## Current Archives

| Universe | Visualization | Characters | SYS Voice |
|---|---|---|---|
| Attack on Titan | Timeline | 6 | Military intelligence briefing |
| Jujutsu Kaisen | Counter Tree | 6 | Technical systems analysis |
| Hunter x Hunter | Node Graph | 6 | Contract law / game theory |

Each payload contains 6 characters, 4 power systems, 3 rules, factions, relationships, counterplay, anomalies, and causal events — all with separate LORE and SYS descriptions.

## Architecture

```
src/
├── App.jsx                    # Landing page + universe selector
├── Dashboard.jsx              # Universe detail view with tabs
├── data/
│   ├── index.js               # Import, validate, export all payloads
│   ├── aot.json               # Attack on Titan
│   ├── jjk.json               # Jujutsu Kaisen
│   └── hxh.json               # Hunter x Hunter
├── components/
│   ├── ImageWithFallback.jsx  # Portrait with gradient fallback
│   ├── DangerBar.jsx          # Animated threat level bar
│   ├── SeverityBadge.jsx      # Rule severity indicator
│   ├── Toggle.jsx             # LORE / SYS mode switch
│   ├── Timeline.jsx           # Timeline visualization
│   ├── NodeGraph.jsx          # Relationship graph (SVG)
│   ├── AffinityMatrix.jsx     # Character affinity grid
│   ├── CounterTree.jsx        # Counterplay tree
│   ├── TabContent.jsx         # Tab router
│   └── tabs/
│       ├── PowerEngineTab.jsx
│       ├── EntityDatabaseTab.jsx
│       ├── FactionsTab.jsx
│       └── CoreLawsTab.jsx
├── visualizations/
│   ├── registry.js            # Maps visualizationHint → explorer
│   ├── TimelineExplorer.jsx
│   ├── NodeGraphExplorer.jsx
│   ├── CounterTreeExplorer.jsx
│   ├── AffinityMatrixExplorer.jsx
│   └── StandardCardsExplorer.jsx
└── utils/
    ├── validateSchema.js      # Runtime payload validation
    └── resolveColor.js        # Tailwind color name → hex
```

## Data Schema

Every anime payload is validated on import. Required structure:

- **Top-level:** `anime`, `tagline`, `malId`, `themeColors` (9 fields), `visualizationHint`, `visualizationReason`
- **Characters (6):** `name`, `title`, `rank`, `dangerLevel`, `loreBio`, `systemBio`, `gradientFrom`, `gradientTo`, `accentColor`, `icon`, `signatureMoment`, `imageUrl`
- **Power Systems (4):** `name`, `subtitle`, `loreDesc`, `systemDesc`, `icon`, `color`, `signatureMoment`
- **Rules (3):** `name`, `subtitle`, `loreConsequence`, `systemEquivalent`, `severity`
- **Factions:** `name`, `role`, `loreDesc`, `systemDesc`, `icon`, `color`
- **Relationships:** `source`, `target`, `type`, `weight`, `loreDesc`, `systemDesc`
- **Rankings:** `systemName`, `loreName`, `topTierName`, `tiers[]`

## Visualization Modes

| Mode | Hint | Best For |
|---|---|---|
| Timeline | `timeline` | Linear causality, escalating stakes |
| Node Graph | `node-graph` | Conditional alliances, betrayal webs |
| Counter Tree | `counter-tree` | Technical matchups, ability interactions |
| Affinity Matrix | `affinity-matrix` | Faction alignment, character chemistry |
| Standard Cards | `standard-cards` | Fallback grid layout |

Each payload declares its preferred mode via `visualizationHint`.

## Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4** (PostCSS)
- **Lucide React** for icons
- No router — state-driven navigation
- Deployed on **Vercel**

## Development

```bash
npm install
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Adding a New Universe

1. Create `src/data/<slug>.json` following the schema above
2. Import and add to `ANIME_LIST` in `src/data/index.js`
3. Set `visualizationHint` to match the series' structural identity
4. Validation runs automatically on import — check console for warnings

## License

MIT
