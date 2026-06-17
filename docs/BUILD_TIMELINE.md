# Blind Spot Engine — Build Timeline

**Deadline:** 20 June 2026 | **Total budget:** ~75 hours | **Build days:** 27

Product behaviour and acceptance criteria: [`REQUIREMENTS.md`](REQUIREMENTS.md)

---

## ✅ PREP — Sun 24 May (1h)
- [x] Product ideation and shortlisting
- [x] Blind Spot Engine selected
- [x] Build plan and timeline created
- [x] Complexity comparison and timeline exported as PNGs

---

## ✅ DAY 1 — Mon 25 May (3h)
- [x] Cursor install
- [x] Next.js 15 scaffold
- [x] shadcn/ui initialised (Radix, Default, Slate)
- [x] Tailwind v4 + PostCSS config resolved

---

## ✅ KIDS WEEK EVENINGS — Tue 26 – Fri 29 May (1.5h/eve × 4 = 6h)
- [x] Core UI components built (form, persona cards, challenge cards, results panel)
- [x] Claude API route with streaming
- [x] Two-phase concept rebuilt (excluded personas + Stakeholder Challenge)
- [x] Optional single context field added (replaced by structured context in Mode 2)
- [x] Supabase schema and client code drafted
- [x] REQUIREMENTS.md created and updated
- [x] App running end-to-end locally

---

## ✅ MODE 1 — Sat 30 – Sun 31 May (4–5h/day × 2 = ~9h)

### ✅ Sat 30 May
- [x] Supabase project created (dashboard setup)
- [x] Schema SQL run in Supabase SQL Editor
- [x] Env variables added to `.env.local`
- [x] ~~Persistence~~ — decision made not to wire in for the demo

### Today — Sun 31 May
- [x] Error handling UI — timeout, failed API call, empty response states
- [x] End-to-end smoke test: submit → stream → results render correctly

---

## ✅ MODE 2 — AI Enrichment — Mon 1 – Sun 7 Jun (3–4h/day × 7 = ~24h)
- [x] Audience mode selector (startup / enterprise PM)
- [x] Structured context form (target market, stage, team constraints, validated)
- [x] Label legends and badge micro-labels on persona and challenge cards
- [x] Streaming UX polish — progressive card reveal as JSON streams in
- [x] Copy-to-clipboard on results
- [x] Docs sync — REQUIREMENTS.md, CLAUDE.md, [`TESTPLAN.md`](TESTPLAN.md)
- [x] Prompt refinement based on real test results (see [`PROMPTREFINMENTS.md`](PROMPTREFINMENTS.md))
- [ ] ~~Share link for individual analyses~~ — deferred (no DB persistence on hackathon demo)

---

## 🔄 POLISH & DEPLOY — Mon 8 – Fri 13 Jun (3h/day × 6 = ~18h)
- [x] Mobile responsive layout review and fixes (see [`MOBILE_RESPONSIVE_REVIEW.md`](MOBILE_RESPONSIVE_REVIEW.md))
- [x] Dark/light mode toggle (brand-aligned light palette, tokenized badges/callouts, themed logo)
- [x] Loading and empty states polished
- [ ] Vercel production deployment
- [ ] Custom domain (optional)
- [ ] Environment variable audit — confirm no secrets in git history
- [ ] Performance review — API response times, streaming UX
- [ ] Install and set up Novus.ai agent

---

## SUBMIT — Mon 14 – Sat 20 Jun (2h/day × 7 = ~14h)
- [ ] Demo video recording
- [ ] Hackathon submission write-up
- [ ] README finalised
- [ ] Public GitHub repo (after secrets audit: `git grep -i "sk-ant"`)
- [ ] Devpost submission completed before 20 Jun deadline

---

## Hours Summary

| Phase | Dates | Budget | Status |
|---|---|---|---|
| Prep | 24 May | 1h | ✅ Done |
| Day 1 Scaffold | 25 May | 3h | ✅ Done |
| Kids Week Evenings | 26–29 May | 6h | ✅ Done |
| Mode 1 — Core | 30–31 May | 9h | ✅ Done |
| Mode 2 — AI Enrichment | 1–7 Jun | 24h | ✅ Done |
| Polish & Deploy | 8–13 Jun | 18h | 🔄 In progress |
| Submit | 14–20 Jun | 14h | ⬜ Upcoming |
| **Total** | | **~75h** | |

> Actual spend to date: ~30h (estimated from build timeline + Cursor chat sessions, Jun 2026)
