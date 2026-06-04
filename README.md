# Hackcessible — Cohort 2026 website

A multi-page public showcase for **Hackcessible**, a clinical-engineering programme hosted by the **Centre for Innovation in Medical Education (CIME)** at **Aga Khan University (AKU)**, Nairobi. Built from the Hackcessible design system (warm brutalist-editorial: cream paper, deep forest green, electric lime, ultra-heavy Plus Jakarta Sans).

## Pages
| File | Purpose |
|---|---|
| `index.html` | **Home** — decluttered and visual. One big statement, the three headline numbers, and a grid of tiles that act as doors into the detail pages. |
| `model.html` | **The model** — how Hackcessible works, the host/partner cards, and the four cross-cohort lessons. |
| `groups.html` | **Groups** — TimeKeeper and Sawa hero cards plus an interactive case-study switcher (one layout, two datasets). |
| `people.html` | **People** — the rotating participant carousel and a consent-gated credit grid. |
| `contact.html` | **Contact** — one inbox, two routes: **Sponsor** and **Apply**, toggled in place. Caters for both audiences. |

## Shared chrome
- `styles.css` — design tokens (light **and** dark themes), the liquid-glass pill nav, and every component style.
- `site.js` — injects the nav + footer on every page and wires the toggles.
- `fonts/` — self-hosted Plus Jakarta Sans (variable, upright + italic). Fraunces loads from Google Fonts.

## The "liquid glass" nav
A floating, Apple-style pill fixed to the top of every page:
- **Translucent glass** — `backdrop-filter: blur + saturate`, a top specular sheen, and a hairline highlight.
- **Changes once you toggle** — a sun/moon button flips the whole site between light and dark; the glass and accents morph with it. Preference is saved to `localStorage`.
- **Changes on scroll** — past the top, the pill tightens, gains opacity and lifts.
- **Mobile** — collapses to a menu button; the links drop down as a second glass pill.

## Run
No build step. Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```
then visit http://localhost:8000

## Accessibility
Skip link, semantic landmarks, visible focus, keyboard-operable toggles, `prefers-reduced-motion` honoured (marquee + carousel stop), WCAG 2.1 AA contrast targets. Participant photos stay consent-gated — initials placeholders ship until written consent and crops are ready.
