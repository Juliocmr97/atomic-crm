-- Used by the WhatsApp bot API (supabase/functions/bot) to find a contact by phone.
-- Compares the last 9 digits, so "+51 987 654 321" matches "987654321".
CREATE OR REPLACE FUNCTION "public"."find_contacts_by_phone"("phone_digits" "text") RETURNS SETOF bigint
    LANGUAGE "sql" STABLE
    SET "search_path" TO ''
    AS $$
  select distinct c.id
  from public.contacts c,
       jsonb_array_elements(coalesce(c.phone_jsonb, '[]'::jsonb)) p
  where length(regexp_replace(phone_digits, '\D', '', 'g')) >= 9
    and right(regexp_replace(p ->> 'number', '\D', '', 'g'), 9)
      = right(regexp_replace(phone_digits, '\D', '', 'g'), 9)
  order by c.id;
$$;

revoke all on function "public"."find_contacts_by_phone"(text) from public, anon, authenticated;
grant execute on function "public"."find_contacts_by_phone"(text) to service_role;
