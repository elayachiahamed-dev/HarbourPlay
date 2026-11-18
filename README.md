# Harbour Jackpot – landing page

A responsive, single-page landing site for the **Harbour Jackpot** weekly draw by Harbour Play: hero, live countdown to the next draw, How to Play, prize tiers, latest results, FAQ and footer.

All editable text and numbers live in one file, **`data.json`**. The page reads it on load, so content changes need no HTML or JavaScript edits.

> **Status:** not deployed yet. Several items in `data.json` are marked as placeholders and must be replaced before launch (see [Before going live](#before-going-live)).

---

## Technologies

| Layer | What is used |
|---|---|
| Markup | Plain HTML5 (`index.html` is a shell; sections are rendered by JS) |
| Styles | One hand-written CSS file, mobile-first, desktop layout from 1280px |
| Script | Vanilla JavaScript ES module, no framework, no dependencies |
| Content | `data.json` |
| Fonts | Self-hosted: Roboto (variable) and Ryosa Ocean Black |
| Build | None. The folder is deployed as-is |
| Local servers | Zero-dependency scripts for Ruby (built into macOS), Node.js or Python |
| Checks | `scripts/check.py` (Python 3, standard library only) |

## Project structure

```
harbour-jackpot/
├── index.html            Page shell: <head>, skip link, #app mount point
├── data.json             ALL editable content (see "Editing content")
├── css/main.css          All styles
├── js/main.js            Renders sections from data.json; countdown, FAQ, menu, footer accordions
├── assets/
│   ├── img/              Hero, logo, step, prize and payment images (PNG)
│   ├── icons/            SVG icons (incl. the original euro/accessibility icons)
│   └── fonts/            Roboto-Variable.woff2, RyosaOcean-Black.woff2
├── scripts/
│   ├── serve.rb          Local server using macOS's built-in Ruby
│   ├── serve.mjs         Local server using Node.js
│   ├── check.py          Pre-deploy check (JSON, assets, links, placeholders)
│   ├── fetch-assets.mjs  Re-downloads image/icon exports from Figma (dev only)
│   └── assets.json       Figma export list used by fetch-assets.mjs
├── netlify.toml          Netlify settings (publish folder, cache headers)
├── package.json          npm script shortcuts (optional)
└── README.md
```

## Prerequisites

Only a web browser plus **one** way to serve the folder over HTTP. The page loads `data.json` with `fetch()`, which browsers block when you open `index.html` straight from disk (`file://`).

Any one of these works:

- **Ruby**, already on every Mac (`ruby -v`)
- **Python 3**, on macOS once Apple's Command Line Tools are installed (`python3 --version`)
- **Node.js 18+**, optional (`node -v`)

## Installation

There is nothing to install: no `npm install`, no build.

```bash
cd ~/Documents/harbour-jackpot
```

## Run locally

Pick one, then open **http://localhost:5173**:

```bash
ruby scripts/serve.rb
```

```bash
python3 -m http.server 5173
```

```bash
node scripts/serve.mjs
```

The Ruby and Node servers disable caching, so a browser refresh always shows your latest edits. Stop any of them with `Ctrl+C`. To use another port, add it at the end (for example `ruby scripts/serve.rb 8080`).

## Editing content (`data.json`)

Open `data.json` in any text editor, change values, save, and refresh the page. Keep it valid JSON: double quotes, commas between items, no trailing commas. Run `python3 scripts/check.py` afterwards to catch mistakes.

### Blocks

| Block | Controls |
|---|---|
| `site` | Browser tab title, meta description, brand name, logo alt text |
| `jackpot` | `amount` (e.g. `"€1,000,000"`) and `ticketPrice` (e.g. `"€3"`) |
| `draw` | `timezone`, `weekday` (0 = Sunday … 6 = Saturday), `time` (`"21:00"`), optional `nextDrawOverride` |
| `cta` | Label and link of every yellow "Buy Ticket" button |
| `navigation` | Header menu items, language label, menu button label |
| `hero` | Title, tagline (`highlight: true` = yellow text), 18+ legal line, image alt text |
| `countdown` | Countdown heading, subtitle, unit labels, "Next draw" title |
| `howToPlay` | Section title/subtitle and the three steps (number, title, text, image alt) |
| `prizes` | Section text and the four prize tiers (name, amount, image alt) |
| `latestResults` | Draw date, draw number, winning `numbers`, winner count, "View all" link |
| `faq` | Questions and answers; `"open": true` shows an item expanded on load |
| `footer` | Link groups, social links, payment logo names (alt text), copyright, language/currency labels |

### Tokens: change a value once, update it everywhere

Any text can contain these tokens. They are filled in automatically:

| Token | Filled from | Example |
|---|---|---|
| `{jackpot}` | `jackpot.amount` | €1,000,000 |
| `{ticketPrice}` | `jackpot.ticketPrice` | €3 |
| `{drawDay}` | `draw.weekday` | Saturday |
| `{drawDayUpper}` | `draw.weekday` | SATURDAY |
| `{drawTime}` | `draw.time` | 21:00 |

For example, setting `"amount": "€2,500,000"` updates the hero, the Jackpot prize card and the browser tab title. Setting `"weekday": 5, "time": "20:30"` updates the countdown target, the hero tagline, both countdown subtitles and step 3.

### Countdown and next draw

The countdown always targets the **next weekly draw** (`weekday` + `time` in `timezone`, Malta time by default, DST-safe) and the "Next draw" date updates itself. For a one-off draw on a different date, set for example:

```json
"nextDrawOverride": "2026-12-24T21:00:00+01:00"
```

Once that moment has passed, the weekly schedule takes over again. Set it back to `null` afterwards.

### Updating results after a draw

Edit `latestResults.drawDate`, `drawNumber`, `numbers`, `winners`, and remove `"placeholder": true` once the values are official.

### Placeholders

Anything not yet verified carries `"placeholder": true` (and often a `_note`). Keys starting with `_` are notes for editors and are never displayed. `python3 scripts/check.py` lists every remaining placeholder.

## Build / prepare for deployment

There is no build step. Before each deploy:

```bash
python3 scripts/check.py
```

It verifies that `data.json` parses and has every block, that every referenced image, icon and font exists, that no `localhost`, `file://` or `/Users/…` paths are used, and that every in-page `#link` points at a real section. It also lists remaining placeholders as warnings. It exits with an error code if anything is broken.

All paths in the site are relative (`assets/...`, `data.json`), so it works at a domain root or in a sub-folder.

## Deployment

**Recommended: Netlify.** The site is plain static files with no build. Netlify can publish this folder by drag-and-drop with no Node.js or Git required, and the included `netlify.toml` already sets the publish folder and cache headers (`data.json` is never cached stale; assets are cached for a week). Vercel works too, but it is geared toward framework builds and adds nothing here.

### Option A – Netlify Drop (quickest, no tools)

1. Run `python3 scripts/check.py`.
2. Go to <https://app.netlify.com/drop> and sign in or create a free account.
3. Drag the **`harbour-jackpot` folder** onto the page.
4. Netlify gives you a URL like `https://random-name.netlify.app`. Rename it under **Site configuration → Change site name**, or add your own domain under **Domain management**.
5. To update later: open the site in Netlify → **Deploys** → drag the folder onto the deploy area again.

### Option B – Netlify from a Git repository (automatic deploys)

1. Push this folder to a GitHub, GitLab or Bitbucket repository.
2. In Netlify: **Add new site → Import an existing project** → choose the repository.
3. Build settings: **Build command:** leave empty. **Publish directory:** `.` (already set by `netlify.toml`).
4. **Deploy**. Every push to the main branch then redeploys automatically, so editing `data.json` and pushing is all a content update needs.

### Option C – Netlify CLI (requires Node.js)

```bash
npx netlify-cli deploy --dir . --prod
```

### Alternative – Vercel

Import the repository at <https://vercel.com/new>, choose **Framework Preset: Other**, leave the build command empty, set **Output Directory** to `.` and deploy. `netlify.toml` is ignored there, so the custom cache headers do not apply.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`s labelled by their headings, `footer`), one `h1`, and a "Skip to main content" link.
- Every interactive element is a real `<a>` or `<button>` with a visible 3px yellow `:focus-visible` outline; yellow CTAs also turn white on focus.
- FAQ: buttons with `aria-expanded` and `aria-controls`; answers are labelled regions. Mobile menu: `aria-expanded`, closes with **Esc** and returns focus. Footer link groups on mobile are buttons with `aria-expanded` too.
- Countdown: `role="timer"` with a label; screen readers get a once-a-minute summary instead of per-second noise.
- Prize tiers: a list of cards, each with a heading (tier name), image alt text and amount, read in that order.
- Contrast (WCAG 2.2 AA) checked on the main text/background pairs: lowest is 5.96:1 (light text on hero blue); body text 19.9:1; CTA text 12.9:1.
- Touch targets meet WCAG 2.2 AA 2.5.8; the few links under 24px (footer links on desktop, header logo) pass via the spacing exception.
- The yellow CTA hover only applies to mouse/trackpad devices, so taps don't leave it stuck white. Tapping a How to Play or prize card shows its hover style until you tap elsewhere. All transitions respect `prefers-reduced-motion`.
- Decorative images and icons have empty `alt` and `aria-hidden`.

## Performance

- No frameworks or third-party scripts; one CSS and one JS file (~25 KB and ~16 KB unminified).
- Fonts are self-hosted WOFF2 with `font-display: swap`.
- `<picture>` serves separate mobile and desktop hero and logo images.
- Possible improvements: compress the PNGs or convert them to WebP/AVIF (the hero images are ~1 MB each), and add `loading="lazy"` to below-the-fold images.

## Before going live

These are placeholders in `data.json` (run `python3 scripts/check.py` for the current list):

- **Buy Ticket** link (`cta.href`): no purchase page exists yet.
- **Latest results**: date, draw number, numbers and winner count are sample values from the design, not real results.
- **FAQ answers**: none were provided; all six show placeholder text.
- **Safer gambling, helpline and licence information** is not on the site. The page has no section for it, so adding it later needs a small code change, not just a `data.json` edit. The footer's "Safer Gambling" link is a placeholder until then.
- Footer links with no destination yet: Terms & Conditions, Privacy Policy, Safer Gambling, Set Your Limits, Get Support, View All Results, and the Facebook, Instagram and YouTube links.
- Confirm the contact email, phone number and prize amounts shown in the design are real.
- The section subtitles for Prize tiers and Latest results repeat an unfinished sentence from the design.
