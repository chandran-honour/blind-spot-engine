import { cn } from '@/lib/utils'

interface LoadingStatusLineProps {
  message: string
  className?: string
}

export function LoadingStatusLine({ message, className }: LoadingStatusLineProps) {
  return (
    <div className={cn('flex items-center gap-2 text-muted-foreground text-sm', className)}>
      <span className="inline-block w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0" />
      <span>{message}</span>
    </div>
  )
}
