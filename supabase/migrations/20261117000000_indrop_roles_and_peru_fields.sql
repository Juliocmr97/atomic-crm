-- InDrop: roles (admin / supervisor / asesor), per-advisor row level security,
-- and Peru-specific fields (document, ubigeo, payment method).

--
-- 1. Roles on sales
--

alter table "public"."sales" add column "role" text;

update "public"."sales"
set "role" = case when "administrator" then 'admin' else 'asesor' end;

alter table "public"."sales" alter column "role" set not null;

alter table "public"."sales" add constraint "sales_role_check"
    check (("role" = any (array['admin'::text, 'supervisor'::text, 'asesor'::text])));

-- Keeps `role` and the legacy `administrator` flag consistent, whichever one is written.
CREATE OR REPLACE FUNCTION "public"."sync_sales_role"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if tg_op = 'INSERT' then
    if new.role is null then
      new.role := case when new.administrator then 'admin' else 'asesor' end;
    end if;
  elsif new.role is distinct from old.role then
    null; -- role wins
  elsif new.administrator is distinct from old.administrator then
    new.role := case
      when new.administrator then 'admin'
      when old.role = 'admin' then 'asesor'
      else old.role
    end;
  end if;

  new.administrator := (new.role = 'admin');
  return new;
end;
$$;

create or replace trigger "sync_sales_role"
    before insert or update on "public"."sales"
    for each row execute function "public"."sync_sales_role"();

CREATE OR REPLACE FUNCTION "public"."current_sales_id"() RETURNS bigint
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select id from public.sales where user_id = auth.uid() and disabled = false;
$$;

-- Admins and supervisors see every record; advisors only see their own.
CREATE OR REPLACE FUNCTION "public"."can_see_all"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select exists (
    select 1 from public.sales
    where user_id = auth.uid()
      and disabled = false
      and role in ('admin', 'supervisor')
  );
$$;

revoke all on function "public"."current_sales_id"() from public, anon;
grant execute on function "public"."current_sales_id"() to authenticated, service_role;
revoke all on function "public"."can_see_all"() from public, anon;
grant execute on function "public"."can_see_all"() to authenticated, service_role;
revoke all on function "public"."sync_sales_role"() from public, anon, authenticated;

--
-- 2. Row level security per advisor
--

-- Contacts
drop policy if exists "Enable read access for authenticated users" on "public"."contacts";
drop policy if exists "Enable insert for authenticated users only" on "public"."contacts";
drop policy if exists "Enable update for authenticated users only" on "public"."contacts";
drop policy if exists "Contact Delete Policy" on "public"."contacts";

create policy "Contacts: read own or all" on "public"."contacts" for select to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Contacts: insert own or all" on "public"."contacts" for insert to authenticated
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Contacts: update own or all" on "public"."contacts" for update to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()))
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Contacts: delete own or all" on "public"."contacts" for delete to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));

-- Deals
drop policy if exists "Enable read access for authenticated users" on "public"."deals";
drop policy if exists "Enable insert for authenticated users only" on "public"."deals";
drop policy if exists "Enable update for authenticated users only" on "public"."deals";
drop policy if exists "Deals Delete Policy" on "public"."deals";

create policy "Deals: read own or all" on "public"."deals" for select to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Deals: insert own or all" on "public"."deals" for insert to authenticated
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Deals: update own or all" on "public"."deals" for update to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()))
    with check ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));
create policy "Deals: delete own or all" on "public"."deals" for delete to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));

-- Contact notes: visible when the contact is visible (contacts RLS applies in the subquery)
drop policy if exists "Enable read access for authenticated users" on "public"."contact_notes";
drop policy if exists "Enable insert for authenticated users only" on "public"."contact_notes";
drop policy if exists "Contact Notes Update policy" on "public"."contact_notes";
drop policy if exists "Contact Notes Delete Policy" on "public"."contact_notes";

create policy "Contact notes: via contact" on "public"."contact_notes" for all to authenticated
    using (exists (select 1 from public.contacts c where c.id = contact_notes.contact_id))
    with check (exists (select 1 from public.contacts c where c.id = contact_notes.contact_id));

-- Deal notes: visible when the deal is visible
drop policy if exists "Enable read access for authenticated users" on "public"."deal_notes";
drop policy if exists "Enable insert for authenticated users only" on "public"."deal_notes";
drop policy if exists "Deal Notes Update Policy" on "public"."deal_notes";
drop policy if exists "Deal Notes Delete Policy" on "public"."deal_notes";

create policy "Deal notes: via deal" on "public"."deal_notes" for all to authenticated
    using (exists (select 1 from public.deals d where d.id = deal_notes.deal_id))
    with check (exists (select 1 from public.deals d where d.id = deal_notes.deal_id));

-- Tasks: visible when the contact is visible
drop policy if exists "Enable read access for authenticated users" on "public"."tasks";
drop policy if exists "Enable insert for authenticated users only" on "public"."tasks";
drop policy if exists "Task Update Policy" on "public"."tasks";
drop policy if exists "Task Delete Policy" on "public"."tasks";

create policy "Tasks: via contact" on "public"."tasks" for all to authenticated
    using (exists (select 1 from public.contacts c where c.id = tasks.contact_id))
    with check (exists (select 1 from public.contacts c where c.id = tasks.contact_id));

-- Companies: everyone can read (shared directory), only owner / admin / supervisor can change
drop policy if exists "Enable update for authenticated users only" on "public"."companies";
drop policy if exists "Company Delete Policy" on "public"."companies";

create policy "Companies: update own or all" on "public"."companies" for update to authenticated
    using ((select public.can_see_all()) or sales_id is null or sales_id = (select public.current_sales_id()))
    with check ((select public.can_see_all()) or sales_id is null or sales_id = (select public.current_sales_id()));
create policy "Companies: delete own or all" on "public"."companies" for delete to authenticated
    using ((select public.can_see_all()) or sales_id = (select public.current_sales_id()));

-- Configuration (pipelines, stages, ...): admins and supervisors
drop policy if exists "Enable insert for admins" on "public"."configuration";
drop policy if exists "Enable update for admins" on "public"."configuration";

create policy "Configuration: insert admin or supervisor" on "public"."configuration" for insert to authenticated
    with check ((select public.can_see_all()));
create policy "Configuration: update admin or supervisor" on "public"."configuration" for update to authenticated
    using ((select public.can_see_all())) with check ((select public.can_see_all()));

create index if not exists "contacts_sales_id_idx" on "public"."contacts" using btree ("sales_id");
create index if not exists "deals_sales_id_idx" on "public"."deals" using btree ("sales_id");

--
-- 3. Peru fields
--

alter table "public"."contacts" add column "document_type" text;
alter table "public"."contacts" add column "document_number" text;
alter table "public"."contacts" add column "address" text;
alter table "public"."contacts" add column "address_reference" text;
alter table "public"."contacts" add column "ubigeo" text;

alter table "public"."contacts" add constraint "contacts_document_type_check"
    check (("document_type" = any (array['DNI'::text, 'RUC'::text, 'CE'::text, 'PASAPORTE'::text])));

alter table "public"."contacts" add constraint "contacts_document_check" check (
    (("document_type" is null) = ("document_number" is null))
    and (
        "document_number" is null
        or ("document_type" = 'DNI' and "document_number" ~ '^[0-9]{8}$')
        or ("document_type" = 'RUC' and "document_number" ~ '^(10|15|17|20)[0-9]{9}$')
        or ("document_type" = 'CE' and "document_number" ~ '^[A-Za-z0-9]{8,12}$')
        or ("document_type" = 'PASAPORTE' and "document_number" ~ '^[A-Za-z0-9]{6,12}$')
    )
);

alter table "public"."contacts" add constraint "contacts_ubigeo_check"
    check (("ubigeo" ~ '^[0-9]{6}$'));

create unique index "contacts_document_unique"
    on "public"."contacts" using btree ("document_type", "document_number")
    where ("document_number" is not null);

alter table "public"."deals" add column "payment_method" text;

alter table "public"."deals" add constraint "deals_payment_method_check"
    check (("payment_method" = any (array['contra_entrega'::text, 'transferencia'::text, 'yape_plin'::text, 'tarjeta'::text, 'efectivo'::text])));

-- contacts_summary lists its columns explicitly: append the new ones
create or replace view "public"."contacts_summary" with (security_invoker = on) as
select
    co.id,
    co.first_name,
    co.last_name,
    co.gender,
    co.title,
    co.background,
    co.avatar,
    co.first_seen,
    co.last_seen,
    co.has_newsletter,
    co.status,
    co.tags,
    co.company_id,
    co.sales_id,
    co.linkedin_url,
    co.email_jsonb,
    co.phone_jsonb,
    (jsonb_path_query_array(co.email_jsonb, '$[*]."email"'))::text as email_fts,
    (jsonb_path_query_array(co.phone_jsonb, '$[*]."number"'))::text as phone_fts,
    c.name as company_name,
    count(distinct t.id) filter (where t.done_date is null) as nb_tasks,
    co.document_type,
    co.document_number,
    co.address,
    co.address_reference,
    co.ubigeo
from public.contacts co
    left join public.tasks t on co.id = t.contact_id
    left join public.companies c on co.company_id = c.id
group by co.id, c.name;
