# Universe Ingestion Pipeline

The archive includes a structured pipeline for adding new universes.

## Actual Workflow

### Stage 1 — Research
Input:
- anime name
- MASTER_RESEARCH_PROMPT.md
- optionally RESEARCH_GUIDE.md

Output:
- structured research file

### Stage 2 — Payload Generation
Input:
- full docs zip
- research file

Output:
- archive-compatible JSON payload

### Stage 3 — Validation
Run:

npm run validate:payload payload.json

### Stage 4 — Integration
Run:

npm run add:universe payload.json

## What the integration script does
- validates schema
- generates slug
- copies payload into src/data/
- registers universe in src/data/index.js
- enables routing via /universe/:slug
- removes pending stub when configured to do so

## Important Distinction
Do NOT confuse research with payload generation.

Research should be broad and system-aware.
Payload generation should be schema-aware and renderer-aware.
