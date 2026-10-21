-- Trigger functions should not be callable from the public data API.
revoke execute on function public.add_workspace_owner() from public, anon, authenticated;
revoke execute on function public.sync_profile() from public, anon, authenticated;
-- RLS helper functions are needed by signed-in users but not by anon users.
revoke execute on function public.is_member(uuid) from public, anon;
revoke execute on function public.is_admin(uuid) from public, anon;
revoke execute on function public.can_edit(uuid) from public, anon;
revoke execute on function public.shares_workspace(uuid) from public, anon;
grant execute on function public.is_member(uuid), public.is_admin(uuid), public.can_edit(uuid), public.shares_workspace(uuid) to authenticated;
