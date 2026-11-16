# Cyber Access Protocol — Official Website

A static, dependency-free multi-page site for **Cyber Access Protocol v5.0.0**.

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
| `index.html` | Hero, premise, feature pillars, chapter overview, V5 spotlight, build stats |
| `campaign.html` | All 50 levels across five chapters, with a capture per level |
| `gameplay.html` | Core loop, player verbs, mission structure, threats, bosses, debrief, controls, accessibility |
| `gallery.html` | 64 filterable screenshots with a keyboard-accessible lightbox |
| `field-manual.html` | The Last Signal: nine disciplines, mission list, Evidence Workbench, consequences, endings, boss roster |
| `changelog.html` | The Journey: how the campaign grew, chapter by chapter |
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

- a pointer-driven parallax hero with a floating 3D sigil;
- tilt-and-glare card interactions across features, levels, disciplines, bosses,
  gallery screens and press panels;
- a six-card 3D chapter deck on the homepage that auto-rotates in view, pauses on
  hover/focus, supports drag and arrow controls, and turns keyboard focus to the
  front card.

The layer is progressive enhancement. `.has-3d` is set before paint, tilt is limited to
fine pointers, `prefers-reduced-motion` disables transforms and auto-rotation, and the
deck falls back to a stacked card grid without JavaScript.

## AI search / GEO files

- `robots.txt` — allows search and AI-search crawlers, including `OAI-SearchBot`,
  `Claude-SearchBot`, `PerplexityBot`, `Googlebot`, `Applebot` and training crawlers.
- `llms.txt` — a curated map for non-Google AI systems (Google states it has no ranking
  or citation weight).
- `GEO-ANALYSIS.md` — the readiness audit, crawler status, citability review and next
  steps. The site is not deployed; no domain, canonical or sitemap exists yet.

## Screenshot provenance

Screenshots in `assets/img/` are derived from retained QA captures in
`production/qa/evidence/`. The sources are listed in
`_build/convert-captures.ps1`, which converts them to web-sized JPEGs with
System.Drawing (no external image tools required):

```powershell
powershell -ExecutionPolicy Bypass -File website/_build/convert-captures.ps1
```

Seven clean V5 room plates (`plate-41.webp` … `plate-50.webp`) are copied
directly from `assets/art/rooms/` and used as page backgrounds. Source assets
are never modified. Level cards are 960×540; key art, bosses and interface
screens are 1280×720; the V5 contact sheet is 1800×405.

## Content sources

The site is grounded in the repository's own record:

- `README.md` — feature and verification summary
- `design/gdd/cyber-access-protocol-master-gdd.md` — story bible, cast, roadmap
- `assets/data/v5/missions/levels_41_50/*.json` — V5 mission names and objectives
- `assets/data/v5/knowledge_library.json` + `localization/en.csv` — domain doctrine
- `localization/en.csv` — V5 boss names and all three epilogues
- `docs/release/release-notes.md` — version history and dates
- `production/qa/evidence/` — screenshots and QA matrices

## Notes

- No analytics, cookies, trackers or third-party JavaScript.
- Every page has a skip link, visible focus styles, semantic landmarks and a
  reduced-motion path.
- Gallery filters are deep-linkable (`gallery.html#bosses`,
  `gallery.html#last-signal`, and so on).
- The lightbox is a native `<dialog>` with arrow-key navigation and Escape to
  close.
- All factual claims (test counts, artifact hash, localization counts) should
  be re-checked against the current QA report before publishing a new build.

## License

MIT — see [LICENSE](LICENSE), the same license as the game project.
