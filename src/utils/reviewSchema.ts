// src/utils/reviewSchema.ts
/**
 * Build schema.org Review + AggregateRating JSON-LD from testimonial items.
 *
 * This is content-specific structured data: it belongs on the testimonial
 * variants (which know exactly which reviews are visible on the page), NOT in
 * the site-wide SEO layer — the same "schema follows visible content" rule we
 * use for FAQPage on the accordion variant.
 *
 * Attaches the reviews + aggregate to the site-wide business entity (@id) so
 * search engines tie them to the RoofingContractor declared in SEO.astro,
 * rather than emitting a free-floating (self-serving) rating.
 */
import { siteData } from "@/content/siteData";

interface TestimonialItem {
  title?: string; // reviewer name
  content?: string; // review body
  description?: string; // short headline (fallback body)
  role?: string;
  rating?: number;
}

const BUSINESS_ID = `${siteData.url}/#business`;

export function buildReviewSchema(items: TestimonialItem[]): object | null {
  const safe = Array.isArray(items) ? items : [];

  const reviews = safe
    .map((t) => {
      const author = (t.title ?? "").trim();
      const body = String(t.content ?? t.description ?? "")
        .replace(/\s+/g, " ")
        .trim();
      const rating = Number(t.rating);
      if (!author || !body) return null;
      return {
        "@type": "Review",
        author: { "@type": "Person", name: author },
        reviewBody: body,
        ...(Number.isFinite(rating) && rating > 0
          ? {
              reviewRating: {
                "@type": "Rating",
                ratingValue: rating,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      };
    })
    .filter(Boolean) as object[];

  if (reviews.length === 0) return null;

  const ratings = safe
    .map((t) => Number(t.rating))
    .filter((n) => Number.isFinite(n) && n > 0);

  const aggregateRating =
    ratings.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            ratings.reduce((a, b) => a + b, 0) / ratings.length
          ).toFixed(1),
          reviewCount: ratings.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  // Attach to the site-wide business entity by @id.
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": BUSINESS_ID,
    name: siteData.legalName || siteData.title,
    url: siteData.url,
    ...(aggregateRating && { aggregateRating }),
    review: reviews,
  };
}
