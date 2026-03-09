import { validateCorePayload } from '../utils/validateSchema'

const dataFiles = import.meta.glob('./*.json', { eager: true })

function extractSlug(filePath) {
  const fileName = filePath.split('/').pop() || ''
  return fileName
    .replace(/\.extended\.json$/, '')
    .replace(/\.core\.json$/, '')
    .replace(/\.json$/, '')
}

const groupedBySlug = Object.entries(dataFiles).reduce((acc, [filePath, mod]) => {
  const payload = mod.default || mod
  const slug = extractSlug(filePath)

  if (!acc[slug]) {
    acc[slug] = { slug, legacy: null, core: null, extended: null }
  }

  if (filePath.endsWith('.extended.json')) {
    acc[slug].extended = payload
  } else if (filePath.endsWith('.core.json')) {
    acc[slug].core = payload
  } else {
    acc[slug].legacy = payload
  }

  return acc
}, {})

const preferredOrder = ['aot', 'jjk', 'hxh', 'vinlandsaga']
const discoveredSlugs = Object.keys(groupedBySlug)
const slugs = [
  ...preferredOrder.filter(slug => discoveredSlugs.includes(slug)),
  ...discoveredSlugs.filter(slug => !preferredOrder.includes(slug)).sort()
]

export const UNIVERSE_DATA_REGISTRY = slugs.reduce((acc, slug) => {
  const entry = groupedBySlug[slug]
  const corePayload = entry.core || entry.legacy

  if (!corePayload) return acc

  corePayload.id = slug

  acc[slug] = {
    slug,
    core: corePayload,
    extended: entry.extended || null,
    source: entry.core ? 'core' : 'legacy'
  }

  return acc
}, {})

export const ANIME_LIST = slugs
  .map(slug => UNIVERSE_DATA_REGISTRY[slug]?.core)
  .filter(Boolean)

ANIME_LIST.forEach(validateCorePayload)
