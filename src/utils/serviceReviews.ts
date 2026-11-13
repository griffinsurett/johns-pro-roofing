// src/utils/serviceReviews.ts
/**
 * The reviews a service page shows: the testimonials whose `reviewedItem`
 * points at this service, or, when it has none yet, the testimonials tagged
 * "featured" (general reviews that don't talk about one specific service). A
 * new page still shows real customers without borrowing another service's
 * reviews.
 *
 * To give a page its own reviews, set `reviewedItem: "<service-id>"` on the
 * testimonial. To change the fallback set, add or remove the "featured" tag.
 */
import type { CollectionEntry } from "astro:content";
import { query, sortByOrder, normalizeReference } from "@/utils/query";

export async function getServiceReviews(
  serviceId: string,
): Promise<CollectionEntry<"testimonials">[]> {
  const all = (await query("testimonials")
    .orderBy(sortByOrder())
    .all()) as CollectionEntry<"testimonials">[];

  const forService = all.filter((t) =>
    normalizeReference(t.data.reviewedItem).some((ref: any) => ref.id === serviceId),
  );
  return forService.length
    ? forService
    : all.filter((t) => t.data.tags?.includes("featured"));
}
