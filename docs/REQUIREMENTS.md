# Blind Spot Engine — Requirements

## Product Overview

Blind Spot Engine is an AI-powered web application that helps product builders surface the hidden risks in their ideas — before they ship. Users describe a product idea, choose whether they are building as a **startup/founder** or **enterprise PM**, optionally add structured context, and the engine runs two phases automatically:

1. **Excluded Personas** — Claude generates 3–5 personas of people this product will *not* serve. The principle: *who you're not designing for clarifies who you are designing for.* This surfaces audience blind spots that typical user research misses.

2. **Stakeholder Challenge** — The idea is stress-tested across four stakeholder lenses (Business & Finance, Product & PM, Technical & Engineering, Delivery & Operations) in a single pass, surfacing assumptions and anticipated pushback from each angle.

When analysis completes, users can **copy a markdown-formatted report** to the clipboard for sharing in docs, Slack, or email. Results live in browser memory only — nothing is saved to a database on the hackathon demo.

The product is designed to be fast, focused, and actionable. It is not a general-purpose chat interface — it is a single-purpose thinking tool that returns structured, high-signal output every time.

---

## Problem Statement

Decision-makers across business, product, engineering and delivery routinely act on assumptions they haven't examined. Traditional brainstorming and peer review catch some of these, but cognitive biases, group-think, and domain blind spots mean critical risks are routinely missed until it's too late. Blind Spot Engine makes assumption stress-testing fast, low-friction, and available to anyone with a browser.

---

## Target Users

- Founders and product managers stress-testing strategic assumptions
- Engineering leads evaluating technical decisions
- Delivery managers assessing project plans and timelines
- Consultants preparing for client engagements

---

## Analysis Lenses (Stakeholder Challenge)

Phase 2 uses four fixed lenses. JSON enum values are stable; UI labels are PM-friendly.

| JSON enum | UI label |
|---|---|
| `business` | Business & Finance |
| `product` | Product & PM |
| `technical` | Technical & Engineering |
| `delivery` | Delivery & Operations |

Claude returns exactly 2 challenges per lens (8 total), ordered by severity within each lens. The results panel groups challenges in lens order (`business` → `product` → `technical` → `delivery`).

### Business & Finance (`business`)
Unit economics, pricing, ROI, runway, market sizing, and competitive viability — not generic “strategy slides.”

### Product & PM (`product`)
Jobs-to-be-done, PMF signals, adoption, discoverability, and roadmap assumptions — what users actually do vs what we assume.

### Technical & Engineering (`technical`)
Architecture, scale, reliability, security posture, integrations, and build/maintenance cost — what must be true before we promise it in sales.

### Delivery & Operations (`delivery`)
Scope, timeline, dependencies, capacity, rollout, and operational readiness — including procurement and change management in enterprise contexts.

### Startup vs enterprise framing

The same four lenses apply to every analysis. **Audience mode** (user-selected) and **context** (product idea + optional structured fields) steer emphasis:

| Lens | Startup emphasis | Enterprise emphasis |
|---|---|---|
| Business & Finance | Runway, PMF, pricing experiments, speed to revenue | Contract economics, renewal risk, compliance cost in P&L |
| Product & PM | Learning velocity, wedge use case, what to cut | Governance of roadmap, multi-stakeholder buyers, rollout segments |
| Technical & Engineering | MVP scope, deferrable complexity, ship-to-learn | SSO, audit, residency, security review, integration with legacy |
| Delivery & Operations | Who ships what by when with a small team | Procurement, legal review cycles, pilots, training, support readiness |

In regulated domains (health, fintech, HR, contracts, etc.), the model intensifies compliance and operational-risk questions under **business** and **delivery** — surfacing risks and questions only, never legal advice.

---

## Audience Mode (Startup / Enterprise)

A radio-group selector on the form asks **“Who are you building for?”** before the product idea field.

| Value | UI label | Default |
|---|---|---|
| `startup` | Startup / Founder | Yes |
| `enterprise` | Enterprise PM | |

**Form state:** `audienceMode` (`AudienceMode` in `types/blind-spot.ts`)

**API:** Sent as `audience_mode` on `POST /api/analyze`. Invalid values return 400; omitted values default to `startup`.

**Prompt effect:** `route.ts` prepends an audience instruction block to the user message. Startup mode prioritises PMF, runway, speed to learning, and scope discipline. Enterprise mode prioritises governance, procurement, security review, integration debt, rollout, and contract/compliance cost. The system prompt tells Claude to honour the explicit selection even when context suggests the other mode (with at most one brief trade-off note).

---

## Structured Context Fields

Optional collapsible fields on the form improve specificity. Labels in the UI:

| Field key | Form label |
|---|---|
| `targetMarket` | Target market |
| `stageOfDevelopment` | Stage of development |
| `teamConstraints` | Team constraints |
| `validated` | What's already been validated |

**Form state:** `contextFields` (`ContextFields` in `types/blind-spot.ts`), toggled via “Add context” / “Hide context”.

**Submission:** `buildContextString()` in `types/blind-spot.ts` joins non-empty fields into labeled lines, e.g. `Target market: Independent dental clinics in the UK`, separated by newlines. If all fields are empty, `context` is omitted from the request body (empty string is not sent as meaningful context).

**API:** Single `context` string on `POST /api/analyze`, appended to the user message as `Additional context: …` when non-empty.

---

## Results Presentation: Labels, Legends & Copy Report

### Card badges and micro-labels

Persona and challenge cards show dimension micro-labels (from `BADGE_DIMENSION_LABELS` in `lib/label-copy.ts`) above each badge:

**Excluded persona cards** (`excluded-persona-card.tsx`):
- **Significance** — `high` | `medium` | `low` (color-coded pill)
- **Exclusion** — `by-design` → “By Design”, `by-assumption` → “By Assumption”, `by-circumstance` → “By Circumstance”

**Stakeholder challenge cards** (`blind-spot-card.tsx`, exported as `StakeholderChallengeCard`):
- **Severity** — `high` | `medium` | `low` (color-coded pill)
- **Lens** — stakeholder enum mapped to UI label (e.g. Business & Finance)

### Section legends

`results-panel.tsx` renders a `SectionLegend` above each results block, titled **“How to read these cards”** (`PERSONA_LEGEND_TITLE` in `lib/label-copy.ts`).

**Excluded personas section** — explains Significance and Exclusion (`PERSONA_LEGEND_LINES`).

**Stakeholder Challenge section** — explains Severity and Lens (`CHALLENGE_LEGEND_LINES`).

### Copy report to clipboard

When streaming finishes and `isProductAnalysisComplete()` passes (`lib/analysis-guards.ts`), `results-panel.tsx` shows `CopyReportButton` top-right above the summary.

- **Source:** In-memory `ProductAnalysis` only — no database read
- **Format:** Markdown via `formatAnalysisForClipboard()` in `lib/format-analysis.ts` (headings, bullet lists, lens labels, significance/severity capitalised)
- **UX:** Button toggles to “Copied” for 2s; falls back to `window.prompt` if clipboard API is blocked

---

## Persistence & Sharing

**Disabled for hackathon demo.** Analyses are not saved to Supabase, and there are no share links or persisted report URLs.

- Supabase schema, client, and types exist under `lib/supabase/` as **optional scaffold for future work only**
- Env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not used at runtime in the current build
- **Privacy:** Product ideas and analysis results exist only in the user's browser session for the duration of the visit; closing or refreshing the page clears them. No server-side storage of user content.

Copy-to-clipboard is the supported way to export a report off-site.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Industry standard, Vercel-native, supports streaming API routes |
| Language | TypeScript | Type safety across the full stack |
| Styling | Tailwind CSS v4 + shadcn/ui | Rapid UI development with accessible, composable components |
| AI | Anthropic Claude API (claude-sonnet-4-6) | Structured JSON output, streaming |
| Database | Supabase | Postgres + auth + realtime — scaffold only; not wired for demo |
| Deployment | Vercel | Zero-config Next.js deployment, edge functions |
| IDE | Cursor | AI-assisted development |

---

## Project Structure

```
blind-spot-engine/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # Claude streaming API route
│   ├── globals.css             # Tailwind v4 + shadcn/ui theme
│   ├── layout.tsx              # Root layout with font setup
│   └── page.tsx                # Main page — renders BlindSpotForm
├── components/
│   ├── ui/                     # shadcn/ui primitives (auto-generated)
│   ├── blind-spot-form.tsx     # Input form, audience mode, context, streaming
│   ├── excluded-persona-card.tsx
│   ├── blind-spot-card.tsx     # StakeholderChallengeCard
│   ├── results-panel.tsx       # Summary, legends, progressive results, copy button
│   ├── section-legend.tsx      # “How to read these cards” block
│   └── copy-report-button.tsx  # Clipboard export when analysis complete
├── lib/
│   ├── format-analysis.ts      # Markdown report for clipboard
│   ├── label-copy.ts           # Legend and badge dimension copy
│   ├── analysis-guards.ts      # Streaming completeness type guards
│   └── supabase/               # Scaffold only — not used at runtime
├── types/
│   └── blind-spot.ts           # Shared TypeScript interfaces
├── .env.local                  # ANTHROPIC_API_KEY (not committed)
└── REQUIREMENTS.md             # This file
```

## Build Status & Planned Work

Phase dates, hour budget, and checkboxes live in [`BUILD_TIMELINE.md`](BUILD_TIMELINE.md). Summary as of Jun 2026:

| Phase | Status | Shipped in this spec |
|---|---|---|
| Prep → Mode 1 | Done | Core UI, streaming API, error handling; Supabase scaffold only; persistence off for demo |
| Mode 2 — AI Enrichment | Done | Audience mode, structured context, legends, copy report, progressive reveal, prompt refinements ([`PROMPTREFINMENTS.md`](PROMPTREFINMENTS.md)) |
| Polish & Deploy | In progress | Dark/light mode, loading/empty states, mobile responsive review done ([`MOBILE_RESPONSIVE_REVIEW.md`](MOBILE_RESPONSIVE_REVIEW.md)); Vercel deploy and Novus.ai still open |
| Submit | Upcoming | Demo video, README, Devpost submission |

**Still open (tracked in BUILD_TIMELINE, not product scope above):** production deployment; Novus.ai integration; hackathon submission assets.

Product behaviour is defined in the sections above; the timeline tracks delivery only.

---

## Components

### `blind-spot-form.tsx`
The primary interactive component. Manages audience mode, product idea input, optional structured context, loading state, errors, and parsed `ProductAnalysis` results. Handles streaming fetch from the API route, assembling JSON chunk-by-chunk via `partial-json`, and passing partial results to `ResultsPanel`.

**Props:** none (self-contained)

**State:** `productIdea`, `audienceMode`, `contextFields`, `showContext`, `isLoading`, `result`, `error`

**Key behaviour:**
- Radio selector for `startup` vs `enterprise` before the idea field
- ⌘ Enter (Ctrl Enter on Windows) triggers analysis
- Collapsible structured context fields concatenated via `buildContextString()` on submit
- POST body: `product_idea`, `audience_mode`, `context` (when non-empty)

### `excluded-persona-card.tsx`
Renders one excluded persona: name, description, significance and exclusion badges with micro-labels, “Why excluded” and “Design implication” callouts.

**Props:** `persona: ExcludedPersona`

### `blind-spot-card.tsx` (`StakeholderChallengeCard`)
Renders one stakeholder challenge: title, severity and lens badges with micro-labels, concern, challenge question (quoted), optional research insight.

**Props:** `challenge: StakeholderChallenge`

### `results-panel.tsx`
Two-phase layout: analysis summary, then Excluded Personas, then Stakeholder Challenge. Progressive reveal via `isPersonaComplete` / `isChallengeComplete`; skeleton only until first content arrives. Error banner on failed runs. `CopyReportButton` when `isProductAnalysisComplete(result)`.

**Props:** `result: Partial<ProductAnalysis> | null`, `isLoading: boolean`, `error: string | null`

### `section-legend.tsx`
Compact definition list for “How to read these cards” above persona and challenge sections.

**Props:** `title: string`, `lines: { term, definition }[]`

### `copy-report-button.tsx`
“Copy report” outline button; formats in-memory `ProductAnalysis` to markdown and writes to clipboard.

**Props:** `analysis: ProductAnalysis`

---

## API Route

**Endpoint:** `POST /api/analyze`

**Request body:**
```json
{
  "product_idea": "string — the product idea to analyse (required)",
  "audience_mode": "startup | enterprise (optional, default startup) — explicit PM audience for prompt framing",
  "context": "string (optional) — labeled sections from structured form fields, joined with newlines; omitted if all fields empty"
}
```

**Response:** A `text/plain` streaming response containing a single JSON `ProductAnalysis` object, streamed token-by-token from Claude. The client assembles the stream and parses incrementally with `partial-json`.

**Model:** `claude-sonnet-4-6`
**Max tokens:** 3000
**Streaming:** Yes — `ReadableStream` via Anthropic SDK `.stream()`

---

## Data Schema

See `types/blind-spot.ts` for the source of truth. Summary:

### `ProductAnalysis`
```typescript
interface ProductAnalysis {
  product_idea: string
  summary: string
  excluded_personas: ExcludedPersona[]      // 3-5 items
  stakeholder_challenges: StakeholderChallenge[]  // exactly 2 per lens
}
```

### `ExcludedPersona`
```typescript
type ExclusionType = 'by-design' | 'by-assumption' | 'by-circumstance'
type Significance = 'high' | 'medium' | 'low'

interface ExcludedPersona {
  id: string
  name: string
  description: string
  why_excluded: string
  design_implication: string
  exclusion_type: ExclusionType
  significance: Significance
}
```

### `StakeholderChallenge`
```typescript
type StakeholderLens = 'business' | 'product' | 'technical' | 'delivery'
type Severity = 'high' | 'medium' | 'low'

interface StakeholderChallenge {
  id: string
  stakeholder: StakeholderLens
  title: string
  concern: string
  challenge_question: string
  severity: Severity
  research_insight?: string
}
```

UI labels (e.g. “Business & Finance”) map to `StakeholderLens` enum values in `blind-spot-card.tsx` and `format-analysis.ts`; do not add a fifth lens without a schema migration.

---

## Claude Prompt Design

The system prompt in `app/api/analyze/route.ts` instructs Claude to return **only valid JSON** matching `ProductAnalysis` — no markdown, no preamble. Key constraints:

- 3–5 excluded personas, ordered by significance
- Exactly 2 stakeholder challenges per lens (`business`, `product`, `technical`, `delivery`) — 8 total
- Per-lens failure modes and challenge questions embedded in the system prompt
- **Business & Finance** framing while JSON enum remains `business`
- Audience-aware emphasis from `audience_mode` in the request (startup: PMF/runway/speed; enterprise: governance/procurement/security/rollout); defaults to startup if omitted
- Regulated-domain context: intensify compliance/operational-risk questions under `business` and/or `delivery` — risks and questions only, not legal advice
- Plain English in all narrative fields; explain industry jargon inline on first use ([`PROMPTREFINMENTS.md`](PROMPTREFINMENTS.md) §6)
- `research_insight` concrete and verifiable where possible; cite or hedge per [`PROMPTREFINMENTS.md`](PROMPTREFINMENTS.md); omit if uncertain

Full refinement log (figure freshness, severity cross-check, `risk_category` tagging, plain English): [`PROMPTREFINMENTS.md`](PROMPTREFINMENTS.md).

---

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key — required at runtime; never commit to source control |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL — optional; scaffold only, not used at runtime |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key — optional; scaffold only, not used at runtime |

---

## Known Constraints

- The app requires a valid `ANTHROPIC_API_KEY` at runtime — there is no mock/offline mode
- Claude responses are non-deterministic; the same product idea may produce different results on each run
- The `research_insight` field is currently generated by Claude from training knowledge, not live web search — live grounding may be added in Mode 2 or Polish & Deploy (see BUILD_TIMELINE.md)
- Analyses are not persisted; users must copy the report before leaving the page if they want to keep it
