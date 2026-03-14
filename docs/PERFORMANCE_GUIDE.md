# Performance Guide

## Current strategy

- Route-level lazy loading is preserved (`Dashboard` and all visualization renderers are split).
- Universe payload JSON stays route-loaded via `import.meta.glob` and never bundled into the homepage/catalog.
- StandardCards fallback is now loaded lazily in renderer fallbacks and error boundaries to preserve visualization chunk boundaries.
- Telemetry (Vercel Analytics + Speed Insights) is deferred to idle time to keep initial route execution focused on content.

## Build visibility

Use:

```bash
npm run build
```

Review generated chunk sizes from Vite output and check for warnings about mixed static/dynamic imports.

## Cache policy (Vercel)

- Fingerprinted `/assets/*` are immutable for 1 year.
- `/src/data/*.json` payloads are cached at edge (`s-maxage=86400`, `stale-while-revalidate=604800`).
- `/api/og` is edge-cached (`s-maxage=86400`, `stale-while-revalidate=604800`).
- HTML app shell stays revalidated (`max-age=0, must-revalidate`) for safe freshness.

## Audit checklist

1. No mixed static + dynamic imports for visualization modules.
2. Homepage hero/featured image priority is limited to true above-the-fold assets.
3. Catalog remains metadata-only with no eager universe payload fetch.
4. Telemetry and community/support widgets never block first paint.
5. Validate with:
   - `npm run validate:all`
   - `npm run test`
   - `npm run build`
