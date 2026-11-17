import type { DocumentType } from "../types";

export const documentTypeChoices: { id: DocumentType; name: string }[] = [
  { id: "DNI", name: "DNI" },
  { id: "RUC", name: "RUC" },
  { id: "CE", name: "CE" },
  { id: "PASAPORTE", name: "resources.contacts.document_types.PASAPORTE" },
];

// Same rules as the contacts_document_check constraint in the database
const documentPatterns: Record<DocumentType, RegExp> = {
  DNI: /^[0-9]{8}$/,
  RUC: /^(10|15|17|20)[0-9]{9}$/,
  CE: /^[A-Za-z0-9]{8,12}$/,
  PASAPORTE: /^[A-Za-z0-9]{6,12}$/,
};

export const isValidDocument = (
  type: DocumentType | null | undefined,
  number: string | null | undefined,
) => {
  if (!type && !number) return true;
  if (!type || !number) return false;
  return documentPatterns[type]?.test(number) ?? false;
};

/** react-admin validator for the document_number input */
export const validateDocumentNumber = (
  value: string | null | undefined,
  values: { document_type?: DocumentType | null },
) => {
  const type = values?.document_type;
  if (!value && !type) return undefined;
  if (type && !value) return "resources.contacts.validation.document_required";
  if (!type && value)
    return "resources.contacts.validation.document_type_required";
  if (!isValidDocument(type, value)) {
    return {
      message: `resources.contacts.validation.document_invalid_${type}`,
      args: {},
    };
  }
  return undefined;
};

/** Empty strings from the form become null so the DB constraints are satisfied */
export const normalizePeruFields = <
  T extends {
    document_type?: string | null;
    document_number?: string | null;
    ubigeo?: string | null;
    address?: string | null;
    address_reference?: string | null;
  },
>(
  data: T,
): T => {
  const clean = (v: string | null | undefined) =>
    v == null || v.trim() === "" ? null : v.trim();
  const next = { ...data };
  if ("document_type" in next)
    next.document_type = clean(next.document_type) as T["document_type"];
  if ("document_number" in next)
    next.document_number = clean(next.document_number)?.toUpperCase() ?? null;
  if ("ubigeo" in next) next.ubigeo = clean(next.ubigeo);
  if ("address" in next) next.address = clean(next.address);
  if ("address_reference" in next)
    next.address_reference = clean(next.address_reference);
  return next;
};
