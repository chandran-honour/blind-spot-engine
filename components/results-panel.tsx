'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { ExcludedPersonaCard } from '@/components/excluded-persona-card'
import { StakeholderChallengeCard } from '@/components/blind-spot-card'
import type {
  ProductAnalysis,
  ExcludedPersona,
  StakeholderChallenge,
  StakeholderLens,
} from '@/types/blind-spot'

interface ResultsPanelProps {
  result: Partial<ProductAnalysis> | null
  isLoading: boolean
  error: string | null
}

const STAKEHOLDER_ORDER: StakeholderLens[] = ['business', 'product', 'technical', 'delivery']

// Only render a persona card when all required fields are present
function isPersonaComplete(p: unknown): p is ExcludedPersona {
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

// Only render a challenge card when all required fields are present
function isChallengeComplete(c: unknown): c is StakeholderChallenge {
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

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span>Running Blind Spot...</span>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-48 bg-slate-800" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 w-48 bg-slate-800" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-full bg-slate-800" />
                <Skeleton className="h-5 w-28 rounded-full bg-slate-800" />
              </div>
            </div>
            <Skeleton className="h-4 w-full bg-slate-800" />
            <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-44 bg-slate-800" />
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
            <Skeleton className="h-5 w-full bg-slate-800" />
            <Skeleton className="h-4 w-3/4 bg-slate-800" />
            <Skeleton className="h-16 w-full rounded-lg bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ResultsPanel({ result, isLoading, error }: ResultsPanelProps) {
  if (!isLoading && !result && !error) return null

  const personas = (result?.excluded_personas ?? []).filter(isPersonaComplete)
  const challenges = (result?.stakeholder_challenges ?? []).filter(isChallengeComplete)
  const hasContent = result?.summary || personas.length > 0 || challenges.length > 0

  return (
    <div className="mt-8 space-y-5">
      <div className="h-px bg-slate-800" />

      {error && (
        <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 flex items-start gap-3">
          <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
          <div>
            <p className="text-red-400 text-sm font-medium mb-1">Analysis failed</p>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Show skeletons only while loading with no content yet */}
      {isLoading && !hasContent && <LoadingSkeleton />}

      {/* Render content progressively as it streams in */}
      {hasContent && (
        <div className="space-y-10">

          {/* Summary */}
          {result?.summary && (
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 animate-card-in">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Analysis Summary
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
            </div>
          )}

          {/* Phase 1 — Excluded Personas */}
          {personas.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  Who you're not designing for
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {personas.length} excluded {personas.length === 1 ? 'persona' : 'personas'} identified
                  {isLoading && <span className="text-blue-500 ml-1 animate-pulse">…</span>}
                </p>
              </div>
              <div className="space-y-3">
                {personas.map((persona) => (
                  <div key={persona.id} className="animate-card-in">
                    <ExcludedPersonaCard persona={persona} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase 2 — Stakeholder Challenge */}
          {challenges.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  Stakeholder Challenge
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {challenges.length} {challenges.length === 1 ? 'challenge' : 'challenges'} across {STAKEHOLDER_ORDER.length} perspectives
                  {isLoading && <span className="text-blue-500 ml-1 animate-pulse">…</span>}
                </p>
              </div>
              <div className="space-y-3">
                {STAKEHOLDER_ORDER.flatMap((lens) =>
                  challenges
                    .filter((c) => c.stakeholder === lens)
                    .map((challenge) => (
                      <div key={challenge.id} className="animate-card-in">
                        <StakeholderChallengeCard challenge={challenge} />
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
