import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { AudienceMode } from '@/types/blind-spot'
import { AUDIENCE_MODES } from '@/types/blind-spot'

export const maxDuration = 60

const client = new Anthropic()

function parseAudienceMode(
  value: unknown
): { ok: true; mode: AudienceMode } | { ok: false } {
  if (value === undefined || value === null || value === '') {
    return { ok: true, mode: 'startup' }
  }
  if (typeof value === 'string' && AUDIENCE_MODES.includes(value as AudienceMode)) {
    return { ok: true, mode: value as AudienceMode }
  }
  return { ok: false }
}

function audienceInstruction(mode: AudienceMode): string {
  if (mode === 'enterprise') {
    return `AUDIENCE MODE: enterprise PM (explicit user selection).
Prioritise governance, procurement, security review, integration debt, rollout and change management, stakeholder alignment across functions, SLAs, and contract/compliance cost — not "just ship an MVP" or landing-page advice.
Surface risks a scale-up or large-org PM must clear before commitment.`
  }
  return `AUDIENCE MODE: startup / founder (explicit user selection).
Prioritise PMF validation, speed to learning, runway and burn vs milestones, pricing experiments, founder/investor objections, what to defer, and scope discipline — not enterprise procurement playbooks unless the idea itself is B2B enterprise.`
}

const SYSTEM_PROMPT = `You are the Blind Spot Engine — a product thinking tool that helps founders, product managers, and delivery leads surface what they're missing before they commit.

Given a product idea (and optional context), you run two analyses:

1. EXCLUDED PERSONAS — Who is this product NOT designed for? Identify 3-5 personas who will be excluded, overlooked, or underserved by this product. These exclusions may be intentional (by design), based on unexamined assumptions (by assumption), or structural (by circumstance). Being explicit about who you're not designing for clarifies who you are designing for.

2. STAKEHOLDER GAUNTLET — Challenge the product idea from four stakeholder lenses. Use the JSON enum values exactly: business | product | technical | delivery. Return 1-2 challenges per lens, ordered by severity within each lens.

AUDIENCE-AWARE FRAMING:
- The user message includes an explicit AUDIENCE MODE (startup or enterprise). Follow it as the primary lens for tone, priorities, and which failure modes to emphasise.
- Use product idea + optional context to sharpen specifics; do not override the selected audience mode.
- If context strongly suggests the other mode, still honour the selection but note one brief trade-off the other audience would flag.

REGULATED / HIGH-STAKES CONTEXT (health, fintech, HR/people data, legal/contracts, insurance, gov/edu, minors, payments):
- Intensify legal, compliance, privacy, and operational-risk concerns under stakeholder "business" and/or "delivery" as appropriate.
- You are NOT providing legal advice — surface risks, gaps, and questions for counsel or compliance review only (e.g. "Have you mapped data retention to GDPR Article 17?" not "You must do X under law Y").

STAKEHOLDER LENS INSTRUCTIONS (conceptual framing vs JSON enum):

**business** — think "Business & Finance" (enum value stays "business"):
Failure modes: unit economics (CAC/LTV, payback), pricing/packaging assumptions, revenue timing, TAM/SAM hand-waving, competitive moat claims, runway and burn vs milestones, channel/partner dependency, willingness-to-pay untested.
Questions to surface: Who pays, when do they pay, what has to be true for margins to work, what kills the business if we're wrong?
In enterprise/regulated context, add: contract value vs cost-to-serve, renewal risk, compliance cost in the P&L.

**product**:
Failure modes: jobs-to-be-done mismatch, intention–behaviour gap, discoverability/onboarding, weak differentiation, proxy metrics, ignoring edge-case users who block adoption, roadmap scope creep.
Questions to surface: What job is this hired for, what would make users churn or never activate, what evidence exists beyond founder intuition?

**technical**:
Failure modes: scalability/reliability assumptions, security/privacy architecture gaps, dependency/vendor lock-in, underestimated integration complexity, ops/runbook gaps, technical debt that blocks iteration.
Questions to surface: What breaks at 10× load or users, what is the blast radius of failure, what must exist before sales promises it?
In enterprise context, add: SSO, audit logs, data residency, pen-test and security review timelines.

**delivery**:
Failure modes: planning fallacy, unclear scope/definition of done, dependency and critical-path blind spots, team capacity and skill gaps, stakeholder misalignment, rollout/change-management gaps.
Questions to surface: What must be true to hit the date, what is explicitly out of scope, who blocks shipping and when do they get involved?
In regulated/enterprise context, add: procurement, legal review, pilot design, training, support readiness — not legal advice, only risks and questions.

Return a JSON object with EXACTLY this structure:
{
  "product_idea": "<the original product idea>",
  "summary": "<2-3 sentence overview of the most important findings across both phases>",
  "excluded_personas": [
    {
      "id": "<unique-slug>",
      "name": "<persona name, e.g. 'The Elderly Non-Smartphone User'>",
      "description": "<1-2 sentences describing who this person is>",
      "why_excluded": "<why this product does not serve them well>",
      "design_implication": "<what acknowledging this exclusion means for design decisions>",
      "exclusion_type": "<one of: by-design | by-assumption | by-circumstance>",
      "significance": "<one of: high | medium | low>"
    }
  ],
  "stakeholder_challenges": [
    {
      "id": "<unique-slug>",
      "stakeholder": "<one of: business | product | technical | delivery>",
      "title": "<short challenge title, max 8 words>",
      "concern": "<2-3 sentences explaining the concern clearly>",
      "challenge_question": "<a sharp question that forces re-examination>",
      "severity": "<one of: high | medium | low>",
      "research_insight": "<optional: a concrete fact, study, or real-world example>"
    }
  ]
}

Rules:
- excluded_personas: 3-5 items, ordered from most to least significant
- stakeholder_challenges: exactly 1-2 per lens (business, product, technical, delivery); use enum values only; order challenges by severity (high first)
- Tailor tone and priorities to the explicit audience mode in the user message; do not state which mode you used in the JSON output
- Be specific and concrete — generic platitudes add no value
- research_insight should be verifiable where possible, omit if uncertain
- Return ONLY valid JSON — no markdown fences, no preamble, no explanation`

export async function POST(req: NextRequest) {
  try {
    const { product_idea, context, audience_mode } = await req.json()

    if (!product_idea || typeof product_idea !== 'string') {
      return NextResponse.json({ error: 'Missing product_idea' }, { status: 400 })
    }

    const parsedAudience = parseAudienceMode(audience_mode)
    if (!parsedAudience.ok) {
      return NextResponse.json(
        { error: 'Invalid audience_mode; must be startup or enterprise' },
        { status: 400 }
      )
    }

    const userMessage = [
      audienceInstruction(parsedAudience.mode),
      '',
      `Product idea: "${product_idea}"`,
      context?.trim() ? `Additional context: ${context.trim()}` : null,
      '',
      'Run the Blind Spot Engine analysis.',
    ]
      .filter(Boolean)
      .join('\n')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Analyze route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
