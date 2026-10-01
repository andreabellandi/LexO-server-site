# LexO-server-site — Project Context

This file records the current architecture and editing conventions of the LexO-server public website.

## Repository

- GitHub: `andreabellandi/LexO-server-site`
- Default branch: `main`
- Type: static website (no build system, framework, package manager, or server-side application)
- Local preview: `python3 -m http.server 8000`

## Main structure

```text
.
├── README.md
├── index.html
├── assets/
│   ├── content/
│   │   └── corpus-api.html
│   ├── css/
│   │   ├── styles.css
│   │   ├── corpus-api.css
│   │   └── install.css
│   ├── images/
│   └── js/
│       ├── main.js
│       └── router.js
└── docs/
    └── papers/
```

## Page architecture

The site behaves as a small single-page application built with static HTML, jQuery, and hash-based routing.

### `index.html`

Contains:

- global document structure, header, navigation, footer;
- Home;
- Linguistic Data Models;
- Other Data Models;
- Resource Types;
- basic Lexicon / WordNet / Dictionary / ECD API sections;
- Projects;
- Papers.

Some placeholders in the static HTML are replaced or extended dynamically by JavaScript.

### `assets/js/main.js`

Contains and injects substantial site content, including:

- Corpus API documentation;
- Attestation API documentation;
- dynamic replacement of the Services Documentation menu;
- project icon replacement;
- base `navigate(sectionId)` implementation;
- dynamic loading of `assets/css/corpus-api.css`.

Important: when editing Corpus API or Attestation API documentation, check `main.js` first. The file `assets/content/corpus-api.html` currently overlaps with older Corpus API content and should not be assumed to be the active source rendered by the site.

### `assets/js/router.js`

Wraps the global `navigate()` function and implements readable hash routes.

Current routes include:

- `#/home`
- `#/linguistic-data-models`
- `#/other-data-models`
- `#/resource-types`
- `#/services/lexicon-api`
- `#/services/wordnet-api`
- `#/services/attestation-api`
- `#/services/dictionary-api`
- `#/services/explanatory-combinatorial-dictionary-api`
- `#/services/corpus-api`
- `#/install/docker`
- `#/install/manual`
- `#/projects`
- `#/papers`

It also:

- replaces the static "How to Install" link with a dropdown;
- injects Docker installation documentation;
- injects Manual installation documentation;
- dynamically loads `assets/css/install.css`;
- synchronizes the current section with `window.location.hash`.

Important: installation documentation should be edited in `router.js`, not in `index.html`.

## CSS responsibilities

### `assets/css/styles.css`

Global visual system and layout:

- typography;
- header and navigation;
- sections;
- cards;
- tables;
- project rows;
- footer;
- responsive behavior.

### `assets/css/corpus-api.css`

Specific styling for Corpus and Attestation API documentation.

Also adjusts the Services dropdown width.

### `assets/css/install.css`

Specific styling for Docker and Manual installation documentation and the installation dropdown.

## Assets

Project-specific icons are present in `assets/images/` and are assigned dynamically in `setupProjectIcons()` in `main.js`.

The footer currently uses `assets/images/logoILC.png`.

## External dependencies

Loaded directly from CDNs in `index.html`:

- Google Fonts;
- jQuery 3.6.0.

There is no npm/yarn/pnpm dependency tree.

## Editing conventions

1. Keep the site deployable as plain static files.
2. Preserve existing section IDs because routing depends on them.
3. When adding a new navigable section:
   - add or inject the `<section id="...">`;
   - add an entry to `ROUTES` in `router.js`;
   - add/update the corresponding navigation link.
4. Prefer existing visual classes before adding new CSS.
5. Keep external links using `target="_blank"` together with `rel="noopener noreferrer"`.
6. Preserve keyboard accessibility for interactive cards/dropdowns.
7. Test direct hash navigation and browser back/forward navigation after routing changes.
8. Test at desktop and narrow/mobile widths.
9. Avoid introducing a build step unless explicitly required.

## Current technical observations

- `main.js` contains large HTML template strings. This is functional but makes content maintenance harder.
- `router.js` also contains large HTML template strings for installation pages.
- `assets/content/corpus-api.html` appears to contain overlapping/legacy Corpus API markup while the active page is injected from `main.js`. Before future cleanup, verify whether anything external still references this file.
- The global navigation logic is split between `main.js` and `router.js`; changes to navigation should therefore be checked in both files.
- API documentation is currently hand-maintained HTML rather than generated from OpenAPI.

## Recent repository state

As of 2026-10-01, the latest commit on `main` observed during project analysis is:

`7388d1b Document Web Annotation attestation export`

That commit updates the Attestation API documentation in `assets/js/main.js` with the Web Annotation JSON-LD export endpoint.

## Development workflow

Recommended workflow for future changes:

```bash
cd /Users/andrea/Documents/lexo-server-site
git status
git pull --ff-only
python3 -m http.server 8000
```

Open:

`http://localhost:8000`

After changes:

```bash
git diff
git status
```

Before committing, verify navigation, responsive layout, external links, and all modified documentation sections.

## Source-of-truth reminder

Before editing content, locate its actual source:

| Site content | Primary source |
|---|---|
| Home / Models / Projects / Papers | `index.html` |
| Corpus API | `assets/js/main.js` |
| Attestation API | `assets/js/main.js` |
| Services dropdown | `assets/js/main.js` |
| Docker installation | `assets/js/router.js` |
| Manual installation | `assets/js/router.js` |
| Hash routing | `assets/js/router.js` |
| Global styling | `assets/css/styles.css` |
| Corpus/Attestation styling | `assets/css/corpus-api.css` |
| Installation styling | `assets/css/install.css` |
