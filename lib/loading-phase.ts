import { isChallengeComplete, isPersonaComplete } from '@/lib/analysis-guards'
import type { ProductAnalysis } from '@/types/blind-spot'

export type LoadingPhase = 'starting' | 'personas' | 'challenges' | 'finishing'

export function getLoadingPhase(result: Partial<ProductAnalysis> | null | undefined): LoadingPhase {
  if (!result) return 'starting'

  const personas = (result.excluded_personas ?? []).filter(isPersonaComplete)
  const challenges = (result.stakeholder_challenges ?? []).filter(isChallengeComplete)

  if (personas.length === 0) return 'personas'
  if (challenges.length === 0) return 'challenges'
  return 'finishing'
}

export function getLoadingMessage(phase: LoadingPhase): string {
  switch (phase) {
    case 'starting':
      return 'Starting analysis…'
    case 'personas':
      return 'Identifying excluded personas…'
    case 'challenges':
      return 'Running stakeholder challenge…'
    case 'finishing':
      return 'Finishing up…'
  }
}
