/**
 * Starter profiles express which sections matter most by system type.
 *
 * These are intentionally lightweight editorial defaults for a foundation pass.
 * They are guidance signals, not hard schema limits. Final payloads should still
 * be manually adjusted to fit universe scope.
 */
export const STARTER_PROFILES = {
  timeline: {
    densityClass: 'tight-causal',
    prioritize: ['causalEvents', 'anomalies', 'rules'],
    minTargets: { causalEvents: 4, rules: 4, characters: 6 },
    baseCaps: { causalEvents: 8, anomalies: 6, rules: 6, characters: 8, relationships: 10, factions: 6, counterplay: 6, powerSystem: 6 },
    stretchCaps: { causalEvents: 12, anomalies: 8, rules: 8, characters: 10, relationships: 14, factions: 8, counterplay: 8, powerSystem: 7 }
  },
  'node-graph': {
    densityClass: 'broad-network',
    prioritize: ['characters', 'relationships', 'factions'],
    minTargets: { characters: 8, relationships: 10, factions: 4 },
    baseCaps: { characters: 10, relationships: 16, factions: 6, rules: 6, anomalies: 6, causalEvents: 6, counterplay: 8, powerSystem: 6 },
    stretchCaps: { characters: 14, relationships: 24, factions: 9, rules: 8, anomalies: 8, causalEvents: 8, counterplay: 10, powerSystem: 7 }
  },
  'counter-tree': {
    densityClass: 'focused-combat',
    prioritize: ['rules', 'counterplay', 'anomalies'],
    minTargets: { counterplay: 5, rules: 4, characters: 6 },
    baseCaps: { rules: 8, counterplay: 10, anomalies: 6, characters: 8, relationships: 10, factions: 6, causalEvents: 6, powerSystem: 6 },
    stretchCaps: { rules: 10, counterplay: 14, anomalies: 8, characters: 10, relationships: 14, factions: 8, causalEvents: 8, powerSystem: 7 }
  },
  'affinity-matrix': {
    densityClass: 'hybrid-affinity',
    prioritize: ['relationships', 'characters', 'factions'],
    minTargets: { relationships: 6, characters: 6, factions: 3 },
    baseCaps: { characters: 9, relationships: 14, factions: 6, rules: 6, anomalies: 6, causalEvents: 6, counterplay: 6, powerSystem: 6 },
    stretchCaps: { characters: 12, relationships: 20, factions: 8, rules: 8, anomalies: 8, causalEvents: 8, counterplay: 8, powerSystem: 7 }
  },
  'standard-cards': {
    densityClass: 'balanced-standard',
    prioritize: ['characters', 'rules', 'factions'],
    minTargets: { characters: 6, rules: 4, factions: 3 },
    baseCaps: { characters: 8, rules: 6, factions: 6, relationships: 10, anomalies: 5, causalEvents: 5, counterplay: 6, powerSystem: 6 },
    stretchCaps: { characters: 11, rules: 8, factions: 8, relationships: 14, anomalies: 8, causalEvents: 8, counterplay: 8, powerSystem: 7 }
  }
}

export function detectSystemType(research = {}) {
  if (research.visualizationHint) return research.visualizationHint

  const thesis = (research.structuralThesis || '').toLowerCase()
  if (thesis.includes('time') || thesis.includes('causal')) return 'timeline'
  if (thesis.includes('counter') || thesis.includes('economy') || thesis.includes('trade-off')) return 'counter-tree'
  if (thesis.includes('network') || thesis.includes('contract') || thesis.includes('alliance')) return 'node-graph'

  return 'standard-cards'
}
