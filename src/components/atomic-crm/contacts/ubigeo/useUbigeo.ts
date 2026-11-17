import { useEffect, useState } from "react";

/**
 * Peru UBIGEO codes (INEI), departamento -> provincia -> distrito.
 * Source: CONCYTEC, https://github.com/CONCYTEC/ubigeo-peru (CC BY 4.0).
 * Loaded lazily so the ~44 KB dataset is not part of the main bundle.
 */
export type UbigeoData = {
  departamentos: Record<string, string>;
  provincias: Record<string, string>;
  distritos: Record<string, string>;
};

let cache: UbigeoData | null = null;
let pending: Promise<UbigeoData> | null = null;

export const loadUbigeo = (): Promise<UbigeoData> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = import("./ubigeoPeru.json").then((mod) => {
      cache = (mod.default ?? mod) as UbigeoData;
      return cache;
    });
  }
  return pending;
};

export const useUbigeo = () => {
  const [data, setData] = useState<UbigeoData | null>(cache);
  useEffect(() => {
    if (data) return;
    let active = true;
    loadUbigeo().then((d) => {
      if (active) setData(d);
    });
    return () => {
      active = false;
    };
  }, [data]);
  return data;
};

export const formatUbigeo = (
  data: UbigeoData | null,
  code: string | null | undefined,
) => {
  if (!data || !code || code.length !== 6) return code ?? "";
  const dist = data.distritos[code];
  const prov = data.provincias[code.slice(0, 4)];
  const dep = data.departamentos[code.slice(0, 2)];
  return [dist, prov, dep].filter(Boolean).join(", ");
};

export const childrenOf = (
  map: Record<string, string>,
  prefix: string,
): { id: string; name: string }[] =>
  Object.entries(map)
    .filter(([code]) => code.startsWith(prefix))
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
