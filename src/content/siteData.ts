// src/siteData.ts - Compatible with both Astro and React
import { SITE_DOMAIN, SITE_URL } from "./siteDomain.js";

export const siteData = {
  title: "John's Pro Roofing",
  legalName: "John's Pro Roofing LLC",
  tagline: "Professional roofing services built on dependable workmanship.",
  description: "Professional roofing services in Somerset, New Jersey. Free estimates, 0% financing available, roof repairs, replacements, and commercial roofing.",
  domain: SITE_DOMAIN,
  url: SITE_URL,
  location: "New Jersey, USA",
  address: "20 Emerald Place, Somerset, NJ 08873",
  googleReviewsUrl:
    "https://www.google.com/search?kgmid=/g/11mx000nb3&hl=en-US&q=John%27s+Pro+Roofing+LLC&shem=epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/osrp/m5/1&kgs=9d1507ae5b28eddc&utm_source=epsd1,ltae,rimspwouoe,sh/x/loc/osrp/m5/1&safe=strict#lrd=0x89c3c1af88bc03fb:0x3e59fc7c7673d755,1,,,,",
};

// ─────────────────────────────────────────────────────────────────────────
// Business credentials — single source of truth for facts reused across page
// copy (service pages, About, schema). Replace the "TODO:" placeholders once
// John confirms them; every page that interpolates these updates at once.
// ─────────────────────────────────────────────────────────────────────────
export const businessData = {
  // NJ Home Improvement Contractor registration number, e.g. "13VH01234500"
  njHicNumber: "TODO: NJ HIC #",
  // Insurance status shown in copy, e.g. "fully licensed and insured"
  insurance: "TODO: insurance confirmation",
  // One shared warranty phrase used in service-page copy,
  // e.g. "a 25-year workmanship warranty"
  warranty: "TODO: workmanship warranty term",
  // Note: manufacturer certifications are a list — see the "certifications"
  // content collection (src/content/certifications), not a field here.
};

export const ctaData = {
  text: "Request an Estimate",
  link: "#quote-form",
}
