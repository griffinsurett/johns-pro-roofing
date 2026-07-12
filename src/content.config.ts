// src/content.config.ts
/**
 * Collection structure:
 *
 * src/content/[collection]/
 *   _meta.mdx         ← Collection config (frontmatter) + index page content (body)
 *                        The _ prefix excludes it from collection entries
 *   item-one.mdx      ← Collection item
 *   item-two.mdx      ← Collection item
 *
 * _meta.mdx frontmatter controls:
 * - title: Display name for the collection
 * - description: Collection description
 * - hasPage: Whether to generate /[collection] index page
 * - itemsHasPage: Whether items get individual pages
 * - featuredImage: Hero image for index page
 * - seo: SEO overrides
 */
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { baseSchema, MenuSchema, MenuItemFields, refSchema, imageInputSchema } from "./content/schema";
import { GlobLoad, FileLoad } from "@/utils/loaders/loaderUtils";
import { MenuItemsLoader } from "@/utils/loaders/MenuItemsLoader";

export const collections = {
  // ── menus.json ─────────────────────────────────────────
  "menus": defineCollection({
    loader: FileLoad("menus", "menus.json"),
    schema: MenuSchema,
  }),

  // ── menu-items.json ─────────────────────────────────────
  "menu-items": defineCollection({
    loader: MenuItemsLoader(),
    schema: MenuItemFields,
  }),

  "contact-us": defineCollection({
    loader: FileLoad("contact-us", "contact-us.json"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        linkPrefix: z.string().optional(),
        url: z.string().optional(),
      }),
  }),

  "social-media": defineCollection({
    loader: FileLoad("social-media", "socialmedia.json"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        link: z.string().optional(),
      }),
  }),

  // ── legal ───────────────────────────────────────────────
  "legal": defineCollection({
    loader: GlobLoad("legal"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        effectiveDate: z
          .union([z.date(), z.string()])
          .optional()
          .transform((val) => {
            if (!val) return undefined;
            if (val instanceof Date) return val;
            return new Date(val);
          }),
      }),
  }),

  "about-us": defineCollection({
    loader: GlobLoad("about-us"),
    schema: ({ image }) =>
      baseSchema({ image })
  }),

  "blog": defineCollection({
    loader: GlobLoad("blog"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        author: refSchema("authors"),
        tags: z.array(z.string()).default([]),
        readingTime: z.number().optional(),
      }),
  }),

  "authors": defineCollection({
    loader: FileLoad("authors", "authors.json"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        email: z.string().email().optional(),
        social: z
          .object({
            twitter: z.string().url().optional(),
            github: z.string().url().optional(),
            linkedin: z.string().url().optional(),
            website: z.string().url().optional(),
          })
          .optional(),
        role: z.string().optional(),
      }),
  }),

  // Services — a single collection grouped by `category` into two families:
  // "Commercial Roofing" and "Asphalt Paving". Each entry gets its own page
  // (e.g. /services/asphalt-paving) with a ServiceLayout hero.
  "services": defineCollection({
    loader: GlobLoad("services"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        category: z.string().optional(),
        price: z.string().optional(),
        features: z.array(z.string()).default([]),
        // Optional explicit link target (external or custom page).
        url: z.string().optional(),
        // Homepage service-grid presentation overrides
        cardSize: z.enum(["large", "small"]).optional(),
        cardTitle: z.string().optional(),
        cardCta: z.string().optional(),
        cardBlurb: z.string().optional(),
        badge: z.string().optional(),
      }),
  }),

  "testimonials": defineCollection({
    loader: GlobLoad("testimonials"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        role: z.string(),
        company: z.string().optional(),
        rating: z.number().min(1).max(5).default(5),
        // Where the review came from; "google" shows the Google G badge.
        source: z.string().default("google"),
      }),
  }),

  "projects": defineCollection({
    loader: GlobLoad("projects"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        client: z.string().optional(),
        location: z.string().optional(),
        projectUrl: z.string().url().optional(),
        technologies: z.array(z.string()).default([]),
        // One or more service references. A project's category/portfolio
        // placement is derived from its referenced service(s) — see
        // ServiceLayout and ProjectsIndexLayout.
        service: refSchema("services"),
        beforeImage: imageInputSchema({ image }),
        afterImage: imageInputSchema({ image }),
      }),
  }),

  "faq": defineCollection({
    loader: GlobLoad("faq"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        category: z.string().optional(),
      }),
  }),

  // ── stats ───────────────────────────────────────────────
  // Headline proof-point stats for the "Why Choose Us" band.
  // value = the big number (e.g. "500+"), title = the label
  // beneath it (e.g. "Roofs Installed"). order controls sequence.
  "stats": defineCollection({
    loader: FileLoad("stats", "stats.json"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        value: z.string(),
      }),
  }),

  // ── selling-points ──────────────────────────────────────
  // Short highlight phrases scrolled in the hero marquee.
  // `title` is the displayed text; `order` controls sequence.
  "selling-points": defineCollection({
    loader: FileLoad("selling-points", "selling-points.json"),
    schema: ({ image }) =>
      baseSchema({ image }),
  }),

  // ── roofing-types ───────────────────────────────────────
  // Roofing systems/materials we install (TPO, EPDM, Metal, etc.), rendered as
  // image cards. MDX-backed so each type can grow into its own page later;
  // `_meta.mdx` sets itemsHasPage:false for now.
  "roofing-types": defineCollection({
    loader: GlobLoad("roofing-types"),
    schema: ({ image }) =>
      baseSchema({ image }),
  }),

  // ── who-we-serve ────────────────────────────────────────
  // Commercial audiences (Property Managers, HOAs, etc.) listed in the
  // red-gradient "Who We Serve" callout band. MDX-backed so each audience can
  // grow into its own page later; `_meta.mdx` sets itemsHasPage:false for now.
  // `title` is the label; `order` controls sequence.
  "who-we-serve": defineCollection({
    loader: GlobLoad("who-we-serve"),
    schema: ({ image }) =>
      baseSchema({ image }),
  }),

  // ── service-areas ───────────────────────────────────────
  // States we serve. title = full name (e.g. "New Jersey"),
  // abbr = postal code (e.g. "NJ"). No pages — used for labels only.
  "service-areas": defineCollection({
    loader: FileLoad("service-areas", "service-areas.json"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        abbr: z.string(),
      }),
  }),

  // ── certifications ──────────────────────────────────────
  // Manufacturer certifications (e.g. GAF, CertainTeed). title = display name,
  // icon/featuredImage = optional logo, url = optional certified-contractor
  // link. No pages — used for labels, badges, and schema credentials.
  "certifications": defineCollection({
    loader: FileLoad("certifications", "certifications.json"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        url: z.string().optional(),
      }),
  }),
};
