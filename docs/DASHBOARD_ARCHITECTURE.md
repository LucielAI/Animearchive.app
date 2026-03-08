# Dashboard Architecture

Each universe page is mounted at:

/universe/:slug

Examples:
- /universe/aot
- /universe/jjk
- /universe/hxh
- /universe/vinlandsaga

## Dashboard Layout

Header
↓
SystemSummary
↓
WhyThisRenderer
↓
Tabs Navigation
↓
Visualizers
↓
ExploreAnotherUniverse
↓
Footer

## Tabs
Typical tabs include:
- Power Engine
- Entity Database
- Core Laws
- Counterplay
- Timeline / causal structures where applicable

## Responsibility Boundaries

SystemSummary
→ immediate comprehension

WhyThisRenderer
→ explains the visualization choice

Visualizers
→ deliver the “wow moment” and deeper understanding

ExploreAnotherUniverse
→ keeps users inside the archive ecosystem
