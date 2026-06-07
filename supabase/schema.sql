-- ============================================================
-- Blind Spot Engine — Supabase Schema (ProductAnalysis shape)
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
--
-- Requires: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
-- in .env.local for share links and persistence.
--
-- Upgrading an older claim/lens table? Run migration_v2_product_analysis.sql
-- ============================================================

create table if not exists analyses (
  id                      uuid        default gen_random_uuid() primary key,
  created_at              timestamptz default now() not null,

  -- Client-generated UUID (localStorage) grouping runs per browser
  session_id              uuid        not null,

  -- User inputs
  product_idea            text        not null,
  context                 text,
  audience_mode           text        not null default 'startup',

  -- Claude outputs (full ProductAnalysis payload)
  summary                 text        not null,
  excluded_personas       jsonb       not null default '[]'::jsonb,
  stakeholder_challenges  jsonb       not null default '[]'::jsonb,

  constraint analyses_audience_mode_check
    check (audience_mode in ('startup', 'enterprise'))
);

create index if not exists analyses_session_id_idx
  on analyses (session_id);

create index if not exists analyses_created_at_idx
  on analyses (created_at desc);

-- ============================================================
-- Row Level Security — permissive anon demo (insert + select by id)
-- ============================================================

alter table analyses enable row level security;

drop policy if exists "Anyone can insert analyses" on analyses;
create policy "Anyone can insert analyses"
  on analyses for insert
  to anon
  with check (true);

drop policy if exists "Anyone can read analyses" on analyses;
create policy "Anyone can read analyses"
  on analyses for select
  to anon
  using (true);
