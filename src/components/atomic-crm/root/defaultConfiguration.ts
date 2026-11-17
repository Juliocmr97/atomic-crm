import type { ConfigurationContextValue } from "./ConfigurationContext";
// Import the logos as module assets so Vite resolves their URL relative to the
// JS chunk (import.meta.url), not the current route. A plain "./logos/..." path
// breaks on nested routes like /oauth/consent and under a deployment sub-path.
import darkModeLogo from "./logos/logo_atomic_crm_dark.svg";
import lightModeLogo from "./logos/logo_atomic_crm_light.svg";

export const defaultDarkModeLogo = darkModeLogo;
export const defaultLightModeLogo = lightModeLogo;

export const defaultCurrency = "PEN";

export const defaultTitle = "InDrop CRM";

export const defaultCompanySectors = [
  { value: "retail", label: "Retail / tienda" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mayorista", label: "Mayorista / distribuidor" },
  { value: "servicios", label: "Servicios" },
  { value: "manufactura", label: "Manufactura" },
  { value: "salud-belleza", label: "Salud y belleza" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "otro", label: "Otro" },
];

// The "opportunity", "won", "lost" and "delayed" values are used by the
// dashboard and the Kanban board: keep them, only the labels change.
export const defaultDealStages = [
  { value: "opportunity", label: "Nuevo lead" },
  { value: "interesado", label: "Interesado" },
  { value: "pedido-confirmado", label: "Pedido confirmado" },
  { value: "enviado", label: "Enviado" },
  { value: "won", label: "Entregado y pagado" },
  { value: "lost", label: "Perdido" },
  { value: "delayed", label: "Reprogramado" },
];

export const defaultDealPipelineStatuses = ["won"];

export const defaultDealCategories = [
  { value: "producto", label: "Producto" },
  { value: "combo", label: "Combo / pack" },
  { value: "mayorista", label: "Venta mayorista" },
  { value: "recompra", label: "Recompra" },
  { value: "other", label: "Otro" },
];

export const defaultNoteStatuses = [
  { value: "cold", label: "Frío", color: "#7dbde8" },
  { value: "warm", label: "Tibio", color: "#e8cb7d" },
  { value: "hot", label: "Caliente", color: "#e88b7d" },
  { value: "in-contract", label: "Cliente", color: "#a4e87d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "Ninguno" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "call", label: "Llamada" },
  { value: "follow-up", label: "Seguimiento" },
  { value: "ship", label: "Envío" },
  { value: "cobro", label: "Cobro" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Reunión" },
  { value: "thank-you", label: "Agradecimiento" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  currency: defaultCurrency,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
