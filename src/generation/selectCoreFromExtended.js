import { detectSystemType, STARTER_PROFILES } from './starterProfiles'

function rankBySignal(items = [], scoreFn) {
  return [...items]
    .map((item) => ({ item, score: scoreFn(item) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

function cap(items = [], max = 8) {
  return items.slice(0, max)
}

export function selectCoreFromExtended(extended = {}) {
  const systemType = detectSystemType(extended)
  const profile = STARTER_PROFILES[systemType] || STARTER_PROFILES['standard-cards']

  const rankedRelationships = rankBySignal(extended.relationships || [], (rel) => {
    const weight = Number(rel.weight) || 0
    const systemImportance = rel.systemImportance ? 3 : 0
    return weight + systemImportance
  })

  const rankedCharacters = rankBySignal(extended.characters || [], (char) => {
    const danger = Number(char.dangerLevel) || 0
    const factionRelevance = char.factionRelevance ? 2 : 0
    const systemImportance = char.systemImportance ? 3 : 0
    return danger + factionRelevance + systemImportance
  })

  const rankedAnomalies = rankBySignal(extended.anomalies || [], (a) => {
    const severity = ['low', 'medium', 'high', 'fatal'].indexOf((a.severity || '').toLowerCase())
    const anomalySignificance = a.significance ? 2 : 0
    return Math.max(severity, 0) + anomalySignificance
  })

  const rankedEvents = rankBySignal(extended.causalEvents || [], (event) => {
    const causalImportance = Number(event.causalImportance) || 0
    const stakes = Number(event.stakes) || 0
    return causalImportance + stakes
  })

  const rankedCounterplay = rankBySignal(extended.counterplay || [], (entry) => {
    const centrality = Number(entry.counterplayCentrality) || 0
    const explicit = entry.explicitCounter ? 2 : 0
    return centrality + explicit
  })

  return {
    ...extended,
    visualizationHint: systemType,
    characters: cap(rankedCharacters, profile.caps.characters || 8),
    relationships: cap(rankedRelationships, profile.caps.relationships || 12),
    factions: cap(extended.factions || [], profile.caps.factions || 6),
    rules: cap(extended.rules || [], profile.caps.rules || 6),
    anomalies: cap(rankedAnomalies, profile.caps.anomalies || 6),
    causalEvents: cap(rankedEvents, profile.caps.causalEvents || 8),
    counterplay: cap(rankedCounterplay, profile.caps.counterplay || 8),
    powerSystem: cap(extended.powerSystem || [], profile.caps.powerSystem || 6),
    __selectionProfile: {
      systemType,
      prioritize: profile.prioritize
    }
  }
}
