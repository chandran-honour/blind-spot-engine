-- ============================================================
-- Blind Spot Engine — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Stores each completed analysis run.
-- No auth required — session_id is a client-generated UUID
-- stored in the browser, used to group analyses per device session.

create table if not exists analyses (
  id            uuid        default gen_random_uuid() primary key,
  created_at    timestamptz default now() not null,

  -- Client-generated UUID (stored in localStorage) that groups
  -- multiple analyses from the same browser session
  session_id    uuid        not null,

  -- User inputs
  claim         text        not null,
  lens          text        not null,
  context       text,                        -- optional additional context

  -- Claude outputs
  summary       text        not null,
  blind_spots   jsonb       not null         -- array of BlindSpot objects

  -- Constraint: lens must be one of the defined personas
  constraint analyses_lens_check
    check (lens in ('business', 'product', 'technical', 'delivery', 'personal'))
);

-- Indexes for common query patterns
create index if not exists analyses_session_id_idx
  on analyses (session_id);

create index if not exists analyses_created_at_idx
  on analyses (created_at desc);

-- ============================================================
-- Row Level Security
-- Permissive anon access — suitable for a public demo app
-- without user authentication.
-- ============================================================

alter table analyses enable row level security;

-- Allow anyone to insert a new analysis
create policy "Anyone can insert analyses"
  on analyses for insert
  to anon
  with check (true);

-- Allow anyone to read analyses (needed for session history)
create policy "Anyone can read analyses"
  on analyses for select
  to anon
  using (true);

-- ============================================================
-- Optional: clear all data (useful during development)
-- truncate analyses;
-- ============================================================
