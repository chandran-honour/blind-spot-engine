'use client'

import { useState } from 'react'
import { parse } from 'partial-json'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResultsPanel } from '@/components/results-panel'
import { cn } from '@/lib/utils'
import {
  buildContextString,
  type AudienceMode,
  type ContextFields,
  type ProductAnalysis,
} from '@/types/blind-spot'

const EMPTY_CONTEXT_FIELDS: ContextFields = {
  targetMarket: '',
  stageOfDevelopment: '',
  teamConstraints: '',
  validated: '',
}

const contextFieldClassName =
  'bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 text-sm'

export function BlindSpotForm() {
  const [productIdea, setProductIdea] = useState('')
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('startup')
  const [contextFields, setContextFields] = useState<ContextFields>(EMPTY_CONTEXT_FIELDS)
  const [showContext, setShowContext] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Partial<ProductAnalysis> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateContextField = (key: keyof ContextFields, value: string) => {
    setContextFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleAnalyse = async () => {
    if (!productIdea.trim() || isLoading) return

    setIsLoading(true)
    setResult(null)
    setError(null)

    const context = buildContextString(contextFields)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_idea: productIdea.trim(),
          audience_mode: audienceMode,
          context,
        }),
      })

      if (!response.ok) throw new Error(`The analysis failed (${response.status}). Please try again.`)
      if (!response.body) throw new Error('No response was received. Please try again.')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
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

      if (fullText.trim() === '') {
        throw new Error('The analysis returned no results. Please try again.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAnalyse()
    }
  }

  return (
    <div className="space-y-6">

      {/* Audience mode */}
      <div className="space-y-2">
        <span id="audience-mode-label" className="text-sm font-medium text-slate-300">
          Who are you building for?
        </span>
        <div
          role="radiogroup"
          aria-labelledby="audience-mode-label"
          className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-900 border border-slate-700"
        >
          {(
            [
              { value: 'startup' as const, label: 'Startup / Founder' },
              { value: 'enterprise' as const, label: 'Enterprise PM' },
            ] as const
          ).map(({ value, label }) => {
            const selected = audienceMode === value
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setAudienceMode(value)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                  selected
                    ? 'bg-slate-800 text-slate-50 shadow-sm ring-1 ring-slate-600'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-slate-600">
          Shapes how challenges are framed — PMF and runway vs governance and rollout.
        </p>
      </div>

      {/* Product idea input */}
      <div className="space-y-3">
        <label htmlFor="product-idea" className="text-sm font-medium text-slate-300">
          Describe your product idea
        </label>
        <Textarea
          id="product-idea"
          placeholder="e.g. A mobile app that helps freelancers track their time and invoice clients automatically..."
          value={productIdea}
          onChange={(e) => setProductIdea(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[120px] bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500 resize-none focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
        />
        <p className="text-xs text-slate-600">
          Tip: press{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">⌘ Enter</kbd>{' '}
          to run the analysis
        </p>
      </div>

      {/* Optional structured context */}
      <div>
        <button
          type="button"
          onClick={() => setShowContext(!showContext)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors duration-150"
        >
          <span className={`inline-block transition-transform duration-200 ${showContext ? 'rotate-90' : ''}`}>
            ›
          </span>
          {showContext ? 'Hide context' : 'Add context'}{' '}
          <span className="text-slate-600 text-xs">(optional — improves accuracy)</span>
        </button>

        {showContext && (
          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              <label htmlFor="context-target-market" className="text-sm font-medium text-slate-300">
                Target market
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
              <label htmlFor="context-stage" className="text-sm font-medium text-slate-300">
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
              <label htmlFor="context-team" className="text-sm font-medium text-slate-300">
                Team constraints
              </label>
              <Textarea
                id="context-team"
                placeholder="e.g. Small team, limited clinical advisor time, no deep EHR integration yet"
                value={contextFields.teamConstraints}
                onChange={(e) => updateContextField('teamConstraints', e.target.value)}
                className={cn('min-h-[72px] resize-none', contextFieldClassName)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="context-validated" className="text-sm font-medium text-slate-300">
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

            <p className="text-xs text-slate-600">
              The more context you provide, the more specific and actionable the analysis will be.
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        onClick={handleAnalyse}
        disabled={!productIdea.trim() || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 text-base font-medium disabled:opacity-40"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            Running Stakeholder Challenge...
          </span>
        ) : (
          'Run Blind Spot'
        )}
      </Button>

      <ResultsPanel
        result={result}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}
