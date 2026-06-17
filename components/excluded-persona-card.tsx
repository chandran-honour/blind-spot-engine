import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BADGE_DIMENSION_LABELS } from '@/lib/label-copy'
import {
  badgeSeverityClass,
  calloutBorderClass,
  calloutLabelClass,
  exclusionBadgeClass,
} from '@/lib/theme-colors'
import type { ExcludedPersona, ExclusionType } from '@/types/blind-spot'

const EXCLUSION_LABELS: Record<ExclusionType, string> = {
  'by-design': 'By Design',
  'by-assumption': 'By Assumption',
  'by-circumstance': 'By Circumstance',
}

function exclusionBadgeClassName(type: ExclusionType): string {
  if (type === 'by-design') return 'border-border text-muted-foreground'
  return exclusionBadgeClass[type]
}

interface ExcludedPersonaCardProps {
  persona: ExcludedPersona
}

export function ExcludedPersonaCard({ persona }: ExcludedPersonaCardProps) {
  return (
    <Card className="bg-card border-border hover:border-muted-foreground/30 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug text-base min-w-0">
            {persona.name}
          </h3>
          <div className="flex flex-wrap items-end gap-3 sm:shrink-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {BADGE_DIMENSION_LABELS.significance}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${badgeSeverityClass[persona.significance]}`}
              >
                {persona.significance}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {BADGE_DIMENSION_LABELS.exclusion}
              </span>
              <Badge
                variant="outline"
                className={`text-xs whitespace-nowrap w-fit ${exclusionBadgeClassName(persona.exclusion_type)}`}
              >
                {EXCLUSION_LABELS[persona.exclusion_type]}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mt-1">
          {persona.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="bg-muted rounded-lg p-3 border border-border">
          <p className={`text-xs font-medium mb-1.5 ${calloutLabelClass.excluded}`}>Why excluded</p>
          <p className="text-foreground/90 text-sm leading-relaxed">{persona.why_excluded}</p>
        </div>

        <div className={`bg-muted rounded-lg p-3 border ${calloutBorderClass.info}`}>
          <p className={`text-xs font-medium mb-1.5 ${calloutLabelClass.info}`}>Design implication</p>
          <p className="text-foreground/90 text-sm leading-relaxed">{persona.design_implication}</p>
        </div>
      </CardContent>
    </Card>
  )
}
