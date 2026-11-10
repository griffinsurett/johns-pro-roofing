// src/utils/roofingTypes.ts
/**
 * Shared query for the roofing-types collection, filtered by the service each
 * type references. Used by both the card band (RoofingTypes.astro) and the
 * in-content list band (RoofingTypesList.astro) so the filter lives once.
 * `home-improvement-types` has the same shape and reuses the same query.
 */
import { query, sortByOrder, normalizeReference } from "@/utils/query";

export type TypesCollection = "roofing-types" | "home-improvement-types";

interface Options {
  /** Service id to filter by (e.g. "flat-roofing"). Omit to return all types. */
  service?: string;
  /** Card/list order by `order` field. */
  direction?: "asc" | "desc";
  collection?: TypesCollection;
}

export async function getRoofingTypes({
  service,
  direction = "asc",
  collection = "roofing-types",
}: Options = {}) {
  const all = await query(collection).orderBy(sortByOrder(direction)).all();
  if (!service) return all;
  return all.filter((t: any) =>
    normalizeReference(t.data.service).some((ref: any) => ref.id === service)
  );
}
