-- Allow the owner to read its newly inserted workspace during INSERT ... RETURNING.
-- Other users still require a workspace membership. Keep RLS enabled.
drop policy if exists "Read own workspaces" on public.workspaces;
create policy "Read own workspaces" on public.workspaces
for select to authenticated
using (public.is_member(id) or created_by = (select auth.uid()));
