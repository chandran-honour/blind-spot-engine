# Blind Spot Engine — Requirements

## Product Overview

Blind Spot Engine is an AI-powered web application that helps product builders surface the hidden risks in their ideas — before they ship. Users describe a product idea and the engine runs two phases automatically:

1. **Excluded Personas** — Claude generates 3–5 personas of people this product will *not* serve. The principle: *who you're not designing for clarifies who you are designing for.* This surfaces audience blind spots that typical user research misses.

2. **Stakeholder Gauntlet** — The idea is stress-tested across four stakeholder lenses (Business, Product, Technical, Delivery) in a single pass, surfacing assumptions and anticipated pushback from each angle.

The product is designed to be fast, focused, and actionable. It is not a general-purpose chat interface — it is a single-purpose thinking tool that returns structured, high-signal output every time.

---

## Problem Statement

Decision-makers across business, product, engineering, delivery and personal contexts routinely act on assumptions they haven't examined. Traditional brainstorming and peer review catch some of these, but cognitive biases, group-think, and domain blind spots mean critical risks are routinely missed until it's too late. Blind Spot Engine makes assumption stress-testing fast, low-friction, and available to anyone with a browser.

---

## Target Users

- Founders and product managers stress-testing strategic assumptions
- Engineering leads evaluating technical decisions
- Delivery managers assessing project plans and timelines
- Consultants preparing for client engagements
- Individuals facing significant personal decisions

---

## Analysis Personas (Lenses)

The analysis lens determines the frame Claude applies when identifying blind spots. Each lens has its own domain heuristics, typical failure modes, and vocabulary.

### Business Strategy
Evaluates claims through the lens of market dynamics, competitive positioning, revenue models, and organisational capability. Surfaces assumptions about customer willingness to pay, market size, competitive moats, and execution capacity.

*Example claim: "Our target customers will pay a premium for faster onboarding."*

### Product
Evaluates claims through the lens of user behaviour, product-market fit, feature discoverability, and adoption patterns. Surfaces assumptions about how users actually interact with a product versus how designers intend them to.

*Example claim: "Users will discover this feature naturally through the UI."*

### Technical
Evaluates claims through the lens of system architecture, scalability, reliability, and engineering complexity. Surfaces assumptions about performance under load, dependency risk, and technical debt accumulation.

*Example claim: "Our current architecture will scale to 10× the current load."*

### Delivery
Evaluates claims through the lens of project management, resourcing, timelines, dependencies, and delivery risk. Surfaces assumptions about team capacity, scope creep, stakeholder alignment, and the reliability of estimates.

*Example claim: "We can ship the MVP in six weeks with the current team."*

### Personal Decision
Evaluates claims through the lens of individual psychology, life circumstances, values alignment, and long-term consequences. Surfaces assumptions about motivation, opportunity cost, and the reliability of self-assessment.

*Example claim: "Switching careers now is the right move given my circumstances."*

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Industry standard, Vercel-native, supports streaming API routes |
| Language | TypeScript | Type safety across the full stack |
| Styling | Tailwind CSS v4 + shadcn/ui | Rapid UI development with accessible, composable components |
| AI | Anthropic Claude API (claude-opus-4-6) | Structured JSON output, streaming, tool use capability |
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
The primary interactive component. Manages all client-side state including the claim input, selected lens, loading state, and parsed results. Handles streaming fetch from the API route, assembling the JSON response chunk by chunk and rendering results as soon as the complete object is available.

**Props:** none (self-contained)
**State:** `claim`, `lens`, `context`, `showContext`, `isLoading`, `result`
**Key behaviour:** ⌘ Enter keyboard shortcut triggers analysis; lens selection updates the textarea placeholder dynamically. An optional collapsible context field ("Add context") allows users to provide background information — team size, constraints, what's at stake — that is appended to the Claude prompt to produce more specific, actionable blind spots.

### `blind-spot-card.tsx`
Renders a single blind spot as a card. Displays title, severity badge (colour-coded: red/amber/green), category badge, description, challenge question, and an optional research insight panel.

**Props:** `blindSpot: BlindSpot`

### `results-panel.tsx`
Wraps the list of `BlindSpotCard` components. Handles three states: hidden (no analysis run yet), loading (skeleton placeholders), and populated (summary + cards).

**Props:** `result: AnalysisResult | null`, `isLoading: boolean`

---

## API Route

**Endpoint:** `POST /api/analyze`

**Request body:**
```json
{
  "claim": "string — the assumption to stress-test",
  "lens": "business | product | technical | delivery | personal",
  "context": "string (optional) — additional background to improve specificity"
}
```

**Response:** A `text/plain` streaming response containing a single JSON object, streamed token-by-token from Claude. The client assembles the stream and parses the complete JSON on receipt.

**Model:** `claude-opus-4-6`
**Max tokens:** 2048
**Streaming:** Yes — `ReadableStream` via Anthropic SDK `.stream()`

---

## Data Schema

### `BlindSpot`
```typescript
interface BlindSpot {
  id: string                  // URL-safe slug, e.g. "optimism-bias"
  title: string               // Short title, max 8 words
  category: BlindSpotCategory // See below
  severity: 'high' | 'medium' | 'low'
  description: string         // 2-3 sentence explanation
  challenge_question: string  // Sharp re-examination question
  research_insight?: string   // Optional grounding fact or study
}
```

### `BlindSpotCategory`
```typescript
type BlindSpotCategory =
  | 'cognitive-bias'
  | 'market-assumption'
  | 'technical-risk'
  | 'strategic-gap'
  | 'ethical-concern'
```

### `AnalysisResult`
```typescript
interface AnalysisResult {
  claim: string
  lens: AnalysisLens
  summary: string             // 2-3 sentence overview
  blind_spots: BlindSpot[]    // 3-5 items, ordered high → low severity
}
```

---

## Claude Prompt Design

The system prompt instructs Claude to act as the Blind Spot Engine and return **only valid JSON** matching the `AnalysisResult` schema — no markdown, no preamble. Key constraints enforced in the prompt:

- 3–5 blind spots returned, ordered by severity
- `research_insight` should be concrete and verifiable
- Specificity over generality — no generic platitudes
- Category and severity values must match the defined enums

### Lens-Specific Instructions

Each analysis lens injects a structured instruction block into the user message at request time, defined in `LENS_PROMPTS` in `app/api/analyze/route.ts`. This makes each persona load-bearing rather than a two-word label that Claude interprets freely.

Each lens instruction specifies:
- **Failure modes to hunt** — the domain-specific risks and assumptions most likely to be overlooked under that lens
- **Preferred categories** — which of the five `BlindSpotCategory` values to favour, ensuring category output is coherent with the lens
- **Evidence base** — the research tradition, literature, or real-world examples Claude should draw on for `research_insight`

| Lens | Failure modes prioritised | Preferred categories |
|---|---|---|
| Business Strategy | Willingness to pay, competitive moats, CAC/LTV, distribution | strategic-gap, market-assumption, cognitive-bias |
| Product | Intention-behaviour gap, discoverability, jobs-to-be-done, proxy metrics | cognitive-bias, strategic-gap, market-assumption |
| Technical | Scalability ceilings, dependency risk, ops complexity, security assumptions | technical-risk, cognitive-bias, strategic-gap |
| Delivery | Planning fallacy, scope creep, stakeholder alignment, definition of done | cognitive-bias, strategic-gap, ethical-concern |
| Personal Decision | Motivation durability, opportunity cost, reversibility, sunk cost thinking | cognitive-bias, ethical-concern, strategic-gap |

The `LENS_PROMPTS` map is typed against `AnalysisLens`, so adding a new lens to the type will produce a compile-time error if the corresponding prompt entry is missing.

---

## Remaining Build

### Mode 1 — 30–31 May | Blind Spot Personas ✅ mostly done
- [x] Rebuilt two-phase concept: Excluded Personas + Stakeholder Gauntlet
- [x] 7 files rewritten — types, API route, form, cards, results panel
- [x] First live API analysis returning successfully
- [ ] Error handling UI — graceful failure on API errors / empty responses
- [ ] Update this REQUIREMENTS.md product overview ← in progress

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
- Claude responses are non-deterministic; the same claim may produce different blind spots on each run
- The `research_insight` field is currently generated by Claude from training knowledge, not live web search — this will be addressed in the AI Enrichment phase with tool use integration
