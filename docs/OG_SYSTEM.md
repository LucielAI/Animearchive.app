# Open Graph System

The archive uses dynamic Open Graph image generation.

## File

api/og.jsx

## Features

- 1200x630 OG images
- universe-specific styling
- Roboto Mono typography
- dark brutalist design

## Middleware

middleware.js intercepts /universe/:slug routes and injects OG metadata dynamically.

This enables:

- Twitter embeds
- Discord previews
- shareable archive cards