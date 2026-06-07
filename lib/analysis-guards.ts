import type {
  ExcludedPersona,
  ProductAnalysis,
  StakeholderChallenge,
} from '@/types/blind-spot'

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
    challenge.severity
  )
}

export function isProductAnalysisComplete(
  value: Partial<ProductAnalysis> | null | undefined
): value is ProductAnalysis {
  if (!value?.product_idea?.trim() || !value.summary?.trim()) return false

  const personas = (value.excluded_personas ?? []).filter(isPersonaComplete)
  const challenges = (value.stakeholder_challenges ?? []).filter(isChallengeComplete)

  return personas.length >= 1 && challenges.length >= 1
}
