# Blind Spot Engine — Requirements

## Product Overview

Blind Spot Engine is an AI-powered web application that helps product builders surface the hidden risks in their ideas — before they ship. Users describe a product idea and the engine runs two phases automatically:

1. **Excluded Personas** — Claude generates 3–5 personas of people this product will *not* serve. The principle: *who you're not designing for clarifies who you are designing for.* This surfaces audience blind spots that typical user research misses.

2. **Stakeholder Gauntlet** — The idea is stress-tested across four stakeholder lenses (Business & Finance, Product & PM, Technical & Engineering, Delivery & Operations) in a single pass, surfacing assumptions and anticipated pushback from each angle.

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

## Analysis Personas (Lenses)

The Stakeholder Gauntlet uses four fixed lenses (JSON enum: `business` | `product` | `technical` | `delivery`). Labels in the UI may read more clearly for PMs; the API enum values do not change.

### Business & Finance (`business`)
Unit economics, pricing, ROI, runway, market sizing, and competitive viability — not generic “strategy slides.”

### Product & PM (`product`)
Jobs-to-be-done, PMF signals, adoption, discoverability, and roadmap assumptions — what users actually do vs what we assume.

### Technical & Engineering (`technical`)
Architecture, scale, reliability, security posture, integrations, and build/maintenance cost — what must be true before we promise it in sales.

### Delivery & Operations (`delivery`)
Scope, timeline, dependencies, capacity, rollout, and operational readiness — including procurement and change management in enterprise contexts.

### Startup vs enterprise framing

The same four lenses apply to every analysis; **context** (product idea + optional user context) steers emphasis:

| Lens | Startup emphasis | Enterprise emphasis |
|---|---|---|
| Business & Finance | Runway, PMF, pricing experiments, speed to revenue | Contract economics, renewal risk, compliance cost in P&L |
| Product & PM | Learning velocity, wedge use case, what to cut | Governance of roadmap, multi-stakeholder buyers, rollout segments |
| Technical & Engineering | MVP scope, deferrable complexity, ship-to-learn | SSO, audit, residency, security review, integration with legacy |
| Delivery & Operations | Who ships what by when with a small team | Procurement, legal review cycles, pilots, training, support readiness |

In regulated domains (health, fintech, HR, contracts, etc.), the model intensifies compliance and operational-risk questions under **business** and **delivery** — surfacing risks and questions only, never legal advice.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Industry standard, Vercel-native, supports streaming API routes |
| Language | TypeScript | Type safety across the full stack |
| Styling | Tailwind CSS v4 + shadcn/ui | Rapid UI development with accessible, composable components |
| AI | Anthropic Claude API (claude-sonnet-4-6) | Structured JSON output, streaming |
| Database | Supabase | Postgres + auth + realtime, generous free tier |
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
│   ├── blind-spot-form.tsx     # Main input form + state management
│   ├── blind-spot-card.tsx     # Individual blind spot result card
│   └── results-panel.tsx       # Results container with loading states
├── types/
│   └── blind-spot.ts           # Shared TypeScript interfaces
├── .env.local                  # ANTHROPIC_API_KEY (not committed)
└── REQUIREMENTS.md             # This file
```

---

## Components

### `blind-spot-form.tsx`
The primary interactive component. Manages product idea input, optional context, loading state, and parsed `ProductAnalysis` results. Handles streaming fetch from the API route, assembling JSON chunk-by-chunk via `partial-json`, and rendering results progressively.

**Props:** none (self-contained)
**State:** `productIdea`, `context`, `showContext`, `isLoading`, `result`, `error`
**Key behaviour:** ⌘ Enter triggers analysis. Optional collapsible context (team size, stage, industry, constraints) is sent to the API so Claude can tailor startup vs enterprise emphasis and regulated-domain risk surfacing.

### `excluded-persona-card.tsx`
Renders one excluded persona from Phase 1: name, exclusion type, significance, why excluded, and design implication.

### `blind-spot-card.tsx`
Renders one stakeholder challenge from Phase 2: title, severity, lens badge (e.g. Business & Finance), concern, challenge question, optional research insight.

**Props:** `challenge: StakeholderChallenge`

### `results-panel.tsx`
Two-phase layout: Excluded Personas then Stakeholder Gauntlet. Progressive reveal via type guards; skeleton only until first complete card arrives.

**Props:** `result: Partial<ProductAnalysis> | null`, `isLoading: boolean`

---

## API Route

**Endpoint:** `POST /api/analyze`

**Request body:**
```json
{
  "product_idea": "string — the product idea to analyse (required)",
  "audience_mode": "startup | enterprise (optional, default startup) — explicit PM audience for prompt framing",
  "context": "string (optional) — stage, team, industry, constraints"
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
  stakeholder_challenges: StakeholderChallenge[]  // 1-2 per lens
}
```

### `StakeholderLens`
```typescript
type StakeholderLens = 'business' | 'product' | 'technical' | 'delivery'
```

UI labels (e.g. "Business & Finance") map to these enum values; do not add a fifth lens without a schema migration.

---

## Claude Prompt Design

The system prompt in `app/api/analyze/route.ts` instructs Claude to return **only valid JSON** matching `ProductAnalysis` — no markdown, no preamble. Key constraints:

- 3–5 excluded personas, ordered by significance
- 1–2 stakeholder challenges per lens (`business`, `product`, `technical`, `delivery`)
- Per-lens failure modes and challenge questions embedded in the system prompt
- **Business & Finance** framing while JSON enum remains `business`
- Audience-aware emphasis from `audience_mode` in the request (startup: PMF/runway/speed; enterprise: governance/procurement/security/rollout); defaults to startup if omitted
- Regulated-domain context: intensify compliance/operational-risk questions under `business` and/or `delivery` — risks and questions only, not legal advice
- `research_insight` concrete and verifiable where possible; omit if uncertain

---

## Remaining Build

### Mode 1 — 30–31 May | Blind Spot Personas ✅ mostly done
- [x] Rebuilt two-phase concept: Excluded Personas + Stakeholder Gauntlet
- [x] 7 files rewritten — types, API route, form, cards, results panel
- [x] First live API analysis returning successfully
- [ ] Error handling UI — graceful failure on API errors / empty responses
- [x] Update REQUIREMENTS.md — lenses, API shape, prompt design

> **Note:** Supabase persistence deliberately deferred. No data collection on public demo URL — no privacy policy required.

### Mode 2 — 1–7 Jun | Stakeholder Challenge + Challenge Report
- [ ] Stakeholder Challenge — structured challenge of the product idea across Business, Product, Technical, Delivery perspectives
- [ ] Challenge Report — formatted, shareable output the user can send to stakeholders
- [ ] Streaming UX polish — progressive card reveal as JSON streams in
- [ ] Prompt refinement based on real Mode 1 usage

### Polish & Deploy — 8–13 Jun
- [ ] Novus.ai testing + feedback incorporation
- [ ] Dark/light mode toggle
- [ ] Mobile responsive layout review
- [ ] Copy-to-clipboard on results
- [ ] Share link for individual analyses
- [ ] Vercel production deployment
- [ ] Environment variable audit before going live

### Submission — 14–20 Jun
- [ ] Demo video recording
- [ ] README and submission write-up
- [ ] Public GitHub repo (after secrets audit)

---

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key — never commit to source control |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (to be added) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (to be added) |

---

## Known Constraints

- The app requires a valid `ANTHROPIC_API_KEY` at runtime — there is no mock/offline mode
- Claude responses are non-deterministic; the same product idea may produce different results on each run
- The `research_insight` field is currently generated by Claude from training knowledge, not live web search — this will be addressed in the AI Enrichment phase with tool use integration
