# Universe Ingestion Pipeline

The archive includes a structured pipeline for adding new universes.

## Steps

1. Generate research using the master research prompt.
2. Convert research into a structured JSON payload.
3. Validate the payload.
4. Integrate the universe.

## Commands

Validate payload:

npm run validate:payload payload.json

Add universe:

npm run add:universe payload.json

## What the integration script does

- validates schema
- generates slug
- copies payload into src/data/
- registers universe in src/data/index.js
- enables routing via /universe/:slug