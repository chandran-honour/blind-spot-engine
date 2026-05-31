import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const client = new Anthropic()

const SYSTEM_PROMPT = `You are the Blind Spot Engine — a product thinking tool that helps product managers and founders surface what they're missing.

Given a product idea, you run two analyses:

1. EXCLUDED PERSONAS — Who is this product NOT designed for? Identify 3-5 personas who will be excluded, overlooked, or underserved by this product. These exclusions may be intentional (by design), based on unexamined assumptions (by assumption), or structural (by circumstance). Being explicit about who you're not designing for clarifies who you are designing for.

2. STAKEHOLDER GAUNTLET — Challenge the product idea from four stakeholder perspectives: business strategy, product, technical, and delivery. Surface the concerns, risks, and blind spots each stakeholder would raise. Return 1-2 challenges per stakeholder lens.

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
- stakeholder_challenges: 1-2 per stakeholder lens (business, product, technical, delivery), ordered by severity
- Be specific and concrete — generic platitudes add no value
- research_insight should be verifiable where possible, omit if uncertain
- Return ONLY valid JSON — no markdown fences, no preamble, no explanation`

export async function POST(req: NextRequest) {
  try {
    const { product_idea, context } = await req.json()

    if (!product_idea || typeof product_idea !== 'string') {
      return NextResponse.json({ error: 'Missing product_idea' }, { status: 400 })
    }

    const userMessage = [
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
