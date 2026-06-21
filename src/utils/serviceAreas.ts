// src/utils/serviceAreas.ts
/**
 * Service-area helpers — single source of truth for the states we serve.
 * Pulls from the `service-areas` collection via the query shortcuts.
 */
import { query, sortByOrder } from "@/utils/query";

/** Join a list into "A, B & C" (ampersand before the last item). */
export function listAreas(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return items.slice(0, -1).join(", ") + " & " + items[items.length - 1];
}

/** Ordered service-area entries (full name + abbr). */
export async function getServiceAreas() {
  return query("service-areas").orderBy(sortByOrder()).all();
}

/** "New Jersey, New York & Pennsylvania" */
export async function getServiceAreaNames(): Promise<string> {
  const areas = await getServiceAreas();
  return listAreas(areas.map((a) => a.data.title));
}

/** "NJ, NY & PA" */
export async function getServiceAreaAbbrs(): Promise<string> {
  const areas = await getServiceAreas();
  return listAreas(areas.map((a) => (a.data as { abbr: string }).abbr));
}
