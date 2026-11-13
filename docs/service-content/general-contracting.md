# General Contracting: content document

**Status:** Draft 2, built for review

## Page brief

- **Tier:** 3, with its own unique layout allowed.
- **Audience:** Half commercial, half residential. This is the one service page where both
  audiences meet. Both are written into one page: a side-by-side comparison of how a job runs
  for each, then one list of work for each.
- **Job of the page:** Win general contracting work from businesses, property managers and
  homeowners who want one company to run a multi-trade project.
- **Allowed mentions:** Home remodeling, home additions and home extensions, all three, linked
  to their standalone pages. The links come from data: a card links only when it names a real
  service page, and roofing is never in the list.
- **Not on this page:** Roofing in any form (including photos), parking lot work, decks.
- **HOA work:** on this page as of 2026-11-12. The handoff said to ask before HOA services
  appear anywhere; Griffin approved it here (client still to confirm). Still not on the homepage
  and still no separate HOA page.
- **URL:** `/services/general-contractors` (matches the primary search term, "general contractors nj").

### Search terms this page targets

Primary: general contractor nj, general contractors nj.
Secondary: commercial general contractor nj, residential general contractor nj, general
contractor near me, tenant improvement contractor nj, commercial renovation contractor nj,
office renovation contractor nj, medical office build-out nj, hoa contractor nj.
Questions people ask (used in the FAQ): do I need a general contractor, can a general
contractor pull permits, are general contractors licensed, how long does a project take.

### SEO

- **Meta title:** General Contractor in NJ | Commercial & Residential | John's Pro Roofing
- **Meta description:** Commercial and residential general contractor in New Jersey. One
  company to plan, schedule and manage your project from estimate to final walkthrough. Free
  estimates.

### How the page is put together

Each section says something no other section says:

1. Hero with the callback form, highlights strip at the bottom
2. What a general contractor actually does
3. Who we build for (red band, shared "Who we serve" list)
4. What we take on (commercial card grid, then the two home pages as side-by-side cards listing
   their jobs, then a full-width closing card; Commercial / Residential tabs, Commercial first)
5. Reviews carousel (the homepage's navy review cards; this page's reviews, else the featured set)
6. Commercial or home project? (comparison: scheduling and updates, as two navy gradient cards on
   white, neither emphasized)
7. How a project with us runs (red photo band)
8. What affects the cost of a project
9. Detailed form with reviews (red, so it never sits directly under the red process band)
10. FAQ
11. Closing banner

---

## What this page lists

Every item needs the client's confirmation before it goes live. Unconfirmed items carry
`confirmed: false` in the page frontmatter; nothing is shown on the page.

### Commercial work

Accessibility (ADA) work and code-violation repairs are off the page for now: they carry legal
expectations, so they wait for Charlie's answers (see client-questions.md).

| Item | Short description | Confirm |
| --- | --- | --- |
| Commercial construction | New commercial buildings and additions to existing ones | [CONFIRM: Griffin thinks yes] |
| Tenant improvements and build-outs | Getting a space ready for a new tenant, from bare walls to move-in | [CONFIRM] |
| Office renovations | New layouts and finishes while the business keeps running | [CONFIRM] |
| Restaurant and retail fit-outs | Storefronts, customer areas and back-of-house space | [CONFIRM] |
| Medical and dental office build-outs | Exam rooms and plumbing-heavy layouts for medical and dental tenants | [CONFIRM] |
| Commercial interior renovations | Common areas, restrooms, break rooms and the rooms people use every day | [CONFIRM] |
| Interior finishes | Drywall, ceilings, flooring and paint for commercial spaces | [CONFIRM] |
| Warehouse and industrial improvements | Offices, loading areas and upgrades inside working buildings | [CONFIRM] |
| Apartment and multifamily renovations | Unit turnovers and upgrades for property managers | [CONFIRM] |
| HOA and community association work | Clubhouses, common areas, building exteriors and repairs across the community | [CONFIRM: Griffin thinks yes] |
| Church renovations | Sanctuaries, fellowship halls and the rest of the building | [CONFIRM] |
| Building repairs | Fixing damage and wear before it turns into a bigger problem | [CONFIRM] |
| Vacancy make-ready | Getting an empty commercial space ready to show and lease | [CONFIRM] |
| Exterior repairs and upgrades | Siding, doors, windows and the parts of a building people see first | [CONFIRM] |
| Interior demolition and site prep | Clearing a space out so the new work starts on a clean slate | [CONFIRM] |

### Home projects

| Item | Short description | Links to | Confirm |
| --- | --- | --- | --- |
| Home remodeling | New life for the rooms you already have | → Home Remodeling | [CONFIRM] |
| Home additions and extensions | More space, built onto the house or pushed out from a room you have | → Home Additions & Extensions | [CONFIRM] |

Layout: the commercial cards fill the grid. Under them, the two linked cards sit side by side as
navy gradient cards with white text and a white "Learn more" button, each listing every job from that page's own list (it comes from the linked page, so editing that page
updates the card; nothing to copy here). "Projects that cross the lines" closes the list at full
width (`wide: true`).

Commercial card photos: each commercial item can take an `image` (a job photo in `src/assets/`),
shown edge to edge on top of the card. Add them to all commercial cards in one go: a row where only
some cards have photos leaves the others with empty space. The home cards don't take photos.
| Projects that cross the lines | An addition with a new kitchen, or a whole-floor layout change | No link (this page only; shows under every filter) | [CONFIRM] |

---

## Page copy

### Hero

**Eyebrow:** Commercial & Residential

**H1:** General Contractor in New Jersey

**Subheading:** One company to plan the job, run the crews and answer for the result. We take
on commercial projects and home projects across New Jersey.

`[PHOTO: commercial or mixed job site with the crew working. Not a roofing photo.]`

### Highlights strip

Commercial Construction · Commercial Renovations · Tenant Build-Outs · HOA & Community Work · Home
Remodeling · Home Additions & Extensions · One Point of Contact · We Pull the Permits · Free
Estimates

### Top form: request a call back

**Form heading:** Get a call back

**Fields**
- Name
- Phone
- What's the project? (Commercial / HOA or community / Home / Not sure yet). Same answers as the
  detailed form, so the filter can prefill both.
- Consent checkbox
- Button: **Request a Call Back**

---

### What a general contractor actually does

Photo: `src/assets/john-outside.png` (John in a branded work shirt outside a home; no roofing in frame).

Almost every building project needs more than one trade. There's demolition, framing,
electrical, plumbing, drywall and finish work, and they have to happen in the right order.
Get the order wrong and crews end up waiting on each other, or tearing out work that's already
done.

A general contractor owns that whole sequence. We plan the job, schedule every trade, order
materials, keep the site safe, pull the permits and schedule the inspections.

When a job's split between five separate contractors and something goes wrong, everyone points
at someone else. With us there's nobody else to point at. You've got one company responsible
for the schedule, the budget and the finished work, and one number to call.

---

### Who we build for

Shown in the red "Who we serve" band from the homepage (the shared `who-we-serve` list), with this
page's own heading:

**Eyebrow:** Who we build for
**Heading:** Commercial properties and communities
**Line:** From a single office to a whole HOA community, we work with the people responsible for
keeping buildings in shape. Homeowners, see home projects below.

**Numbered list (from the shared list):** Property managers · Facility managers · Building owners ·
Warehouse owners · Industrial parks · Shopping centers · HOAs · Churches · Medical buildings

---

### Commercial or home project? Here's how we run each.

The way we build is the same. What changes is what we plan around. (Who we work with is the
section above, so it isn't repeated here.)

| | Commercial | Home |
| --- | --- | --- |
| **How we schedule** | Around how your building runs, staged so entrances stay open and tenants and customers can still get in. `[CONFIRM: after-hours or weekend work]` | Around your household, with notice of which rooms are affected and when. |
| **How we keep you informed** | A written scope and cost you can take to ownership or a board, and updates as the work moves. | A weekly update on what's happening and what's next, and one person to call with questions. |

---

### What we take on

One card list holding both tables above, with two tabs: Commercial (selected when the page opens)
and Residential. No "All" option. Each has its own link (`#commercial`, `#home`) for ads and
emails. Picking one fills in "What kind of project is it?" on both forms; the preselected tab
doesn't. "Projects that cross the lines" shows under both. The home remodeling and home additions and extensions cards link to their own pages.

---

### What affects the cost of a project

Photo (left): `src/assets/john-w-client.webp`, John with a homeowner. The homeowner is holding a
shingle sample board; swap for a general contracting photo when one arrives.

- How much work is involved, and how many trades it takes
- Permits, inspections and any engineering the job needs
- Working in an occupied building, around tenants, customers or your family
- What's behind the walls once they're opened up
- The materials and finishes you choose

You'll get a written scope and price after your free estimate, before anything starts.

---

### How a project with us runs

Shown in the red photo band: "How it works" label, the heading, and one numbered step per line.

1. **Free estimate.** We walk the site with you and listen to what you need.
2. **Scope and cost in writing.** You see what's included, and what it costs, before anything starts.
3. **Permits and scheduling.** We pull the permits and schedule the inspections, then line up the trades in the right order around your business or your household.
4. **Construction.** We run the crews and the materials, and you hear from us as the work moves.
5. **Final walkthrough.** We go through the finished work with you and leave the site clean.

`[CONFIRM: credentials line, shown only once confirmed. NJ HIC registration #____. Licensed and insured. Warranty terms.]`

---

### Detailed form

**Heading:** Planning a *project?*
**Line:** Tell us what you're building. We'll come out, take a look and give you a free estimate.

Reviews scroll beside the form: reviews written about this service, or the site's featured
reviews (general reviews that don't mention roofing) until there are some.

**Form heading:** Tell us about your project
**Intro line:** The more you tell us, the more useful our first conversation will be.

**Fields**
- First name, last name
- Phone
- Email
- Address
- What kind of project is it? (Commercial / HOA or community / Home)
- What kind of property is it? (Office / Retail or restaurant / Medical or dental office /
  Warehouse or industrial / Apartment or multifamily / HOA or community / Church / House /
  Something else)
- Is it a new building, or work on an existing one? (Work on an existing building / New
  construction or an addition / Not sure yet)
- When do you want to start? (As soon as possible / In 1 to 3 months / In 3 to 6 months / Just planning)
- Tell us about the project (free text)
- Consent checkbox
- Button: **Send My Project Details**

`[CONFIRM: does the client want a budget range question?]`

---

### FAQ

Questions the page already answers in its own sections (both audiences, how pricing works) aren't
repeated here.

**Do I need a general contractor for my project?**
If your project needs more than one trade, it usually makes sense. Anything that involves
framing plus electrical or plumbing, or moves walls, or needs permits and inspections, goes
more smoothly with one company running it. If it's a single small repair, you may not need one,
and we'll tell you that.

**Do you handle permits?**
Yes. We always pull the permits for the work we do and schedule the inspections, so you don't
have to deal with the township yourself.

**How long will my project take?**
It depends on the size of the job and whether permits are involved. You'll get a schedule with
your estimate, and we'll keep you updated if anything changes it.

**Are you licensed and insured?** *(stays off the page until confirmed)*
`[CONFIRM before publishing]` Yes. We're a registered New Jersey Home Improvement Contractor
(#____) and carry ____ insurance. We're happy to send proof before work starts.

---

### Pre-footer banner

**Heading:** One contractor, *start* to finish.
**Line:** Free estimates on commercial and home projects across New Jersey.
**Numbered points (steps to get started):** 1. Request your free estimate. 2. We come out and look
at the job. 3. You get a clear, written price.
**Buttons:** Request an Estimate (to the form) and the phone number.

---

## Questions for the client (this page)

These are also in the question list sent to Charlie.

1. Confirm or cut each commercial item. Griffin believes he does HOA work and commercial
   buildings; please confirm both, and whether "commercial buildings" includes ground-up new
   construction.
2. Does he do after-hours or weekend work for commercial clients?
3. Should deck building be listed as a home project here?
4. Does he work with architects and engineers, or help with plans?
5. Can he provide a certificate of insurance naming a property manager or landlord?
6. Own crews or subcontractors? How do payments work?
7. Does he want a budget range question on the detailed form?
8. A commercial project he'd like described here, with the client's permission?
