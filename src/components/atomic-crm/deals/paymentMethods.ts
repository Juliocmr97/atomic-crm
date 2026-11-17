import type { PaymentMethod } from "../types";

export const paymentMethodChoices: { id: PaymentMethod; name: string }[] = [
  {
    id: "contra_entrega",
    name: "resources.deals.payment_methods.contra_entrega",
  },
  {
    id: "transferencia",
    name: "resources.deals.payment_methods.transferencia",
  },
  { id: "yape_plin", name: "resources.deals.payment_methods.yape_plin" },
  { id: "tarjeta", name: "resources.deals.payment_methods.tarjeta" },
  { id: "efectivo", name: "resources.deals.payment_methods.efectivo" },
];
