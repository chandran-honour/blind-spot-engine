import type {
  AudienceMode,
  ExcludedPersona,
  StakeholderChallenge,
} from '@/types/blind-spot'

// Mirrors supabase/schema.sql — ProductAnalysis persistence row

export interface AnalysisRow {
  id: string
  created_at: string
  session_id: string
  product_idea: string
  context: string | null
  audience_mode: AudienceMode
  summary: string
  excluded_personas: ExcludedPersona[]
  stakeholder_challenges: StakeholderChallenge[]
}

export type AnalysisInsert = Omit<AnalysisRow, 'id' | 'created_at'>
export type AnalysisUpdate = Partial<AnalysisInsert>

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: AnalysisRow
        Insert: AnalysisInsert
        Update: AnalysisUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
