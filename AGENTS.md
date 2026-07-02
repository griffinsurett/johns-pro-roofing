# AGENTS.md — John's Pro Roofing

This is a **Project Mode** site built on **Greastro**. Greastro is the foundation, not the
brand. The brand is **John's Pro Roofing**.

> **Read the full Greastro ruleset first:** `../greastro/AGENTS.md`
> All architecture, mode rules, query/ContentRenderer conventions, styling tokens, and the
> "reuse before creating / customize in place" discipline live there. This file only adds
> what's specific to this project.

---

## What this project is

Local roofing company site for Somerset, New Jersey. Static, content-driven, built on the
Greastro systems (content collections → `query()` → `ContentRenderer` → variants/cards →
`@theme` design tokens). See the [SEO content strategy](SEO-CONTENT-STRATEGY.md).

## Where the brand lives — edit these, don't duplicate them

- **Site facts / CTA:** `src/content/siteData.ts` — title, legal name, tagline, description,
  address, Google reviews URL, and `ctaData` ("Request an Estimate" → `#quote-form`).
- **Business credentials:** `businessData` in `siteData.ts` — single source of truth for
  facts reused across page copy (HIC #, insurance, warranty). Some are `TODO:` placeholders;
  interpolate from here so every page updates at once — never copy-paste the values inline.
- **Brand color:** `src/styles/global.css` `@theme` → change `--color-primary` (one line; the
  50–950 scale auto-derives). Don't hand-edit derived steps.
- **Brand assets:** `src/assets/johns-pro-roofing/`.
- **Domain:** `src/content/siteDomain.js`.

## Project-specific content collections

Beyond the Greastro defaults, this site adds collections under `src/content/`:
`roofing`, `services`, `service-areas`, `certifications`, `selling-points`, `projects`,
`testimonials`, `faq`. Manufacturer certifications are the `certifications` collection —
**not** a field on `businessData`. Add/edit entries and `_meta.mdx`; render through
`ContentRenderer` with an existing variant before inventing a new display.

## Sanctioned third parties & endpoints

This is the **complete allowlist** of external services this site is allowed to touch.
Anything not here doesn't belong — see "the allowlist" rule in `../greastro/AGENTS.md` §3.5.
Plain footer/social links don't count as integrations.

| Service | Status | Purpose | How it's wired | Config |
|---|---|---|---|---|
| **Formspree** (`formspree.io`) | **active** | Quote + contact form submission | `src/utils/formspree.ts` | `PUBLIC_FORMSPREE_QUOTE_ID`, `PUBLIC_FORMSPREE_CONTACT_ID`, `PUBLIC_FORMSPREE_ID` |
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | **active** | Webfonts: Inter, Outfit, Saira Condensed | `<link>` in `src/pages/index.astro` | — |
| **Google Tag Manager** (`www.googletagmanager.com`) | **wired, off** | Analytics / tags | `src/integrations/analytics/GoogleTagManager.astro` → `IntHeadScripts.astro` | `PUBLIC_GTM_ID` (not set in `.env`) |
| **OneSignal** (`cdn.onesignal.com`) | **wired, off** | Web push | `src/integrations/onesignal/` | `PUBLIC_ONESIGNAL_APP_ID`, `PUBLIC_ONESIGNAL_SAFARI_WEB_ID` (both empty) |

"wired, off" = the Greastro integration exists but its env IDs are unset, so it doesn't
load. Activating one = filling its env var, not new code. No backend, no SSR, no runtime
content fetch, no CMS. If a new service is needed, get sign-off and add a row here in the
same change.

### The CSP is the enforcement layer — keep it in sync with this list

`vercel.json` ships a strict **Content-Security-Policy** (`default-src 'none'`, plus
explicit `script-src` / `connect-src` / `form-action` / `font-src` / `img-src` / `frame-src`
allowances). This is what *actually* blocks an unsanctioned third party at the browser, so it
is the source of truth that must agree with the allowlist above:

- Currently whitelisted by the CSP: **Formspree** (`connect-src`, `form-action`),
  **Google Translate** hosts (`script-src`/`style-src`/`frame-src`/`connect-src`),
  **Google Fonts** (`fonts.gstatic.com`, `www.gstatic.com`). Note `formspree.io` and the
  Translate hosts appear in the CSP but are easy to miss in the table — Google Translate is
  part of the Greastro preferences/language UI.
- **GTM and OneSignal hosts are NOT in the CSP.** If either is ever activated (its env IDs
  filled), its hosts must be added to the CSP or the browser will block it. Flag this if you
  enable them.
- **Adding any new third party means editing the CSP too** — in the same change as the
  allowlist row. A service in the table but not the CSP will silently fail in production.

### Commands

- `npm run dev` — local dev server
- `npm run build` / `npm run preview` — production build / preview the build
- `npm run generate:icons` — **run after adding/removing icons**; regenerates the icon map
  (`src/integrations/icons/`). Don't hand-edit the generated map.

### Project docs — read before related work

- `SEO-CONTENT-STRATEGY.md` — SEO/content plan; consult before page-copy or metadata work.
- `color-theory.md` — **binding** design rule: strict **60-30-10** palette with
  `--color-canvas-*` tokens. Respect these proportions; don't introduce ad-hoc colors.
- `MAINTENANCE.md` — upkeep/dependency guidance.
- `ASTRO-6-MIGRATION.md` — Astro 6 migration notes/gotchas.
- SEO/meta lives in `src/layouts/SEO.astro` (+ `HeadTags.astro`); page shell in
  `BaseLayout.astro`; heroes in `FrontPageHero*.astro` / `SecondaryHero.astro`.

### START OF EVERY CHAT — third-party / exposure audit

Before doing the requested work in a new session, run a quick audit of this project against
the allowlist above and report anything that doesn't match. Check both directions:

**Reaching OUT (the site contacting the outside):**
- External `<script src>`, `<link>`, `<iframe>`, or embed pointing at a non-listed host.
- `fetch()` / `axios` / SDK calls, or any build-time/runtime data load from an external API.
- New hosts in the code that aren't in the allowlist. Quick sweep:
  - `grep -rhoiE "https?://[a-z0-9.-]+" src` → compare hosts to the table (ignore plain
    footer/social links and `schema.org`/`w3.org`; Google Translate hosts are legitimate —
    Greastro language UI).
  - `grep -rniE "fetch\(|axios|createClient|new .*Client|\.env|import\.meta\.env" src`
  - Diff `.env` keys against the table; flag any **non-`PUBLIC_` (secret)** var, or any new
    `PUBLIC_*` service key not represented above.
  - **Cross-check `vercel.json` CSP ↔ the allowlist:** any host in `script-src` /
    `connect-src` / `form-action` / `frame-src` / `img-src` / `font-src` that isn't a known
    sanctioned service is a red flag; any table service missing from the CSP will break in
    prod. They must agree.

**Letting the OUTSIDE in (something accessing or seeing inside):**
- Secrets exposed to the client: any private key/token referenced in client-side code, or a
  secret accidentally named `PUBLIC_*`. (This site should have **no** server secrets at all.)
- `output` flipped off `'static'`, an SSR adapter added, or a server route / API endpoint
  (`src/pages/api/*`, `prerender = false`) — all of which open an inbound surface.
- New trackers/pixels/analytics/chat widgets/cookies beyond the listed GTM.
- Anything reading visitor data and sending it somewhere not listed.

If everything matches the allowlist, say so in one line and proceed. If anything is off,
**flag it before continuing** — it's either drift to remove or a real integration the list
forgot to record (then update the table). Don't silently work around a mismatch.

## Reminders specific to staying on-rails here

- Don't reintroduce greastro starter copy/placeholder content — replace in place.
- Don't hardcode service/area/testimonial arrays; they're collections.
- Keep it static (build stays `output: 'static'`) — no custom backend, server routes, or
  runtime fetching for site content. Third-party services that are already wired in are fine:
  **Formspree** for forms (`src/utils/formspree.ts`, `PUBLIC_FORMSPREE_*`), GTM analytics,
  and OneSignal push. See §3.5 of `../greastro/AGENTS.md`.
- The quote form is the primary conversion (`#quote-form`, posts to Formspree); keep CTAs
  pointed at it.
