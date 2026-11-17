import { useEffect, useMemo, useState } from "react";
import { useInput, useTranslate } from "ra-core";
import { Label } from "@/components/ui/label";

import { childrenOf, useUbigeo } from "./useUbigeo";

const selectClassName =
  "border-input bg-transparent dark:bg-input/30 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50";

/**
 * Cascading departamento / provincia / distrito selector.
 * Stores the 6-digit INEI district code in `source` (default: "ubigeo").
 */
export const UbigeoInput = ({ source = "ubigeo" }: { source?: string }) => {
  const translate = useTranslate();
  const data = useUbigeo();
  const { field } = useInput({ source });
  const value: string = field.value ?? "";

  const [dep, setDep] = useState(value.slice(0, 2));
  const [prov, setProv] = useState(value.slice(0, 4));

  // Keep local selection in sync when the record loads or changes
  useEffect(() => {
    if (value.length === 6) {
      setDep(value.slice(0, 2));
      setProv(value.slice(0, 4));
    }
  }, [value]);

  const departamentos = useMemo(
    () => (data ? childrenOf(data.departamentos, "") : []),
    [data],
  );
  const provincias = useMemo(
    () => (data && dep ? childrenOf(data.provincias, dep) : []),
    [data, dep],
  );
  const distritos = useMemo(
    () => (data && prov ? childrenOf(data.distritos, prov) : []),
    [data, prov],
  );

  const placeholder = translate("resources.contacts.ubigeo.select");

  return (
    <div className="flex flex-col gap-2">
      <Label>{translate("resources.contacts.fields.ubigeo")}</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          aria-label={translate("resources.contacts.ubigeo.departamento")}
          className={selectClassName}
          value={dep}
          disabled={!data}
          onChange={(e) => {
            setDep(e.target.value);
            setProv("");
            field.onChange(null);
          }}
        >
          <option value="">
            {translate("resources.contacts.ubigeo.departamento")}
          </option>
          {departamentos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          aria-label={translate("resources.contacts.ubigeo.provincia")}
          className={selectClassName}
          value={prov}
          disabled={!dep}
          onChange={(e) => {
            setProv(e.target.value);
            field.onChange(null);
          }}
        >
          <option value="">
            {translate("resources.contacts.ubigeo.provincia")}
          </option>
          {provincias.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          aria-label={translate("resources.contacts.ubigeo.distrito")}
          className={selectClassName}
          value={value.length === 6 ? value : ""}
          disabled={!prov}
          onChange={(e) => field.onChange(e.target.value || null)}
          onBlur={field.onBlur}
        >
          <option value="">
            {prov
              ? translate("resources.contacts.ubigeo.distrito")
              : placeholder}
          </option>
          {distritos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
