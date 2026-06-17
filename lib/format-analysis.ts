import { isChallengeComplete, isPersonaComplete } from '@/lib/analysis-guards'
import type {
  ExclusionType,
  ProductAnalysis,
  StakeholderLens,
} from '@/types/blind-spot'
import { STAKEHOLDER_LENSES } from '@/types/blind-spot'

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

const STAKEHOLDER_ORDER = STAKEHOLDER_LENSES

function capitalize(value: string | undefined): string {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Formats a complete analysis as markdown for clipboard / stakeholder sharing. */
export function formatAnalysisForClipboard(result: ProductAnalysis): string {
  const sections: string[] = ['# Blind Spot Analysis Report', '']

  const personas = result.excluded_personas.filter(isPersonaComplete)
  const challenges = result.stakeholder_challenges.filter(isChallengeComplete)

  if (result.product_idea?.trim()) {
    sections.push('## Product Idea', '', result.product_idea.trim(), '')
  }

  sections.push('## Analysis Summary', '', result.summary.trim(), '')

  sections.push('## Excluded Personas', '')
  for (const persona of personas) {
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
    for (const challenge of challenges.filter((c) => c.stakeholder === lens)) {
      sections.push(
        `### ${challenge.title}`,
        `- **Lens:** ${STAKEHOLDER_LABELS[challenge.stakeholder]}`,
        `- **Severity:** ${capitalize(challenge.severity)}`,
        `- **Risk category:** ${challenge.risk_category === 'table-stakes' ? 'Table-stakes' : 'Idea-specific'}`,
        `- **Concern:** ${challenge.concern}`,
        `- **Challenge question:** ${challenge.challenge_question}`,
        `- **Suggested mitigation / next experiment:** ${challenge.suggested_mitigation}`,
        ...(challenge.research_insight
          ? [`- **Research insight:** ${challenge.research_insight}`]
          : []),
        ''
      )
    }
  }

  return sections.join('\n').trimEnd()
}
