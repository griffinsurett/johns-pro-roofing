// src/siteData.ts - Compatible with both Astro and React
import { SITE_DOMAIN, SITE_URL } from "./siteDomain.js";

export const siteData = {
  title: "John's Pro Roofing",
  legalName: "John's Pro Roofing LLC",
  tagline: "Commercial Roofing & Asphalt Paving built on dependable workmanship.",
  description: "Commercial roofing and asphalt paving in New Jersey — flat-roof systems, repairs, maintenance, paving, sealcoating, and parking lot repairs for property managers, facility managers, and building owners. Free estimates.",
  domain: SITE_DOMAIN,
  url: SITE_URL,
  language: "en",
  location: "New Jersey, USA",
  schemaType: "RoofingContractor",
  currency: "USD",
  googleReviewsUrl:
    "https://www.google.com/search?kgmid=/g/11mx000nb3&hl=en-US&q=John%27s+Pro+Roofing+LLC&shem=epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/osrp/m5/1&kgs=9d1507ae5b28eddc&utm_source=epsd1,ltae,rimspwouoe,sh/x/loc/osrp/m5/1&safe=strict#lrd=0x89c3c1af88bc03fb:0x3e59fc7c7673d755,1,,,,",
};

// ─────────────────────────────────────────────────────────────────────────
// Business credentials — single source of truth for facts reused across page
// copy (service pages, About). Leave unconfirmed facts unset; enter verified
// values here once John confirms them. Conditional copy updates from this data.
// ─────────────────────────────────────────────────────────────────────────
export const businessData: { njHicNumber?: string; insurance?: string; warranty?: string } = {
  // NJ Home Improvement Contractor registration number, e.g. "13VH01234500"
  njHicNumber: undefined,
  // Insurance status shown in copy, e.g. "fully licensed and insured"
  insurance: undefined,
  // One shared warranty phrase used in service-page copy,
  // e.g. "a 25-year workmanship warranty"
  warranty: undefined,
  // Note: manufacturer certifications are a list — see the "certifications"
  // content collection (src/content/certifications), not a field here.
  //
  // Address + phone (incl. country codes) live in the contact-us collection —
  // the single source of truth for contact facts, read by the schema builders.
};

export const ctaData = {
  text: "Request an Estimate",
  link: "#quote-form",
}
