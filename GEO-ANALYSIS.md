# GEO / AI Search Readiness — Cyber Access Protocol

**Audited:** 2026-11-16
**Scope:** `website/` (local static site, no production domain assigned)
**Method:** Source review + static HTML extraction + headless-browser interaction tests.
Ai-search visibility itself is **not measured**: the site is not deployed and no
DataForSEO / SE Ranking data is available. Scores below assess readiness, not ranking.

---

## 1. GEO Readiness Score: 78 / 100

| Area | Weight | Score | Notes |
|---|---:|---:|---|
| Citability | 25% | 21 | Definition front-loaded in the hero; question-led FAQ blocks on Overview, Campaign, Gameplay, Field Manual and Press; specific player-facing numbers. No sourced third-party data. |
| Structural readability | 20% | 18 | Clean H1→H2→H3 hierarchy, tables, lists, FAQ sections, short paragraphs. Campaign page is long but sectioned by chapter. |
| Multi-modal | 15% | 13 | 100 images with alt text and captions, including screenshots of every level, plus an interactive 3D chapter deck. No video or audio preview yet. |
| Authority & brand | 20% | 8 | Visible update date and Organization schema, but no named creator/studio byline, no external profile links, and no Wikipedia / Reddit / YouTube / LinkedIn presence for the game. |
| Technical accessibility | 20% | 18 | Static HTML; all marketing copy is in the raw document. AI-search crawlers allowed. `llms.txt` present. No canonical or sitemap because no domain exists. |

---

## 2. Platform Readiness (qualitative, not measured)

| Platform | Readiness | Why |
|---|---|---|
| Google AI Overviews | Good | Structurally complete, but ranking and AIO selection are unmeasured. Requires a live domain and Google Search indexation. |
| Google AI Mode | Good | Distinct surface; the site has fresh, dated content and citable passages. Entity authority remains weak. |
| ChatGPT Search | Fair | `OAI-SearchBot` is allowed and the copy is quotable, but ChatGPT leans on Wikipedia and authoritative entity signals the project does not yet have. |
| Perplexity | Fair | `PerplexityBot` is allowed; Perplexity cites community sources heavily and the game has no Reddit/forum footprint yet. |
| Bing Copilot | Fair | `Bingbot` allowed; no Bing index or link profile yet. |

No platform score is presented as measured. A live-domain crawl and an AI-visibility
tool are required before assigning one.

---

## 3. AI Crawler Access Status

`website/robots.txt` allows every listed crawler. These directives take effect once the
site is served from a domain root; `file://` previews are not crawlable.

| Capability | User-agent | Directive | Status |
|---|---|---|---|
| Google Search / AI Overviews / AI Mode eligibility | `Googlebot` | `Allow: /` | Allowed |
| Gemini & Vertex training/grounding | `Google-Extended` | `Allow: /` | Allowed |
| ChatGPT Search citability | `OAI-SearchBot` | `Allow: /` | Allowed |
| OpenAI model training | `GPTBot` | `Allow: /` | Allowed |
| Claude search citability | `Claude-SearchBot` | `Allow: /` | Allowed |
| Anthropic model training | `ClaudeBot` | `Allow: /` | Allowed |
| Perplexity search | `PerplexityBot` | `Allow: /` | Allowed |
| Apple discovery (Siri / Spotlight / Safari) | `Applebot` | `Allow: /` | Allowed |
| Apple Intelligence training | `Applebot-Extended` | `Allow: /` | Allowed |
| Common Crawl training | `CCBot` | `Allow: /` | Allowed |

Notes:
- `ChatGPT-User`, `Claude-User` and `Google-Agent` are user-triggered fetchers;
  robots.txt may not apply. They are not needed for search citability.
- `Google-Extended` governs Gemini/Vertex training and grounding, **not** Google Search
  or AI Overview inclusion. Those depend on `Googlebot`.
- Training crawlers are allowed deliberately: the project is MIT licensed.

---

## 4. llms.txt Status

**Present:** `website/llms.txt`.

It lists the seven main pages, the game's key facts and the press contact route. Google
states that `llms.txt` carries no ranking or citation weight for Google Search; it is
kept for other AI systems that may consume it. Links are relative until a production
domain is assigned.

---

## 5. Brand Mention Analysis

No verifiable brand presence was found or claimed:

- Wikipedia / Wikidata: none.
- Reddit: no community thread identified.
- YouTube: no channel or trailer identified.
- LinkedIn: no company page identified.

This is the largest gap. Ahrefs' 2025 study found brand mentions correlate far more
strongly with AI visibility than backlinks, with YouTube mentions strongest. A game site
without an entity footprint will struggle to be selected for "best cyber-security
platformer" or "games like …" queries even with perfect on-page structure.

---

## 6. Passage-Level Citability

Self-contained passages already present:

| Passage | Approx. length | Why it is citable |
|---|---:|---|
| Hero definition | ~45 words | Names the genre, protagonist and premise in the first screen. |
| Home FAQ | 30–60 words per answer | Direct question→answer pairs on levels, multiplayer, platforms and session length. |
| Campaign FAQ | 30–50 words per answer | Answers level count, length, bosses and replay. |
| Field Manual doctrines | ~45–60 words each | Self-contained explanations of each security discipline. |
| Press long description | ~200 words | Complete overview with setting, structure and final chapter. |
| Level cards | 1–2 sentences | Specific, named facts for all 50 levels. |

Opportunity: add one explicit 130–170-word "What is Cyber Access Protocol?" overview
block on the homepage. The hero and FAQ cover the definition; a single longer block
would be the most quotable unit.

---

## 7. Server-Side Rendering / JavaScript Dependency

**PASS.** All page copy, FAQ answers, level names, boss names and endings are present in
static HTML. JavaScript only:

- toggles the mobile menu,
- filters the gallery,
- opens the lightbox,
- switches Field Manual tabs,
- adds motion to reveal elements.

No primary content is generated client-side. If JavaScript is disabled, all screenshots
remain visible and all narrative copy remains readable.

---

## 8. Top 5 Highest-Impact Changes

1. **Assign a production domain and publish a canonical + sitemap.** Make OG image,
   `llms.txt` and sitemap URLs absolute. Without this, the site cannot accumulate search
   or AI-search signals.
2. **Add a named creator/studio identity.** A real byline, "About" page and
   `Organization.sameAs` links to YouTube, Reddit, LinkedIn or a store page will do more
   for AI citation than any on-page rewrite.
3. **Publish a gameplay trailer on YouTube with a transcript.** YouTube mentions were the
   strongest brand-mention correlate in the 2025 Ahrefs study; a trailer also gives the
   site an embeddable multi-modal asset.
4. **Build entity presence before launch.** A Wikipedia/Wikidata entry, a developer
   Reddit presence and a handful of previews/streams give AI systems something to ground
   the game's name against.
5. **Add one 130–170-word overview block and keep the update date visible.** The current
   hero + FAQ are good; a single self-contained overview is easier for answer engines to
   quote whole.

---

## 9. Schema Recommendations

Implemented on the homepage:

- `VideoGame` — name, description, genre, platform, operating system, play mode,
  player count, languages, `dateModified`.
- `WebSite` — name, description, language.
- `Organization` — name and description.

Recommended once a domain and public profiles exist:

- Add absolute `url`, `image` and `sameAs` values.
- Add `BreadcrumbList` to Campaign, Gameplay, Gallery, Field Manual, Journey and Press.
- Add `VideoObject` when a trailer exists.
- Do **not** rely on `FAQPage` markup for commercial rich results; the visible FAQ
  sections already provide the structure. FAQ rich results are restricted.
- Add `Person` or `Organization` authorship when there is a real named creator.

---

## 10. Content Reformatting Suggestions

Specific passages to improve next:

1. **Press long description** (three paragraphs): split the first ~150 words into a
   standalone "Game overview" answer block, then keep the chapter and final-chapter
   paragraphs separate.
2. **Campaign chapter intros**: each chapter starts with atmosphere. Add one direct
   sentence per chapter, e.g. "Chapter II has ten missions, Levels 11–20, and three boss
   families." This makes the page answer "how many levels are in Chapter II?" without
   inference.
3. **Field Manual mission table**: already a strong citable table; keep it. Add a short
   caption above it: "The Last Signal has ten missions, Levels 41–50, each with its own
   boss."
4. **Gallery**: captions are now descriptive and chapter-labelled. Add a one-sentence
   intro per filter category if the gallery grows.
5. **Journey**: each chapter entry has a date and content list; add one sentence about
   what changed for the player (not how it was built). This is already the direction.

---

## Verification

- Static extraction: 8 pages, 0 broken local references, one `<h1>` per page, every
  `<img>` has `alt`, homepage JSON-LD parses.
- Headless Edge: gallery filter 64→13, lightbox open/caption/next/close, Field Manual
  tabs, mobile nav, chapter-nav, hero depth parallax, six-card 3D deck rotation and
  card tilt all pass with 0 runtime errors.
- Marketing pass: engine, build, QA, test-count, hash, save-schema and version language
  removed from visible copy.
