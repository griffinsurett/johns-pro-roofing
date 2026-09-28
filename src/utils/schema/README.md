# Structured data (schema.org)

Components say what they render. One resolver turns that into JSON-LD. Your
content supplies the facts. A new site doesn't write schema code.

## Setting up a site

1. **`siteData.ts`**: `schemaType` (for example `"LocalBusiness"`,
   `"RoofingContractor"` or `"OnlineBusiness"`), `currency`, and optionally
   `founder` (an `authors` id), `foundingDate` and `parentUrl` (for
   multi-site brands). The company name is `legalName`.
2. **Collections**: `contact-us` (phone, email, address, and `hours` on
   whichever entry holds them), `social-media` (links become `sameAs`),
   `authors` (people), and `service-areas` (local businesses).
3. **That's it**, unless your content uses different field names. For that,
   see [Overrides](#overrides).

## What emits what

| Schema | Emitted by | Built from |
|---|---|---|
| WebPage / BlogPosting, WebSite, business, people, BreadcrumbList | `SEO.astro`, every page | siteData, `contact-us`, `social-media`, `authors`, URL |
| Page subject: `service`, `course` or `product` | the layout: `resolveSubject(Astro, { kind, entry })`, then `<Schema node={subject} />` | the entry's fields |
| `faq` → FAQPage | `AccordionVariant` (default; pass `schema={false}` for a non-Q&A accordion) | the questions shown |
| `reviews` → Review + AggregateRating | `TestimonialVariant` | the testimonials shown, attached to the page subject if the layout set one, else the business |

```astro
---
// A layout whose page is about one item (e.g. ServiceLayout):
import Schema from "@/components/Schema.astro";
import { resolveSubject } from "@/utils/schema/resolve";
const subject = await resolveSubject(Astro, { kind: "service", entry });
---
<Schema node={subject} />

<!-- A component that shows a list: -->
<Schema kind="faq" items={items} />
```

Resolve the subject in the layout's **frontmatter**. It runs before the page's
sections render, so review sections below can see it.

## The pieces

| File | Holds |
|---|---|
| `kinds/`: `offerings.ts` (service, course, product), `sections.ts` (faq, reviews), `index.ts` (the registry) | one field map per kind: schema.org property → content field |
| `transforms.ts` | reusable value converters: `text`, `image`, `offer`, `date`, `person`, `business`, `serviceAreas`, `rating`, `url`, `language` |
| `resolve.ts` | applies the override layers and enforces the rules |
| `identity.ts` | business, people and website |
| `src/components/Schema.astro` | the component everything renders through |
| `src/content/schemaMap.ts` | this site's field mapping (layer 2) |

## Field maps

```ts
fields: {
  name:        { from: "title", as: "text" },         // field → transform
  serviceType: ["category", "title"],                 // first that has a value
  offers:      { from: ["price", "length"], as: "offer" },
  instructor:  { from: "instructor", as: "person", default: siteData.founder },
  provider:    { as: "business" },                    // no content field needed
  areaServed:  false,                                 // leave it out
  courseCode:  { value: "FAR" },                      // fixed value
  offers2:     { resolve: async (ctx) => … },         // compute it yourself
}
```

## Overrides

Four layers. Each one wins over the one before it:

1. **Kind defaults** in `kinds/`. These match Greastro's standard field names.
2. **Site map**: `src/content/schemaMap.ts`, for when this site's content
   differs:
   ```ts
   export const schemaMap: SchemaMap = {
     service: {
       offers: { from: ["cost", "billing"], as: "offer" }, // renamed fields
       award: { from: "certifications" },                  // new property
     },
   };
   ```
   The key `business` adjusts the site-wide business node the same way, for
   example to add `brand` for a multi-site company.
3. **Component props**:
   `<Schema kind="faq" items={items} map={{ answer: { from: "answerText" } }} extra={{ … }} />`
4. **Entry frontmatter**: a hand-set value for one page:
   ```yaml
   schema:
     name: "Emergency Roof Repair — 24/7"
   ```

## Rules no override can bend

- **Required fields.** A node missing a property Google requires is dropped
  with a `[schema]` build warning, instead of shipping broken markup.
- **Honest ratings.** `reviews.rating` can only be read from content. A fixed
  or default value is ignored with a warning. Keep `rating` optional in the
  collection schema, with no default.
- **One per page.** There's one FAQPage per page, and one review set per
  target. Duplicates are skipped.
- **Local vs online.** A local `schemaType` gets an address, hours and service
  area. An online type (`OnlineBusiness`, `OnlineStore`, `Organization`)
  doesn't. `EducationalOrganization` counts as a place in schema.org, so use
  `OnlineBusiness` for online education.
- **Everything links by `@id`** to the business, website and people. Nodes
  never repeat partial copies of each other.

## Extending

| To… | Do this |
|---|---|
| use a new content field | add a line to the kind's field map, or to `schemaMap.ts` for one site |
| handle a new kind of value (SKU, date range, duration…) | add a transform to `transforms.ts` |
| support a new schema type (Event, VideoObject, HowTo…) | add a kind file and list it in `kinds/index.ts` |
| give a new component schema | render `<Schema kind="…">` in it |

## Offers from price + length

| `length` | Offer |
|---|---|
| "Per Month", "Monthly", "Monthly Recurring" | subscription billed monthly (`UnitPriceSpecification`) |
| "15 Days of Access", "36 Months of Access" | one-time price with `eligibleDuration` |
| anything else | a plain price in `siteData.currency` |
