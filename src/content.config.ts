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
import { baseSchema, MenuSchema, MenuItemFields, refSchema, imageInputSchema, ctaSchema } from "./content/schema";
import { GlobLoad, FileLoad } from "@/utils/loaders/loaderUtils";
import { MenuItemsLoader } from "@/utils/loaders/MenuItemsLoader";
import { PROPERTY_TYPE_IDS } from "@/utils/propertyTypes";

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
        // The contact value itself (phone digits, email, etc.). This is the
        // canonical field — `description` is free for genuine subtext now.
        value: z.string().optional(),
        linkPrefix: z.string().optional(),
        url: z.string().optional(),
        // Structured address parts (on the address entry) — the single source
        // of truth for schema.org PostalAddress, so builders don't parse the
        // display string. Fill these on whichever entry holds the address.
        streetAddress: z.string().optional(),
        addressLocality: z.string().optional(),
        addressRegion: z.string().optional(),
        postalCode: z.string().optional(),
        addressCountry: z.string().optional(),
        // Phone country dialing code (E.164 prefix without "+", e.g. "1"),
        // on the phone entry.
        phoneCountryCode: z.string().optional(),
        // Opening hours (local businesses), on the entry that holds them —
        // [{ dayOfWeek: ["Monday"], opens: "08:00", closes: "17:00" }].
        hours: z
          .array(z.object({ dayOfWeek: z.array(z.string()), opens: z.string(), closes: z.string() }))
          .optional(),
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

  // Services — a single collection grouped by `category` ("Commercial
  // Roofing", "Residential Roofing", "Home Improvement", ...). Each entry gets its own page
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
        // Services contained in this page (ContentRenderer + OfferingsVariant). `confirmed: false`
        // marks an item the client hasn't approved yet (bookkeeping; not shown).
        offerings: z
          .array(
            z.object({
              title: z.string(),
              description: z.string(),
              confirmed: z.boolean().default(true),
              // Kinds of home this item applies to. When set, the grid shows
              // where each item applies and a property-type filter.
              propertyTypes: z.array(z.enum(PROPERTY_TYPE_IDS)).optional(),
              // Audience this item belongs to (e.g. "commercial" / "home"),
              // used by an `offeringFilters` filter on `group`.
              group: z.string().optional(),
              // Another service this item is: the card links to that page.
              // Must be a real service id (checked at build). Used for the
              // allowed cross-mentions (general contracting → remodeling,
              // additions); roofing is never listed, so it never links.
              page: z.string().optional(),
              // Full-width card closing the list (e.g. one that ties the
              // others together).
              wide: z.boolean().optional(),
              // Photo on top of a grid card (e.g. a finished commercial job).
              // `src` or `{ src, alt }`; cards without one stay text-only.
              // Linked and wide cards don't show it.
              image: imageInputSchema({ image }),
            })
          )
          .optional(),
        // Filter chips above the offerings grid. Without this, a list whose items
        // carry `propertyTypes` gets the default All homes / Houses / Townhouses /
        // Condos filter. `field` is the item field to match (`group` or
        // `propertyTypes`); option ids are its values. Picking one highlights the
        // comparison column with the same id and sets the form select named
        // `prefill` to the option's `formValue`.
        offeringFilters: z
          .object({
            field: z.enum(["group", "propertyTypes"]),
            // Omit for tabs: no "All" option, and the first option starts
            // selected.
            allLabel: z.string().optional(),
            prefill: z.string().optional(),
            options: z
              .array(
                z.object({
                  id: z.string(),
                  label: z.string(),
                  formValue: z.string().optional(),
                })
              )
              .min(2),
          })
          .optional(),
        // Side-by-side comparison (ContentRenderer + ComparisonVariant), e.g. house /
        // townhouse / condo or composite / wood. Every column has the same
        // rows, so each needs one cell per row. A column whose `id` matches a
        // filter option (property type, or an `offeringFilters` id) is highlighted
        // when the OfferingsVariant filter picks it.
        comparison: z
          .object({
            heading: z.string(),
            intro: z.string().optional(),
            rows: z.array(z.string()).min(1),
            columns: z
              .array(
                z.object({
                  id: z.string(),
                  label: z.string(),
                  cells: z.array(z.string()),
                })
              )
              .min(2),
          })
          .refine(
            (c) => c.columns.every((col) => col.cells.length === c.rows.length),
            { message: "Each comparison column needs exactly one cell per row." }
          )
          .optional(),
        // Pre-footer CTA banner (CtaBanner), separate from `cta` (which heads
        // the mid-page quote form) so the page doesn't repeat one headline.
        // `points` default to the get-started steps (see ServiceLayout).
        ctaBanner: ctaSchema,
        // Highlights strip under the service hero: this page's own phrases
        // (a plain list per page, no shared query).
        marquee: z.array(z.string()).optional(),
        // Process steps ("How your deck gets built"), shown in the red photo
        // band (ServiceCalloutVariant, one column).
        process: z
          .object({
            pretitle: z.string().optional(),
            heading: z.string(),
            description: z.string().optional(),
            steps: z
              .array(z.object({ title: z.string(), description: z.string() }))
              .min(1),
          })
          .optional(),
        // Compact callback form in the service hero (QuickQuoteForm).
        quickForm: z
          .object({
            heading: z.string(),
            description: z.string().optional(),
            selectLabel: z.string(),
            options: z.array(z.string()).min(1),
            button: z.string(),
          })
          .optional(),
        // Detailed bottom form (ProjectDetailsForm): this service's questions.
        detailsForm: z
          .object({
            heading: z.string(),
            description: z.string().optional(),
            button: z.string(),
            questions: z.array(
              z.object({
                name: z.string(),
                label: z.string(),
                type: z.enum(["select", "checkboxes", "text", "textarea"]),
                options: z.array(z.string()).optional(),
                placeholder: z.string().optional(),
                required: z.boolean().optional(),
              })
            ),
          })
          .optional(),
      })
      // The service hero's background is `bannerImage`; when a page doesn't
      // set one, it defaults to the page's `featuredImage`.
      .transform((data) => ({
        ...data,
        bannerImage: data.bannerImage ?? data.featuredImage,
      })),
  }),

  "testimonials": defineCollection({
    loader: GlobLoad("testimonials"),
    schema: ({ image }) =>
      baseSchema({ image }).extend({
        role: z.string(),
        company: z.string().optional(),
        // No default: a star rating must be the reviewer's own.
        reviewedItem: refSchema(["services"]).optional(),
        rating: z.number().min(1).max(5).optional(),
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
        // ServiceLayout.
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
        // Optional service reference. Service-specific FAQs link to their
        // service so each service page can render its own set; general FAQs
        // omit this and only appear on the main /faq page.
        service: refSchema("services"),
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
      baseSchema({ image }).extend({
        // The service(s) this roofing system is installed/serviced under
        // (e.g. TPO → flat-roofing). Mirrors the projects → services pattern.
        service: refSchema("services"),
      }),
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
        // schema.org type of the area in structured data ("State", "City", …).
        areaType: z.string().optional(),
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

  // ── gallery ─────────────────────────────────────────────
  // A curated set of project + recurring photos used across the site, shown as
  // an auto-scrolling marquee (GalleryMarquee, embedded in the StatsVariant
  // "Why Choose Us" band) — a visual prelude, not a projects section. No pages:
  // display-only. `featuredImage` is the tile, `title` the alt text.
  "gallery": defineCollection({
    loader: FileLoad("gallery", "gallery.json"),
    schema: ({ image }) =>
      baseSchema({ image }),
  }),
};
