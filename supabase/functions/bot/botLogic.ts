// Pure helpers for the WhatsApp bot API (no Deno / Supabase imports, unit-tested in Node).

export const DOCUMENT_TYPES = ["DNI", "RUC", "CE", "PASAPORTE"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const PAYMENT_METHODS = [
  "contra_entrega",
  "transferencia",
  "yape_plin",
  "tarjeta",
  "efectivo",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// Same rules as the contacts_document_check constraint
const documentPatterns: Record<DocumentType, RegExp> = {
  DNI: /^[0-9]{8}$/,
  RUC: /^(10|15|17|20)[0-9]{9}$/,
  CE: /^[A-Za-z0-9]{8,12}$/,
  PASAPORTE: /^[A-Za-z0-9]{6,12}$/,
};

/**
 * Normalizes a Peruvian phone number to E.164 (+51XXXXXXXXX).
 * Accepts "987 654 321", "+51 987654321", "51987654321", "whatsapp:+51987654321"...
 * Returns null when it doesn't look like a phone number.
 */
export const normalizePhone = (raw: unknown): string | null => {
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 9) return `+51${digits}`;
  if (digits.length === 11 && digits.startsWith("51")) return `+${digits}`;
  // Foreign numbers: keep them as-is if they have a plausible length
  if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return null;
};

export const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const str = (v: unknown, max = 500): string | undefined => {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t.slice(0, max);
};

export type ContactPayload = {
  phone: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  document_type?: DocumentType;
  document_number?: string;
  address?: string;
  address_reference?: string;
  ubigeo?: string;
  asesor_email?: string;
  note?: string;
};

export type ValidationResult<T> =
  { ok: true; value: T } | { ok: false; errors: string[] };

export const parseContactPayload = (
  body: unknown,
): ValidationResult<ContactPayload> => {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const phone = normalizePhone(b.phone);
  if (!phone) errors.push("phone: número de teléfono inválido o faltante");

  const document_type = str(b.document_type)?.toUpperCase();
  const document_number = str(b.document_number, 20)?.toUpperCase();
  if (document_type || document_number) {
    if (!document_type || !DOCUMENT_TYPES.includes(document_type as never)) {
      errors.push("document_type: debe ser DNI, RUC, CE o PASAPORTE");
    } else if (
      !document_number ||
      !documentPatterns[document_type as DocumentType].test(document_number)
    ) {
      errors.push(`document_number: no es un ${document_type} válido`);
    }
  }

  const ubigeo = str(b.ubigeo, 6);
  if (ubigeo && !/^[0-9]{6}$/.test(ubigeo)) {
    errors.push("ubigeo: debe tener 6 dígitos (código INEI del distrito)");
  }

  const email = str(b.email, 254)?.toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email: correo inválido");
  }

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      phone: phone!,
      first_name: str(b.first_name, 120),
      last_name: str(b.last_name, 120),
      email,
      document_type: document_type as DocumentType | undefined,
      document_number,
      address: str(b.address, 300),
      address_reference: str(b.address_reference, 300),
      ubigeo,
      asesor_email: str(b.asesor_email, 254)?.toLowerCase(),
      note: str(b.note, 5000),
    },
  };
};

export type DealPayload = {
  contact_id?: number;
  phone?: string;
  name: string;
  amount: number;
  stage?: string;
  payment_method?: PaymentMethod;
  description?: string;
  categories?: string[];
};

export const parseDealPayload = (
  body: unknown,
): ValidationResult<DealPayload> => {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const contact_id =
    typeof b.contact_id === "number" && Number.isInteger(b.contact_id)
      ? b.contact_id
      : undefined;
  const phone = b.phone != null ? normalizePhone(b.phone) : undefined;
  if (b.phone != null && !phone) errors.push("phone: número inválido");
  if (!contact_id && !phone) errors.push("contact_id o phone es obligatorio");

  const name = str(b.name, 200);
  if (!name) errors.push("name: obligatorio");

  const amountNum = Number(b.amount ?? 0);
  if (!Number.isFinite(amountNum) || amountNum < 0) {
    errors.push("amount: debe ser un número positivo (en soles)");
  }

  const payment_method = str(b.payment_method);
  if (payment_method && !PAYMENT_METHODS.includes(payment_method as never)) {
    errors.push(
      `payment_method: debe ser uno de ${PAYMENT_METHODS.join(", ")}`,
    );
  }

  const categories = Array.isArray(b.categories)
    ? b.categories
        .filter((c): c is string => typeof c === "string")
        .slice(0, 10)
    : undefined;

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      contact_id,
      phone: phone ?? undefined,
      name: name!,
      amount: Math.round(amountNum),
      stage: str(b.stage, 60),
      payment_method: payment_method as PaymentMethod | undefined,
      description: str(b.description, 5000),
      categories,
    },
  };
};

/** Only the fields the bot actually sent overwrite the stored contact */
export const contactUpdateFromPayload = (
  p: ContactPayload,
  existing?: {
    phone_jsonb?: { number: string; type: string }[] | null;
    email_jsonb?: { email: string; type: string }[] | null;
  },
) => {
  const update: Record<string, unknown> = {};
  for (const key of [
    "first_name",
    "last_name",
    "document_type",
    "document_number",
    "address",
    "address_reference",
    "ubigeo",
  ] as const) {
    if (p[key] !== undefined) update[key] = p[key];
  }

  const phones = existing?.phone_jsonb ?? [];
  const hasPhone = phones.some(
    (ph) => normalizePhone(ph.number)?.slice(-9) === p.phone.slice(-9),
  );
  if (!hasPhone)
    update.phone_jsonb = [...phones, { number: p.phone, type: "Other" }];

  if (p.email) {
    const emails = existing?.email_jsonb ?? [];
    if (!emails.some((e) => e.email?.toLowerCase() === p.email)) {
      update.email_jsonb = [...emails, { email: p.email, type: "Other" }];
    }
  }
  return update;
};
