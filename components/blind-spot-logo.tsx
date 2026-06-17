import { cn } from '@/lib/utils'

interface BlindSpotLogoProps {
  className?: string
}

export function BlindSpotLogo({ className }: BlindSpotLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn('size-10 shrink-0', className)}
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        style={{ fill: 'var(--logo-ring-fill)' }}
      />

      <circle
        cx="24"
        cy="24"
        r="20"
        style={{ stroke: 'var(--logo-ring-stroke)' }}
        strokeWidth="2.5"
      />

      <circle
        cx="24"
        cy="24"
        r="5"
        style={{ fill: 'var(--logo-center-fill)' }}
      />
    </svg>
  )
}
