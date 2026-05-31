import type { BlindSpot, AnalysisLens } from '@/types/blind-spot'

// -------------------------------------------------------
// Database row types — mirror the Supabase schema exactly
// -------------------------------------------------------

export interface AnalysisRow {
  id: string
  created_at: string
  session_id: string
  claim: string
  lens: AnalysisLens
  context: string | null
  summary: string
  blind_spots: BlindSpot[]
}

// -------------------------------------------------------
// Supabase Database type — used to type the client
// -------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: AnalysisRow
        Insert: Omit<AnalysisRow, 'id' | 'created_at'>
        Update: Partial<Omit<AnalysisRow, 'id' | 'created_at'>>
      }
    }
  }
}
