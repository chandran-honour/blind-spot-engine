'use client'

import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatAnalysisForClipboard } from '@/lib/format-analysis'
import { copyTextToClipboard, shareReportText } from '@/lib/copy-to-clipboard'
import type { ProductAnalysis } from '@/types/blind-spot'

interface CopyReportButtonProps {
  analysis: ProductAnalysis
}

export function CopyReportButton({ analysis }: CopyReportButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [manualText, setManualText] = useState('')
  const manualRef = useRef<HTMLTextAreaElement>(null)

  const markCopied = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleCopy = async () => {
    const text = formatAnalysisForClipboard(analysis)

    if (await copyTextToClipboard(text)) {
      pendo.track('report_exported', { method: 'clipboard' })
      markCopied()
      return
    }

    if (await shareReportText(text)) {
      pendo.track('report_exported', { method: 'share_sheet' })
      markCopied()
      return
    }

    setManualText(text)
    setShowManual(true)
    window.setTimeout(() => {
      manualRef.current?.focus()
      manualRef.current?.select()
    }, 0)
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check className="size-4" aria-hidden />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-4" aria-hidden />
            Copy report
          </>
        )}
      </Button>

      {showManual && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="copy-report-manual-title"
        >
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-4 shadow-xl">
            <h3 id="copy-report-manual-title" className="text-sm font-medium text-foreground">
              Copy report manually
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Select all, then copy — needed on some phones when testing over local HTTP.
            </p>
            <textarea
              ref={manualRef}
              readOnly
              value={manualText}
              className="mt-3 h-48 w-full resize-none rounded-lg border border-border bg-muted p-3 text-xs text-foreground"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowManual(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  manualRef.current?.focus()
                  manualRef.current?.select()
                  void copyTextToClipboard(manualText).then((ok) => {
                    if (ok) {
                      pendo.track('report_exported', { method: 'manual_copy' })
                      setShowManual(false)
                      markCopied()
                    }
                  })
                }}
                className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
              >
                Select all &amp; copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
