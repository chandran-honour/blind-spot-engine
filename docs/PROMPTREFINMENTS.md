# Prompt Refinements

**Status:** Complete — refinements 1–5 tested and verified (Jun 2026); refinement 6 applied, pending test verify  
**Implementation:** `app/api/analyze/route.ts` (`SYSTEM_PROMPT`)  
**Client completeness:** `lib/analysis-guards.ts` (`CHALLENGES_PER_LENS = 2` in `types/blind-spot.ts`)  
**Test against:** product ideas from demo / eval runs; score with rubric in eval notes

---

## Applied refinements (Jun 2026)

### 1. Exactly 2 stakeholder challenges per lens

**What:** Stakeholder Gauntlet must return **exactly 2 challenges** for each lens (`business`, `product`, `technical`, `delivery`) — **8 total**, ordered by severity within each lens.

**Why:** Single challenges per lens left gaps; delivery lens was often under-filled.

**Prompt location:** Gauntlet intro, `FOUR-LENS COVERAGE`, Rules.

**App behaviour:** `isProductAnalysisComplete()` requires ≥2 complete challenges per lens and 8 total. If the model returns fewer, partial results still render but **Copy report** is hidden and an amber incomplete banner appears. There is **no automatic retry** or backfill.

**Verify:**
- [ ] 8 stakeholder challenge cards after a full run
- [ ] 2 each for Business, Product, Technical, Delivery
- [ ] Copy report appears only when all 8 pass field completeness

---

### 2. Figure freshness (market statistics)

**What:** Lightweight freshness check for any cited **market-size or population statistic** (freelancer counts, TAM/SAM, headcount, adoption %).

**Rules:**
- Prefer the most recently available authoritative report the model knows
- Cite **source + year** in `research_insight` or inline (e.g. `Freelance Forward 2024 (Upwork)`)
- Flag staleness if only older data exists
- Do not invent numbers — omit, qualify, or turn into a validation question

**Limitation:** Prompt-only; not live web research.

**Verify:**
- [ ] Quantified TAM/headcount claims include source and year
- [ ] Stale figures note vintage risk
- [ ] No precise stats without a plausible source

---

### 3. Cite or hedge (named research and surveys)

**What:** Extend sourcing discipline **beyond market-size stats** to named research, surveys, studies, and pundit claims (e.g. “Lenny Rachitsky survey”, “a16z report”).

**Rules:**
- **Verifiable:** source title/publication + year in `research_insight`
- **Not verifiable:** prefix with `Illustrative, unsourced —` in `research_insight`
- **Never** fabricate survey names, sample sizes, or publication details

**Why:** Test runs surfaced fabricated citations that read authoritative.

**Verify:**
- [ ] Named surveys include publication + year, or explicit “Illustrative, unsourced —”
- [ ] No invented “Lenny Rachitsky survey”-style references presented as real

---

### 4. Severity-consistency cross-check (personas ↔ challenges)

**What:** Before returning JSON, scan for the **same underlying risk** in both phases (e.g. recurring usage / retention, compliance, integration dependency).

**Rules:**
- Align persona **significance** with challenge **severity** when the root risk is the same
- If ratings intentionally differ, explain in **summary** and/or linked `why_excluded` + `concern` — no silent mismatch (e.g. persona `high` + challenge `low` on the same retention theme)

**Why:** Test runs rated the same retention risk differently across phases without explanation.

**Verify:**
- [ ] Shared themes use aligned significance/severity, or
- [ ] Summary or field copy explains deliberate divergence

---

### 5. Tighter `risk_category` tagging (idea-specific vs table-stakes)

**What:** Stricter bar for `risk_category: "idea-specific"`.

**Rules:**
- **idea-specific** — title or concern must name a causal mechanism **specific to this product**. Swap test: if another startup idea would fit unchanged → **table-stakes**
- **table-stakes** — generic indie-hacker / early-stage risks even when titles sound punchy, e.g.:
  - “No retention mechanism” / “no revenue foundation without habit”
  - “Product Hunt before retention hook” / “ship before PMF validation”
  - Generic moat, willingness-to-pay, “need more validation”, “competition exists”
- Still: ≥75% idea-specific across the gauntlet; ≤2 table-stakes total; idea-specific listed before table-stakes within each lens

**Why:** Generic retention and launch-sequencing challenges were mis-tagged as idea-specific.

**Verify:**
- [ ] Generic retention/launch risks tagged `table-stakes`
- [ ] Idea-specific tags reference this product’s workflow, integration, segment, or regulation
- [ ] At most 2 table-stakes in a full run

---

### 6. Plain English (inclusive language)

**What:** All user-facing analysis text (summary, personas, challenges) uses plain English accessible to readers with less industry experience and non-native English speakers.

**Rules:**
- Short sentences, common words, active voice
- No unexplained jargon, acronyms, idioms, or insider metaphors in prose
- When a specialist term is needed, define it inline on first use in that field (e.g. "TAM (total addressable market — everyone who could theoretically buy this)")
- Titles stay concise but understandable without specialist context
- JSON enum values (`business`, `risk_category`, etc.) unchanged — this applies to narrative fields only

**Why:** Results should help founders and PMs at every experience level, not only industry insiders.

**Verify:**
- [ ] No unexplained acronyms (CAC, LTV, PMF, SSO, etc.) without a plain-English gloss
- [ ] Concerns and challenge questions readable without a glossary
- [ ] No idiomatic startup metaphors left unexplained

---

## Baseline prompt rules (still in effect)

These predate the Jun 2026 pass but remain in `SYSTEM_PROMPT`:

| Rule | Summary |
|---|---|
| Audience-aware framing | Honour `startup` / `enterprise` from the form |
| Regulated context | Intensify compliance questions; not legal advice |
| Persona significance consistency | High significance when exclusion forecloses major TAM |
| Prescriptive output | Every challenge needs `suggested_mitigation` (actionable in 1–2 weeks) |
| Four-lens coverage | All four enums required; placeholder pattern only when needed |
| Blind spot priority | Favour non-obvious, idea-grounded challenges over platitudes |

---

## Per-run verification checklist

After each test analysis, quick pass:

| # | Check | Pass? |
|---|---|---|
| 1 | 8 challenges (2 per lens) | ✅ |
| 2 | Market stats: source + year or omitted | ✅ |
| 3 | Named research: cited or “Illustrative, unsourced —” | ✅ |
| 4 | Persona/challenge severity aligned or explained | ✅ |
| 5 | `table-stakes` only for generic risks (≤2) | ✅ |
| 6 | Plain English; jargon explained inline | |
| 7 | Copy report available when complete | ✅ |

---

## Sign-off

- [x] Refinements 1–5 applied in `SYSTEM_PROMPT` and verified in test runs
- [x] Refinement 6 (plain English) applied in `SYSTEM_PROMPT` — pending test verify
- [x] Client completeness guards aligned (`CHALLENGES_PER_LENS = 2`)

---

## Run log template

### Run N

- **Product idea:**
- **Context provided:**
- **Challenges per lens:** business __ / product __ / technical __ / delivery __
- **Figure freshness / citations:**
- **Severity cross-check:**
- **Mis-tagged table-stakes as idea-specific:**
- **Strongest improvement from refinements:**
- **Next prompt tweak to try:**

---

## Out of scope (future)

- Live web search / grounding for figure freshness
- Automatic retry when &lt;8 challenges returned
- Server-side JSON schema validation beyond client guards
