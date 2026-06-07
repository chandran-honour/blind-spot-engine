-- ============================================================
-- Migration: legacy claim/lens schema → ProductAnalysis columns
-- Run once if your project already has the old `analyses` table.
-- Fresh projects can use schema.sql only.
-- ============================================================

-- Drop legacy lens constraint if present
alter table analyses drop constraint if exists analyses_lens_check;

-- Add new columns (no-op if already present)
alter table analyses add column if not exists product_idea text;
alter table analyses add column if not exists audience_mode text not null default 'startup';
alter table analyses add column if not exists excluded_personas jsonb not null default '[]'::jsonb;
alter table analyses add column if not exists stakeholder_challenges jsonb not null default '[]'::jsonb;

-- Backfill product_idea from legacy claim column when migrating
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'analyses' and column_name = 'claim'
  ) then
    update analyses
    set product_idea = coalesce(product_idea, claim)
    where product_idea is null;
  end if;
end $$;

-- Require product_idea for new rows (set NOT NULL after backfill)
update analyses set product_idea = '' where product_idea is null;
alter table analyses alter column product_idea set not null;

-- Optional: drop legacy columns after verifying data
-- alter table analyses drop column if exists claim;
-- alter table analyses drop column if exists lens;
-- alter table analyses drop column if exists blind_spots;

alter table analyses drop constraint if exists analyses_audience_mode_check;
alter table analyses add constraint analyses_audience_mode_check
  check (audience_mode in ('startup', 'enterprise'));
