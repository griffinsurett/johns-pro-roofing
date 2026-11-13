# Service page content: review packet

These are the content documents for the four new service pages. They're written from the
project handoff, not from the pages currently in `src/content/services/`. Those pages will be
rebuilt from these documents once the copy is approved.

| Page | Document | Status |
| --- | --- | --- |
| General Contracting | [general-contracting.md](general-contracting.md) | Draft 1, awaiting review |
| Home Remodeling | [home-remodeling.md](home-remodeling.md) | Draft 1, awaiting review |
| Home Additions & Extensions | [home-additions-and-extensions.md](home-additions-and-extensions.md) | Draft 1, awaiting review |
| Deck Building | [deck-building.md](deck-building.md) | Draft 2, built for review |

## The process

1. **Draft** (this packet). Copy, offerings lists, FAQs, form fields and photo slots.
2. **Review.** Griffin and the client read each document, confirm or cut every `[CONFIRM]`
   item, and edit the copy.
3. **Approve.** A page's status changes to *Approved*. From then on its document is the single
   source of truth.
4. **Build.** Only approved pages get layout and UI work, and the build follows the document.
   Design doesn't rewrite approved copy.

No UI or UX decisions are made in these documents. Section order is the reading order the copy
was written for, nothing more.

## How to read the markers

- **`[CONFIRM: ...]`** A fact, claim or offering we need the client to verify. Nothing marked
  this way goes live until it's confirmed or removed.
- **`[PHOTO: ...]`** A spot that needs a real Johns Pro Roofing job photo. Every slot lists
  what the photo should show.
- **`→ /services/...`** A link to another service page. Links only appear where the handoff
  allows them (see below).

## What's listed, at a glance

This is the full inventory the four pages would put in front of visitors. Every item is a
proposal until the client confirms he actually does that work.

| Page | Offerings listed |
| --- | --- |
| General Contracting (commercial) | Commercial construction; tenant improvements and build-outs; office renovations; restaurant and retail fit-outs; medical and dental build-outs; commercial interior renovations; interior finishes; warehouse and industrial improvements; apartment and multifamily renovations; HOA and community association work; church renovations; building repairs; vacancy make-ready; exterior repairs and upgrades; interior demolition and site prep |
| General Contracting (residential) | Home remodeling →; home additions and extensions → (side-by-side cards, each listing every job on that page); multi-trade home projects |
| Home Remodeling | Kitchen remodeling; bathroom remodeling; primary suite remodeling; interior renovations and flooring; whole-home and full-unit renovations; basement finishing; attic conversions; garage conversions; laundry and mudroom remodeling; custom built-ins and trim carpentry; repairs after water or fire damage; renovations before you sell; rental turnovers. Each item is labeled houses / townhouses / condos, with a property-type filter and a comparison of what changes for each. |
| Home Additions & Extensions | Room additions; primary suite additions; second-story additions; kitchen and room extensions (bump-outs); in-law suites; sunrooms and four-season rooms; garage additions; dormers; two-story additions; bathroom additions; mudroom and entryway additions; porch enclosures; front porch and portico additions; ADUs; modular and prefab additions |
| Deck Building | New custom decks; multi-level decks; pool decks; covered decks and pergolas; deck replacement; deck repair and resurfacing; railings and stairs; built-ins and lighting; deck staining and sealing; deck safety inspections. Materials (composite, pressure-treated wood) are a side-by-side comparison, not cards. |

Each page also shows its own list in the copy, near the top, so a visitor can see everything
that service covers.

## Web addresses

There's no live site, so each address is chosen on search value alone:

| Page | Address |
| --- | --- |
| General Contracting | `/services/general-contractors` |
| Home Remodeling | `/services/home-remodeling` |
| Home Additions & Extensions | `/services/home-additions-and-extensions` |
| Deck Building | `/services/deck-builders` |

## Decisions changed from the handoff

- **HOA work (2026-11-12):** the handoff said to ask before HOA services appear anywhere. Griffin
  approved HOA work on the general contracting page only (client still to confirm). Not on the
  homepage, and still no separate HOA page. (HOA decision)

## Cross-mentions and links

| From | May mention and link to | Never links to |
| --- | --- | --- |
| General Contracting | Home Remodeling, Home Additions & Extensions (card links, from data) | Any roofing page, parking lot, decks |
| Home Remodeling | Home Additions & Extensions (one line) | Any roofing page, parking lot, decks |
| Home Additions & Extensions | Home Remodeling (one line) | Any roofing page, parking lot, decks |
| Deck Building | Nothing | Everything |

None of the four pages pitch roofing. The additions page describes how the new roof gets tied
into the house, because that's part of building an addition, but it doesn't advertise roofing
services or link to them.

When these pages are built, the linked items come from data: each page's content lists the
other services it offers, and an item links only when it matches a standalone service page.
Roofing is never in those lists, so the no-roofing-links rule is enforced by the content itself.

## Photo mapping

Every photo slot across the four pages. The client's photos aren't in the repo yet, so every
slot is open. When photos arrive, fill in the file name and confirm the job matches the service.

| Page | Slot | What it should show | File | Confirmed |
| --- | --- | --- | --- | --- |
| General Contracting | Hero | A commercial or mixed job site with the crew working | | |
| General Contracting | Intro (What a general contractor does) | John or the crew, not on a roof | `src/assets/john-outside.png` | Existing site photo |
| General Contracting | Cost section | John with a client | `src/assets/john-w-client.webp` | Existing site photo (shingle board in frame) |
| General Contracting | Commercial section | Finished commercial interior or exterior work | | |
| General Contracting | Residential section | A home project in progress | | |
| Home Remodeling | Intro | A finished kitchen or bathroom | | |
| Home Remodeling | Project gallery | Before-and-after pairs from remodeling jobs (kitchens, baths, basements) | | |
| Home Additions & Extensions | Hero | A finished addition seen from outside | | |
| Home Additions & Extensions | Under construction | Framing or foundation of an addition | | |
| Home Additions & Extensions | Finished interior | Inside the new space | | |
| Deck Building | Intro | A finished deck | `src/assets/decks/composite-deck-dusk.png` | Client-supplied |
| Deck Building | Structure | Framing, footings or ledger during a build | | |
| Deck Building | Project gallery | Before-and-after pairs from deck jobs | | |

`src/assets/decks.jpg` is in the repo already. Before it's used, confirm it's a Johns Pro
Roofing job and not a stock image.

### Client media received (2026-11-12)

From `~/Downloads/johns pro november`, renamed by service. Nothing here is on the site yet.

| File | Shows | Service | Notes | Original name |
| --- | --- | --- | --- | --- |
| `deck-builders_covered-deck-stone-tv-wall.heic` | Covered deck: gray composite, white railings, pine ceiling, fan, stone TV wall | Deck building | Best photo in the set. Only 450×600: ask for the original | `IMG_9078.heic` |
| `deck-builders_covered-deck-walkthrough.mp4` | 34s walkthrough of the same covered deck, inside and out | Deck building | Full quality | `63EABD08-09CC-4E24-9ED5-B6DFC28FCC9A.mp4` |
| `deck-builders_composite-deck-wraparound-steps.heic` | Gray composite deck, white railings, wraparound steps, crew on site | Deck building | Full resolution. Looks downloaded from a web listing: confirm it's his job | `photo-741_singular_display_fullPicture.heic` |
| `deck-builders_composite-deck-dusk.png` | Brown composite deck at dusk, step lights, staged furniture | Deck building | Possibly AI-generated, but the client sent it: approved for use. **On the deck page intro.** In repo as `src/assets/decks/composite-deck-dusk.png` | `95A186E2-BB04-4BC7-8938-44CA7299A4ED.PNG` |
| `residential-roofing_tear-off-two-story-house.heic` | Two-story house mid tear-off, new sheathing, GAF shingles | Residential roofing | 450×600: ask for the original | `IMG_7397.heic` |
| `residential-roofing_chimney-flashing.heic` | Brick chimney with new flashing on a shingle roof | Residential roofing | 450×600: ask for the original | `IMG_4317.heic` |
| `residential-roofing_chimney-repointing.mp4` | 13s close-up of a repointed chimney with new flashing | Residential roofing | Different chimney from the photo above | `IMG_4313.mp4` |
| `residential-roofing_tile-roof-crew-balcony.png` | Crew on the balcony of a stucco house with a tile roof | Residential roofing | 600×338 screenshot: low resolution | `2026-08-27-11-23-37-954.PNG` |
| `unassigned_paver-patio-pergola.heic` | Paver patio, curved steps, pergola, outdoor fireplace | None yet | Matches no page. Ask what job this was. 450×600 | `IMG_7843.heic` |

Candidates for open slots: the covered deck photo and walkthrough fit the deck page's intro slot
(and the covered decks card). Still nothing for remodeling, additions or general contracting.

## Forms

**Top form (every page, beside the hero):** name, phone, what they need, submit. The "what they
need" options are set per page and listed in each document. It's a callback request, so the
button says so.

**Bottom form (every page):** the detailed form. Its fields are set per page and listed in each
document. It's the second chance for visitors who've read the page and want to tell us more.

Both forms post to Formspree. The top form uses the new quick quote form (ID pending).

## Questions for the client

The full, send-ready list for Charlie lives in [client-questions.md](client-questions.md). Keep it
current: add new questions there and remove ones he answers.

The ones below apply to all four pages (also in that list).

These apply to all four pages. Page-specific questions are at the end of each document.

1. What's the NJ Home Improvement Contractor registration number? It'll go on every residential page.
2. Is the company fully licensed and insured for this work, and is there a workmanship warranty? If so, what are its terms?
3. Is financing offered on these services? If yes, through whom and on what terms?
4. ~~Permits~~ Confirmed 2026-11-12: John's Pro Roofing always pulls the permits and schedules the inspections. Every page says so.
5. Which parts of the work does his own crew do, and which go to licensed subcontractors (electrical, plumbing, HVAC)?
6. How quickly does someone call back after a form submission? We'd like to state it under the top form.
7. Are there Google reviews from customers on remodeling, additions, decks or contracting jobs? Until there are, each page shows the featured reviews (the five general reviews that don't mention roofing).
8. Which parts of New Jersey does he take these jobs in? Is it the same area as roofing?
