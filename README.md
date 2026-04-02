# Masinfo Systems — Website

> Websites & Apps | Fast, Affordable, Professional

Full-stack company website built with React (Vite) + Tailwind CSS + Framer Motion frontend,
and Node.js + Express backend with Brevo email integration.

---

## Project Structure

```
masinfo_systems/
├── frontend/                  # React + Vite + Tailwind
│   ├── public/
│   │   └── favicon.svg        # Gold M logo (SVG)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx     # Glassmorphism sticky nav
│   │   │   │   └── Footer.jsx
│   │   │   ├── sections/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Services.jsx
│   │   │   │   ├── Portfolio.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   ├── Pricing.jsx
│   │   │   │   ├── CTA.jsx
│   │   │   │   └── Contact.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── SectionWrapper.jsx
│   │   │       ├── LabelPill.jsx
│   │   │       └── ServiceIcon.jsx
│   │   ├── data/
│   │   │   ├── projects.js    ← Add portfolio projects here
│   │   │   ├── services.js    ← Edit services here
│   │   │   └── pricing.js     ← Edit pricing here
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── backend/                   # Node.js + Express API
    ├── src/
    │   ├── routes/contact.js
    │   ├── controllers/contactController.js
    │   └── middleware/rateLimiter.js
    ├── src/app.js
    ├── server.js
    ├── .env.example
    └── package.json
```

---

## Run Locally

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values (see below)
npm run dev
# → http://localhost:5000
```

### 3. .env Setup

Edit `backend/.env`:

```
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173
BREVO_API_KEY=your-actual-brevo-key
CONTACT_EMAIL=masinfo.usa@gmail.com
SENDER_EMAIL=no-reply@masinfosystems.com
```

Get your Brevo API key at: https://app.brevo.com/settings/keys/api

---

## Deploy

### Frontend → Cloudflare Pages

1. `cd frontend && npm run build` — generates `dist/`
2. Push to GitHub
3. Connect repo in Cloudflare Pages → set build command `npm run build`, output `dist`
4. Done. Cloudflare handles CDN + SSL automatically.

### Backend → Render

1. Push `backend/` to GitHub (can be same or separate repo)
2. Create a new **Web Service** on Render
3. Set:
   - Build command: `npm install`
   - Start command: `node server.js`
4. Add all `.env` variables in Render's **Environment** tab
5. Update `ALLOWED_ORIGINS` to your production frontend URL

---

## How to Edit Content

### Change text / copy
Every section has its content inline. Open the section file and edit the strings directly.

### Change pricing
Edit `frontend/src/data/pricing.js` — update price, features list, and CTA text.

### Change services
Edit `frontend/src/data/services.js`.

### Add a portfolio project

Open `frontend/src/data/projects.js` and add a new object:

```js
{
  id: 4,
  name: 'Client Business Name',
  tagline: 'Industry / Category',
  description: 'One or two sentences describing the project.',
  liveUrl: 'https://their-site.com',
  image: '/images/projects/their-site.jpg',  // add to /public/images/projects/
  placeholderColor: '#0d0d0d',   // shown if no image
  placeholderAccent: '#C4A030',
  tags: ['Business Website', 'E-Commerce'],
  featured: true,
}
```

Then drop a screenshot (JPG/WEBP, ~800×500px) in `frontend/public/images/projects/`.

### Replace the OG image
Drop a `1200×630` branded image at `frontend/public/og-image.jpg`.

---

## Anti-Spam Strategy

- **Rate limiting**: max 5 contact form submissions per IP per 15 minutes (backend)
- **Honeypot field**: invisible field in the form — bots fill it, real users don't — submission is silently discarded
- **CORS**: only your domain is allowed to call the API
- **Input validation**: all fields are validated and sanitized server-side

---

## Brand Colors (from business card)

| Token | Hex | Usage |
|-------|-----|-------|
| Gold | `#C4A030` | Primary accent, buttons, icons |
| Gold Light | `#D4B550` | Gradient highlight |
| Gold Dark | `#9A7820` | Gradient shadow |
| Background | `#111111` | Page background |
| Deep | `#0d0d0d` | Section alternates |
| Card | `#1a1a1a` | Card surfaces |
| Navy | `#0d1629` | CTA section |
| Text Primary | `#FFFFFF` | Headings |
| Text Secondary | `#BBBBBB` | Body text |
| Text Muted | `#777777` | Labels, captions |
