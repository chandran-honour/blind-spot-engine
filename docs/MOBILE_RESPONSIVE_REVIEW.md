# Mobile Responsive Review Checklist

**Status:** Complete — tested and verified (Jun 2026)  
**Phase:** Polish & Deploy — complete (see [`BUILD_TIMELINE.md`](BUILD_TIMELINE.md))  
**Related:** `[LOADING_EMPTY_STATES_PLAN.md](LOADING_EMPTY_STATES_PLAN.md)`, `[THEME_TOGGLE_PLAN.md](THEME_TOGGLE_PLAN.md)`

---

## How to run this review

1. Start the dev server: `npm run dev`
2. Test on a **real phone** if possible (iOS Safari + one Android browser). Chrome DevTools device emulation is a useful first pass but not a substitute.
3. Repeat key flows in **light and dark** mode.
4. Log issues in the template at the bottom; fix before Vercel deploy and demo recording.

### Viewports to check


| Device class               | Width     | Priority                                     |
| -------------------------- | --------- | -------------------------------------------- |
| Small phone                | 320–375px | Must pass                                    |
| Standard phone             | 390–430px | Must pass                                    |
| Large phone / small tablet | 480–640px | Should pass                                  |
| Desktop                    | ≥640px    | Smoke test only (already primary dev target) |


---

## Page shell (`app/page.tsx`)

- [x] No horizontal scroll at 320px width
- [x] Theme toggle (`ModeToggle`) is tappable and not clipped by safe area (top-right)
- [x] Theme toggle does not overlap the logo or headline
- [x] Headline scales readably (`text-3xl` → `sm:text-4xl`); no awkward line breaks on narrow screens
- [x] Subtitle and footer pill remain centered and legible
- [x] Page padding (`px-4`, `py-16`) feels balanced — not cramped at top, not excessive whitespace on short phones

---

## Form (`components/blind-spot-form.tsx`)

### Audience mode (`components/audience-mode-selector.tsx`)

- [x] On touch devices: **native `<select>`** is shown (not segmented buttons) — see `audience-mode-native` in `app/globals.css`
- [x] On desktop with fine pointer (≥640px): **segmented control** is shown instead
- [x] Select and buttons meet touch target guidance (`min-h-12` / `min-h-14` on Run)
- [x] Labels and helper text do not overflow or wrap awkwardly

### Product idea input

- [x] Textarea is full width; placeholder readable without zoom
- [x] Virtual keyboard does not permanently hide the Run button (scroll after focus if needed)
- [x] Mobile tip copy shows: “Enter your idea, then tap Run Blind Spot below.” (`sm:hidden`)
- [x] Validation error appears inline and is readable

### Optional context (`<details>`)

- [x] “Add context” summary is easy to tap (`min-h-12`, `touch-manipulation`)
- [x] Expanded fields stack vertically with comfortable spacing
- [x] Inputs and textareas are full width; no horizontal overflow from long placeholders

### Run button

- [x] **Run Blind Spot** responds to tap on iOS Safari and Android Chrome (no `disabled` attribute — touch-safe by design)
- [x] Loading state shows phase-aware copy and does not clip on narrow screens
- [x] After tap, results area scrolls into view (`scrollResultsIntoView`)

---

## Results (`components/results-panel.tsx`)

### Loading & empty states

- [x] Idle placeholder (`IdleResultsPlaceholder`) reads well on narrow screens
- [x] Loading skeleton cards fit within viewport; no badge row overflow
- [x] On mobile (coarse pointer): full response buffers then renders — confirm acceptable wait UX (~30–60s) with loading message visible throughout
- [x] Error and warning banners wrap text; **Try again** button is tappable

### Summary & cards

- [x] Analysis summary card text wraps; no overflow
- [x] Persona and challenge cards: title + badges stack on mobile (`flex-col sm:flex-row`)
- [x] Badge rows wrap without clipping (`flex-wrap`); micro-labels remain legible at `text-[10px]`
- [x] Callout blocks (why excluded, concern, challenge question) readable without horizontal scroll
- [x] Section legends (`SectionLegend`) fit narrow width

### Copy report (`components/copy-report-button.tsx`)

- [x] **Copy report** button is tappable when analysis completes
- [x] Native **Share** sheet appears on mobile when clipboard is blocked (`shareReportText`)
- [x] Manual copy fallback dialog: bottom sheet on mobile (`items-end sm:items-center`); textarea selectable; Close works

---

## Theme (`components/mode-toggle.tsx`, `app/globals.css`)

- [x] Toggle works on touch; icon state matches theme
- [x] Light mode: sufficient contrast on cards, inputs, badges, and banners
- [x] Dark mode: no regression vs desktop
- [x] Logo ring and center dot visible in both themes (no stray wedge/artifact)

---

## Performance & polish

- [x] First Contentful Paint feels acceptable on mobile network (test on 4G throttling in DevTools if no device)
- [x] No layout shift when results stream in (desktop) or appear all at once (mobile)
- [x] `animate-card-in` does not cause jank on lower-end Android
- [x] Footer “Powered by Claude” pill does not overlap results on long scroll

---

## Pre-deploy smoke (production URL)

After Vercel deploy, repeat on a real phone (not part of local mobile review sign-off):

- [ ] Load public URL cold (no cache)
- [ ] Submit one idea from eval / demo product set
- [ ] Copy or share report succeeds
- [ ] Theme toggle persists across refresh (`next-themes`)

---

## Issue log

### Issue 1

- **Viewport / device:**  
- **Theme:** light / dark  
- **Area:** (e.g. persona card badges)  
- **Expected:**  
- **Actual:**  
- **Fix / file:**

### Issue 2

- **Viewport / device:**  
- **Theme:** light / dark  
- **Area:**  
- **Expected:**  
- **Actual:**  
- **Fix / file:**

---

## Sign-off

- [x] All **Must pass** viewports checked on at least one real device
- [x] No open **high** severity layout issues
- [x] `npm run build` passes after any CSS/component fixes
- [x] [`BUILD_TIMELINE.md`](BUILD_TIMELINE.md) mobile item marked complete