import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BADGE_DIMENSION_LABELS } from '@/lib/label-copy'
import {
  badgeSeverityClass,
  calloutBorderClass,
  calloutLabelClass,
  lensBadgeClass,
} from '@/lib/theme-colors'
import type { StakeholderChallenge, StakeholderLens } from '@/types/blind-spot'

const STAKEHOLDER_LABELS: Record<StakeholderLens, string> = {
  business: 'Business & Finance',
  product: 'Product & PM',
  technical: 'Technical & Engineering',
  delivery: 'Delivery & Operations',
}

interface StakeholderChallengeCardProps {
  challenge: StakeholderChallenge
}

export function StakeholderChallengeCard({ challenge }: StakeholderChallengeCardProps) {
  return (
    <Card className="bg-card border-border hover:border-muted-foreground/30 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug text-base min-w-0">
            {challenge.title}
            {challenge.risk_category === 'table-stakes' && (
              <Badge
                variant="outline"
                className="ml-2 align-middle text-[10px] font-normal border-border text-muted-foreground"
              >
                Table-stakes
              </Badge>
            )}
          </h3>
          <div className="flex flex-wrap items-end gap-3 sm:shrink-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {BADGE_DIMENSION_LABELS.severity}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${badgeSeverityClass[challenge.severity]}`}
              >
                {challenge.severity}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {BADGE_DIMENSION_LABELS.lens}
              </span>
              <Badge
                variant="outline"
                className={`text-xs whitespace-nowrap w-fit ${lensBadgeClass[challenge.stakeholder]}`}
              >
                {STAKEHOLDER_LABELS[challenge.stakeholder]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-muted-foreground text-sm leading-relaxed">{challenge.concern}</p>

        <div className="bg-muted rounded-lg p-3 border border-border">
          <p className={`text-xs font-medium mb-1.5 ${calloutLabelClass.info}`}>Challenge question</p>
          <p className="text-foreground/90 text-sm italic">&quot;{challenge.challenge_question}&quot;</p>
        </div>

        <div className={`bg-muted rounded-lg p-3 border ${calloutBorderClass.info}`}>
          <p className={`text-xs font-medium mb-1.5 ${calloutLabelClass.info}`}>
            Suggested mitigation / next experiment
          </p>
          <p className="text-foreground/90 text-sm leading-relaxed">{challenge.suggested_mitigation}</p>
        </div>

        {challenge.research_insight && (
          <div className={`bg-muted rounded-lg p-3 border ${calloutBorderClass.research}`}>
            <p className={`text-xs font-medium mb-1.5 ${calloutLabelClass.research}`}>Research insight</p>
            <p className="text-foreground/90 text-sm">{challenge.research_insight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
