// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  contactUpdateFromPayload,
  normalizePhone,
  parseContactPayload,
  parseDealPayload,
  timingSafeEqual,
} from "./botLogic";

describe("normalizePhone", () => {
  it("normalizes Peruvian numbers to +51", () => {
    expect(normalizePhone("987 654 321")).toBe("+51987654321");
    expect(normalizePhone("+51 987-654-321")).toBe("+51987654321");
    expect(normalizePhone("51987654321")).toBe("+51987654321");
    expect(normalizePhone("whatsapp:+51987654321")).toBe("+51987654321");
  });

  it("rejects things that are not phone numbers", () => {
    expect(normalizePhone("")).toBe(null);
    expect(normalizePhone("1234")).toBe(null);
    expect(normalizePhone(undefined)).toBe(null);
  });
});

describe("parseContactPayload", () => {
  it("accepts a minimal payload", () => {
    const r = parseContactPayload({ phone: "987654321" });
    expect(r).toEqual({
      ok: true,
      value: expect.objectContaining({ phone: "+51987654321" }),
    });
  });

  it("validates DNI, RUC and ubigeo like the database does", () => {
    expect(
      parseContactPayload({
        phone: "987654321",
        document_type: "dni",
        document_number: "12345678",
      }).ok,
    ).toBe(true);
    expect(
      parseContactPayload({
        phone: "987654321",
        document_type: "DNI",
        document_number: "1234",
      }).ok,
    ).toBe(false);
    expect(
      parseContactPayload({
        phone: "987654321",
        document_type: "RUC",
        document_number: "30123456789",
      }).ok,
    ).toBe(false);
    expect(
      parseContactPayload({ phone: "987654321", ubigeo: "15011" }).ok,
    ).toBe(false);
  });

  it("requires a phone", () => {
    const r = parseContactPayload({ first_name: "Ana" });
    expect(r.ok).toBe(false);
  });
});

describe("parseDealPayload", () => {
  it("needs a contact and a name, rounds the amount", () => {
    const r = parseDealPayload({
      phone: "987654321",
      name: "Pedido",
      amount: 89.6,
      payment_method: "contra_entrega",
    });
    expect(r).toEqual({
      ok: true,
      value: expect.objectContaining({
        amount: 90,
        payment_method: "contra_entrega",
      }),
    });
    expect(parseDealPayload({ name: "Pedido" }).ok).toBe(false);
    expect(
      parseDealPayload({
        phone: "987654321",
        name: "x",
        payment_method: "bitcoin",
      }).ok,
    ).toBe(false);
    expect(
      parseDealPayload({ phone: "987654321", name: "x", amount: -1 }).ok,
    ).toBe(false);
  });
});

describe("contactUpdateFromPayload", () => {
  it("does not duplicate a phone already stored with another format", () => {
    const update = contactUpdateFromPayload(
      { phone: "+51987654321", first_name: "Ana" },
      { phone_jsonb: [{ number: "987 654 321", type: "Work" }] },
    );
    expect(update).toEqual({ first_name: "Ana" });
  });

  it("adds a new phone and email", () => {
    const update = contactUpdateFromPayload(
      { phone: "+51911111111", email: "ana@mail.pe" },
      { phone_jsonb: [{ number: "987654321", type: "Work" }], email_jsonb: [] },
    );
    expect(update.phone_jsonb).toHaveLength(2);
    expect(update.email_jsonb).toEqual([
      { email: "ana@mail.pe", type: "Other" },
    ]);
  });
});

describe("timingSafeEqual", () => {
  it("compares strings", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });
});
