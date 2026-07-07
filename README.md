# austinspace-lite

A reusable one-page business website template built on [Eleventy 3](https://www.11ty.dev/). Ships with realistic placeholder content for a fictional cafe so it renders immediately — re-skin it for a real client by editing data files only.

## Using this for a new client

1. Clone/copy this repo into a new project for the client.
2. Edit the files in `src/_data/`:
   - `site.json` — business name (split into `businessName` + `businessDescriptor`, e.g. "Maple & Bean" + "Coffee Co." — always used together, never store the combined name as a third field), tagline, contact info, address, opening hours, meta tags (`metaTitleSuffix` is optional — omit it and the `<title>` tag just drops the trailing " | "), and the two brand colours (`colorPrimary` / `colorAccent`, used as CSS custom properties across the whole site). The logo/hero lockup scales as one unit off a single `--logo-size` / `--hero-heading-size` CSS variable in `style.css` — tune that one value, don't hand-tune the two lines separately.
   - `services.json` — array of `{ icon, title, blurb }`. Available `icon` keys are defined in `src/_includes/services.njk` (`coffee`, `cake`, `wifi`, `users`).
   - `reviews.json` — array of `{ name, quote, rating }` (rating 1–5).
   - `gallery.json` — array of `{ image, alt }`. `image` is just the filename inside `src/assets/images/gallery/`.
   - `social.json` — object of `{ platform: url }`. Only platforms present here render in the footer icon row. Supported platform keys are defined in `src/_includes/social.njk` (`facebook`, `instagram`, `twitter`, `linkedin`, `youtube`, `tiktok`).
3. Drop the client's real photos into `src/assets/images/gallery/` (replacing the placeholder JPGs) and update `gallery.json` to match. Eleventy Image will automatically generate optimized WebP + srcset versions at build time — just use normal JPG/PNG source files.
4. If the client wants different service icons, add more inline SVGs to the `icons` map at the top of `src/_includes/services.njk`.
5. Brand mark — edit `src/_includes/brand-mark.njk` (not `brand-icon.njk`, which is shared structure). Paste the inline SVG from Lucide (zero-adjustment, it's already on a 24×24 grid) or Font Awesome (also copy the source SVG's `viewBox` attribute into the `viewBox()` macro at the bottom of `brand-mark.njk`, so the glyph's coordinate space matches) — both inherit `currentColor`, so no colour edits are needed. If sourcing elsewhere, make sure the SVG uses `currentColor` (not a hardcoded hex) and is single-colour.

No further template/HTML/CSS edits should be needed for a standard re-skin.

## Commands

- `npm start` — build and serve locally with live reload, for previewing changes.
- `git push` — push to your Git host; connect the repo to Netlify (or similar) and it builds with `npm run build` and deploys automatically.

## Notes

- No client-side JavaScript. The contact form is a static Netlify form (`data-netlify="true"`) with a honeypot field for spam protection — works without any JS.
- No web fonts — the stylesheet uses the OS system font stack.
- CSS lives in `src/assets/css/style.css` and is linked (not inlined) so it stays cacheable; only the two brand-colour CSS variables are generated inline in `<head>` since those come from data.
