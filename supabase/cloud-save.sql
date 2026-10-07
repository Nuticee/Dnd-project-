-- Shared cloud save for The Frozen Passage
-- Used by the ai-dm Edge Function only. Client roles get no direct table access.

create table if not exists public.game_sessions (
  id text primary key,
  campaign_id text not null,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.game_sessions enable row level security;

revoke all on table public.game_sessions from anon, authenticated;

grant select, insert, update, delete on table public.game_sessions to service_role;

create index if not exists game_sessions_campaign_id_idx
  on public.game_sessions (campaign_id);
