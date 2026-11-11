// src/utils/roofingTypes.ts
/**
 * Shared query for the roofing-types collection, filtered by the service each
 * type references. Used by both the card band (RoofingTypes.astro) and the
 * in-content list band (RoofingTypesList.astro) so the filter lives once.
 * `project-types` has the same shape and reuses the same query.
 */
import { query, sortByOrder, normalizeReference } from "@/utils/query";

export type TypesCollection = "roofing-types" | "project-types";

interface Options {
  /** Service id to filter by (e.g. "flat-roofing"). Omit to return all types. */
  service?: string;
  /** Card/list order by `order` field. */
  direction?: "asc" | "desc";
  collection?: TypesCollection;
  /** Only types carrying this tag (e.g. "commercial" or "residential"). */
  tag?: string;
}

export async function getRoofingTypes({
  service,
  direction = "asc",
  collection = "roofing-types",
  tag,
}: Options = {}) {
  const all = await query(collection).orderBy(sortByOrder(direction)).all();
  return all.filter(
    (t: any) =>
      (!service ||
        normalizeReference(t.data.service).some((ref: any) => ref.id === service)) &&
      (!tag || t.data.tags?.includes(tag))
  );
}
