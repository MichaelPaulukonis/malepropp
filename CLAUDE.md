# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Story generator using Vladimir Propp's narrative "functions" (Proppian narratemes) to combinatorially assemble fairy-tale-shaped stories from templates. Two consumers share one generation engine:

- **Node headless CLI** (`index.js`, the "novel builder") — generates stories until a word-count target, writes to a `.txt` file. Requires the engine from `lib/`.
- **Browser GUI** (`index.html` + `gui.js`, jQuery-driven) — deployed to GitHub Pages at `michaelpaulukonis.github.io/malepropp`. Loads the same `lib/*.js` files as plain `<script>` tags.

Engine (`lib/`): `propp.js`, `templates.js`/`templates.business.js`/`templates.descriptive.js`/`default.templates.js`, `words.js`, `business.wordbank.js`, `wordbank.test.js`, `cleaner.js`, `tokenizer.web.js`. GUI-only files stay at repo root: `index.html`, `gui.js`, `propp.css`, vendored `scripts/jquery.min.js`/`scripts/underscore.js`.

Currently a standalone repo. Under active consideration for import into `textgen-monorepo` as `libs/malepropp` (engine only) — mid-cleanup on the `dev` branch first, not yet moved.

## Commands

```bash
npm install
npm test              # mocha tests/ — all tests, currently 127 passing on Node 22
npm run test_cleaner   # mocha tests/cleaner.tests.js
npm run test_propp     # mocha tests/malepropp.tests.js
node index.js          # generates stories to ~50k words, writes wonder.tale.<rand>.txt to cwd
```

## Architecture

### Engine vs. presentation, physically split

`lib/` holds the Node-consumable engine; GUI files stay at repo root. `index.js` and `tests/*.tests.js` require from `./lib/...`; `index.html`'s `<script src>` tags point at `lib/...` for the same files, in the same order they were in before the split — **order matters, not just presence.**

**Files loaded as `<script>` tags in `index.html` share one global namespace — there is no module isolation in the browser, unlike Node's `require()`.** This has already caused a real bug: a helper function named `words()` added to `lib/tokenizer.web.js` was silently overwritten by `lib/words.js`'s own global `words` data object, loaded later in the script order — Node's tests passed fine (separate module scopes) while the browser broke (`words is not a function`). When adding top-level names to any `lib/*.js` file, either confirm nothing else in the load order uses that name, or scope it inside an IIFE (see `tokenizer.web.js` for the pattern) rather than trusting a grep across files loaded in different scopes.

Several `lib/*.js` files use a `var x = x || require('./y.js')` pattern (e.g. `propp.js`'s `Tokenizer`/`Cleaner`) to work in both environments: in the browser, `x` is expected to already be a global from an earlier `<script>` tag (so `require`, which doesn't exist, is never reached); in Node, `require()` fills it in. This is why `Tokenizer` itself is a plain global function declaration in `tokenizer.web.js`, not wrapped — only its *internal* helpers are IIFE-scoped.

**`nlp_compromise@~0.2.2` is load-bearing and should not be casually upgraded.** It predates the `compromise` package (what `poeticalbot`/`listmania` in textgen-monorepo use, at v11–13) and has a completely different API. Templates may depend on its specific 0.2.2 behavior in ways that aren't obvious from reading `propp.js` alone.

**`wordbank.test.js` is not a test file** despite the name — `index.js` requires it directly as a module: `require('./lib/wordbank.test.js')(words)`. Don't let the `.test.js` suffix fool you into thinking it's covered by/excluded from the test runner.

**`lib/templates.descriptive.js` is currently dead code** — not in `index.html`'s script tags, not required by `index.js`, only exercised by its own block in `tests/malepropp.tests.js`. Pending decision on wiring it in (it holds raw Propp function descriptions — likely useful as-is for seeing how templates compose) vs. removing it.

### Branches

See [README.md](README.md#branches) for the canonical branch rundown (`master`/`dev`/`gh-pages`/`origin/tumblr` and how they actually relate — `gh-pages` and `tumblr` are not independent siblings of `master`, verify lineage with `git merge-base` before assuming otherwise).

### Dependencies removed this cleanup pass

Sugar (`sugar.min.js`, `require('sugar')`), `sentence-tokenizer` (npm dep, was declared but never actually required anywhere), `.travis.yml`, and `mocha@2.4.5`/`chai@3.5.0`/`vows` are all gone — don't reintroduce without checking why they were removed (see git log on `dev` for the specific commits and reasoning).

### Known issues

- `.eslintrc` exists but is non-functional — no `eslint` installed, nothing in `package.json` scripts runs it, and its `"linebreak-style": ["windows"]` rule would fail on every file in this Unix-authored repo if it ever did run. Pending decision: wire up a real linter/formatter (`standard`, to match the sibling `textgen-monorepo` apps, or `prettier`) or delete the stale config.
