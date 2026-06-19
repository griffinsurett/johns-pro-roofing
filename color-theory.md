# John's Pro Roofing — Color Theory

## Rule: 60-30-10

This website strictly follows the 60-30-10 color rule. Every design decision must respect these proportions.

---

## 60% — Canvas (Backgrounds)

| Variable | Hex | Usage |
|---|---|---|
| `--color-canvas-primary` | `#ffffff` | Main page background |
| `--color-canvas-secondary` | `#f4f6f9` | Alternate section backgrounds |
| `--color-canvas-tertiary` | `#edf2f7` | Deeper grey, tertiary backgrounds |

---

## 30% — Navy Blue (Structure & Typography)

| Variable | Hex | Usage |
|---|---|---|
| `--color-brand-navy` | `#0b2545` | All headings, nav background, footer, dark sections |
| `--color-brand-navy-light` | `#134074` | Tags, borders, lighter navy accents |
| `--color-brand-navy-dark` | `#051830` | Hover states on navy elements |
| `--color-text-body` | `#2d3748` | All body text / paragraphs |
| `--color-text-muted` | `#718096` | Descriptions, captions, muted labels |
| `--color-border` | `#e2e8f0` | Dividers, card borders, separator lines |

---

## 10% — Accent Red (CTAs Only)

| Variable | Hex | Usage |
|---|---|---|
| `--color-accent-red` | `#c8102e` | CTA buttons, active nav states, key labels, highlights |
| `--color-accent-red-hover` | `#a60c23` | Hover state on red elements |
| `--color-accent-red-light` | `#fbebee` | Soft red for pill/badge backgrounds |

---

## Shadows (Navy-tinted, never black)

| Variable | Value |
|---|---|
| `--shadow-sm` | `0 2px 4px rgba(5, 24, 48, 0.04)` |
| `--shadow-md` | `0 10px 20px rgba(5, 24, 48, 0.06)` |
| `--shadow-lg` | `0 20px 40px rgba(5, 24, 48, 0.12)` |
| `--shadow-premium` | `0 25px 50px -12px rgba(11, 37, 69, 0.15)` |

---

## Typography

| Variable | Value |
|---|---|
| `--font-family-headings` | `'Outfit', sans-serif` |
| `--font-family-body` | `'Inter', sans-serif` |

---

## Hard Rules

1. **Backgrounds are always white or off-white.** Never use navy or red as a full-page background.
2. **Headings and structural elements are always navy.** Never use black (`#000000`) for text.
3. **Red is used ONLY for CTAs and accent highlights.** Never use red for backgrounds, body text, or decorative elements.
4. **No blue, purple, green, or any other color exists on this website.** If a component renders in any other color, it is wrong and must be fixed.
5. **Button text on a red button is always white (`#ffffff`).** Never dark or navy.
6. **Shadows are tinted navy** — never use plain `rgba(0,0,0,x)` black shadows.
7. **Borders use `--color-border` (`#e2e8f0`) only.** Never use navy or red as a border color except for deliberate accent borders (e.g. active state underlines).

---

## Quick Reference: What color goes where?

| Element | Color |
|---|---|
| Page background | `--color-canvas-primary` (white) |
| Section alternate background | `--color-canvas-secondary` (off-white) |
| All headings (h1–h6) | `--color-brand-navy` |
| Body / paragraph text | `--color-text-body` |
| Muted / helper text | `--color-text-muted` |
| Navigation background | `--color-brand-navy` |
| Navigation text | `--color-canvas-primary` (white) |
| Footer background | `--color-accent-red` |
| Footer text | `--color-canvas-primary` (white) |
| Primary CTA button | `--color-accent-red` background, white text |
| Hover on CTA button | `--color-accent-red-hover` background |
| Active nav item | `--color-accent-red` |
| Card / section borders | `--color-border` |
| Stat numbers / emphasis | `--color-brand-navy` or `--color-accent-red` |
