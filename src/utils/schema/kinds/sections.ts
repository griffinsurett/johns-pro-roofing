// src/utils/schema/kinds/sections.ts
/**
 * Section kinds — built from the items a component shows, so the schema
 * always matches what's visible. A variant declares one
 * (`<Schema kind="faq" items={items} />`).
 */
import { BUSINESS_ID, BUSINESS_NAME, BUSINESS_TYPE, BUSINESS_URL } from "../identity";
import type { ListKind } from "../types";

/**
 * FAQPage from the questions shown. One per page: a second FAQ section on the
 * same page is skipped rather than emitting a competing FAQPage.
 */
export const faq: ListKind = {
  mode: "list",
  fields: {
    question: { from: "title", as: "text" },
    answer: { from: ["content", "description"], as: "text" },
  },
  dedupeKey: () => "faq",
  build: (items) => {
    const entries = items.filter((i) => i.question && i.answer);
    if (entries.length === 0) return null;
    return {
      "@type": "FAQPage",
      mainEntity: entries.map((e) => ({
        "@type": "Question",
        name: e.question,
        acceptedAnswer: { "@type": "Answer", text: e.answer },
      })),
    };
  },
};

/**
 * Review + AggregateRating from the testimonials shown, attached to the page
 * subject (a Service/Course/Product the layout declared) or else the business
 * — stars can show for an offering, not for a business reviewing itself.
 *
 * `rating` is protected: overrides can remap which field it's read from, but
 * never give it a fixed or default value. Stars must be the reviewer's own.
 */
export const reviews: ListKind = {
  mode: "list",
  protectedFields: ["rating"],
  fields: {
    // A reviewer who left no name carries title "Anonymous" in the entry, so
    // the card and the schema agree.
    author: { from: ["author", "company", "title"], as: "text" },
    body: { from: ["content", "description"], as: "text" },
    rating: { from: "rating", as: "rating" },
  },
  dedupeKey: ({ locals }) => `reviews:${locals.schemaSubject?.["@id"] ?? "business"}`,
  build: (items, { locals }) => {
    const reviews = items
      .filter((i) => i.author && i.body)
      .map((i) => ({
        "@type": "Review",
        author: { "@type": "Person", name: i.author },
        reviewBody: i.body,
        ...(i.rating && { reviewRating: i.rating }),
      }));
    if (reviews.length === 0) return null;

    // Aggregate from the reviews actually emitted — Google cross-checks
    // reviewCount against the Review nodes.
    const ratings = reviews
      .map((r: any) => Number(r.reviewRating?.ratingValue))
      .filter((n) => Number.isFinite(n) && n > 0);
    const target = locals.schemaSubject ?? {
      "@id": BUSINESS_ID,
      "@type": BUSINESS_TYPE,
      name: BUSINESS_NAME,
      url: BUSINESS_URL,
    };
    return {
      ...target,
      review: reviews,
      ...(ratings.length > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
          reviewCount: ratings.length,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    };
  },
};
