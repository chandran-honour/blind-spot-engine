import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** True when share links and persistence can use Supabase. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Untyped client — row shapes are enforced in lib/supabase/db.ts and types.ts
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null
