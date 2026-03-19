const DEFAULT_MICRO_HOOK_BY_HINT = {
  timeline: 'Map the causal chain before judging outcomes.',
  'node-graph': 'Track control edges before reading motives.',
  'counter-tree': 'Read the matchup economy before ranking strength.',
  'affinity-matrix': 'Inspect compatibility pressure before predicting alliances.',
  'standard-cards': 'Start with the governing mechanics, then compare actors.',
}

const DEFAULT_SYSTEM_TYPE_BY_HINT = {
  timeline: 'causal',
  'node-graph': 'relational',
  'counter-tree': 'counterplay',
  'affinity-matrix': 'affinity',
  'standard-cards': 'general',
}

const DEFAULT_PRIMARY_SYSTEM_BY_HINT = {
  timeline: 'entity_db',
  'node-graph': 'entity_db',
  'counter-tree': 'power_engine',
  'affinity-matrix': 'entity_db',
  'standard-cards': 'power_engine',
}

const PRIMARY_SYSTEM_TO_TAB_INDEX = {
  power_engine: 0,
  entity_db: 1,
  factions: 2,
  core_laws: 3,
}

const warnedUniverses = new Set()

function shortText(value = '', limit = 120) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  if (clean.length <= limit) return clean

  const firstSentence = clean.split(/[.!?]/)[0]?.trim()
  if (firstSentence && firstSentence.length <= limit) return `${firstSentence}.`
  return `${clean.slice(0, limit - 1).trim()}…`
}

function warnMissingFields(data, missingFields) {
  if (typeof window === 'undefined' || !data?.id || missingFields.length === 0) return
  const warningKey = `${data.id}:${missingFields.join('|')}`
  if (warnedUniverses.has(warningKey)) return
  warnedUniverses.add(warningKey)
  console.warn(`[hero-contract] ${data.id}: missing ${missingFields.join(', ')}. Using shared fallback mapping.`)
}

export function getHeroContract(data, preferredTabIndex = 0) {
  const hero = data?.hero || {}
  const hint = data?.visualizationHint || 'standard-cards'
  const title = data?.anime || 'Unknown Archive'

  const fallbackSystemType = DEFAULT_SYSTEM_TYPE_BY_HINT[hint] || 'general'
  const fallbackMicroHook = DEFAULT_MICRO_HOOK_BY_HINT[hint] || DEFAULT_MICRO_HOOK_BY_HINT['standard-cards']
  const fallbackPrimarySystemType = DEFAULT_PRIMARY_SYSTEM_BY_HINT[hint] || 'power_engine'

  const systemType = hero?.systemType || fallbackSystemType
  const microHook = shortText(hero?.microHook || fallbackMicroHook, 92)
  const thesis = shortText(hero?.thesis || data?.visualizationReason || data?.tagline, 125)
  const mechanicsCount = Array.isArray(data?.powerSystem) ? data.powerSystem.length : 0
  const linksCount = Array.isArray(data?.relationships) ? data.relationships.length : 0
  const lawsCount = Array.isArray(data?.rules) ? data.rules.length : 0

  const preferredPrimarySystemType = hero?.primarySystemType || fallbackPrimarySystemType
  const mappedTabIndex = PRIMARY_SYSTEM_TO_TAB_INDEX[preferredPrimarySystemType]
  const primaryTabIndex = Number.isInteger(mappedTabIndex) ? mappedTabIndex : preferredTabIndex
  const resolvedPrimarySystemType = Number.isInteger(mappedTabIndex) ? preferredPrimarySystemType : fallbackPrimarySystemType

  const missingFields = []
  if (!hero?.microHook) missingFields.push('hero.microHook')
  if (!hero?.thesis) missingFields.push('hero.thesis')
  if (!hero?.systemType) missingFields.push('hero.systemType')
  if (!hero?.primarySystemType) missingFields.push('hero.primarySystemType')
  warnMissingFields(data, missingFields)

  return {
    title,
    systemType,
    microHook,
    thesis,
    mechanicsCount,
    linksCount,
    lawsCount,
    primarySystemType: resolvedPrimarySystemType,
    primaryTabIndex,
  }
}

