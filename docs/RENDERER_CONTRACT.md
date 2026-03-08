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
- chronological or attractor-field ordering
- event dependencies
- renderer-worthy causality

### CounterTreeExplorer
Used for rule-based combat or counterplay systems.

Examples:
- Jujutsu Kaisen
- Death Note

Requirements:
- counterplay nodes
- power interactions
- escalation chains
- system-vs-anti-system dynamics

### NodeGraphExplorer
Used for relational ecosystems.

Examples:
- Hunter x Hunter
- Vinland Saga
- Code Geass

Requirements:
- characters
- relationships
- faction dynamics
- strong strategic or ideological network value

### StandardCardsExplorer
Fallback renderer when no specific visualization fits or when a specialized renderer fails safely.

## visualizationHint
Payloads may include:

- timeline
- counter-tree
- node-graph
- cards

## Image Handling Contract
If a character image cannot be reliably fetched:
- imageUrl may be null
- _fetchFailed: true must be set

Future agents must not fabricate image URLs to satisfy schema shape.
