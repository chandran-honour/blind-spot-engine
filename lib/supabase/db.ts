import type { AudienceMode, ProductAnalysis } from '@/types/blind-spot'
import { supabase, isSupabaseConfigured } from './client'
import type { AnalysisInsert, AnalysisRow } from './types'

export { isSupabaseConfigured }

export interface SaveProductAnalysisOptions {
  context?: string
  audience_mode?: AudienceMode
}

export async function saveProductAnalysis(
  analysis: ProductAnalysis,
  sessionId: string,
  options?: SaveProductAnalysisOptions
): Promise<string | null> {
  if (!supabase) return null

  const row: AnalysisInsert = {
    session_id: sessionId,
    product_idea: analysis.product_idea,
    summary: analysis.summary,
    context: options?.context?.trim() || null,
    audience_mode: options?.audience_mode ?? 'startup',
    excluded_personas: analysis.excluded_personas,
    stakeholder_challenges: analysis.stakeholder_challenges,
  }

  const { data, error } = await supabase
    .from('analyses')
    .insert(row)
    .select('id')
    .single<{ id: string }>()

  if (error) {
    console.error('Failed to save analysis:', error.message)
    return null
  }

  return data?.id ?? null
}

export async function getSessionAnalyses(sessionId: string): Promise<AnalysisRow[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch analyses:', error.message)
    return []
  }

  return (data ?? []) as AnalysisRow[]
}

export async function getAnalysis(id: string): Promise<AnalysisRow | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single<AnalysisRow>()

  if (error) {
    console.error('Failed to fetch analysis:', error.message)
    return null
  }

  return data
}
