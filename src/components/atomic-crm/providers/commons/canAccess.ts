// FIXME: This should be exported from the ra-core package
type CanAccessParams<
  RecordType extends Record<string, any> = Record<string, any>,
> = {
  action: string;
  resource: string;
  record?: RecordType;
};

/**
 * Roles:
 * - admin: everything
 * - supervisor: sees all records, configures pipelines and stages, can read
 *   (but not manage) users so it can assign records to advisors
 * - asesor (and legacy "user"): only their own records (enforced by RLS),
 *   no access to users or configuration
 */
export const canAccess = <
  RecordType extends Record<string, any> = Record<string, any>,
>(
  role: string,
  params: CanAccessParams<RecordType>,
) => {
  if (role === "admin") {
    return true;
  }

  if (role === "supervisor") {
    if (params.resource === "sales") {
      return ["list", "show"].includes(params.action);
    }
    return true;
  }

  // Advisors can't access the sales resource
  if (params.resource === "sales") {
    return false;
  }

  // Advisors can't access the configuration resource
  if (params.resource === "configuration") {
    return false;
  }

  return true;
};

export const getSaleRole = (sale: {
  role?: string | null;
  administrator?: boolean;
}) => sale.role ?? (sale.administrator ? "admin" : "asesor");
