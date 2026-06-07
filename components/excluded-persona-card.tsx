import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BADGE_DIMENSION_LABELS } from '@/lib/label-copy'
import type { ExcludedPersona, ExclusionType, Significance } from '@/types/blind-spot'

const SIGNIFICANCE_STYLES: Record<Significance, string> = {
  high: 'bg-red-950 text-red-400 border border-red-900',
  medium: 'bg-amber-950 text-amber-400 border border-amber-900',
  low: 'bg-emerald-950 text-emerald-400 border border-emerald-900',
}

const EXCLUSION_LABELS: Record<ExclusionType, string> = {
  'by-design': 'By Design',
  'by-assumption': 'By Assumption',
  'by-circumstance': 'By Circumstance',
}

const EXCLUSION_STYLES: Record<ExclusionType, string> = {
  'by-design': 'border-slate-700 text-slate-400',
  'by-assumption': 'border-orange-900 text-orange-400',
  'by-circumstance': 'border-purple-900 text-purple-400',
}

interface ExcludedPersonaCardProps {
  persona: ExcludedPersona
}

export function ExcludedPersonaCard({ persona }: ExcludedPersonaCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h3 className="font-semibold text-slate-100 leading-snug text-base min-w-0">
            {persona.name}
          </h3>
          <div className="flex flex-wrap items-end gap-3 sm:shrink-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {BADGE_DIMENSION_LABELS.significance}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${SIGNIFICANCE_STYLES[persona.significance]}`}
              >
                {persona.significance}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {BADGE_DIMENSION_LABELS.exclusion}
              </span>
              <Badge
                variant="outline"
                className={`text-xs whitespace-nowrap w-fit ${EXCLUSION_STYLES[persona.exclusion_type]}`}
              >
                {EXCLUSION_LABELS[persona.exclusion_type]}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mt-1">
          {persona.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
          <p className="text-xs font-medium text-rose-400 mb-1.5">Why excluded</p>
          <p className="text-slate-300 text-sm leading-relaxed">{persona.why_excluded}</p>
        </div>

        <div className="bg-slate-950 rounded-lg p-3 border border-blue-900/40">
          <p className="text-xs font-medium text-blue-400 mb-1.5">Design implication</p>
          <p className="text-slate-300 text-sm leading-relaxed">{persona.design_implication}</p>
        </div>
      </CardContent>
    </Card>
  )
}
