import { BlindSpotForm } from '@/components/blind-spot-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="container mx-auto px-4 py-16 max-w-2xl">

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-950 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-900/60 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Powered by Claude
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-slate-50">
            Blind Spot Engine
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
            Discover who you're not designing for — and survive the stakeholder gauntlet.
          </p>
        </header>

        {/* Form + Results */}
        <BlindSpotForm />

      </div>
    </main>
  )
}
