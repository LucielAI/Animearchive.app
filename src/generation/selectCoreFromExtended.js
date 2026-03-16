import { detectSystemType, STARTER_PROFILES } from './starterProfiles'

/**
 * Deterministic core selector (foundation pass).
 *
 * This is intentionally simple and predictable:
 * - no AI scoring,
 * - no schema mutation outside expected core sections,
 * - no renderer coupling.
 */
function rankBySignal(items = [], scoreFn) {
  return [...items]
    .map((item) => ({ item, score: scoreFn(item) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

function cap(items = [], max = 8) {
  return items.slice(0, max)
}

function resolveScopeLevel(extended = {}, profile = {}) {
  const explicit = (extended.scopeFitDensity || '').toLowerCase()
  if (['tight', 'medium', 'broad', 'hybrid'].includes(explicit)) return explicit

  const profileComplexity = Number(extended?.systemProfile?.factionComplexity) || 0
  const profileCausal = Number(extended?.systemProfile?.causalDensity) || 0
  const structuralSignals = [
    Array.isArray(extended.characters) ? extended.characters.length : 0,
    Array.isArray(extended.relationships) ? extended.relationships.length : 0,
    Array.isArray(extended.factions) ? extended.factions.length : 0,
    Array.isArray(extended.causalEvents) ? extended.causalEvents.length : 0
  ]

  const maxSignal = Math.max(...structuralSignals, 0)
  if (profile?.densityClass === 'hybrid-affinity' || (profileComplexity >= 3 && profileCausal >= 3)) return 'hybrid'
  if (maxSignal >= 16 || profileComplexity >= 3) return 'broad'
  if (maxSignal >= 10 || profileCausal >= 2) return 'medium'
  return 'tight'
}

function pickCaps(profile, scopeLevel) {
  const base = profile.baseCaps || profile.caps || {}
  const stretch = profile.stretchCaps || base

  if (scopeLevel === 'broad' || scopeLevel === 'hybrid') return stretch
  if (scopeLevel === 'medium') {
    const merged = {}
    Object.keys({ ...base, ...stretch }).forEach((key) => {
      const b = Number(base[key] || 0)
      const s = Number(stretch[key] || b)
      merged[key] = Math.max(b, Math.round((b + s) / 2))
    })
    return merged
  }

  return base
}

export function selectCoreFromExtended(extended = {}) {
  const systemType = detectSystemType(extended)
  const profile = STARTER_PROFILES[systemType] || STARTER_PROFILES['standard-cards']
  const scopeLevel = resolveScopeLevel(extended, profile)
  const caps = pickCaps(profile, scopeLevel)

  // Signal examples: relationship density + explicit system importance.
  const rankedRelationships = rankBySignal(extended.relationships || [], (rel) => {
    const weight = Number(rel.weight) || 0
    const systemImportance = rel.systemImportance ? 3 : 0
    return weight + systemImportance
  })

  // Signal examples: danger, faction relevance, system-level relevance.
  const rankedCharacters = rankBySignal(extended.characters || [], (char) => {
    const danger = Number(char.dangerLevel) || 0
    const factionRelevance = char.factionRelevance ? 2 : 0
    const systemImportance = char.systemImportance ? 3 : 0
    return danger + factionRelevance + systemImportance
  })

  // Signal examples: anomaly severity + explicit significance.
  const rankedAnomalies = rankBySignal(extended.anomalies || [], (a) => {
    const severity = ['low', 'medium', 'high', 'fatal'].indexOf((a.severity || '').toLowerCase())
    const anomalySignificance = a.significance ? 2 : 0
    return Math.max(severity, 0) + anomalySignificance
  })

  // Signal examples: causal importance + stakes.
  const rankedEvents = rankBySignal(extended.causalEvents || [], (event) => {
    const causalImportance = Number(event.causalImportance) || 0
    const stakes = Number(event.stakes) || 0
    return causalImportance + stakes
  })

  // Signal examples: counterplay centrality + explicit counters.
  const rankedCounterplay = rankBySignal(extended.counterplay || [], (entry) => {
    const centrality = Number(entry.counterplayCentrality) || 0
    const explicit = entry.explicitCounter ? 2 : 0
    return centrality + explicit
  })

  return {
    ...extended,
    visualizationHint: systemType,
    characters: cap(rankedCharacters, caps.characters || 8),
    relationships: cap(rankedRelationships, caps.relationships || 12),
    factions: cap(extended.factions || [], caps.factions || 6),
    rules: cap(extended.rules || [], caps.rules || 6),
    anomalies: cap(rankedAnomalies, caps.anomalies || 6),
    causalEvents: cap(rankedEvents, caps.causalEvents || 8),
    counterplay: cap(rankedCounterplay, caps.counterplay || 8),
    powerSystem: cap(extended.powerSystem || [], caps.powerSystem || 6),
    __selectionProfile: {
      systemType,
      scopeLevel,
      densityClass: profile.densityClass,
      prioritize: profile.prioritize,
      minTargets: profile.minTargets || {},
      caps
    }
  }
}
