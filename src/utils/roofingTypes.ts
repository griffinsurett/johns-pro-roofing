// src/utils/roofingTypes.ts
/**
 * Shared query for the roofing-types collection, filtered by the service each
 * type references. Used by both the card band (RoofingTypes.astro) and the
 * in-content list band (RoofingTypesList.astro) so the filter lives once.
 */
import { query, sortByOrder, normalizeReference } from "@/utils/query";

interface Options {
  /** Service id to filter by (e.g. "flat-roofing"). Omit to return all types. */
  service?: string;
  /** Card/list order by `order` field. */
  direction?: "asc" | "desc";
}

export async function getRoofingTypes({ service, direction = "asc" }: Options = {}) {
  const all = await query("roofing-types").orderBy(sortByOrder(direction)).all();
  if (!service) return all;
  return all.filter((t: any) =>
    normalizeReference(t.data.service).some((ref: any) => ref.id === service)
  );
}
