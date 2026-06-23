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

  // Roofing services — a single collection with a parent/child hierarchy
  // (e.g. Residential Roofing → Residential Roof Repair).
  "roofing": defineCollection({
    loader: GlobLoad("roofing"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        price: z.string().optional(),
        features: z.array(z.string()).default([]),
        // Homepage service-grid presentation overrides
        cardSize: z.enum(["large", "small"]).optional(),
        cardTitle: z.string().optional(),
        cardCta: z.string().optional(),
        cardBlurb: z.string().optional(),
        badge: z.string().optional(),
      }),
  }),

  // Top-level services shown as cards on the homepage: roofing, decking,
  // siding. Only roofing has a page (links to the roofing collection index);
  // decking/siding are page-less and render as non-linking cards.
  "services": defineCollection({
    loader: GlobLoad("services"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        // Explicit link target (e.g. roofing → /roofing). Page-less services
        // (decking, siding) omit this and render as non-linking cards.
        url: z.string().optional(),
        price: z.string().optional(),
        features: z.array(z.string()).default([]),
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
        category: z.string(),
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

  // ── selling-points ──────────────────────────────────────
  // Short highlight phrases scrolled in the hero marquee.
  // `title` is the displayed text; `order` controls sequence.
  "selling-points": defineCollection({
    loader: FileLoad("selling-points", "selling-points.json"),
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
};
