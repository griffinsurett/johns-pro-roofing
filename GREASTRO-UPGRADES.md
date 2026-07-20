# Greastro Site Upgrades — Reusable Patterns

A reference for everything built on **John's Pro Roofing** that is designed to
port to other greastro sites. Each section explains the pattern, the files
involved, and exactly what a new site needs to change.

Guiding principle throughout: **one source of truth per fact, schema/markup
lives at the layer that owns it, and per-site facts live in data (siteData /
content collections) — never hardcoded in components or utils.**

---

## 1. Shared `SectionHeading` component

**Problem it solves:** every section/variant had its own copy-pasted
`eyebrow + title + accent-word + description` markup, which drifted out of sync
(some headings italic, some not; accent word styled inconsistently).

**The convention:** regular heading words are upright; the **emphasized word is
red + italic** (`italic text-accent`). That rule lives in exactly one place.

**Files:**
- `src/components/SectionHeading.astro` — the single header component. Supports:
  - `pretitle` (eyebrow), `title`, `accentTitle` (emphasized word appended),
    or a segmented `heading={{ before, text, after }}` where `text` is emphasized.
  - `description`, `headingTag` (h1/h2/h3), `align` ("center" default | "left").
  - class overrides: `pretitleClass`, `headingClass`, `emphasisClass`,
    `descriptionClass` (for dark bands, e.g. `!text-bg`).
- `src/styles/global.css` — `.section-title` base is **not** italic anymore
  (upright); the emphasis span carries the italic.

**Adopted by:** ImageCardVariant, ServiceListVariant, TestimonialVariant,
TestimonialCarouselVariant, BeforeAfterVariant, ServiceCalloutVariant,
AccordionVariant, SecondaryHero, CtaBanner, QuoteCta.

**Port checklist:** copy `SectionHeading.astro`, make `.section-title` upright,
and route every variant's header through `<SectionHeading>`. Grep for
`not-italic font-\[family-name` — those are the old accent spans to replace with
`italic text-accent`.

---

## 2. Structured data (schema.org JSON-LD) system

The centerpiece. A clean, reusable convention split across three layers.

### Layers

| Layer | Location | Responsibility | New site edits? |
|---|---|---|---|
| **Facts** | `siteData.ts` + content collections | what the business/content *is* | ✅ yes |
| **Builders** | `src/utils/schema/*Schema.ts` | facts → schema.org objects | ❌ no |
| **Rendering** | `src/components/JsonLd.astro` | emit any object as static JSON-LD | ❌ no |

### The rule: site-wide vs content-specific

- **Site-wide** (business identity, breadcrumbs) → built in `SEO.astro`, merged
  into one `@graph`. Present on every page.
- **Content-specific** (FAQ, reviews, service) → built on the variant/layout
  that renders that content, so the schema always matches what's *visible* on
  the page. (Google requires FAQ/Review schema reflect on-page content.)

All entities stitch together by a shared `@id` (`BUSINESS_ID`), so search
engines see one coherent business graph (reviews + services attach to the
business node).

**Content-specific splits into two branches** (both "match visible content"):

- **List schema** — describes a *collection rendered as a list* → lives on the
  **variant** that renders the list (FAQPage → AccordionVariant, Review →
  testimonial variants). The variant holds the items and knows what's shown.
- **Page-identity schema** — describes *the page's own subject* → lives on the
  **layout/SEO layer** that owns the page (Service → ServiceLayout; Article /
  WebSite → SEO.astro).

This is why `Service` is on `ServiceLayout`, not a variant: a service is the
*subject* of its own page, rendered once. Services also appear as a *list* on
the homepage/`/services` index (via `ServiceListVariant`) — but those are
teasers, not service pages, so they emit **no** `Service` schema (emitting 8
`Service` blocks on a listing page is exactly what Google warns against).

### Builders (`src/utils/schema/`)

- **`businessSchema.ts`** — `RoofingContractor` (LocalBusiness). Exports
  `BUSINESS_ID` and `BUSINESS_TYPE` (both reused by other builders).
  - Business type from `siteData.businessType`.
  - Name/description/url from `siteData`.
  - Address (`PostalAddress`) + phone (E.164) from the **contact-us collection**
    (see §4) — no string parsing, no hardcoded facts.
  - `areaServed` from the **service-areas collection**.
- **`breadcrumbSchema.ts`** — `BreadcrumbList` derived from the URL path;
  returns `null` on the homepage.
- **`faqSchema.ts`** — `FAQPage` from FAQ items (question = title, answer =
  body/description).
- **`reviewSchema.ts`** — `Review` + `AggregateRating`, attached to the business
  `@id`. Deliberately NOT site-wide (avoids self-serving rating on pages with no
  reviews).
- **`serviceSchema.ts`** — `Service`, linked to the business via `provider.@id`,
  with `areaServed`.

### Rendering (`src/components/JsonLd.astro`)

The single owner of the `<script type="application/ld+json">` tag. Callers pass
a schema object (or `null` — renders nothing):

```astro
<JsonLd schema={buildServiceSchema(...)} />
```

> Note: this is **build-time** data baked into static HTML for crawlers — NOT
> client-side JS. `type="application/ld+json"` is inert data, no hydration.

### Who emits what

| Emitter | Schema |
|---|---|
| `SEO.astro` | `WebSite`/`Article` + `RoofingContractor` + `BreadcrumbList` (as `@graph`) |
| `AccordionVariant` | `FAQPage` (prop `faqSchema={false}` to suppress) |
| `TestimonialVariant` + `TestimonialCarouselVariant` | `Review` + `AggregateRating` |
| `ServiceLayout` | `Service` |

### Verified output (per page type)

- All content pages: `WebSite` + `RoofingContractor` + `BreadcrumbList`
- Service pages: + `Service` + `FAQPage`
- `/faq`: + `FAQPage`
- `/services`, `/testimonials`: + review `RoofingContractor` (aggregate rating)
- Redirect stubs: none (correctly `noindex` + canonical)

**Port checklist for a new site:**
1. Copy `src/utils/schema/` and `src/components/JsonLd.astro` verbatim.
2. In `siteData.ts`, set `businessType` to the right schema.org LocalBusiness
   subtype (`"RoofingContractor"` → `"Plumber"`, `"Electrician"`,
   `"GeneralContractor"`, etc.).
3. Wire `SEO.astro` to build the business + breadcrumb graph (see §2 imports).
4. Point `siteLogo`/`defaultOGImage` in `SEO.astro` at the **real** brand logo
   (NOT the placeholder `astro.svg` — this was a bug on John's; every OG share
   and the schema logo used the Astro logo until fixed).
5. Emit content-specific schema from the variants that render that content.

---

## 3. FAQ system with per-service scoping

**What:** ~100 FAQs — general + 10 per service — with each service page showing
only its own, and FAQPage schema everywhere they render.

**Files/mechanism:**
- `src/content.config.ts` — the `faq` collection schema gained an optional
  `service: refSchema("services")` reference (mirrors how `projects` reference
  services). General FAQs omit it; service FAQs reference their service id.
- `src/content/faq/*.mdx` — one file per FAQ. Frontmatter: `title` (the
  question), `description`, `order`, `category`, optional `service`. Body = the
  answer.
- `src/layouts/collections/ServiceLayout.astro` — renders an `AccordionVariant`
  FAQ section under the projects band, filtered to FAQs whose `service` matches
  the current page.
- `src/content/faq/_meta.mdx` — the main `/faq` page filters to **general only**
  (`.where((e) => !e.data.service)`) so it isn't flooded with every service's.

**Port checklist:** add `service` to the faq schema, author FAQ files (service
ones reference their service), render the scoped `AccordionVariant` in the
service layout, and filter the `/faq` index to general FAQs.

---

## 4. Contact collection = single source of truth (IMPORTANT CHANGES)

This section documents the **contact-us collection changes** specifically, since
they affect any site built on the old pattern.

### What changed and why

**Before:** contact data was split/duplicated — `siteData.address` held a string
(which drifted: "Place" vs "Pl"), phone lived in the collection, and each
contact entry overloaded the generic `description` field to hold its *value*
(`description: "7323513518"`). Schema country codes lived in a `businessData.schema`
block on siteData.

**After:** the **`contact-us` collection is the single source of truth** for all
contact + address facts. `siteData` holds no contact data.

### The new contact-us schema (`src/content.config.ts`)

```ts
"contact-us": defineCollection({
  loader: FileLoad("contact-us", "contact-us.json"),
  schema: ({ image }) =>
    baseSchema({ image }).extend({
      value: z.string().optional(),          // ← the contact value (NEW canonical field)
      linkPrefix: z.string().optional(),
      url: z.string().optional(),
      // Structured address parts (on the address entry) — schema.org PostalAddress:
      streetAddress: z.string().optional(),
      addressLocality: z.string().optional(),
      addressRegion: z.string().optional(),
      postalCode: z.string().optional(),
      addressCountry: z.string().optional(),
      // Phone country dialing code (on the phone entry), E.164 prefix w/o "+":
      phoneCountryCode: z.string().optional(),
    }),
}),
```

### The field-role change (the key migration)

| Field | Old role | New role |
|---|---|---|
| `value` | *(didn't exist)* | **the contact value** (phone digits, email, address string) |
| `description` | held the value (misused) | genuine optional subtext (e.g. hours); usually omitted |
| `title` | heading ("Call Us") | unchanged |
| `tags` | type id (`["phone"]`) | unchanged — still how consumers/schema find entries |

### Example `contact-us.json`

```json
[
  {
    "id": "phone",
    "title": "Call Us",
    "value": "7323513518",
    "icon": "lu:phone",
    "tags": ["phone"],
    "linkPrefix": "tel:",
    "phoneCountryCode": "1"
  },
  {
    "id": "address",
    "title": "Visit Us",
    "value": "20 Emerald Pl, Somerset, NJ 08873",
    "icon": "lu:map-pin",
    "tags": ["address"],
    "url": "https://maps.google.com/?q=...",
    "streetAddress": "20 Emerald Place",
    "addressLocality": "Somerset",
    "addressRegion": "NJ",
    "postalCode": "08873",
    "addressCountry": "US"
  }
]
```

### Resolution is centralized (non-breaking)

`src/utils/contactLinks.ts` → `normalizeContactLinks()` is the ONE place that
resolves the value: reads `value` and **falls back to `description`** so old
sites don't break. `ContactLink.value` is the value; `ContactLink.description`
is optional subtext. Every consumer (footer, legal pages, schema) uses this
normalized output.

### Consumers updated to read `value` (fallback `description`)

- `src/utils/schema/businessSchema.ts` (phone digits + address parts)
- `src/integrations/preferences/consent/ui/PrivacyPolicy/LegalContactSection.astro`
- `src/integrations/preferences/consent/ui/PrivacyPolicy/CCPARights.astro`

### Removed from `siteData.ts`

- `address` (duplicate/stale) — now from the collection.
- `businessData.schema` block (`countryCode`, `phoneCountryCode`) — country
  codes now live on the relevant contact entries.

**Port checklist:** add `value` + address-parts + `phoneCountryCode` to the
contact-us schema; move each entry's value from `description` → `value`; add
address parts to the address entry; delete `siteData.address` and repoint its
consumers to the collection; keep `normalizeContactLinks` reading `value ??
description` for a safe migration.

---

## 5. Cookie preferences in the footer Legal links

**What:** removed the "Reading Preferences" (accessibility) bottom-bar button and
moved "Cookie Preferences / Your Privacy Choices" into the footer's **Legal**
column (matching Griffin's Web Services, but vertical). The consent script +
cookie banner stay wired site-wide.

**Files:**
- `src/layouts/PreferencesLayout.astro` — added `showButtons` prop. Scripts +
  `CookieConsentBanner` always render; the visible button row is optional.
- `src/layouts/Footer.astro` — `PreferencesLayout showButtons={false}` (keeps
  scripts/banner), and `CookiePreferencesButton` rendered inline at the end of
  the Legal column.

---

## 6. Gallery collection + auto-scrolling marquee

**What:** a curated photo gallery (project + recurring images) as an
auto-scrolling marquee (like the testimonial carousel, no animation timeline),
baked into the "Why Choose Us" `StatsVariant` so it shows on homepage + about.

**Files:**
- `src/content.config.ts` — `gallery` collection (JSON-loaded, `baseSchema`,
  display-only).
- `src/content/gallery/gallery.json` + `_meta.mdx` — the curated image set;
  `featuredImage` = tile, `title` = alt.
- `src/components/GalleryMarquee.astro` — self-contained marquee (queries the
  gallery collection, CSS `translateX(-50%)` loop, pauses on hover,
  reduced-motion safe). Drop it anywhere with no props.
- `src/components/ContentRenderer/variants/StatsVariant.astro` — renders
  `<GalleryMarquee />` below the stats (prop `gallery={false}` to suppress).

---

## Media / video patterns (John's-specific, reusable)

- `src/components/Bands/Band.astro` — service-page content bands support
  `image`, `video`, `aspect` ("landscape" 4/3 | "portrait" 9/16 for phone-shot
  vertical clips).
- `src/components/Video/Video.tsx` + `TestimonialVideoCard.tsx` — the shared
  video system: poster-first lazy load; the card shows an overlay play button on
  load, then hands off to native controls once playing (`controls` toggles on
  first play).

---

## Files created/changed — quick index

**New shared components/utils:**
- `src/components/SectionHeading.astro`
- `src/components/JsonLd.astro`
- `src/components/GalleryMarquee.astro`
- `src/utils/schema/{business,breadcrumb,faq,review,service}Schema.ts`

**Modified core:**
- `src/layouts/SEO.astro` — business + breadcrumb graph, real logo, JsonLd
- `src/layouts/collections/ServiceLayout.astro` — Service schema + scoped FAQ band
- `src/layouts/PreferencesLayout.astro` — `showButtons` prop
- `src/layouts/Footer.astro` — cookie prefs in Legal, centered bottom bar
- `src/utils/contactLinks.ts` — `value` field resolution
- `src/content.config.ts` — contact-us (`value`, address parts), faq (`service`), gallery
- `src/content/siteData.ts` — `businessType`; removed `address` + schema block
- `src/content/contact-us/contact-us.json` — `value` + structured address

**Per-site knobs (what a new site actually edits):**
- `siteData.ts`: `title`, `legalName`, `businessType`, `url`, `description`, `tagline`
- `contact-us.json`: phone/address/email entries with `value` + address parts + country codes
- `service-areas.json`: the states served (drives `areaServed`)
- content collections: services, testimonials (with `rating`), faq, gallery, projects
- `SEO.astro`: the logo import → real brand logo
