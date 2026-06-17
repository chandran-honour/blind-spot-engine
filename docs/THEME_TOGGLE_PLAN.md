# Dark / Light Mode Toggle Plan

**Status:** Implemented (Jun 2026) — including pixel-perfect light palette  
**Scope:** Dark as default; brand-aligned light mode

---

## What was implemented

| Item | Location |
|---|---|
| `next-themes` + `ThemeProvider` | `components/theme-provider.tsx`, `app/layout.tsx` |
| Sun/moon toggle (top-right) | `components/mode-toggle.tsx`, `app/page.tsx` |
| Semantic token migration | Feature components use CSS tokens, not `dark:` pairs |
| Themed logo | `components/blind-spot-logo.tsx` via `--logo-*` CSS variables |
| Badge/callout tokens | `app/globals.css` + `lib/theme-colors.ts` |

**Default:** dark mode. Toggle switches `.dark` class on `<html>`.

---

## Palette reference

### Core surfaces (`app/globals.css`)

| Token | Light | Dark |
|-------|-------|------|
| `--background` | Soft blue-gray page | Near-black |
| `--card` | Elevated white-blue | Slate-900 equivalent |
| `--muted` | Blue-gray callout wells | Slate-800 equivalent |
| `--border` / `--input` | Soft blue-gray borders | White/10% borders |
| `--primary` | Blue-600 (CTA) | Near-white (shadcn default) |
| `--ring` | Blue-tinted focus | Gray focus |

### Brand extensions

| Token | Use |
|-------|-----|
| `--brand-accent` | Run button, loading dots, streaming indicators |
| `--brand-accent-muted` / `--brand-accent-subtle` | Footer pill, logo fills |
| `--badge-*` | Severity/significance chips |
| `--lens-*` | Stakeholder lens badges |
| `--exclusion-*` | Exclusion type badges |
| `--callout-*` | Card callout labels and borders |
| `--callout-warning-*` | Amber warning banners |
| `--logo-*` | Logo ring, wedge, stroke, center |

Utility classes (e.g. `badge-severity-high`, `banner-warning`, `footer-brand-pill`) are defined in `globals.css`. Component class maps live in `lib/theme-colors.ts`.

---

## Verify

- [x] First load: dark
- [x] Toggle → light: brand-aligned blue-gray surfaces
- [x] Toggle back → dark; no regression
- [x] Logo, badges, banners token-driven
- [x] `npm run build` passes

---

## Out of scope

- System preference auto-switch (`enableSystem`) — dark remains default
- Figma design handoff
