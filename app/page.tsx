import { BlindSpotForm } from '@/components/blind-spot-form'
import { BlindSpotLogo } from '@/components/blind-spot-logo'
import { ModeToggle } from '@/components/mode-toggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-16 max-w-2xl flex-1 flex flex-col w-full relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-0">
          <ModeToggle />
        </div>

        <header className="mb-12 text-center">
          <div className="flex flex-col items-center gap-2 mb-8">
            <BlindSpotLogo />
            <span className="text-sm font-semibold tracking-wide text-muted-foreground">
              Blind Spot
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground max-w-xl mx-auto">
            Pressure Test Your Product Idea
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
            Discover who you&apos;re not designing for and face the stakeholder challenge.
          </p>
        </header>

        <p
          role="note"
          className="mb-10 rounded-lg border border-border bg-muted/40 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground"
        >
          Demonstration only — product ideas and context you enter are not saved. Results
          exist in this browser session only and are cleared when you refresh or leave the
          page.
        </p>

        <BlindSpotForm />

        <footer className="mt-16 pt-8 border-t border-border text-center">
          <div className="inline-flex items-center gap-2 footer-brand-pill text-xs font-medium px-3 py-1.5 rounded-full border">
            <span className="w-1.5 h-1.5 rounded-full footer-brand-dot animate-pulse" />
            Powered by Claude
          </div>
        </footer>
      </div>
    </main>
  )
}
