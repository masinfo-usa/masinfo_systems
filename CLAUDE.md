# Masinfo Systems — Claude Context

This file is read automatically by Claude Code at the start of every session.
It captures the full project state so work can resume on any machine.

---

## Project overview

Company website for **Masinfo Systems**, a web development agency owned by **Faisal M.**
Target market: US small businesses (restaurants, construction, dealerships, etc.)
Design philosophy: premium dark/gold, minimal, no clutter, no neon, no glow effects.

---

## Live deployment

| Layer | Service | URL |
|-------|---------|-----|
| Frontend | Cloudflare Pages | https://masinfosystems.com |
| Backend | Render (shared with mezquite_valley) | https://mezquite-valley-gyc6.onrender.com |
| Repo | GitHub | https://github.com/masinfo-usa/masinfo_systems |

**Cloudflare env var:** `VITE_API_URL=https://mezquite-valley-gyc6.onrender.com`

The `/api/contact` route lives inside the **mezquite_valley** Render server, not a separate deployment. The `masinfo_systems/backend/server.js` is kept locally for reference and future use.

---

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + React Router v6
- **Backend:** Node.js + Express (single `server.js` file, ESM imports)
- **Email:** Brevo transactional API (`BREVO_API_KEY` on Render)
- **Theme:** CSS custom properties (`var(--bg)`, etc.) toggled via `html.light` class

---

## Folder structure

```
masinfo_systems/
├── frontend/
│   ├── public/
│   │   ├── _redirects               ← React Router SPA fix for Cloudflare
│   │   ├── favicon.svg
│   │   └── images/projects/         ← portfolio screenshots go here
│   ├── src/
│   │   ├── context/ThemeContext.jsx  ← dark/light toggle, persists to localStorage
│   │   ├── components/
│   │   │   ├── layout/Header.jsx    ← glass nav, theme toggle, React Router Links
│   │   │   ├── sections/            ← Hero, About, Services, Portfolio, HowItWorks,
│   │   │   │                           Pricing, CTA, Contact
│   │   │   └── ui/                  ← Button, SectionWrapper, LabelPill, ServiceIcon
│   │   ├── pages/                   ← HomePage, ProcessPage, PortfolioPage,
│   │   │                               PricingPage, ContactPage
│   │   ├── data/                    ← projects.js, services.js, pricing.js
│   │   └── index.css                ← theme vars, .glass, .card, .pricing-highlight
│   ├── .env                         ← VITE_API_URL=http://localhost:5000 (local only, gitignored)
│   ├── .gitignore
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── server.js                    ← single-file Express server (mezquite style)
    ├── .env                         ← BREVO_API_KEY, CONTACT_EMAIL, SENDER_EMAIL
    ├── .env.example
    └── package.json                 ← "type": "module" (ESM)
```

---

## Brand colors (locked — do not change)

| Token | Value | Usage |
|-------|-------|-------|
| `gold.DEFAULT` | `#D4A820` | Buttons, icons, borders |
| `gold.light` | `#E8C040` | Button hover |
| `bg.DEFAULT` | `#111111` | Page background (dark) |
| `bg.deep` | `#0d0d0d` | Alternate sections |
| `bg.navy` | `#0d1629` | CTA section — always dark even in light theme |
| Light bg | `#F5F2EB` | Warm cream (light theme) |

---

## Theme system

- `:root` in `index.css` defines dark theme CSS vars
- `html.light` overrides to warm cream palette
- `ThemeContext.jsx` toggles the `light` class on `<html>`
- All Tailwind colors use `var(--bg)` etc. so components switch automatically
- CTA section is always dark navy — its phone button uses `variant="white"` on Button

---

## Key design rules

- No glow/shadow effects on cards — hover uses lift (`translateY(-3px)`) + border brighten only
- No hardcoded dark colors in components (caused light theme bugs before — e.g. `to-[#1c1708]`)
- All internal links use `<Button to="/page">` (React Router), never `href="#anchor"`
- External links / tel / mailto use `<Button href="...">`
- Section pages (non-Home) have a `<div className="h-16 md:h-20 shrink-0" />` spacer at the top to clear the fixed header

---

## Contact info in the site

- Phone: 984-399-1281
- Email: masinfo.usa@gmail.com
- Domain: masinfosystems.com

---

## Current portfolio projects

- **Mezquite Valley** — mezquite-valley.com (live, Restaurant & Catering)
- 2 placeholder cards (to be replaced with real screenshots)

Screenshots go in `frontend/public/images/projects/` and are referenced in `frontend/src/data/projects.js`.

---

## Running locally

```bash
# Frontend
cd frontend
npm install
npm run dev          # runs on http://localhost:5173

# Backend (masinfo standalone — not currently deployed separately)
cd backend
npm install
npm run dev          # runs on http://localhost:5000
```

For the contact form to work locally, `frontend/.env` must have:
```
VITE_API_URL=http://localhost:5000
```

---

## Planned future work

### 1. Migrate Tailwind → Material UI
- **Why:** Performance lag observed on iPhone 17 (2026-04)
- **Scope:** Full frontend rewrite — same design, same brand, new component system
- **Stack:** React + Vite stays, swap Tailwind for MUI `sx` / theme API
- **Preserve:** All brand colors, dark/light theme system, section structure

### 2. New sections to add (reference: https://na.arnit.ae/)
- **Problem section** — 3 cards with pain points + statistics (high persuasion value, currently missing)
- **Testimonials section** — 3 client quote cards (social proof, currently missing)
- **Quantified portfolio results** — add outcome metrics to project cards
- **Hero benefit badges** — replace trust row with 4 scannable pills (Mobile Responsive, SEO Optimized, etc.)

### 3. OG image
- Add `og-image.jpg` (1200×630) to `frontend/public/` for social share previews

---

## Font

Staying with **Inter** — user decided against switching to Poppins/Nunito/DM Sans.