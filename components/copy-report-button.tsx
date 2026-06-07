'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatAnalysisForClipboard } from '@/lib/format-analysis'
import type { ProductAnalysis } from '@/types/blind-spot'

interface CopyReportButtonProps {
  analysis: ProductAnalysis
}

export function CopyReportButton({ analysis }: CopyReportButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = formatAnalysisForClipboard(analysis)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this report:', text)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCopy}
      className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-slate-50"
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
  )
}
