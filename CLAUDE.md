# Blind Spot Engine — Claude Context

## What this project is

Blind Spot Engine is an AI-powered web app for product managers and founders. Users describe a product idea, choose **startup/founder** or **enterprise PM** audience mode, optionally add structured context, and the engine runs two sequential analyses:

1. **Excluded Personas** — who the product is *not* designed for, surfacing unexamined assumptions about the target audience
2. **Stakeholder Challenge** — stress-tests the idea across four lenses (`business` | `product` | `technical` | `delivery`; UI labels e.g. Business & Finance). The UI sends `audience_mode` (`startup` | `enterprise`, default startup) to `/api/analyze` for explicit prompt framing; regulated domains surface compliance risks as questions only (not legal advice).

When analysis completes, users can **copy a markdown report** to the clipboard. Results live in browser memory only — nothing is saved to a database on the hackathon demo.

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
│   ├── blind-spot-form.tsx           # Main form — audience mode, product idea, structured context, streaming fetch
│   ├── excluded-persona-card.tsx     # Phase 1 card — excluded persona
│   ├── blind-spot-card.tsx           # Phase 2 card — StakeholderChallengeCard
│   ├── results-panel.tsx             # Summary, legends, progressive results, copy button
│   ├── section-legend.tsx            # “How to read these cards” block
│   └── copy-report-button.tsx        # Clipboard export when analysis complete
├── lib/
│   ├── format-analysis.ts            # Markdown report for clipboard
│   ├── label-copy.ts                 # Legend and badge dimension copy
│   ├── analysis-guards.ts            # Streaming completeness type guards
│   └── supabase/                     # Scaffold only — not used at runtime
│       ├── client.ts
│       ├── db.ts
│       └── types.ts
├── types/
│   └── blind-spot.ts                 # Shared TypeScript interfaces
├── supabase/
│   └── schema.sql                    # Run in Supabase SQL Editor to create tables
├── docs/
│   ├── REQUIREMENTS.md               # Full product requirements
│   ├── BUILD_TIMELINE.md             # Build plan with dates and task checklist
│   ├── PROMPTREFINMENTS.md           # Prompt refinement log and verify checklist
│   ├── TESTPLAN.md                   # Product ideas and scoring rubric for test runs
│   ├── MOBILE_RESPONSIVE_REVIEW.md   # Mobile responsive test checklist
│   ├── LOADING_EMPTY_STATES_PLAN.md  # Loading/empty states polish (complete)
│   └── THEME_TOGGLE_PLAN.md          # Dark/light mode implementation (complete)
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
```

Optional (scaffold only, not used at runtime):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The app will not function without `ANTHROPIC_API_KEY`. `NEXT_PUBLIC_SUPABASE_*` vars are optional — Supabase scaffold (`lib/supabase/`, `supabase/schema.sql`) has no runtime imports. The hackathon demo does not persist analyses or offer share links; product ideas and results exist only in the browser session until the page is closed or refreshed.

---

## How the analysis works

### API route (`app/api/analyze/route.ts`)

- Accepts `POST` with `{ product_idea: string, audience_mode?: 'startup' | 'enterprise', context?: string }`
- `audience_mode` defaults to `startup`; invalid values return 400. Prepends an audience instruction block to the user message
- `context` is a single string built from optional structured form fields via `buildContextString()` in `types/blind-spot.ts`; omitted when all fields empty
- Streams a single JSON object from Claude using `client.messages.stream()`
- Model: `claude-sonnet-4-6`, max tokens: 8000 (raised from 4000 — the refined output format adds a mitigation + research insight per challenge, and 4000 truncated long runs before the final Delivery & Operations lens)
- `export const maxDuration = 120` prevents Vercel timeout (raised from 60 to give the longer 8000-token generations headroom)
- Returns `text/plain` streaming response — no SSE, raw token stream

### Audience mode & structured context (`components/blind-spot-form.tsx`)

- Radio selector **“Who are you building for?”** — `startup` (default) or `enterprise` (`AudienceMode` in `types/blind-spot.ts`)
- Collapsible structured context fields (`ContextFields`): target market, stage of development, team constraints, what's already been validated
- POST body: `product_idea`, `audience_mode`, `context` (when non-empty)

### Client-side streaming (`components/blind-spot-form.tsx`)

- Uses `fetch` with `ReadableStream` reader
- Parses each chunk with `parse()` from `partial-json` package
- Sets `result` state as a `Partial<ProductAnalysis>` on each chunk
- Cards render progressively as each object becomes complete

### Progressive reveal & copy report (`components/results-panel.tsx`)

- `isPersonaComplete()` and `isChallengeComplete()` in `lib/analysis-guards.ts` — only render cards with all required fields present
- `isProductAnalysisComplete()` gates `CopyReportButton`; formats in-memory result via `formatAnalysisForClipboard()` in `lib/format-analysis.ts`
- `SectionLegend` above each results block — copy from `lib/label-copy.ts` (`PERSONA_LEGEND_*`, `CHALLENGE_LEGEND_*`, `BADGE_DIMENSION_LABELS`)
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
  stakeholder_challenges: StakeholderChallenge[]  // exactly 2 per lens
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
- **Theme** — dark default via `next-themes` + `ModeToggle`; semantic tokens in `app/globals.css` (see [`docs/THEME_TOGGLE_PLAN.md`](docs/THEME_TOGGLE_PLAN.md))

---

## Supabase setup (for future reference)

Schema is defined in `supabase/schema.sql`. Single table: `analyses`. RLS enabled with permissive anon policies (insert + select). Persistence and share links are disabled for the hackathon demo — `lib/supabase/` remains as unused scaffold. Copy-to-clipboard is the supported export path.

To activate persistence later:

1. Call `saveProductAnalysis()` from `lib/supabase/db.ts` after a successful stream completes
2. Generate a session UUID client-side (localStorage) and pass it with each save
3. Add `/analysis/[id]` page and share-link UI; restore `lib/supabase/map.ts` row mapper

---

## Remaining build (as of Jun 2026)

### Mode 2 (1–7 Jun) — done

- Streaming progressive reveal (partial-json)
- ~~Prompt refinement~~ — done ([`docs/PROMPTREFINMENTS.md`](docs/PROMPTREFINMENTS.md))
- ~~Copy-to-clipboard on results~~ — done (`CopyReportButton`, `lib/format-analysis.ts`)
- ~~Share link~~ — deferred (no DB persistence on hackathon demo)

### Polish & Deploy (8–13 Jun) — done

- ~~Mobile responsive review~~ — done ([`docs/MOBILE_RESPONSIVE_REVIEW.md`](docs/MOBILE_RESPONSIVE_REVIEW.md))
- ~~Dark/light theme toggle~~ — done ([`docs/THEME_TOGGLE_PLAN.md`](docs/THEME_TOGGLE_PLAN.md))
- ~~Loading and empty states~~ — done ([`docs/LOADING_EMPTY_STATES_PLAN.md`](docs/LOADING_EMPTY_STATES_PLAN.md))
- ~~Vercel production deployment~~ — done
- ~~Secrets audit~~ — done (`git grep -i "sk-ant"` before public repo)
- ~~Performance / streaming UX~~ — done
- ~~Novus.ai agent~~ — done

### Submit (14–20 Jun) — in progress

- Demo video (2–3 min, Loom/YouTube)
- Hackathon write-up and README
- Devpost submission

---

## Conventions

- Component files use kebab-case: `blind-spot-form.tsx`
- All components are named exports (not default exports) except `app/page.tsx`
- `'use client'` directive on all interactive components
- Error messages are user-friendly strings set via `setError()` in the form — never shown as browser alerts
- The `blind-spot-card.tsx` component is named for historical reasons but exports `StakeholderChallengeCard` and renders `StakeholderChallenge` objects (Phase 2), not generic blind spots

