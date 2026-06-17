/** Copy text on desktop HTTPS and on LAN HTTP dev (non-secure context). */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof document === 'undefined') return false

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to execCommand
    }
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.left = '0'
    textarea.style.width = '1px'
    textarea.style.height = '1px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

/** Native share sheet — useful on mobile when clipboard is awkward. */
export async function shareReportText(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.share) return false

  const payload = { title: 'Blind Spot Analysis', text }
  if (navigator.canShare && !navigator.canShare(payload)) return false

  try {
    await navigator.share(payload)
    return true
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return true
    return false
  }
}
