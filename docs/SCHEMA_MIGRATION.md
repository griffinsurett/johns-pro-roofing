# John's Pro Roofing schema migration

2026-09-29. Inherits the committed Greastro runtime at `5257a3a`, including
canonical URLs, shared breadcrumbs, rendered FAQ answers and draft-safe AEO files.

## Integration decisions

- Business: RoofingContractor, John's Pro Roofing LLC. Charlie John is the
  user-confirmed founder in JSON authors. Author pages remain disabled.
- Address, phone, social links and three served states use their existing
  collections. No inferred offices, opening hours, credentials or star ratings.
- Eight services retain their MDX designs. ServicePageLayout declares Service
  and uses prepared page URLs/canonical metadata; ServiceLayout selects FAQ
  entries through the existing `related` query. Schema captures those exact
  rendered answers, not every FAQ on every page.
- “Free estimates available” does not mean the roofing/paving service is free.
  No fabricated zero-dollar Offer is emitted.
- Home and Services retain their CSS testimonial marquee; Testimonials retains
  its grid. The local map and card share testimonialExcerpt. Sixteen reviews per
  page are registered once, even though marquee cards repeat for animation.
  No per-review rating is shown on these cards, so schema omits Rating and
  AggregateRating. The existing 4.7/20 Google badge stays display-only and needs
  independent factual confirmation if edited; it is not a schema data source.
- Breadcrumbs use the shared navigation model: Home → Services → service.
  This site has no existing breadcrumb UI, so none was added. The reusable
  component is available for future UI using the same resolver.
- Unconfirmed HIC, insurance and warranty details now stay unset in siteData.
  Conditional service copy omits unfinished claims instead of rendering TODOs.
  The placeholder manufacturer certification is draft. Added its missing `_meta`
  page rules, removing two unintended placeholder/empty certification routes.
- Existing Formspree, consent/accessibility/language UI, Vercel analytics,
  assets and CTA destinations remain. Corrected the allowlist to record mounted
  integrations and allowed the already-approved Google Fonts stylesheet in CSP.
  No new integration, backend, Vercel protection setting or bypass credential.

## Verification

- Build completes: 20 schema-bearing pages and 15 HTML redirect stubs; 48 JSON-LD
  blocks, 19 breadcrumb lists, eight Service subjects, 102 FAQ occurrences across
  nine pages, and 48 Review occurrences across three pages.
- Six inherited unit tests pass. Typecheck: zero errors/warnings, 57 hints.
- Isolated staged release also builds, typechecks and passes every audit/test.
  All 20 page graphs match the working build; unrelated video work is excluded.
- Full schema/breadcrumb audits and site-specific assertions pass. They cover
  founder, address/phone, service areas, related FAQ membership, root canonical
  IDs, real breadcrumb destinations, review deduplication, absent default
  ratings/prices, missing draft routes, generated LLMs files and the font CSP.
- Six Schema.org samples report zero errors/warnings: home, FAQ, asphalt paving,
  flat roofing, testimonials and contact. Only public JSON-LD was submitted.
- All 35 retained HTML files preserve baseline links and images. Text changes
  are limited to omitting unconfirmed credential placeholders on eight services.
  The two removed routes are `/certifications` and `/certifications/todo-cert-1`.
- Browser interaction QA remains pending because computer/browser tooling is
  unavailable in this continuation. Check desktop/mobile navigation, service
  FAQs opening/closing, marquee hover/reduced motion, media playback, quote and
  contact form layout/context without submission, and preferences controls.
  Successful static and HTTP checks do not establish these interaction results.

```sh
npm run build
npm exec -- astro check
node --experimental-strip-types --test tests/*.test.mjs
python3 tests/schema-output.py .
python3 tests/breadcrumb-output.py .
python3 tests/site-schema.py
```

Non-fatal empty-collection and bundler notices are recorded, not suppressed.
Separate pending video-thumbnail integration, utility and generated thumbnail
changes are excluded from this release. Check an isolated staged build too.
The prior schema commit on the feature branch is an ancestor of the new main
release; this migration brings that incomplete implementation to the current
shared runtime before publication.

## Hosting

Vercel currently lists only `https://johns-pro-roofing.vercel.app` for this project.
`https://johnsproroofing.com` remains the intended canonical domain in siteDomain;
connecting the custom domain is a separate launch task. Authenticate verification
with the existing workspace helper. Never include keys in source, URLs or reports.
Deployment and live-check evidence belongs in `schema-validation/`.
