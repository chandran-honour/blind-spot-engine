import type {
  ExcludedPersona,
  ProductAnalysis,
  StakeholderChallenge,
} from '@/types/blind-spot'
import { CHALLENGES_PER_LENS, STAKEHOLDER_LENSES } from '@/types/blind-spot'

export function isPersonaComplete(p: unknown): p is ExcludedPersona {
  if (!p || typeof p !== 'object') return false
  const persona = p as Partial<ExcludedPersona>
  return !!(
    persona.id &&
    persona.name &&
    persona.description &&
    persona.why_excluded &&
    persona.design_implication &&
    persona.exclusion_type &&
    persona.significance
  )
}

export function isChallengeComplete(c: unknown): c is StakeholderChallenge {
  if (!c || typeof c !== 'object') return false
  const challenge = c as Partial<StakeholderChallenge>
  return !!(
    challenge.id &&
    challenge.stakeholder &&
    challenge.title &&
    challenge.concern &&
    challenge.challenge_question &&
    challenge.suggested_mitigation &&
    challenge.severity &&
    (challenge.risk_category === 'idea-specific' ||
      challenge.risk_category === 'table-stakes')
  )
}

export function hasChallengeForEveryLens(challenges: StakeholderChallenge[]): boolean {
  return STAKEHOLDER_LENSES.every(
    (lens) =>
      challenges.filter((challenge) => challenge.stakeholder === lens).length >=
      CHALLENGES_PER_LENS
  )
}

export function isProductAnalysisComplete(
  value: Partial<ProductAnalysis> | null | undefined
): value is ProductAnalysis {
  if (!value?.product_idea?.trim() || !value.summary?.trim()) return false

  const personas = (value.excluded_personas ?? []).filter(isPersonaComplete)
  const challenges = (value.stakeholder_challenges ?? []).filter(isChallengeComplete)

  return (
    personas.length >= 1 &&
    challenges.length >= STAKEHOLDER_LENSES.length * CHALLENGES_PER_LENS &&
    hasChallengeForEveryLens(challenges)
  )
}
