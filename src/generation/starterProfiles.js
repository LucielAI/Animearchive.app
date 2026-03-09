export const STARTER_PROFILES = {
  timeline: {
    prioritize: ['causalEvents', 'anomalies', 'rules'],
    caps: { causalEvents: 8, anomalies: 6, rules: 6, characters: 8, relationships: 10, factions: 6 }
  },
  'node-graph': {
    prioritize: ['characters', 'relationships', 'factions'],
    caps: { characters: 10, relationships: 16, factions: 6, rules: 5, anomalies: 5 }
  },
  'counter-tree': {
    prioritize: ['rules', 'counterplay', 'anomalies'],
    caps: { rules: 8, counterplay: 10, anomalies: 6, characters: 8, relationships: 10 }
  },
  'standard-cards': {
    prioritize: ['characters', 'rules', 'factions'],
    caps: { characters: 8, rules: 6, factions: 6, relationships: 10, anomalies: 5 }
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
