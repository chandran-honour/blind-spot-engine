import type { ExclusionType, Significance, StakeholderLens } from '@/types/blind-spot'

export const badgeSeverityClass: Record<Significance, string> = {
  high: 'badge-severity-high',
  medium: 'badge-severity-medium',
  low: 'badge-severity-low',
}

export const lensBadgeClass: Record<StakeholderLens, string> = {
  business: 'badge-lens-business',
  product: 'badge-lens-product',
  technical: 'badge-lens-technical',
  delivery: 'badge-lens-delivery',
}

export const exclusionBadgeClass: Record<Exclude<ExclusionType, 'by-design'>, string> = {
  'by-assumption': 'badge-exclusion-assumption',
  'by-circumstance': 'badge-exclusion-circumstance',
}

export const calloutLabelClass = {
  excluded: 'callout-label-excluded',
  info: 'callout-label-info',
  research: 'callout-label-research',
} as const

export const calloutBorderClass = {
  info: 'callout-border-info',
  research: 'callout-border-research',
} as const
