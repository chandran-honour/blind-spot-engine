# Blind Spot Engine — Claude Context

## What this project is

Blind Spot Engine is an AI-powered web app for product managers and founders. It takes a product idea as input and runs two sequential analyses:

1. **Excluded Personas** — who the product is *not* designed for, surfacing unexamined assumptions about the target audience
2. **Stakeholder Gauntlet** — challenges from four lenses (`business` | `product` | `technical` | `delivery`; UI labels e.g. Business & Finance). The UI sends `audience_mode` (`startup` | `enterprise`, default startup) to `/api/analyze` for explicit prompt framing; regulated domains surface compliance risks as questions only (not legal advice).

Built as a solo hackathon entry for the [Mind the Product World Product Hackathon](https://mindtheproduct.devpost.com), deadline 20 June 2026. Also serves as a portfolio project for an AI product management role.

---

## Tech stack


| Layer      | Choice                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router)                                                |
| Language   | TypeScript                                                             |
| Styling    | Tailwind CSS v4 + shadcn/ui (Radix, Default preset, Slate base colour) |
| AI         | Anthropic Claude API — `claude-sonnet-4-6`                             |
| Database   | Supabase (schema defined, not wired into demo)                         |
| Deployment | Vercel                                                                 |
| IDE        | Cursor                                                                 |


---

## Project structure

```
blind-spot-engine/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts              # Claude streaming API route
│   ├── globals.css                   # Tailwind v4 theme + card-in animation
│   ├── layout.tsx                    # Root layout (Inter font)
│   └── page.tsx                      # Main page — renders BlindSpotForm
├── components/
│   ├── ui/                           # shadcn/ui primitives (auto-generated, do not edit)
│   ├── blind-spot-form.tsx           # Main form — product idea input, context toggle, streaming fetch
│   ├── excluded-persona-card.tsx     # Phase 1 card — excluded persona
│   ├── blind-spot-card.tsx           # Phase 2 card — stakeholder challenge
│   └── results-panel.tsx             # Two-phase results layout with progressive reveal
├── lib/
│   └── supabase/
│       ├── client.ts                 # Supabase client (configured, not wired into demo)
│       ├── db.ts                     # save/fetch helpers (ready for future use)
│       └── types.ts                  # Database row types
├── types/
│   └── blind-spot.ts                 # Shared TypeScript interfaces
├── supabase/
│   └── schema.sql                    # Run in Supabase SQL Editor to create tables
├── REQUIREMENTS.md                   # Full product requirements
├── BUILD_TIMELINE.md                 # Build plan with dates and task checklist
└── CLAUDE.md                         # This file
```

---

## Key commands

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run lint       # ESLint
```

---

## Environment variables

Required in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The app will not function without `ANTHROPIC_API_KEY`. Supabase variables are present but persistence is not wired into the demo.

---

## How the analysis works

### API route (`app/api/analyze/route.ts`)

- Accepts `POST` with `{ product_idea: string, context?: string }`
- Streams a single JSON object from Claude using `client.messages.stream()`
- Model: `claude-sonnet-4-6`, max tokens: 3000
- `export const maxDuration = 60` prevents Vercel timeout
- Returns `text/plain` streaming response — no SSE, raw token stream

### Client-side streaming (`components/blind-spot-form.tsx`)

- Uses `fetch` with `ReadableStream` reader
- Parses each chunk with `parse()` from `partial-json` package
- Sets `result` state as a `Partial<ProductAnalysis>` on each chunk
- Cards render progressively as each object becomes complete

### Progressive reveal (`components/results-panel.tsx`)

- `isPersonaComplete()` and `isChallengeComplete()` type guards — only render cards with all required fields present
- Skeleton shows only while no content has arrived yet
- Live `…` pulse indicator while still loading
- `animate-card-in` CSS class fades each card in as it appears (defined in `globals.css`)

---

## Data schema

### `ProductAnalysis` (full response shape)

```typescript
{
  product_idea: string
  summary: string
  excluded_personas: ExcludedPersona[]   // 3-5 items
  stakeholder_challenges: StakeholderChallenge[]  // 1-2 per lens
}
```

### `ExcludedPersona`

```typescript
{
  id: string
  name: string
  description: string
  why_excluded: string
  design_implication: string
  exclusion_type: 'by-design' | 'by-assumption' | 'by-circumstance'
  significance: 'high' | 'medium' | 'low'
}
```

### `StakeholderChallenge`

```typescript
{
  id: string
  stakeholder: 'business' | 'product' | 'technical' | 'delivery'
  title: string
  concern: string
  challenge_question: string
  severity: 'high' | 'medium' | 'low'
  research_insight?: string
}
```

---

## Tailwind / CSS notes

- **Tailwind v4** — uses `@import "tailwindcss"` not `@tailwind` directives
- **PostCSS** — uses `@tailwindcss/postcss`, not `tailwindcss` directly
- **shadcn/ui** components are in `components/ui/` — do not edit manually
- Custom animation defined in `globals.css`:
  ```css
  @keyframes card-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @utility animate-card-in { animation: card-in 0.35s ease-out forwards; }
  ```
- Dark theme is hardcoded via `bg-slate-950` on the main layout — no dark mode toggle yet

---

## Supabase setup (for future reference)

Schema is defined in `supabase/schema.sql`. Single table: `analyses`. RLS enabled with permissive anon policies (insert + select). Session history is not wired into the current demo — the Supabase client and `db.ts` helpers are ready but unused.

To activate persistence:

1. Call `saveAnalysis()` from `lib/supabase/db.ts` after a successful stream completes in the API route
2. Generate a session UUID client-side (localStorage) and pass it with each request
3. Build a history view using `getSessionAnalyses(sessionId)`

---

## Remaining build (as of 1 Jun 2026)

### Mode 2 (1–7 Jun)

- Streaming progressive reveal (partial-json)
- Prompt refinement — run test analyses, tighten system prompt
- Copy-to-clipboard on results
- Share link (unique URL per analysis)

### Polish & Deploy (8–13 Jun)

- Mobile responsive review
- UI polish pass for video recording
- Vercel production deployment
- Secrets audit (`git grep -i "sk-ant"` before making repo public)

### Submit (14–20 Jun)

- Demo video (2–3 min, Loom/YouTube)
- Hackathon write-up and README
- Devpost submission

---

## Conventions

- Component files use kebab-case: `blind-spot-form.tsx`
- All components are named exports (not default exports) except `app/page.tsx`
- `'use client'` directive on all interactive components
- Error messages are user-friendly strings set via `setError()` in the form — never shown as browser alerts
- The `blind-spot-card.tsx` component is named for historical reasons but renders `StakeholderChallenge` objects (Phase 2), not generic blind spots

