# Loading & Empty States Polish Plan

**Status:** Implemented (Jun 2026)  
**Phase:** Polish & Deploy — complete (see [`BUILD_TIMELINE.md`](BUILD_TIMELINE.md))  
**Depends on (optional):** [`THEME_TOGGLE_PLAN.md`](THEME_TOGGLE_PLAN.md) — remaining semantic token pass on error banners deferred until theme work lands

## How to resume later

This plan is **complete**. For theme-related polish, see `THEME_TOGGLE_PLAN.md`.

---

## Current state (implemented)

| State | Where | Behavior |
|---|---|---|
| **Loading — button** | `components/blind-spot-form.tsx` | Phase-aware copy via `lib/loading-phase.ts` |
| **Loading — skeleton** | `components/results-panel.tsx` | Full skeleton until first parseable content |
| **Loading — streaming** | `results-panel.tsx` | Progressive cards via guards; section skeletons between phases |
| **Error** | `results-panel.tsx` | Red banner + Try again |
| **Empty parse** | `results-panel.tsx` | Amber banner if stream completes with nothing displayable |
| **Validation empty** | `blind-spot-form.tsx` | Inline message under product idea textarea |
| **Pre-run idle** | `components/idle-results-placeholder.tsx` | Friendly placeholder below form |

**Streaming (Jun 2026):** API streams chunked JSON again. Desktop reads the body incrementally for progressive reveal; mobile buffers the full response (`response.text()` on coarse pointer) — unchanged mobile UX.

Reference: [`REQUIREMENTS.md`](REQUIREMENTS.md), [`CLAUDE.md`](CLAUDE.md), [`lib/analysis-guards.ts`](lib/analysis-guards.ts).

---

## Gaps to polish

### 1. Loading UX

- [x] **Phase-aware copy** — Button/skeleton/status line aligned to personas → challenges flow
- [x] **Section-level loading** — Challenge skeletons while phase 2 streams after phase 1 visible
- [x] **Consistent status line** — `LoadingStatusLine` component (pulsing dot + short status)
- [x] **Mobile visibility** — Scroll-to-results on Run; loading UI visible on phone
- [x] **Token styling** — Skeleton/card shells use `bg-muted`, `bg-card`, `border-border`

### 2. Empty UX

- [x] **Pre-run idle state** — `IdleResultsPlaceholder`
- [x] **Inline validation** — Under product idea textarea
- [x] **Error recovery** — Try again on error banners; form state preserved
- [x] **Partial failure copy** — Amber banner when analysis incomplete

### 3. Edge cases (verified)

- [x] Mobile buffered response path — same loading/empty behavior as desktop stream
- [x] `isLoading` cleared in `finally` block
- [x] Re-run clears previous results immediately (`setResult(null)` on submit)

---

## Files touched

| File | Changes |
|---|---|
| `components/results-panel.tsx` | Idle placeholder, section skeletons, error retry, token colors |
| `components/blind-spot-form.tsx` | Button copy, inline validation, phase-aware loading |
| `components/idle-results-placeholder.tsx` | Pre-run placeholder |
| `components/loading-status-line.tsx` | Shared status line |
| `lib/loading-phase.ts` | Phase detection + copy |
| `app/api/analyze/route.ts` | Streaming restored with fail-fast auth errors |

---

## Todos

- [x] Align loading copy across button, skeleton, and section headers (phase-aware)
- [x] Add pre-run idle placeholder below form
- [x] Inline validation for empty product idea + error retry on banners
- [x] Section-level skeletons while phase 2 streams after phase 1 visible
- [x] Migrate skeleton/empty UI colors to semantic tokens
- [x] Desktop + mobile verification + `npm run build`

---

## Acceptance criteria (matches REQUIREMENTS)

- [x] Skeleton only until first displayable content arrives
- [x] Cards render progressively via analysis guards (desktop stream)
- [x] Copy report appears only when `isProductAnalysisComplete(result)`
- [x] Failed runs show clear error with recovery path
- [x] Pre-run state is intentional, not a blank gap

---

## Out of scope (unchanged)

- Full-page loading overlay
- Progress bar / % complete
- Persisting partial results across refresh
- Error banner semantic tokens — deferred to theme toggle work
