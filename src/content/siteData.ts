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
  googleReviewsUrl: "https://share.google/I4KdUD3BPIPIdFkoy",
};

export const ctaData = {
  text: "Request an Estimate",
  link: "#quote-form",
}
