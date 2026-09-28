// src/utils/schema/transforms.ts
/**
 * Reusable value transforms, referenced by name from field maps
 * (`{ from: "featuredImage", as: "image" }`). Each receives the values of the
 * spec's `from` fields, in order, and returns the schema value (undefined =
 * leave the property out).
 *
 * Adding a new kind of value (dates, SKUs, durations…) means adding one
 * function here; every kind and every site map can then use it.
 */
import { siteData } from "@/content/siteData";
import { getImageUrl } from "@/utils/images";
import { resolveAuthorId } from "@/utils/seo";
import { BUSINESS_ID, buildAreaServed, personId } from "./identity";
import type { SchemaContext } from "./types";

type Transform = (values: unknown[], ctx: SchemaContext) => unknown | Promise<unknown>;

const present = (v: unknown) =>
  v !== undefined && v !== null && !(typeof v === "string" && v.trim() === "");
const first = (values: unknown[]) => values.find(present);

const absoluteUrl = (src?: string) =>
  !src
    ? undefined
    : src.startsWith("http")
      ? src
      : `${siteData.url}${src.startsWith("/") ? "" : "/"}${src}`;

/** "$139.00" → "139.00"; anything unparseable → undefined. */
export function parsePrice(raw: unknown): string | undefined {
  const n = Number(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toFixed(2) : undefined;
}

const UNIT_CODES: Record<string, string> = { day: "DAY", week: "WEE", month: "MON", year: "ANN" };

/** "15 Days of Access" → QuantitativeValue { 15, DAY }. */
export function parsePeriod(length: unknown) {
  const m = String(length ?? "").match(/(\d+)\s*(day|week|month|year)s?/i);
  if (!m) return undefined;
  return { "@type": "QuantitativeValue", value: Number(m[1]), unitCode: UNIT_CODES[m[2].toLowerCase()] };
}

/**
 * An Offer from a price and a length. "Per Month" / "Monthly" / "Recurring"
 * reads as a subscription billed monthly; "N days/months of access" as a
 * one-time price for that period.
 */
export function buildOffer(
  input: { name?: string; price?: unknown; length?: unknown },
  url: string,
): Record<string, any> | undefined {
  const price = parsePrice(input.price);
  if (!price) return undefined;
  const currency = siteData.currency;
  const length = String(input.length ?? "");
  const monthly = /per month|monthly|recurring/i.test(length);
  const period = monthly ? undefined : parsePeriod(length);
  return {
    "@type": "Offer",
    ...(input.name && { name: input.name }),
    price,
    priceCurrency: currency,
    url,
    availability: "https://schema.org/InStock",
    ...(monthly && {
      category: "Subscription",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: currency,
        billingDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
    }),
    ...(period && { eligibleDuration: period }),
  };
}

export const transforms: Record<string, Transform> = {
  /** Plain text, whitespace collapsed. */
  text: (values) => {
    const v = first(values);
    return present(v) ? String(v).replace(/\s+/g, " ").trim() : undefined;
  },

  /** An image field (string or Astro image) → absolute URL. */
  image: (values) => {
    const v = first(values);
    return v ? absoluteUrl(getImageUrl(v as any, "")) : undefined;
  },

  /** [price, length] → Offer (see buildOffer). */
  offer: (values, ctx) =>
    buildOffer({ name: ctx.data.title, price: values[0], length: values[1] }, ctx.url),

  /** A date field → ISO 8601 string. */
  date: (values) => {
    const v = first(values);
    if (!present(v)) return undefined;
    const d = v instanceof Date ? v : new Date(String(v));
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  },

  /** An `authors` reference (or id) → the person node's @id. */
  person: (values) => {
    const id = resolveAuthorId(first(values));
    return id ? { "@id": personId(id) } : undefined;
  },

  /** The site's business entity, by @id. Ignores content. */
  business: () => ({ "@id": BUSINESS_ID }),

  /** Local businesses: the `service-areas` collection. Online: nothing. */
  serviceAreas: async () => {
    const areas = await buildAreaServed();
    return areas.length > 0 ? areas : undefined;
  },

  /** A 1–5 number → Rating. Missing stays missing (never invented). */
  rating: (values) => {
    const n = Number(first(values));
    return Number.isFinite(n) && n > 0
      ? { "@type": "Rating", ratingValue: n, bestRating: 5, worstRating: 1 }
      : undefined;
  },

  /** The page's own canonical URL. */
  url: (_values, ctx) => ctx.url,

  /** The site's language (siteData.language). */
  language: () => siteData.language,
};
