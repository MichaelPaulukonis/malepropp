# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Story generator using Vladimir Propp's narrative "functions" (Proppian narratemes) to combinatorially assemble fairy-tale-shaped stories from templates. Two consumers share one generation engine, and neither is a `src/`-organized app — everything lives flat at repo root:

- **Node headless CLI** (`index.js`, the "novel builder") — generates stories until a word-count target, writes to a `.txt` file.
- **Browser GUI** (`index.htm` + `gui.js`, jQuery-driven) — deployed to GitHub Pages at `michaelpaulukonis.github.io/malepropp`.

Engine: `propp.js` + `templates.js`/`templates.business.js`/`templates.descriptive.js`/`default.templates.js` + `words.js` + `business.wordbank.js` + `cleaner.js`.

Currently a standalone repo (`node >6.0` declared engine — actually last verified against Node 22). Under active consideration for import into `textgen-monorepo` as `libs/malepropp` (engine only; GUI likely stays here or moves to the monorepo's `static/`).

## Commands

```bash
npm install
npm test              # mocha tests/ — all tests, currently 127 passing on Node 22
npm run test_cleaner   # mocha tests/cleaner.tests.js
npm run test_propp     # mocha tests/malepropp.tests.js
node index.js          # generates stories to ~50k words, writes wonder.tale.<rand>.txt to cwd
```

devDependencies (`mocha@2.4.5`, `chai@3.5.0`, `vows@~0.7.0`) are ancient and produce `npm audit` noise on install — that's dev-tooling only, not a runtime risk, and slated for modernization (see Known Issues).

## Architecture

### Engine vs. presentation split (not yet physically separated)

The generation engine (`propp.js` and friends) is plain CommonJS and Node-clean. The GUI (`gui.js`) does real DOM/jQuery work, not just cosmetic — it's a genuine browser dependency, not dead weight. `sugar.min.js` (bundled) and `jquery` are GUI-only; `underscore` and `nlp_compromise` are engine dependencies, required by both consumers.

**`nlp_compromise@~0.2.2` is load-bearing and should not be casually upgraded.** It predates the `compromise` package (what `poeticalbot`/`listmania` in textgen-monorepo use, at v11–13) and has a completely different API. Templates may depend on its specific 0.2.2 behavior in ways that aren't obvious from reading `propp.js` alone.

**`wordbank.test.js` is not a test file** despite the name — `index.js` requires it directly as a module: `require('./wordbank.test.js')(words)`. Don't let the `.test.js` suffix fool you into thinking it's covered by/excluded from the test runner.

### Branches carry real, divergent history

- `gh-pages` — the deployed GUI. **Separate branch, not `master`'s root or a `docs/` folder** — restructuring `master`'s file layout does not affect the live page.
- `origin/tumblr` — a working Tumblr-posting bot lived here (`index.js` posted to `fairytalesbot.tumblr.com` via the `tumblrwks` client, Heroku `Procfile` worker dyno, commit `ee87a17 "working tumblr poster"`). Credentials lived in a gitignored `config.js`, never committed — code survives, creds don't. This branch also has independent evolution of `cleaner.js`/`templates.business.js`/wordbank handling that `master` may not have — **diff before assuming `master` is the canonical version of shared files.**

### Known issues

- `index.js`'s `writeitout()` calls `fs.writeFile(fn, text)` with no callback — throws `ERR_INVALID_ARG_TYPE` on current Node. The story-generation path itself (`propp.js` core, exercised by the test suite) is unaffected; only the CLI's file-write step is broken.
- `package.json` engines field (`>6.0`) doesn't reflect what's actually been verified (Node 22).
