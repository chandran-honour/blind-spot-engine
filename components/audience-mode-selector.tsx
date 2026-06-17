'use client'

import { cn } from '@/lib/utils'
import type { AudienceMode } from '@/types/blind-spot'

const OPTIONS = [
  { value: 'startup' as const, label: 'Startup / Founder' },
  { value: 'enterprise' as const, label: 'Enterprise PM' },
] as const

const selectClassName =
  'w-full min-h-12 rounded-lg border border-input bg-input/80 px-3 py-2.5 text-sm font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50'

interface AudienceModeSelectorProps {
  value: AudienceMode
  onChange: (mode: AudienceMode) => void
}

export function AudienceModeSelector({ value, onChange }: AudienceModeSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="audience-mode" className="text-sm font-medium text-foreground">
        Who are you?
      </label>

      <select
        id="audience-mode"
        name="audience-mode"
        value={value}
        onChange={(e) => onChange(e.target.value as AudienceMode)}
        className={cn(selectClassName, 'audience-mode-native')}
      >
        {OPTIONS.map(({ value: optionValue, label }) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>

      <div
        role="group"
        aria-label="Who are you?"
        className="audience-mode-segmented grid-cols-2 gap-2 p-1 rounded-lg bg-card border border-border"
      >
        {OPTIONS.map(({ value: optionValue, label }) => {
          const selected = value === optionValue
          return (
            <button
              key={optionValue}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(optionValue)}
              className={cn(
                'w-full min-h-12 rounded-md border-2 px-3 py-3 text-sm font-medium text-center transition-colors duration-150',
                'outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                selected
                  ? 'border-primary/40 bg-secondary text-secondary-foreground shadow-sm'
                  : 'border-transparent bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Shapes how challenges are framed — PMF and runway vs governance and rollout.
      </p>
    </div>
  )
}
