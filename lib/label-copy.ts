/** Shared copy for significance, exclusion, severity, and lens labels. */

export const PERSONA_LEGEND_TITLE = 'How to read these cards'

export const PERSONA_LEGEND_LINES = [
  {
    term: 'Significance',
    definition:
      'High = could invalidate core assumptions or cause serious harm; Medium = important gap; Low = worth noting',
  },
  {
    term: 'Exclusion',
    definition:
      'By design = intentionally out of scope; By assumption = excluded due to unexamined beliefs; By circumstance = structural barriers',
  },
] as const

export const CHALLENGE_LEGEND_LINES = [
  {
    term: 'Severity',
    definition:
      'High = likely blocker in review; Medium = needs clear answer; Low = monitor',
  },
  {
    term: 'Lens',
    definition:
      'Business = ROI, risk, and market fit; Product = user value and roadmap trade-offs; Technical = feasibility and architecture; Delivery = operations, compliance, and rollout',
  },
] as const

export const BADGE_DIMENSION_LABELS = {
  significance: 'Significance',
  exclusion: 'Exclusion',
  severity: 'Severity',
  lens: 'Lens',
} as const
