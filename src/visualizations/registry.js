import { lazy } from 'react'

const TimelineExplorer = lazy(() => import('./TimelineExplorer'))
const NodeGraphExplorer = lazy(() => import('./NodeGraphExplorer'))
const CounterTreeExplorer = lazy(() => import('./CounterTreeExplorer'))
const AffinityMatrixExplorer = lazy(() => import('./AffinityMatrixExplorer'))
const StandardCardsExplorer = lazy(() => import('./StandardCardsExplorer'))

export const VISUALIZATION_REGISTRY = {
  'timeline': TimelineExplorer,
  'node-graph': NodeGraphExplorer,
  'counter-tree': CounterTreeExplorer,
  'affinity-matrix': AffinityMatrixExplorer,
  'standard-cards': StandardCardsExplorer,
}

export function getVisualization(hint) {
  const Component = VISUALIZATION_REGISTRY[hint]
  if (!Component) {
    console.warn(`[ARCHIVE] No visualization found for hint: "${hint}". Falling back to standard-cards.`)
    return StandardCardsExplorer
  }
  return Component
}
