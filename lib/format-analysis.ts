import type {
  ExclusionType,
  ProductAnalysis,
  StakeholderLens,
} from '@/types/blind-spot'

const EXCLUSION_LABELS: Record<ExclusionType, string> = {
  'by-design': 'By Design',
  'by-assumption': 'By Assumption',
  'by-circumstance': 'By Circumstance',
}

const STAKEHOLDER_LABELS: Record<StakeholderLens, string> = {
  business: 'Business & Finance',
  product: 'Product & PM',
  technical: 'Technical & Engineering',
  delivery: 'Delivery & Operations',
}

const STAKEHOLDER_ORDER: StakeholderLens[] = [
  'business',
  'product',
  'technical',
  'delivery',
]

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Formats a complete analysis as markdown for clipboard / stakeholder sharing. */
export function formatAnalysisForClipboard(result: ProductAnalysis): string {
  const sections: string[] = ['# Blind Spot Analysis Report', '']

  if (result.product_idea?.trim()) {
    sections.push('## Product Idea', '', result.product_idea.trim(), '')
  }

  sections.push('## Analysis Summary', '', result.summary.trim(), '')

  sections.push('## Excluded Personas', '')
  for (const persona of result.excluded_personas) {
    sections.push(
      `### ${persona.name}`,
      `- **Significance:** ${capitalize(persona.significance)}`,
      `- **Exclusion:** ${EXCLUSION_LABELS[persona.exclusion_type]}`,
      `- **Why excluded:** ${persona.why_excluded}`,
      `- **Design implication:** ${persona.design_implication}`,
      ''
    )
  }

  sections.push('## Stakeholder Challenges', '')
  for (const lens of STAKEHOLDER_ORDER) {
    for (const challenge of result.stakeholder_challenges.filter(
      (c) => c.stakeholder === lens
    )) {
      sections.push(
        `### ${challenge.title}`,
        `- **Lens:** ${STAKEHOLDER_LABELS[challenge.stakeholder]}`,
        `- **Severity:** ${capitalize(challenge.severity)}`,
        `- **Concern:** ${challenge.concern}`,
        `- **Challenge question:** ${challenge.challenge_question}`,
        ''
      )
    }
  }

  return sections.join('\n').trimEnd()
}
