-- NEXO / Startup OS. Execute integralmente no SQL Editor do Supabase.
-- Todas as operações da aplicação usam a publishable key + JWT do usuário.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 120),
  email text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  description text not null default '' check (char_length(description) <= 500),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','manager','member','viewer')),
  job_title text not null default '' check (char_length(job_title) <= 100),
  joined_at timestamptz not null default now(),
  primary key (workspace_id,user_id)
);
create index if not exists members_user_idx on public.members(user_id);

create or replace function public.is_member(wid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.members where workspace_id=wid and user_id=(select auth.uid()));
$$;
create or replace function public.is_admin(wid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.members where workspace_id=wid and user_id=(select auth.uid()) and role in ('owner','admin'));
$$;
create or replace function public.can_edit(wid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.members where workspace_id=wid and user_id=(select auth.uid()) and role in ('owner','admin','manager','member'));
$$;
create or replace function public.shares_workspace(target_user uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.members mine join public.members theirs on theirs.workspace_id=mine.workspace_id
    where mine.user_id=(select auth.uid()) and theirs.user_id=target_user);
$$;

create or replace function public.sync_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,full_name,email)
  values(new.id, left(coalesce(new.raw_user_meta_data->>'full_name',''),120), coalesce(new.email,''))
  on conflict(id) do update set email=excluded.email;
  return new;
end;
$$;
drop trigger if exists auth_user_profile_insert on auth.users;
create trigger auth_user_profile_insert after insert or update of email on auth.users
for each row execute function public.sync_profile();
-- Atualiza usuários pré-existentes, se houver.
insert into public.profiles(id,full_name,email)
select id, left(coalesce(raw_user_meta_data->>'full_name',''),120), coalesce(email,'') from auth.users
on conflict (id) do nothing;

create or replace function public.prevent_profile_identity_change() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.id = old.id;
  new.email = old.email;
  return new;
end;
$$;
drop trigger if exists profiles_protect_identity on public.profiles;
create trigger profiles_protect_identity before update on public.profiles
for each row execute function public.prevent_profile_identity_change();

create or replace function public.add_workspace_owner() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.members(workspace_id,user_id,role) values(new.id,new.created_by,'owner');
  return new;
end;
$$;
drop trigger if exists workspaces_auto_owner on public.workspaces;
create trigger workspaces_auto_owner after insert on public.workspaces
for each row execute function public.add_workspace_owner();

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 160),
  description text not null default '' check (char_length(description) <= 3000),
  scheduled_at timestamptz not null,
  location text not null default '' check (char_length(location) <= 300),
  status text not null default 'planned' check(status in ('planned','completed','cancelled')),
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(id,workspace_id)
);
create index if not exists meetings_workspace_date_idx on public.meetings(workspace_id,scheduled_at);
create table if not exists public.agenda_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  meeting_id uuid not null,
  title text not null check (char_length(trim(title)) between 2 and 240),
  details text not null default '' check (char_length(details) <= 2000),
  decision text not null default '' check (char_length(decision) <= 3000),
  done boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (meeting_id,workspace_id) references public.meetings(id,workspace_id) on delete cascade
);
create index if not exists agenda_meeting_idx on public.agenda_items(meeting_id);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 200),
  description text not null default '' check (char_length(description) <= 2000),
  status text not null default 'todo' check (status in ('todo','doing','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  due_date date,
  assignee_id uuid,
  created_by uuid not null default auth.uid() references public.profiles(id),
  created_at timestamptz not null default now(),
  foreign key (workspace_id,assignee_id) references public.members(workspace_id,user_id)
);
create index if not exists tasks_workspace_due_idx on public.tasks(workspace_id,due_date);
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 200),
  description text not null default '' check (char_length(description) <= 2000),
  due_date date,
  progress integer not null default 0 check(progress between 0 and 100),
  created_at timestamptz not null default now()
);
create index if not exists milestones_workspace_date_idx on public.milestones(workspace_id,due_date);
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role text not null check(role in ('admin','manager','member','viewer')),
  token uuid not null unique default gen_random_uuid(),
  invited_by uuid not null references public.profiles(id),
  expires_at timestamptz not null default (now()+ interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists invitations_workspace_idx on public.invitations(workspace_id);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.members enable row level security;
alter table public.meetings enable row level security;
alter table public.agenda_items enable row level security;
alter table public.tasks enable row level security;
alter table public.milestones enable row level security;
alter table public.invitations enable row level security;

create policy "Read shared profiles" on public.profiles for select to authenticated using (id=(select auth.uid()) or public.shares_workspace(id));
create policy "Edit own profile" on public.profiles for update to authenticated using (id=(select auth.uid())) with check(id=(select auth.uid()));
create policy "Read own workspaces" on public.workspaces for select to authenticated using(public.is_member(id));
create policy "Create workspace" on public.workspaces for insert to authenticated with check (created_by=(select auth.uid()));
create policy "Edit workspace admins" on public.workspaces for update to authenticated using(public.is_admin(id)) with check(public.is_admin(id));
create policy "Remove workspace owner" on public.workspaces for delete to authenticated using(created_by=(select auth.uid()) and public.is_admin(id));
create policy "Read workspace members" on public.members for select to authenticated using(public.is_member(workspace_id));
create policy "Admins change member roles" on public.members for update to authenticated using(public.is_admin(workspace_id) and role <> 'owner') with check(public.is_admin(workspace_id) and role <> 'owner');
create policy "Admins remove members or leave" on public.members for delete to authenticated using(role <> 'owner' and (public.is_admin(workspace_id) or user_id=(select auth.uid())));

create policy "Read meetings" on public.meetings for select to authenticated using(public.is_member(workspace_id));
create policy "Create meetings" on public.meetings for insert to authenticated with check(public.can_edit(workspace_id) and created_by=(select auth.uid()));
create policy "Edit meetings" on public.meetings for update to authenticated using(public.can_edit(workspace_id)) with check(public.can_edit(workspace_id));
create policy "Delete meetings" on public.meetings for delete to authenticated using(public.can_edit(workspace_id));
create policy "Read agenda" on public.agenda_items for select to authenticated using(public.is_member(workspace_id));
create policy "Create agenda" on public.agenda_items for insert to authenticated with check(public.can_edit(workspace_id));
create policy "Edit agenda" on public.agenda_items for update to authenticated using(public.can_edit(workspace_id)) with check(public.can_edit(workspace_id));
create policy "Delete agenda" on public.agenda_items for delete to authenticated using(public.can_edit(workspace_id));
create policy "Read tasks" on public.tasks for select to authenticated using(public.is_member(workspace_id));
create policy "Create tasks" on public.tasks for insert to authenticated with check(public.can_edit(workspace_id) and created_by=(select auth.uid()));
create policy "Edit tasks" on public.tasks for update to authenticated using(public.can_edit(workspace_id)) with check(public.can_edit(workspace_id));
create policy "Delete tasks" on public.tasks for delete to authenticated using(public.can_edit(workspace_id));
create policy "Read milestones" on public.milestones for select to authenticated using(public.is_member(workspace_id));
create policy "Create milestones" on public.milestones for insert to authenticated with check(public.can_edit(workspace_id));
create policy "Edit milestones" on public.milestones for update to authenticated using(public.can_edit(workspace_id)) with check(public.can_edit(workspace_id));
create policy "Delete milestones" on public.milestones for delete to authenticated using(public.can_edit(workspace_id));
create policy "Admins read invitations" on public.invitations for select to authenticated using(public.is_admin(workspace_id));
create policy "Admins revoke invitations" on public.invitations for delete to authenticated using(public.is_admin(workspace_id));

-- Nunca exponha INSERT direto em members/invitations: apenas funções controladas.
create or replace function public.create_invite(wid uuid, invite_email text, invite_role text default 'member') returns uuid
language plpgsql security definer set search_path = '' as $$
declare code uuid;
begin
  if not public.is_admin(wid) then raise exception 'Sem permissão para convidar'; end if;
  if invite_email is null or length(invite_email)>254 or trim(invite_email) !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'E-mail inválido';
  end if;
  if invite_role not in ('admin','manager','member','viewer') then raise exception 'Cargo inválido'; end if;
  insert into public.invitations(workspace_id,email,role,invited_by)
  values(wid,lower(trim(invite_email)),invite_role,auth.uid()) returning token into code;
  return code;
end;
$$;
create or replace function public.accept_invite(invite_token uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare inv record; current_email text; confirmed_at timestamptz;
begin
  if auth.uid() is null then raise exception 'Faça login para aceitar'; end if;
  select email, email_confirmed_at into current_email, confirmed_at from auth.users where id=auth.uid();
  if confirmed_at is null then raise exception 'Confirme seu e-mail antes de entrar'; end if;
  select * into inv from public.invitations where token=invite_token and accepted_at is null and expires_at>now() for update;
  if not found or lower(current_email)<>inv.email then raise exception 'Convite inválido, expirado ou para outro e-mail'; end if;
  insert into public.members(workspace_id,user_id,role) values(inv.workspace_id,auth.uid(),inv.role)
  on conflict(workspace_id,user_id) do nothing;
  update public.invitations set accepted_at=now() where id=inv.id;
  return inv.workspace_id;
end;
$$;
revoke all on function public.create_invite(uuid,text,text) from public,anon;
revoke all on function public.accept_invite(uuid) from public,anon;
grant execute on function public.create_invite(uuid,text,text) to authenticated;
grant execute on function public.accept_invite(uuid) to authenticated;

-- Proteção extra contra alterações de chaves estruturais via UPDATE.
create or replace function public.lock_core_columns() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id then raise exception 'Identificador imutável'; end if;
  if tg_table_name <> 'workspaces' and new.workspace_id is distinct from old.workspace_id then
    raise exception 'Startup imutável';
  end if;
  return new;
end;
$$;
-- Acima se aplica apenas às entidades com id + workspace_id (não a workspaces).
create trigger meetings_lock_core before update on public.meetings for each row execute function public.lock_core_columns();
create trigger agenda_lock_core before update on public.agenda_items for each row execute function public.lock_core_columns();
create trigger tasks_lock_core before update on public.tasks for each row execute function public.lock_core_columns();
create trigger milestones_lock_core before update on public.milestones for each row execute function public.lock_core_columns();
create trigger invitations_lock_core before update on public.invitations for each row execute function public.lock_core_columns();
create or replace function public.lock_owner_fields() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id or new.created_by is distinct from old.created_by then
    raise exception 'Proprietário e ID são imutáveis';
  end if;
  return new;
end;
$$;
create trigger workspaces_lock_owner before update on public.workspaces for each row execute function public.lock_owner_fields();
create or replace function public.lock_member_identity() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.user_id is distinct from old.user_id or new.workspace_id is distinct from old.workspace_id then
    raise exception 'Membro é imutável';
  end if;
  return new;
end;
$$;
create trigger members_lock_identity before update on public.members for each row execute function public.lock_member_identity();
create or replace function public.lock_creator() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.created_by is distinct from old.created_by then raise exception 'Criador imutável'; end if;
  return new;
end;
$$;
create trigger meetings_lock_creator before update on public.meetings for each row execute function public.lock_creator();
create trigger tasks_lock_creator before update on public.tasks for each row execute function public.lock_creator();
