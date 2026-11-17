# Cyber Access Protocol — Official Website

A static, dependency-free multi-page site for **Cyber Access Protocol v7.0.0**, the complete seventy-level campaign.

## Run it

The site is plain HTML, CSS and JavaScript. Any static file server works:

```powershell
# from the repository root
python -m http.server 8080 --directory website
```

Then open <http://localhost:8080>.

Opening `website/index.html` directly from disk also works; the only network
requests are the optional Google Fonts stylesheets, with system fallbacks if
they are unavailable.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Split hero, premise, feature pillars, eight-card chapter deck, V7 systems, numbers, gallery preview |
| `campaign.html` | All 70 levels across seven chapters, with an image per level |
| `gameplay.html` | Core loop, player verbs, V7 workbench/character/dialogue, mission structure, threats, bosses, debrief, controls, accessibility |
| `gallery.html` | 95 filterable screens with a keyboard-accessible lightbox |
| `field-manual.html` | 28 disciplines across three campaigns, the V7 workbench, consequences, six endings, the full boss roster |
| `changelog.html` | The Journey: how the campaign grew through seven chapters |
| `press.html` | Fact sheet, approved copy, cast, downloads, current status and FAQ |
| `404.html` | Static error page |

Shared assets live in `assets/css/site.css`, `assets/js/site.js` and
`assets/img/`. The site logo is `assets/brand/logo_mark.svg` (copied from
`assets/art/ui/logo_mark.svg`).

## Public copy

The public pages are **marketing copy**, not technical documentation. They describe the
game, its story, its cast and what a player can do; they deliberately do not mention the
engine, build pipeline, test counts, save schemas, hashes or implementation details.
Technical detail belongs in `README.md`, `_build/` and `GEO-ANALYSIS.md`.

## 3D UI layer

`assets/css/3d.css` and `assets/js/site.js` add the depth layer:

- a pointer-driven parallax hero with a floating 3D sigil and three depth frames;
- pointer-driven depth on interior page heroes;
- tilt-and-glare card interactions across features, levels, disciplines, bosses,
  system cards, gallery screens and press panels;
- an eight-card 3D chapter deck on the homepage that auto-rotates in view, pauses on
  hover/focus, supports drag and arrow controls, and turns keyboard focus to the
  front card. The deck computes its step and radius from the number of cards;
- a CSS-only orbital system core with ten V7 domain labels, a Hold Orbit control
  and a reduced-motion stop;
- scroll-driven depth on card grids where the browser supports view timelines,
  with the final state rendered when it does not;
- depth-aware reveal, lightbox and cross-document page transitions.

The layer is progressive enhancement. `.has-3d` is set before paint, tilt is limited to
fine pointers, `prefers-reduced-motion` disables transforms and auto-rotation, and the
deck falls back to a stacked card grid without JavaScript. The 3D layer has no WebGL
dependency, no additional downloads and no layout-affecting animation.

## AI search / GEO files

- `robots.txt` — allows search and AI-search crawlers, including `OAI-SearchBot`,
  `Claude-SearchBot`, `PerplexityBot`, `Googlebot`, `Applebot` and training crawlers.
- `llms.txt` — a curated map for non-Google AI systems (Google states it has no ranking
  or citation weight).
- `GEO-ANALYSIS.md` — the readiness audit, crawler status, citability review and next
  steps. The site is not deployed; no domain, canonical or sitemap exists yet.

## Screenshot provenance

Screenshots in `assets/img/` are derived from retained QA captures in
`production/qa/evidence/` and the shipped room art. The sources are listed in
`_build/convert-captures.ps1`, which converts QA captures to web-sized JPEGs with
System.Drawing and copies the V6/V7 WebP backdrops without re-encoding:

```powershell
powershell -ExecutionPolicy Bypass -File website/_build/convert-captures.ps1
```

Level cards for 1–50 are 960×540 JPEGs; Levels 51–70 use the shipped 1280×720 WebP
backdrops. V7 interface and dialogue captures are 1280×720 JPEGs. Page plates are clean
backdrops copied from `assets/art/rooms/`.

## Validation

```powershell
python -I website/_build/validate_site.py
node --check website/assets/js/site.js
```

`validate_site.py` checks tag balance, one `<h1>` per page, image alt text, duplicate
ids and local href/src resolution. `_build/selftest.html` runs the browser interaction
checks (gallery filters and lightbox, field-manual tabs, mobile nav, chapter deck,
hero parallax and chapter navigation); open it through the same static server.

## Content sources

The site is grounded in the repository's own record:

- `README.md` — feature and verification summary
- `design/gdd/cyber-access-protocol-master-gdd.md` — story bible, cast, roadmap
- `assets/data/v5/missions/levels_41_50/*.json` — The Last Signal missions
- `assets/data/v6/missions/levels_51_60/*.json` — Frontier Protocol missions
- `assets/data/v7/missions/levels_61_70/*.json` — The Living System missions
- `assets/data/v7/dialogue/dialogues.json` — dialogue cast and conversations
- `assets/data/v5/knowledge_library.json` + `localization/en.csv` — domain doctrine
- `docs/release/release-notes.md` — version history and dates
- `production/qa/evidence/` — screenshots and QA matrices

## Notes

- No analytics, cookies, trackers or third-party JavaScript.
- Every page has a skip link, visible focus styles, semantic landmarks and a
  reduced-motion path.
- Gallery filters are deep-linkable (`gallery.html#bosses`,
  `gallery.html#frontier`, `gallery.html#living-system`, `gallery.html#dialogue`).
- The lightbox is a native `<dialog>` with arrow-key navigation and Escape to
  close.
- All factual claims (test counts, artifact hash, localization counts) should
  be re-checked against the current QA report before publishing a new build.

## License

MIT — see [LICENSE](LICENSE), the same license as the game project.
