import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { createErrorResponse } from "../_shared/utils.ts";
import {
  contactUpdateFromPayload,
  parseContactPayload,
  parseDealPayload,
  normalizePhone,
  timingSafeEqual,
} from "./botLogic.ts";

/**
 * API for the WhatsApp sales bot (server-to-server, not called from the browser).
 *
 * Auth: header `x-bot-key: <BOT_API_KEY>` (set with `npx supabase secrets set BOT_API_KEY=...`).
 *
 *   GET  /bot/contacts?phone=987654321   -> contact, advisor and open deals
 *   POST /bot/contacts                    -> create or update a contact by phone
 *   POST /bot/deals                       -> create a deal (order) for a contact
 *
 * Contacts are matched by phone (last 9 digits), then by document.
 * New contacts are assigned to `asesor_email`, else to BOT_DEFAULT_ASESOR_EMAIL,
 * else to the first admin.
 */

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const isAuthorized = (req: Request) => {
  const expected = Deno.env.get("BOT_API_KEY") ?? "";
  const received = req.headers.get("x-bot-key") ?? "";
  // Refuse everything when the key isn't configured or is too short
  if (expected.length < 24) return false;
  return timingSafeEqual(received, expected);
};

async function findContactIdByPhone(phone: string): Promise<number | null> {
  const { data, error } = await supabaseAdmin.rpc("find_contacts_by_phone", {
    phone_digits: phone,
  });
  if (error) throw error;
  const ids = (data ?? []) as number[];
  return ids.length ? ids[0] : null;
}

async function findSalesIdByEmail(email?: string): Promise<number | null> {
  if (!email) return null;
  const { data } = await supabaseAdmin
    .from("sales")
    .select("id")
    .eq("email", email)
    .eq("disabled", false)
    .maybeSingle();
  return data?.id ?? null;
}

async function defaultSalesId(): Promise<number | null> {
  const fromEnv = await findSalesIdByEmail(
    Deno.env.get("BOT_DEFAULT_ASESOR_EMAIL")?.toLowerCase(),
  );
  if (fromEnv) return fromEnv;
  const { data } = await supabaseAdmin
    .from("sales")
    .select("id")
    .eq("role", "admin")
    .eq("disabled", false)
    .order("id")
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}

async function getContact(req: Request) {
  const phone = normalizePhone(new URL(req.url).searchParams.get("phone"));
  if (!phone) return createErrorResponse(400, "phone inválido o faltante");

  const id = await findContactIdByPhone(phone);
  if (!id) return json({ found: false });

  const { data: contact } = await supabaseAdmin
    .from("contacts")
    .select(
      "id, first_name, last_name, phone_jsonb, email_jsonb, document_type, document_number, address, address_reference, ubigeo, status, sales_id",
    )
    .eq("id", id)
    .single();
  const { data: asesor } = contact?.sales_id
    ? await supabaseAdmin
        .from("sales")
        .select("id, first_name, last_name, email")
        .eq("id", contact.sales_id)
        .single()
    : { data: null };
  const { data: deals } = await supabaseAdmin
    .from("deals")
    .select("id, name, stage, amount, payment_method, created_at")
    .contains("contact_ids", [id])
    .is("archived_at", null)
    .not("stage", "in", "(won,lost)")
    .order("created_at", { ascending: false })
    .limit(10);

  return json({ found: true, contact, asesor, open_deals: deals ?? [] });
}

async function upsertContact(req: Request) {
  const parsed = parseContactPayload(await req.json().catch(() => null));
  if (!parsed.ok) return createErrorResponse(422, "Datos inválidos", parsed);
  const p = parsed.value;

  let id = await findContactIdByPhone(p.phone);
  if (!id && p.document_type && p.document_number) {
    const { data } = await supabaseAdmin
      .from("contacts")
      .select("id")
      .eq("document_type", p.document_type)
      .eq("document_number", p.document_number)
      .maybeSingle();
    id = data?.id ?? null;
  }

  const explicitAsesor = await findSalesIdByEmail(p.asesor_email);
  if (p.asesor_email && !explicitAsesor) {
    return createErrorResponse(
      422,
      `No existe un asesor activo con el correo ${p.asesor_email}`,
    );
  }

  let created = false;
  if (id) {
    const { data: existing } = await supabaseAdmin
      .from("contacts")
      .select("phone_jsonb, email_jsonb")
      .eq("id", id)
      .single();
    const update = {
      ...contactUpdateFromPayload(p, existing ?? undefined),
      last_seen: new Date().toISOString(),
      ...(explicitAsesor ? { sales_id: explicitAsesor } : {}),
    };
    const { error } = await supabaseAdmin
      .from("contacts")
      .update(update)
      .eq("id", id);
    if (error)
      return createErrorResponse(400, error.message, { code: error.code });
  } else {
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert({
        ...contactUpdateFromPayload(p),
        first_name: p.first_name ?? "Cliente",
        last_name: p.last_name ?? "WhatsApp",
        first_seen: now,
        last_seen: now,
        tags: [],
        sales_id: explicitAsesor ?? (await defaultSalesId()),
      })
      .select("id")
      .single();
    if (error)
      return createErrorResponse(400, error.message, { code: error.code });
    id = data.id;
    created = true;
  }

  if (p.note) {
    const { data: c } = await supabaseAdmin
      .from("contacts")
      .select("sales_id")
      .eq("id", id)
      .single();
    await supabaseAdmin.from("contact_notes").insert({
      contact_id: id,
      text: p.note,
      sales_id: c?.sales_id ?? null,
      date: new Date().toISOString(),
    });
  }

  return json({ contact_id: id, created }, created ? 201 : 200);
}

async function createDeal(req: Request) {
  const parsed = parseDealPayload(await req.json().catch(() => null));
  if (!parsed.ok) return createErrorResponse(422, "Datos inválidos", parsed);
  const p = parsed.value;

  const contactId =
    p.contact_id ?? (p.phone ? await findContactIdByPhone(p.phone) : null);
  if (!contactId)
    return createErrorResponse(
      404,
      "Cliente no encontrado; créalo primero con POST /bot/contacts",
    );

  const { data: contact } = await supabaseAdmin
    .from("contacts")
    .select("id, company_id, sales_id")
    .eq("id", contactId)
    .maybeSingle();
  if (!contact) return createErrorResponse(404, "Cliente no encontrado");

  let stage = p.stage;
  if (!stage) {
    const { data: conf } = await supabaseAdmin
      .from("configuration")
      .select("config")
      .eq("id", 1)
      .maybeSingle();
    stage = conf?.config?.dealStages?.[0]?.value ?? "opportunity";
  }

  const { data, error } = await supabaseAdmin
    .from("deals")
    .insert({
      name: p.name,
      amount: p.amount,
      stage,
      payment_method: p.payment_method ?? null,
      description: p.description ?? null,
      categories: p.categories ?? [],
      contact_ids: [contact.id],
      company_id: contact.company_id,
      sales_id: contact.sales_id,
      index: 0,
    })
    .select("id, stage")
    .single();
  if (error)
    return createErrorResponse(400, error.message, { code: error.code });

  return json({ deal_id: data.id, stage: data.stage }, 201);
}

Deno.serve(async (req: Request) => {
  if (!isAuthorized(req)) return createErrorResponse(401, "No autorizado");

  const path = new URL(req.url).pathname.replace(/^.*\/bot/, "");
  try {
    if (path === "/contacts" && req.method === "GET")
      return await getContact(req);
    if (path === "/contacts" && req.method === "POST")
      return await upsertContact(req);
    if (path === "/deals" && req.method === "POST")
      return await createDeal(req);
    return createErrorResponse(404, "Ruta no encontrada");
  } catch (e) {
    console.error("bot api error", e);
    return createErrorResponse(500, "Error interno");
  }
});
