import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { StakeholderChallenge, StakeholderLens, Severity } from '@/types/blind-spot'

const SEVERITY_STYLES: Record<Severity, string> = {
  high: 'bg-red-950 text-red-400 border border-red-900',
  medium: 'bg-amber-950 text-amber-400 border border-amber-900',
  low: 'bg-emerald-950 text-emerald-400 border border-emerald-900',
}

const STAKEHOLDER_LABELS: Record<StakeholderLens, string> = {
  business: 'Business & Finance',
  product: 'Product & PM',
  technical: 'Technical & Engineering',
  delivery: 'Delivery & Operations',
}

const STAKEHOLDER_STYLES: Record<StakeholderLens, string> = {
  business: 'border-violet-900 text-violet-400',
  product: 'border-blue-900 text-blue-400',
  technical: 'border-cyan-900 text-cyan-400',
  delivery: 'border-teal-900 text-teal-400',
}

interface StakeholderChallengeCardProps {
  challenge: StakeholderChallenge
}

export function StakeholderChallengeCard({ challenge }: StakeholderChallengeCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-100 leading-snug text-base">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${SEVERITY_STYLES[challenge.severity]}`}
            >
              {challenge.severity}
            </span>
            <Badge
              variant="outline"
              className={`text-xs whitespace-nowrap ${STAKEHOLDER_STYLES[challenge.stakeholder]}`}
            >
              {STAKEHOLDER_LABELS[challenge.stakeholder]}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-slate-400 text-sm leading-relaxed">{challenge.concern}</p>

        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
          <p className="text-xs font-medium text-blue-400 mb-1.5">Challenge question</p>
          <p className="text-slate-300 text-sm italic">"{challenge.challenge_question}"</p>
        </div>

        {challenge.research_insight && (
          <div className="bg-slate-950 rounded-lg p-3 border border-indigo-900/50">
            <p className="text-xs font-medium text-indigo-400 mb-1.5">Research insight</p>
            <p className="text-slate-300 text-sm">{challenge.research_insight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
