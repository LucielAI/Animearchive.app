# Image Patch Workflow

This document standardizes the image resolution workflow for Anime Architecture Archive.

## The Problem
Manually copying Jikan/MyAnimeList `imageUrl` links for characters is slow and prone to error. AI agents building payload JSONs often either:
1. Fabricate fake URLs to pass validation.
2. Hit the generic character API which returns spoiler-heavy or irrelevant low-res images.

## The Solution
`scripts/patch_jikan_images.py`

This script automates fetching the official primary anime poster and the correct high-res cast images from Jikan, and patches them into your JSON file cleanly.

## Pipeline Position
This is **Stage 3.5** of the Universe Pipeline. It sits between payload generation and validation.

**Workflow:**
1. AI Research (generates data)
2. JSON Payload created (with empty/null `imageUrl` and `animeImageUrl`, or fallback states)
3. **Run Image Patch:**
   ```bash
   python scripts/patch_jikan_images.py --file src/data/my_new_universe.json
   ```
4. Validate Payload: `npm run validate:payload src/data/my_new_universe.json`
5. Integrate Database: `npm run add:universe src/data/my_new_universe.json`

## Script Behaviors
* It reads `malId` from the JSON to fetch from Jikan.
* It gracefully normalizes Japanese name formatting (e.g. `LastName, FirstName` or `First Last`) via set intersection.
* It never overwrites explicit, manually set images if they are intentionally different unless the payload lacks images or has failed states.
* It automatically removes `_fetchFailed` boolean flags when a valid image is found, rescuing the entry from its premium UI fallback state. 

## Safe Fallbacks
If a character doesn't have an official match:
- `imageUrl` should remain `null`
- `_fetchFailed` should be set to `true`
- The `ImageWithFallback.jsx` component will render the premium aesthetic gradient with the appropriate Lucide icon instead. This is functioning by design. Do not panic and fabricate an image URL to fix it.
