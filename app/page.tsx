import Image from 'next/image'
import { BlindSpotForm } from '@/components/blind-spot-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-16 max-w-2xl flex-1 flex flex-col w-full">

        <header className="mb-12 text-center">
          <div className="flex flex-col items-center gap-2 mb-8">
            <Image
              src="/blind-spot-logo.svg"
              alt=""
              width={40}
              height={40}
              unoptimized
              priority
            />
            <span className="text-sm font-semibold tracking-wide text-slate-300">
              Blind Spot
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-slate-50 max-w-xl mx-auto">
            Pressure Test Your Product Idea
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
            Discover who you&apos;re not designing for and face the stakeholder challenge.
          </p>
        </header>

        <BlindSpotForm />

        <footer className="mt-16 pt-8 border-t border-slate-800/60 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-950 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Powered by Claude
          </div>
        </footer>

      </div>
    </main>
  )
}
