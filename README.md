# Blind Spot Engine

Pressure-test your product idea before you commit. Blind Spot Engine surfaces who you're **not** designing for and stress-tests your assumptions across business, product, technical, and delivery lenses — then lets you copy a markdown report to share.

**[Live demo →](https://www.blindspotengine.app)**

Built for the [Mind the Product World Product Hackathon](https://mindtheproduct.devpost.com) (June 2026). Portfolio project for AI product management.

---

## What it does

1. **Excluded personas** — Identifies 3–5 people your product will *not* serve well, with significance, exclusion type, and design implications.
2. **Stakeholder challenge** — Runs eight structured challenges (two per lens: Business & Finance, Product & PM, Technical & Engineering, Delivery & Operations).

Choose **startup/founder** or **enterprise PM** framing, optionally add structured context, and run one analysis. Results stream in on desktop; copy the full report when complete.

- No account required
- Nothing saved to a database — results exist in your browser session only
- Not legal advice — regulated-domain risks are surfaced as questions to explore

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS v4, shadcn/ui, dark/light theme |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| Deploy | Vercel |

---

## Local development

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
git clone https://github.com/chandran-honour/blind-spot-engine.git
cd blind-spot-engine
npm install
```

Create `.env.local` in the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` uses webpack. For Turbopack: `npm run dev:turbo`.

There is no offline or mock mode — a valid `ANTHROPIC_API_KEY` is required.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (webpack) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |

---

## Project docs

| Doc | Description |
|-----|-------------|
| [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) | Product requirements and behaviour |
| [`docs/BUILD_TIMELINE.md`](docs/BUILD_TIMELINE.md) | Build plan and phase checklist |
| [`docs/TESTPLAN.md`](docs/TESTPLAN.md) | Test product ideas and scoring rubric |
| [`docs/PROMPTREFINMENTS.md`](docs/PROMPTREFINMENTS.md) | Prompt refinement log |
| [`CLAUDE.md`](CLAUDE.md) | Cursor / AI assistant context |

---

## Limitations

- AI output is non-deterministic — the same idea may produce different results each run
- Analyses are not persisted (Supabase schema exists as scaffold only)
- `research_insight` fields are generated from model knowledge, not live web search

---

## License

MIT — see [LICENSE](LICENSE).
