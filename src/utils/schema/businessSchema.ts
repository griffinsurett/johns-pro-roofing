// src/utils/schema/businessSchema.ts
/**
 * Site-wide business schema (LocalBusiness / RoofingContractor).
 *
 * This is the canonical business entity for the whole site — its `@id` is the
 * anchor that every other content-specific schema (reviews, services) attaches
 * to, so search engines see one coherent business graph.
 *
 * Sourced from siteData + the service-areas and contact-us collections — no
 * hardcoded facts, so a new site only edits siteData/content, not this file.
 */
import { siteData } from "@/content/siteData";
import { query, sortByOrder } from "@/utils/query";
import { formatPhoneNumber } from "@/utils/string";

/** The shared business entity @id every schema references. */
export const BUSINESS_ID = `${siteData.url}/#business`;

/** schema.org business type — a per-site fact, set in siteData. */
export const BUSINESS_TYPE = siteData.businessType;

interface BusinessSchemaOptions {
  /** Absolute logo URL (callers resolve their own asset → absolute). */
  logoUrl?: string;
}

/** PostalAddress from the address entry's structured fields (contact-us). */
function buildAddress(addressEntry: any) {
  const d = addressEntry?.data;
  if (!d?.streetAddress) return undefined;
  return {
    "@type": "PostalAddress",
    streetAddress: d.streetAddress,
    ...(d.addressLocality && { addressLocality: d.addressLocality }),
    ...(d.addressRegion && { addressRegion: d.addressRegion }),
    ...(d.postalCode && { postalCode: d.postalCode }),
    ...(d.addressCountry && { addressCountry: d.addressCountry }),
  };
}

/** Phone (E.164-ish) from the phone entry — digits + its own country code. */
function buildPhone(phoneEntry: any): string | undefined {
  const raw = String(phoneEntry?.data?.value ?? phoneEntry?.data?.description ?? "").replace(/\D/g, "");
  if (!raw) return undefined;
  const cc = phoneEntry?.data?.phoneCountryCode;
  if (raw.length === 10) return `+${cc ?? "1"}-${formatPhoneNumber(raw)}`;
  return `+${raw}`;
}

export async function buildBusinessSchema(
  options: BusinessSchemaOptions = {}
): Promise<Record<string, any>> {
  const { logoUrl } = options;

  const serviceAreas = await query("service-areas").orderBy(sortByOrder()).all();
  const areaServed = serviceAreas.map((a: any) => ({
    "@type": "State",
    name: a.data?.title,
  }));

  // Contact facts — single source of truth is the contact-us collection.
  const contacts = await query("contact-us").all();
  const address = buildAddress(
    contacts.find((c: any) => c.data?.tags?.includes("address"))
  );
  const telephone = buildPhone(
    contacts.find((c: any) => c.data?.tags?.includes("phone"))
  );

  return {
    "@type": BUSINESS_TYPE,
    "@id": BUSINESS_ID,
    name: siteData.legalName || siteData.title,
    description: siteData.description,
    url: siteData.url,
    ...(telephone && { telephone }),
    ...(logoUrl && { logo: logoUrl, image: logoUrl }),
    ...(address && { address }),
    ...(areaServed.length > 0 && { areaServed }),
  };
}
