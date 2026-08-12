# CADORO — Jewelry CAD Studio website

Three complete design directions for a jewellery 3D-modelling studio. Same content, same
interactions, three visual languages — built so you can compare them fairly and keep one.

Static HTML/CSS/JS. **No backend, no build step, no npm install.** Libraries load from CDN.

---

## Viewing it

The pages use ES modules and an import map, so `file://` will not work. Serve the folder:

```bash
cd 3d-project
python3 -m http.server 8080
```

Then open **http://localhost:8080** — the landing page links to all three variants.

| | Variant | Direction |
|---|---|---|
| 01 | [`v1-dark-luxury/`](v1-dark-luxury/) | Black + gold. Low light, serif display, glow. The classic fine-jewellery register. |
| 02 | [`v2-light-gallery/`](v2-light-gallery/) | White + champagne. Museum walls, editorial grid. Ships with a light/dark toggle. |
| 03 | [`v3-industrial-tech/`](v3-industrial-tech/) | Navy + steel. Blueprint grid, monospace readouts, wireframe-first 3D. |

---

## What's in the box

### Live 3D viewer

Not a video, not a sprite sheet — a real `three.js` scene. Four pieces (solitaire ring,
eternity band, signet, halo pendant) are **generated procedurally in code**, so there are no
model files to host or version. Visitors can:

- orbit, zoom and stop the auto-spin
- switch between the four pieces
- toggle **CAD mesh** (wireframe) against the solid render — the clearest possible statement of
  what the studio actually delivers
- toggle the stones on and off
- recolour the metal in real time from the Materials section (5 metals)

Falls back to a still render when WebGL is unavailable, pauses when scrolled off-screen, and
drops to lower geometry density and a cheaper gem shader on phones.

### Everything else

Sticky nav with scroll-spy · animated counters · filterable portfolio with a CAD-mesh hover
treatment and a lightbox · six-step process timeline · interactive **price/lead-time estimator**
that pipes its result into the contact form · testimonial slider · pricing tiers · FAQ accordion
(with `FAQPage` structured data) · contact form with inline validation and a drag-and-drop file
zone · Lenis smooth scroll · GSAP scroll reveals.

---

## Project layout

```
3d-project/
├── index.html                  variant picker
├── shared/
│   ├── site-data.js            ← ALL copy, portfolio, pricing, FAQ live here
│   ├── site-ui.js              markup renderers + all behaviour
│   └── jewelry-3d.js           three.js scene factory
├── v1-dark-luxury/    index.html · css/style.css · js/main.js
├── v2-light-gallery/  index.html · css/style.css · js/main.js
└── v3-industrial-tech/index.html · css/style.css · js/main.js
```

The three variants share `shared/`. Their `js/main.js` is a thin config file (~40 lines); the
design lives almost entirely in `css/style.css`.

---

## Before this goes live — replacement checklist

Everything below is a **placeholder**.

1. **Company identity** — `shared/site-data.js` → `BRAND`. Name, tagline, email, phone,
   WhatsApp/Telegram handles, address, opening hours, social links.
   The name also appears in each `index.html`: `<title>`, the OG tags, the JSON-LD block and the
   `.logo-text` spans (header + footer).
2. **Logo** — the gem mark is an inline `<symbol id="gem-mark">` near the top of each
   `index.html`. Replace that one SVG and it updates the header, footer and preloader.
3. **Figures** — `STATS` (models delivered, years, brands, countries) in `site-data.js`. These are
   invented. So are `PRICING`, the `ESTIMATOR` rates and the six-day `PROCESS` schedule.
4. **Portfolio** — `PORTFOLIO` in `site-data.js`. The twelve images are Unsplash stock, not the
   studio's work. Swap the `img` values for your own renders (square or 3:4 crops, ~900 px wide)
   and rewrite `title` / `metal` / `stones` / `note`.
5. **Testimonials** — `TESTIMONIALS` are fictional. Remove the section entirely if you have none
   yet; fake social proof is worse than no social proof.
6. **Contact form** — see below.
7. **Legal** — add privacy policy / terms links in the footer if you collect enquiries in the EU.

### Wiring the contact form

It is currently a demo: it validates, shows a loading state and a success message that says
plainly that nothing was sent. To make it real, open `shared/site-ui.js`, find the
`setTimeout` inside `initForm()`, and replace it with a POST — e.g. Formspree:

```js
const res = await fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  headers: { Accept: 'application/json' },
  body: new FormData(form),
});
```

The drag-and-drop zone lists files locally only; forwarding attachments needs a service that
accepts multipart uploads.

---

## Deploying

Any static host. Drag the folder onto **Netlify Drop**, push to **GitHub Pages**, or upload to
**Cloudflare Pages**. Once you pick a variant, move its three files to the repository root,
keep `shared/`, and fix the two `../../shared/` paths in `js/main.js` to `shared/`.

---

## Notes and known trade-offs

- **CDN dependency.** `three`, GSAP + ScrollTrigger, Lenis, Swiper, Lucide, Vanilla-tilt and
  Google Fonts load from jsDelivr/Google, pinned to exact versions, so the site needs a network
  connection. To self-host, download those files into a local `vendor/` folder and repoint the tags.
  (The lightbox is hand-written in `site-ui.js` rather than pulled from a library, so it is one
  less thing to host.)
- **Portfolio hover mesh** is a CSS treatment, not a real wireframe of that photograph. The real
  wireframe is in the 3D viewer.
- **Repeated sections render from JS.** Portfolio cards, FAQ, services and pricing are built at
  runtime from `site-data.js`. Search engines execute JS, and the FAQ is additionally emitted as
  JSON-LD, but if you want the copy in the served HTML, inline it once a variant is chosen.
- Tested at 390 / 768 / 1024 / 1440 px, with keyboard navigation, and with
  `prefers-reduced-motion: reduce` (which disables smooth scroll, reveals and the auto-spin).
