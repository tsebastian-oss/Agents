-- Agents: initial multi-tenant SaaS schema
-- Apply this migration to a dedicated Supabase project.

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to authenticated;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique,
  industry text,
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member'
    check (role in ('owner', 'admin', 'editor', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  description text not null default '',
  objective text not null,
  instructions text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'testing', 'active', 'paused', 'archived')),
  autonomy_level text not null default 'assistant'
    check (autonomy_level in ('advisor', 'assistant', 'supervised', 'autonomous')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_versions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  config jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (agent_id, version_number)
);

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  status text not null default 'queued'
    check (status in ('queued', 'running', 'waiting_approval', 'completed', 'failed', 'cancelled')),
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  error_message text,
  initiated_by uuid references auth.users(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  run_id uuid references public.agent_runs(id) on delete set null,
  event_type text not null,
  quantity numeric(14, 4) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_members_user_idx
  on public.organization_members(user_id);
create index if not exists agents_org_idx
  on public.agents(organization_id);
create index if not exists agents_org_status_idx
  on public.agents(organization_id, status);
create index if not exists agent_versions_agent_idx
  on public.agent_versions(agent_id);
create index if not exists agent_runs_org_created_idx
  on public.agent_runs(organization_id, created_at desc);
create index if not exists agent_runs_agent_idx
  on public.agent_runs(agent_id);
create index if not exists usage_events_org_created_idx
  on public.usage_events(organization_id, created_at desc);

create or replace function private.is_org_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.organization_members membership
      where membership.organization_id = p_organization_id
        and membership.user_id = (select auth.uid())
    );
$$;

create or replace function private.has_org_role(
  p_organization_id uuid,
  p_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.organization_members membership
      where membership.organization_id = p_organization_id
        and membership.user_id = (select auth.uid())
        and membership.role = any(p_roles)
    );
$$;

revoke all on function private.is_org_member(uuid) from public;
revoke all on function private.has_org_role(uuid, text[]) from public;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_org_role(uuid, text[]) to authenticated;

create or replace function private.handle_new_organization()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
     or new.owner_user_id <> (select auth.uid()) then
    raise exception 'The authenticated user must own the new organization';
  end if;

  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.owner_user_id, 'owner');

  return new;
end;
$$;

revoke all on function private.handle_new_organization() from public;

drop trigger if exists on_organization_created on public.organizations;
create trigger on_organization_created
after insert on public.organizations
for each row execute function private.handle_new_organization();

create or replace function private.handle_new_agent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.agent_versions (
    agent_id,
    version_number,
    config,
    created_by
  )
  values (
    new.id,
    1,
    jsonb_build_object(
      'name', new.name,
      'description', new.description,
      'objective', new.objective,
      'instructions', new.instructions,
      'autonomy_level', new.autonomy_level
    ),
    new.created_by
  );

  return new;
end;
$$;

revoke all on function private.handle_new_agent() from public;

drop trigger if exists on_agent_created on public.agents;
create trigger on_agent_created
after insert on public.agents
for each row execute function private.handle_new_agent();

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

drop trigger if exists agents_set_updated_at on public.agents;
create trigger agents_set_updated_at
before update on public.agents
for each row execute function private.set_updated_at();

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.agents enable row level security;
alter table public.agent_versions enable row level security;
alter table public.agent_runs enable row level security;
alter table public.usage_events enable row level security;

create policy "members can view organizations"
on public.organizations
for select
to authenticated
using (
  owner_user_id = (select auth.uid())
  or private.is_org_member(id)
);

create policy "authenticated users can create owned organizations"
on public.organizations
for insert
to authenticated
with check (owner_user_id = (select auth.uid()));

create policy "owners and admins can update organizations"
on public.organizations
for update
to authenticated
using (
  owner_user_id = (select auth.uid())
  or private.has_org_role(id, array['owner', 'admin'])
)
with check (
  owner_user_id = (select auth.uid())
  or private.has_org_role(id, array['owner', 'admin'])
);

create policy "owners can delete organizations"
on public.organizations
for delete
to authenticated
using (owner_user_id = (select auth.uid()));

create policy "members can view organization membership"
on public.organization_members
for select
to authenticated
using (private.is_org_member(organization_id));

create policy "owners and admins can add members"
on public.organization_members
for insert
to authenticated
with check (
  private.has_org_role(organization_id, array['owner', 'admin'])
);

create policy "owners and admins can update members"
on public.organization_members
for update
to authenticated
using (
  private.has_org_role(organization_id, array['owner', 'admin'])
)
with check (
  private.has_org_role(organization_id, array['owner', 'admin'])
);

create policy "owners and admins can remove members"
on public.organization_members
for delete
to authenticated
using (
  private.has_org_role(organization_id, array['owner', 'admin'])
);

create policy "members can view agents"
on public.agents
for select
to authenticated
using (private.is_org_member(organization_id));

create policy "editors can create agents"
on public.agents
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and private.has_org_role(
    organization_id,
    array['owner', 'admin', 'editor']
  )
);

create policy "editors can update agents"
on public.agents
for update
to authenticated
using (
  private.has_org_role(
    organization_id,
    array['owner', 'admin', 'editor']
  )
)
with check (
  private.has_org_role(
    organization_id,
    array['owner', 'admin', 'editor']
  )
);

create policy "admins can delete agents"
on public.agents
for delete
to authenticated
using (
  private.has_org_role(organization_id, array['owner', 'admin'])
);

create policy "members can view agent versions"
on public.agent_versions
for select
to authenticated
using (
  exists (
    select 1
    from public.agents agent
    where agent.id = agent_versions.agent_id
      and private.is_org_member(agent.organization_id)
  )
);

create policy "editors can create agent versions"
on public.agent_versions
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.agents agent
    where agent.id = agent_versions.agent_id
      and private.has_org_role(
        agent.organization_id,
        array['owner', 'admin', 'editor']
      )
  )
);

create policy "members can view agent runs"
on public.agent_runs
for select
to authenticated
using (private.is_org_member(organization_id));

create policy "editors can create agent runs"
on public.agent_runs
for insert
to authenticated
with check (
  initiated_by = (select auth.uid())
  and private.has_org_role(
    organization_id,
    array['owner', 'admin', 'editor']
  )
);

create policy "editors can update agent runs"
on public.agent_runs
for update
to authenticated
using (
  private.has_org_role(
    organization_id,
    array['owner', 'admin', 'editor']
  )
)
with check (
  private.has_org_role(
    organization_id,
    array['owner', 'admin', 'editor']
  )
);

create policy "admins can view usage"
on public.usage_events
for select
to authenticated
using (
  private.has_org_role(organization_id, array['owner', 'admin'])
);

-- New Supabase projects may not expose SQL-created tables to the Data API
-- automatically. Grant access explicitly, then let RLS restrict the rows.
grant usage on schema public to authenticated;
grant select, insert, update, delete
  on public.organizations,
     public.organization_members,
     public.agents,
     public.agent_versions,
     public.agent_runs,
     public.usage_events
  to authenticated;

revoke all
  on public.organizations,
     public.organization_members,
     public.agents,
     public.agent_versions,
     public.agent_runs,
     public.usage_events
  from anon;
