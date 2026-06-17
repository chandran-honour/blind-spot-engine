'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ExcludedPersonaCard } from '@/components/excluded-persona-card'
import { StakeholderChallengeCard } from '@/components/blind-spot-card'
import { SectionLegend } from '@/components/section-legend'
import { IdleResultsPlaceholder } from '@/components/idle-results-placeholder'
import { LoadingStatusLine } from '@/components/loading-status-line'
import {
  PERSONA_LEGEND_TITLE,
  PERSONA_LEGEND_LINES,
  CHALLENGE_LEGEND_LINES,
} from '@/lib/label-copy'
import { CopyReportButton } from '@/components/copy-report-button'
import {
  isChallengeComplete,
  isPersonaComplete,
  isProductAnalysisComplete,
} from '@/lib/analysis-guards'
import { getLoadingMessage, getLoadingPhase } from '@/lib/loading-phase'
import type { ProductAnalysis } from '@/types/blind-spot'
import { STAKEHOLDER_LENSES } from '@/types/blind-spot'

interface ResultsPanelProps {
  result: Partial<ProductAnalysis> | null
  isLoading: boolean
  error: string | null
  onRetry?: () => void
}

const STAKEHOLDER_ORDER = STAKEHOLDER_LENSES

function PersonaCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-14 w-full rounded-lg" />
      <Skeleton className="h-14 w-full rounded-lg" />
    </div>
  )
}

function ChallengeCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-56" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-14 w-full rounded-lg" />
    </div>
  )
}

function LoadingSkeleton({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <LoadingStatusLine message={message} />

      <div className="space-y-3">
        <Skeleton className="h-5 w-48" />
        {[1, 2, 3].map((i) => (
          <PersonaCardSkeleton key={i} />
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-44" />
        {[1, 2].map((i) => (
          <ChallengeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function ResultsPanel({
  result,
  isLoading,
  error,
  onRetry,
}: ResultsPanelProps) {
  const personas = (result?.excluded_personas ?? []).filter(isPersonaComplete)
  const challenges = (result?.stakeholder_challenges ?? []).filter(isChallengeComplete)
  const lensesWithChallenges = STAKEHOLDER_LENSES.filter((lens) =>
    challenges.some((c) => c.stakeholder === lens)
  ).length
  const hasContent = result?.summary || personas.length > 0 || challenges.length > 0
  const canCopyReport = !isLoading && isProductAnalysisComplete(result)
  const loadingPhase = getLoadingPhase(result)
  const loadingMessage = getLoadingMessage(loadingPhase)
  const showIdle = !isLoading && !result && !error
  const showPartialResult =
    !isLoading && !!result && hasContent && !isProductAnalysisComplete(result) && !error

  if (showIdle) {
    return (
      <div id="analysis-results" className="mt-8">
        <IdleResultsPlaceholder />
      </div>
    )
  }

  return (
    <div id="analysis-results" className="mt-8 space-y-5">
      <div className="h-px bg-border" />

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
          <span className="text-destructive text-lg leading-none mt-0.5">⚠</span>
          <div className="flex-1 min-w-0">
            <p className="text-destructive text-sm font-medium mb-1">Analysis failed</p>
            <p className="text-destructive/90 text-sm">{error}</p>
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-3 border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Try again
              </Button>
            )}
          </div>
        </div>
      )}

      {!isLoading && result && !hasContent && !error && (
        <div className="rounded-xl border banner-warning p-4 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">No results to display</p>
            <p className="text-sm banner-warning-muted">
              The analysis completed but the response could not be read. Try running it again with
              the same or a refined product idea.
            </p>
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-3 bg-transparent banner-warning-button hover:bg-[var(--callout-warning-bg)]"
              >
                Try again
              </Button>
            )}
          </div>
        </div>
      )}

      {showPartialResult && (
        <div className="rounded-xl border banner-warning p-4 text-sm">
          The analysis returned incomplete results — some personas or stakeholder challenges may be
          missing. Try running the analysis again.
        </div>
      )}

      {isLoading && !hasContent && <LoadingSkeleton message={loadingMessage} />}

      {isLoading && hasContent && (
        <LoadingStatusLine message={loadingMessage} />
      )}

      {hasContent && (
        <div className="space-y-10">

          {canCopyReport && (
            <div className="flex justify-end animate-card-in">
              <CopyReportButton analysis={result} />
            </div>
          )}

          {result?.summary && (
            <div className="bg-card rounded-xl p-4 border border-border animate-card-in">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Analysis Summary
              </p>
              <p className="text-foreground/90 text-sm leading-relaxed">{result.summary}</p>
            </div>
          )}

          {(personas.length > 0 || (isLoading && loadingPhase === 'personas')) && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Who you&apos;re not designing for
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {personas.length > 0 ? (
                    <>
                      {personas.length} excluded {personas.length === 1 ? 'persona' : 'personas'}{' '}
                      identified
                    </>
                  ) : (
                    'Identifying excluded personas…'
                  )}
                  {isLoading && personas.length > 0 && personas.length < 3 && (
                    <span className="text-brand-accent ml-1">· loading more…</span>
                  )}
                </p>
              </div>
              {personas.length > 0 && (
                <>
                  <SectionLegend
                    title={PERSONA_LEGEND_TITLE}
                    lines={[...PERSONA_LEGEND_LINES]}
                  />
                  <div className="space-y-3">
                    {personas.map((persona) => (
                      <div key={persona.id} className="animate-card-in">
                        <ExcludedPersonaCard persona={persona} />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {isLoading && personas.length > 0 && personas.length < 3 && (
                <PersonaCardSkeleton />
              )}
            </div>
          )}

          {(challenges.length > 0 || (isLoading && hasContent && challenges.length === 0 && personas.length > 0)) && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Stakeholder Challenge
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  {challenges.length > 0 ? (
                    <>
                      {challenges.length}{' '}
                      {challenges.length === 1 ? 'challenge' : 'challenges'} across{' '}
                      {lensesWithChallenges} of {STAKEHOLDER_LENSES.length} perspectives
                    </>
                  ) : (
                    'Running stakeholder challenge…'
                  )}
                  {isLoading && challenges.length > 0 && (
                    <span className="text-brand-accent ml-1 animate-pulse">…</span>
                  )}
                </p>
              </div>
              {challenges.length > 0 && (
                <>
                  <SectionLegend
                    title={PERSONA_LEGEND_TITLE}
                    lines={[...CHALLENGE_LEGEND_LINES]}
                  />
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
                </>
              )}
              {isLoading && challenges.length === 0 && personas.length > 0 && (
                <div className="space-y-3">
                  <ChallengeCardSkeleton />
                  <ChallengeCardSkeleton />
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
