# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Story generator using Vladimir Propp's narrative "functions" (Proppian narratemes) to combinatorially assemble fairy-tale-shaped stories from templates. Two consumers share one generation engine:

- **Node headless CLI** (`index.js`, the "novel builder") — generates stories until a word-count target, writes to a `.txt` file. Requires the engine from `lib/`.
- **Browser GUI** (`index.html` + `gui.js`, vanilla DOM — jQuery was removed from `gui.js`/`index.html`; `scripts/jquery.min.js` and the `jquery` entry in `package.json` are unused leftovers, deliberately not yet deleted) — deployed to GitHub Pages at `michaelpaulukonis.github.io/malepropp`. Loads the same `lib/*.js` files as plain `<script>` tags.

Engine (`lib/`): `propp.js`, `templates.js`/`templates.business.js`/`templates.descriptive.js`/`default.templates.js`, `words.js`, `business.wordbank.js`, `wordbank.test.js`, `cleaner.js`, `tokenizer.web.js`. GUI-only files stay at repo root: `index.html`, `gui.js`, `propp.css`, vendored (unused) `scripts/jquery.min.js`, and still-used `scripts/underscore.js`.

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

**`lib/templates.descriptive.js` is wired in as a 4th GUI theme** ("Descriptive (raw function skeleton)"), exporting `descriptiveTemplates` — not `nTemplates` (that name is `templates.js`'s, and colliding with it silently breaks the default "Vaguely Russian" theme, the same class of bug as the `words()` collision above). It has no title generator (`story.title`), unlike the other three themes — `gui.js`'s `shoveToGui()` has a defensive fallback for this. `func0` ("Initial situation") is still genuinely unfilled — the file's own comment flags it. `tests/malepropp.tests.js` deliberately still excludes it from the generic per-function theme harness (`// , 'descriptive': descriptiveTemplates`) — that harness assumes every theme defines `story.title`, which this one doesn't; enabling it is a bigger job than fixing the missing title alone.

**`gui.js` loads before `lib/propp.js` in `index.html`** (line 228 vs. 229) — `storyGen`/`world` (defined in `propp.js`) aren't available to any *top-level* code in `gui.js`, only to code inside functions that run later (event handlers, etc.). `gui.js`'s bottom-of-file preset/func8 population code needs `storyGen.presets`/`world.func8subfuncs` and works around this by deferring to `document.addEventListener("DOMContentLoaded", ...)` rather than running inline — `DOMContentLoaded` doesn't fire until every parser-blocking `<script>` tag, including the later `propp.js`, has executed. If you add new top-level (not-inside-a-function) code to `gui.js` that reads anything from `propp.js`, it needs the same `DOMContentLoaded` deferral or it will throw `ReferenceError` on load.

### Branches

See [README.md](README.md#branches) for the canonical branch rundown (`master`/`dev`/`gh-pages`/`origin/tumblr` and how they actually relate — `gh-pages` and `tumblr` are not independent siblings of `master`, verify lineage with `git merge-base` before assuming otherwise).

### Dependencies removed this cleanup pass

Sugar (`sugar.min.js`, `require('sugar')`), `sentence-tokenizer` (npm dep, was declared but never actually required anywhere), `.travis.yml`, `.eslintrc` (non-functional — superseded by Biome), and `mocha@2.4.5`/`chai@3.5.0`/`vows` are all gone — don't reintroduce without checking why they were removed (see git log on `dev` for the specific commits and reasoning).

### Linting/formatting: Biome

`biome.json`, scoped to `**/*.js` only — excludes `scripts/` (vendored third-party `jquery.min.js`/`underscore.js`, not ours to reformat) and `index.html` (Biome's HTML/a11y linter is a separate, more opinionated concern; it flags the deliberate `accesskey="g"` the UI documents as a feature — out of scope).

`linter.rules.complexity.useArrowFunction` is explicitly `"off"`. Its "safe" auto-fix converted `function Cleaner(...)` (used elsewhere as `new Cleaner(...)`) into an arrow function, which throws `TypeError: Cleaner is not a constructor` — the rule can't see call sites outside the function body, so it can't tell a constructor from a plain function expression. **Don't trust Biome's "safe" fix labels without running the test suite (and ideally the browser) afterward** — this codebase's old-style constructors and `arguments`-object usage (`propp.js`'s `select()` helper) are exactly the patterns modern "safe" refactors misjudge.

Four rules are downgraded from `error` to `warn` as a deliberate legacy baseline (`noInnerDeclarations` — 103 of 130 original errors, old-style `var`/`function` inside blocks; `noDoubleEquals`; `noInvalidUseBeforeDeclaration`; `noAssignInExpressions`) — pre-existing violations, not auto-fixable, not disabled (still visible via `npm run lint`), just not commit-blocking. Don't silently re-tighten these to `error` without first fixing (or accepting) the backlog — it'll block unrelated commits to nearly every file in the repo.

**Pre-commit hook is active**: `.githooks/pre-commit` (activated via `git config core.hooksPath .githooks`, auto-activates on `npm install` via the `prepare` script) runs `biome check` on staged `.js` files and blocks the commit on any `error`-severity finding. Override for one commit with `git commit --no-verify`; disable permanently with `git config --unset core.hooksPath`.

`npm run lint` / `npm run lint:fix` (safe fixes only — use `--unsafe` manually, and verify before trusting).
