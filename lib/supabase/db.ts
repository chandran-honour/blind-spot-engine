import { supabase } from './client'
import type { AnalysisRow } from './types'
import type { AnalysisResult, AnalysisLens } from '@/types/blind-spot'

// -------------------------------------------------------
// Save a completed analysis to Supabase
// -------------------------------------------------------

export async function saveAnalysis(
  result: AnalysisResult,
  sessionId: string,
  context?: string
): Promise<AnalysisRow | null> {
  const { data, error } = await supabase
    .from('analyses')
    .insert({
      session_id: sessionId,
      claim: result.claim,
      lens: result.lens,
      context: context ?? null,
      summary: result.summary,
      blind_spots: result.blind_spots,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to save analysis:', error.message)
    return null
  }

  return data
}

// -------------------------------------------------------
// Fetch all analyses for a given session (history view)
// -------------------------------------------------------

export async function getSessionAnalyses(
  sessionId: string
): Promise<AnalysisRow[]> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch analyses:', error.message)
    return []
  }

  return data ?? []
}

// -------------------------------------------------------
// Fetch a single analysis by ID
// -------------------------------------------------------

export async function getAnalysis(id: string): Promise<AnalysisRow | null> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch analysis:', error.message)
    return null
  }

  return data
}
