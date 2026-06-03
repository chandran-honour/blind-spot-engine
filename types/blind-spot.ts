// -------------------------------------------------------
// Audience mode — startup vs enterprise PM framing
// -------------------------------------------------------

export type AudienceMode = 'startup' | 'enterprise'

export const AUDIENCE_MODES: AudienceMode[] = ['startup', 'enterprise']

// -------------------------------------------------------
// Phase 1 — Excluded Personas
// People this product will not serve well
// -------------------------------------------------------

export type ExclusionType =
  | 'by-design'        // intentionally out of scope
  | 'by-assumption'    // excluded through unexamined assumptions
  | 'by-circumstance'  // excluded due to access, ability, or context

export type Significance = 'high' | 'medium' | 'low'

export interface ExcludedPersona {
  id: string
  name: string                   // e.g. "The Elderly Non-Smartphone User"
  description: string            // who they are in 1-2 sentences
  why_excluded: string           // why this product doesn't serve them
  design_implication: string     // what this means for design decisions
  exclusion_type: ExclusionType
  significance: Significance     // how significant this exclusion is
}

// -------------------------------------------------------
// Phase 2 — Stakeholder Gauntlet
// Challenges from each stakeholder perspective
// -------------------------------------------------------

export type StakeholderLens =
  | 'business'
  | 'product'
  | 'technical'
  | 'delivery'

export type Severity = 'high' | 'medium' | 'low'

export interface StakeholderChallenge {
  id: string
  stakeholder: StakeholderLens
  title: string                  // short challenge title, max 8 words
  concern: string                // 2-3 sentences explaining the concern
  challenge_question: string     // sharp question that forces re-examination
  severity: Severity
  research_insight?: string      // optional grounding fact or example
}

// -------------------------------------------------------
// Full analysis result
// -------------------------------------------------------

export interface ProductAnalysis {
  product_idea: string
  summary: string                       // 2-3 sentence overview of key findings
  excluded_personas: ExcludedPersona[]  // 3-5 personas
  stakeholder_challenges: StakeholderChallenge[]  // 1-2 challenges per stakeholder lens
}
