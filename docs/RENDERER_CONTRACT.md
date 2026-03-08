# Renderer Contract

The archive uses specialized visualizers depending on the universe system structure.

## Supported Renderers

### TimelineExplorer
Used for causal systems.

Examples:
- Attack on Titan
- Steins;Gate

Requirements:
- causalEvents array
- chronological ordering
- event dependencies

### CounterTreeExplorer
Used for rule-based combat or counterplay systems.

Examples:
- Jujutsu Kaisen
- Death Note

Requirements:
- counterplay nodes
- power interactions
- escalation chains

### NodeGraphExplorer
Used for relational ecosystems.

Examples:
- Hunter x Hunter
- Code Geass

Requirements:
- characters
- relationships
- faction dynamics

### StandardCardsExplorer
Fallback renderer when no specific visualization fits.

## Visualization Hint

Payloads may include:

visualizationHint

Possible values:

- timeline
- counter-tree
- node-graph
- cards