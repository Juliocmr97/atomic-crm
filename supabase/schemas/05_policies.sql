--
-- Row Level Security
-- This file declares RLS policies for all tables.
--

-- Enable RLS on all tables
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_notes enable row level security;
alter table public.deals enable row level security;
alter table public.deal_notes enable row level security;
alter table public.sales enable row level security;
alter table public.tags enable row level security;
alter table public.tasks enable row level security;
alter table public.configuration enable row level security;
alter table public.favicons_excluded_domains enable row level security;
alter table public.user_invitations enable row level security;

-- Companies
create policy "Enable read access for authenticated users" on public.companies for select to authenticated using (true);
create policy "Enable insert for authenticated users only" on public.companies for insert to authenticated with check (true);

-- Contacts

-- Contact Notes

-- Deals

-- Deal Notes

-- Sales
create policy "Enable read access for authenticated users" on public.sales for select to authenticated using (true);

-- Tags
create policy "Enable read access for authenticated users" on public.tags for select to authenticated using (true);
create policy "Enable insert for authenticated users only" on public.tags for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.tags for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.tags for delete to authenticated using (true);

-- Tasks

-- Configuration (admin-only for writes)
create policy "Enable read for authenticated" on public.configuration for select to authenticated using (true);

-- Favicons excluded domains
create policy "Enable access for authenticated users only" on public.favicons_excluded_domains to authenticated using (true) with check (true);

-- InDrop: per-advisor access (see 20261117000000_indrop_roles_and_peru_fields)
-- Contacts

create policy "Contacts: read own or all" on public.contacts for select to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Contacts: insert own or all" on public.contacts for insert to authenticated
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Contacts: update own or all" on public.contacts for update to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()))
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Contacts: delete own or all" on public.contacts for delete to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));

-- Deals

create policy "Deals: read own or all" on public.deals for select to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Deals: insert own or all" on public.deals for insert to authenticated
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Deals: update own or all" on public.deals for update to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()))
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Deals: delete own or all" on public.deals for delete to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));

-- Contact notes: visible when the contact is visible (contacts RLS applies in the subquery)

create policy "Contact notes: via contact" on public.contact_notes for all to authenticated
    using (exists (select 1 from public.contacts c where c.id = contact_notes.contact_id))
    with check (exists (select 1 from public.contacts c where c.id = contact_notes.contact_id));

-- Deal notes: visible when the deal is visible

create policy "Deal notes: via deal" on public.deal_notes for all to authenticated
    using (exists (select 1 from public.deals d where d.id = deal_notes.deal_id))
    with check (exists (select 1 from public.deals d where d.id = deal_notes.deal_id));

-- Tasks: visible when the contact is visible

create policy "Tasks: via contact" on public.tasks for all to authenticated
    using (exists (select 1 from public.contacts c where c.id = tasks.contact_id))
    with check (exists (select 1 from public.contacts c where c.id = tasks.contact_id));

-- Companies: everyone can read (shared directory), only owner / admin / supervisor can change

create policy "Companies: update own or all" on public.companies for update to authenticated
    using ((select public.can_see_all()) or sales_id is null or sales_id = (select public.current_sales_id()))
    with check ((select public.can_see_all()) or sales_id is null or sales_id = (select public.current_sales_id()));
create policy "Companies: delete own or all" on public.companies for delete to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));

-- Configuration (pipelines, stages, ...): admins and supervisors

create policy "Configuration: insert admin or supervisor" on public.configuration for insert to authenticated
    with check ((select public.can_see_all()));
create policy "Configuration: update admin or supervisor" on public.configuration for update to authenticated
    using ((select public.can_see_all())) with check ((select public.can_see_all()));

