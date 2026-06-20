'use client'

import { useEffect, useRef, useState } from 'react'
import { parse } from 'partial-json'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResultsPanel } from '@/components/results-panel'
import { AudienceModeSelector } from '@/components/audience-mode-selector'
import { cn } from '@/lib/utils'
import { isProductAnalysisComplete } from '@/lib/analysis-guards'
import {
  buildContextString,
  type AudienceMode,
  type ContextFields,
  type ProductAnalysis,
} from '@/types/blind-spot'
import { getLoadingMessage, getLoadingPhase } from '@/lib/loading-phase'

const EMPTY_CONTEXT_FIELDS: ContextFields = {
  targetMarket: '',
  stageOfDevelopment: '',
  teamConstraints: '',
  validated: '',
}

const contextFieldClassName =
  'bg-input/80 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring text-sm'

export function BlindSpotForm() {
  const productIdeaRef = useRef<HTMLTextAreaElement>(null)
  const runInFlightRef = useRef(false)
  const lastRunAtRef = useRef(0)

  const audienceModeRef = useRef<AudienceMode>('startup')
  const contextFieldsRef = useRef<ContextFields>(EMPTY_CONTEXT_FIELDS)
  const isLoadingRef = useRef(false)
  const prevIsLoadingRef = useRef(false)

  const [audienceMode, setAudienceMode] = useState<AudienceMode>('startup')
  const [contextFields, setContextFields] = useState<ContextFields>(EMPTY_CONTEXT_FIELDS)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Partial<ProductAnalysis> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  audienceModeRef.current = audienceMode
  contextFieldsRef.current = contextFields
  isLoadingRef.current = isLoading

  const loadingMessage = isLoading ? getLoadingMessage(getLoadingPhase(result)) : ''

  const focusProductIdea = () => {
    productIdeaRef.current?.focus()
  }

  const scrollProductIdeaIntoView = () => {
    productIdeaRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  const scrollResultsIntoView = () => {
    if (typeof window === 'undefined') return
    window.setTimeout(() => {
      document.getElementById('analysis-results')?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })
    }, 300)
  }

  const handleRetry = () => {
    setError(null)
    setResult(null)
    focusProductIdea()
  }

  const updateContextField = (key: keyof ContextFields, value: string) => {
    setContextFields((prev) => ({ ...prev, [key]: value }))
  }

  const readProductIdea = (): string => {
    const fromRef = productIdeaRef.current?.value ?? ''
    if (fromRef.trim()) return fromRef.trim()

    const byId = document.getElementById('product-idea')
    if (byId instanceof HTMLTextAreaElement && byId.value.trim()) {
      return byId.value.trim()
    }

    return ''
  }

  const applyAnalysisText = (fullText: string) => {
    let trimmed = fullText.trim()
    if (!trimmed) {
      throw new Error('The analysis returned no results. Please try again.')
    }

    // The model is occasionally wrapping its JSON response in a markdown code
    // fence (```json ... ```) despite being told not to. Strip a leading
    // ```[json] and trailing ``` before attempting to parse, so a fenced
    // response doesn't hard-fail JSON.parse / the partial-json fallback.
    if (trimmed.startsWith('```')) {
      trimmed = trimmed
        .replace(/^```[a-zA-Z]*\s*/, '')
        .replace(/```\s*$/, '')
        .trim()
    }

    let parsed: Partial<ProductAnalysis> | null = null
    try {
      parsed = JSON.parse(trimmed) as Partial<ProductAnalysis>
    } catch {
      parsed = parse(trimmed) as Partial<ProductAnalysis>
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Could not read the analysis response. Please try again.')
    }

    setResult(parsed)
  }

  const executeAnalysis = async (productIdeaValue: string) => {
    const context = buildContextString(contextFieldsRef.current)
    const useStreaming =
      typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches

    try {
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), 90_000)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_idea: productIdeaValue,
          audience_mode: audienceModeRef.current,
          context,
        }),
        signal: controller.signal,
      })

      window.clearTimeout(timeoutId)

      if (!response.ok) {
        let detail = ''
        try {
          const errBody = (await response.json()) as { error?: string }
          if (errBody?.error) detail = `: ${errBody.error}`
        } catch {
          // Non-JSON error body
        }
        throw new Error(`The analysis failed (${response.status})${detail}. Please try again.`)
      }

      if (useStreaming && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              fullText += decoder.decode()
              break
            }
            fullText += decoder.decode(value, { stream: true })

            try {
              const parsed = parse(fullText) as Partial<ProductAnalysis>
              if (parsed && typeof parsed === 'object') {
                setResult(parsed)
              }
            } catch {
              // Unparseable chunk — continue streaming
            }
          }

          applyAnalysisText(fullText)
        } catch (streamErr) {
          if (fullText.trim()) {
            try {
              applyAnalysisText(fullText)
              return
            } catch {
              // Fall through to stream error
            }
          }
          throw streamErr
        }
      } else {
        const fullText = await response.text()
        applyAnalysisText(fullText)
      }
    } catch (err) {
      let message = 'Something went wrong. Please try again.'
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          message = 'The analysis timed out. Please try again.'
        } else {
          message = err.message
        }
      }
      setError(message)
      pendo.track('analysis_failed', {
        audience_mode: audienceModeRef.current,
        error_type: err instanceof Error && err.name === 'AbortError' ? 'timeout' : 'error',
        error_message: message,
      })
      scrollResultsIntoView()
      console.error('Analysis error:', err)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
      runInFlightRef.current = false
    }
  }

  const startRunRef = useRef<() => void>(() => {})

  startRunRef.current = () => {
    const now = Date.now()
    if (runInFlightRef.current || isLoadingRef.current || now - lastRunAtRef.current < 300) {
      return
    }
    lastRunAtRef.current = now

    const productIdeaValue = readProductIdea()
    if (!productIdeaValue) {
      const message = 'Please enter a product idea before running the analysis.'
      setValidationError(message)
      setError(message)
      scrollProductIdeaIntoView()
      scrollResultsIntoView()
      return
    }

    runInFlightRef.current = true
    isLoadingRef.current = true
    setIsLoading(true)
    setResult(null)
    setError(null)
    setValidationError(null)
    scrollResultsIntoView()

    pendo.track('analysis_submitted', {
      audience_mode: audienceModeRef.current,
      has_context: Object.values(contextFieldsRef.current).some((v) => v.trim() !== ''),
    })

    void executeAnalysis(productIdeaValue)
  }

  useEffect(() => {
    const button = document.getElementById('run-blind-spot')
    if (!button) return

    const activate = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      startRunRef.current()
    }

    button.addEventListener('click', activate)
    button.addEventListener('touchend', activate)

    return () => {
      button.removeEventListener('click', activate)
      button.removeEventListener('touchend', activate)
    }
  }, [])

  useEffect(() => {
    const wasLoading = prevIsLoadingRef.current
    prevIsLoadingRef.current = isLoading
    if (!wasLoading || isLoading) return
    if (error) return
    if (!result) return

    if (isProductAnalysisComplete(result)) {
      pendo.track('analysis_completed', {
        audience_mode: audienceMode,
        persona_count: (result.excluded_personas ?? []).length,
        challenge_count: (result.stakeholder_challenges ?? []).length,
      })
    } else {
      pendo.track('analysis_incomplete', {
        audience_mode: audienceMode,
        persona_count: (result.excluded_personas ?? []).length,
        challenge_count: (result.stakeholder_challenges ?? []).length,
      })
    }
  }, [isLoading, error, result, audienceMode])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      startRunRef.current()
    }
  }

  return (
    <div className="space-y-6">
      <AudienceModeSelector value={audienceMode} onChange={setAudienceMode} />

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="product-idea" className="text-sm font-medium text-foreground">
            Describe your product idea
          </label>
          <Textarea
            ref={productIdeaRef}
            id="product-idea"
            name="product-idea"
            placeholder={'e.g. An AI Dental Practice Assistant.\nAutomates patient intake and generates treatment summaries from consultations.'}
            defaultValue=""
            onKeyDown={handleKeyDown}
            onInput={() => {
              setValidationError(null)
            }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck
            enterKeyHint="enter"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? 'product-idea-error' : undefined}
            className={cn(
              'min-h-[120px] [field-sizing:content] bg-input/80 resize-y focus-visible:ring-ring/50 focus-visible:border-ring',
              validationError && 'border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/30'
            )}
          />
          {validationError && (
            <p id="product-idea-error" className="text-sm text-destructive" role="alert">
              {validationError}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="hidden sm:inline">
              Tip: press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-xs">⌘ Enter</kbd>{' '}
              to run the analysis
            </span>
            <span className="sm:hidden">Enter your idea, then tap Run Blind Spot below.</span>
          </p>
        </div>

        <details className="group">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-1.5 touch-manipulation text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 [&::-webkit-details-marker]:hidden">
            <span className="inline-block transition-transform duration-200 group-open:rotate-90">
              ›
            </span>
            <span className="group-open:hidden">Add context</span>
            <span className="hidden group-open:inline">Hide context</span>{' '}
            <span className="text-muted-foreground/80 text-xs">(optional — improves accuracy)</span>
          </summary>

          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              <label htmlFor="context-target-market" className="text-sm font-medium text-foreground">
                Target market / users
              </label>
              <Input
                id="context-target-market"
                placeholder="e.g. Independent dental clinics in the UK"
                value={contextFields.targetMarket}
                onChange={(e) => updateContextField('targetMarket', e.target.value)}
                className={cn('h-10', contextFieldClassName)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="context-stage" className="text-sm font-medium text-foreground">
                Stage of development
              </label>
              <Input
                id="context-stage"
                placeholder="e.g. Early discovery with concept mockups prepared"
                value={contextFields.stageOfDevelopment}
                onChange={(e) => updateContextField('stageOfDevelopment', e.target.value)}
                className={cn('h-10', contextFieldClassName)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="context-team" className="text-sm font-medium text-foreground">
                Team constraints
              </label>
              <Textarea
                id="context-team"
                placeholder="e.g. Small team with limited clinical advisor time and no spare capacity for deep integration with clinic patient record systems yet"
                value={contextFields.teamConstraints}
                onChange={(e) => updateContextField('teamConstraints', e.target.value)}
                className={cn('min-h-[72px] resize-none', contextFieldClassName)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="context-validated" className="text-sm font-medium text-foreground">
                What&apos;s already been validated
              </label>
              <Textarea
                id="context-validated"
                placeholder="e.g. Demand signal from dentist interviews for faster intake workflows"
                value={contextFields.validated}
                onChange={(e) => updateContextField('validated', e.target.value)}
                className={cn('min-h-[72px] resize-none', contextFieldClassName)}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              The more context you provide, the more specific and actionable the analysis will be.
            </p>
          </div>
        </details>

        {/* Never use disabled= — it blocks touch events on many Android browsers */}
        <button
          id="run-blind-spot"
          type="button"
          aria-busy={isLoading}
          className={cn(
            'relative z-10 w-full min-h-14 touch-manipulation rounded-lg px-4 py-3 text-base font-medium transition-colors',
            'bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 active:bg-brand-accent/80',
            isLoading && 'opacity-70',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-white/60 animate-pulse" />
              {loadingMessage || 'Starting analysis…'}
            </span>
          ) : (
            'Run Blind Spot'
          )}
        </button>
      </div>

      <p
        role="note"
        className="rounded-lg border border-muted-foreground/45 bg-muted/40 px-4 py-3 text-center text-sm font-bold leading-relaxed text-muted-foreground"
      >
        This is a live demo — no account needed. Nothing is kept after you leave this page
        — results can be exported once the analysis completes.
      </p>

      <ResultsPanel
        result={result}
        isLoading={isLoading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  )
}
