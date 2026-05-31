'use client'

import { useState } from 'react'
import { parse } from 'partial-json'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResultsPanel } from '@/components/results-panel'
import type { ProductAnalysis } from '@/types/blind-spot'

export function BlindSpotForm() {
  const [productIdea, setProductIdea] = useState('')
  const [context, setContext] = useState('')
  const [showContext, setShowContext] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Partial<ProductAnalysis> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyse = async () => {
    if (!productIdea.trim() || isLoading) return

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_idea: productIdea.trim(),
          context: context.trim(),
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

      {/* Product idea input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300">
          Describe your product idea
        </label>
        <Textarea
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

      {/* Optional context */}
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
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Tell us more — target market, stage of development, team constraints, what's already been validated..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[90px] bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500 resize-none focus-visible:ring-blue-500/30 focus-visible:border-blue-500 text-sm"
            />
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
            Running the gauntlet...
          </span>
        ) : (
          'Run the Blind Spot Engine'
        )}
      </Button>

      <ResultsPanel result={result} isLoading={isLoading} error={error} />
    </div>
  )
}
