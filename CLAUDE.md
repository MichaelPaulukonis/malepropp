# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Story generator using Vladimir Propp's narrative "functions" (Proppian narratemes) to combinatorially assemble fairy-tale-shaped stories from templates. Two consumers share one generation engine:

- **Node headless CLI** (`index.js`, the "novel builder") — generates stories until a word-count target, writes to a `.txt` file. Requires the engine from `lib/`.
- **Browser GUI** (`index.html` + `gui.js`, vanilla DOM — jQuery and underscore were both removed from `gui.js`/`lib/propp.js`/`index.html`; `scripts/jquery.min.js`, `scripts/underscore.js`, and their `package.json` entries are unused leftovers, deliberately not yet deleted) — deployed to GitHub Pages at `michaelpaulukonis.github.io/malepropp`. Loads via a single `<script type="module" src="gui.js">` entry point; `gui.js`'s own `import`s pull in the rest of `lib/`.

Engine (`lib/`): `propp.js`, `templates.js`/`templates.business.js`/`templates.descriptive.js`/`default.templates.js`, `words.js`, `business.wordbank.js`, `wordbank.test.js`, `cleaner.js`, `tokenizer.web.js`, `god/` (extracted concern modules from `propp.js`'s `god()` - `god/pronouns.js` (gender lexicon) and `god/characters.js` (character-creation cluster: createCharacter/createCharacters/createFamily/createHero/createVillain/createMagicalHelper/createHome/createFalsehero/createMagicalitem/createPunished/getCharacter, wired via `createCharacterHelpers(deps)` - one options object, not positional args); more clusters land as malepropp-x82 progresses). GUI-only files stay at repo root: `index.html`, `gui.js`, `propp.css`, and vendored (unused) `scripts/jquery.min.js` and `scripts/underscore.js`.

Currently a standalone repo. Under active consideration for import into `textgen-monorepo` as `libs/malepropp` (engine only) — mid-cleanup on `main` first, not yet moved.

## Commands

```bash
npm install
npm test              # mocha tests/ — all tests, currently 292 passing on Node 22
npm run test_cleaner   # mocha tests/cleaner.tests.js
npm run test_propp     # mocha tests/malepropp.tests.js
node index.js          # generates stories to ~50k words, writes wonder.tale.<rand>.txt to cwd
```

## Architecture

### Engine vs. presentation, physically split

`lib/` holds the Node-consumable engine; GUI files stay at repo root. `index.js`, `tests/*.tests.js`, and `gui.js` all `import` from `./lib/...` explicitly (`package.json` has `"type": "module"` — every `.js` file in the repo is a real ES module, `import`/`export`, no bundler). `index.html` loads a single `<script type="module" src="gui.js">` entry point; `gui.js`'s own imports pull in the rest of `lib/` and the browser's module loader resolves that graph itself — there's no manually-ordered list of `<script>` tags left to get wrong.

**Each `.js` file is its own module scope now — the old shared-global-namespace hazard is gone.** It used to bite hard: a helper function named `words()` added to `lib/tokenizer.web.js` was silently overwritten by `lib/words.js`'s own global `words` data object, loaded later in script-tag order — Node's tests passed fine (separate `require()` scopes) while the browser broke (`words is not a function`). That whole class of bug is now structurally impossible: with real ES modules, a name declared in one file is simply invisible to another unless explicitly `export`ed and `import`ed.

**Inline HTML event-handler attributes (`onclick="..."`) don't work for anything defined in `gui.js`.** Inline handlers always execute in global/`window` scope, but `gui.js`'s top-level bindings are module-scoped, not global — this broke the Generate button once already (`onclick="javascript:guiGet();"` threw `ReferenceError: guiGet is not defined`) before it was fixed to use `addEventListener` inside `gui.js`'s `DOMContentLoaded` handler, matching the pattern already used for Randomize/Clear. If you add a new button or interactive element to `index.html`, wire it the same way — `addEventListener` in `gui.js`, never an inline `onclick=` referencing a `gui.js` function.

**`lib/propp.js` is the one file with an environment-branched import.** `nlp_compromise` has no browser-safe build for the pinned `0.2.2` API this engine depends on (see below), so the GUI loads a *different*, newer version from a CDN (currently pinned in the `<script>` URL in `index.html`) as a classic (non-module) `<script>` before `gui.js` runs, exposing it as `window.nlp_compromise`; `propp.js` picks that up at runtime if present, otherwise dynamically imports the pinned npm package (the Node path). That Node/browser version skew is pre-existing, not something the ES-modules migration introduced or fixed.

**`nlp_compromise@~0.2.2` is load-bearing and should not be casually upgraded.** It predates the `compromise` package (what `poeticalbot`/`listmania` in textgen-monorepo use, at v11–13) and has a completely different API. Templates may depend on its specific 0.2.2 behavior in ways that aren't obvious from reading `propp.js` alone.

**`wordbank.test.js` is not a test file** despite the name — `index.js` imports its default export directly and calls it as a factory: `import wordbankFactory from "./lib/wordbank.test.js"; var wordbank = wordbankFactory(words);`. Don't let the `.test.js` suffix fool you into thinking it's covered by/excluded from the test runner.

**`lib/templates.descriptive.js` is wired in as a 4th GUI theme** ("Descriptive (raw function skeleton)"), exporting `descriptiveTemplates` as its default export — a distinct local name from `templates.js`'s `nTemplates` default export, so `gui.js` can `import` both without collision. It has no title generator (`story.title`), unlike the other three themes — `gui.js`'s `shoveToGui()` has a defensive fallback for this. `func0` ("Initial situation") now has content (two templates) despite the file's own stale comment claiming it's missing. `tests/malepropp.tests.js`'s generic per-function theme harness now covers both `brown` (`lib/default.templates.js`) and `descriptive` alongside `slavic`/`business` — it tolerates a missing `story.title` (only asserts title shape when one is actually produced) and special-cases `brown`'s deliberately-blank `func0` placeholder. Enabling them surfaced real bugs, since fixed: `descriptiveTemplates` called `hero()` as a function throughout (the `universe.hero` exposed to templates is a plain object, not a function — fixed to `hero.nickname`, matching the pattern already used in `templates.js`/`templates.business.js`), `func8a` had no template at all (an active func with an empty `templates` array crashed `sentence()` — added minimal content, and hardened `sentence()` to treat an empty templates array as "no templates" instead of crashing).

**`gui.js`'s top-level code can safely use anything `lib/propp.js` defines** (`storyGen` itself, or properties attached to it like `storyGen.world`) — static `import` guarantees the imported module fully evaluates before `gui.js`'s own top-level code runs, unlike the old script-tag-order dependency this replaced. The `document.addEventListener("DOMContentLoaded", ...)` deferral at the bottom of `gui.js` is still needed, but only because the DOM elements it queries (`#presets`, `#func8subfunc`, etc.) don't exist until parsing finishes — that's unrelated to and unaffected by module loading.

### Branches

See [README.md](README.md#branches) for the canonical branch rundown (`main`/`gh-pages`/`legacy`/`origin/tumblr` and how they actually relate — `gh-pages` and `tumblr` are not independent siblings of `main`, verify lineage with `git merge-base` before assuming otherwise). `main` replaced the old `master`+`dev` pair on 2026-08-19 — `dev`'s history became `main`, and the old `master` was preserved as `legacy`.

### Dependencies removed this cleanup pass

Sugar (`sugar.min.js`, `require('sugar')`), `sentence-tokenizer` (npm dep, was declared but never actually required anywhere), `.travis.yml`, `.eslintrc` (non-functional — superseded by Biome), and `mocha@2.4.5`/`chai@3.5.0`/`vows` are all gone — don't reintroduce without checking why they were removed (see git log on `main` for the specific commits and reasoning).

### Linting/formatting: Biome

`biome.json`, scoped to `**/*.js` only — excludes `scripts/jquery.min.js` and `scripts/underscore.js` specifically (vendored third-party, not ours to reformat; `scripts/build-pages.js` is ours and stays linted) and `index.html` (Biome's HTML/a11y linter is a separate, more opinionated concern; it flags the deliberate `accesskey="g"` the UI documents as a feature — out of scope).

`linter.rules.complexity.useArrowFunction` is explicitly `"off"`. Its "safe" auto-fix converted `function Cleaner(...)` (used elsewhere as `new Cleaner(...)`) into an arrow function, which throws `TypeError: Cleaner is not a constructor` — the rule can't see call sites outside the function body, so it can't tell a constructor from a plain function expression. **Don't trust Biome's "safe" fix labels without running the test suite (and ideally the browser) afterward** — this codebase's old-style constructors and `arguments`-object usage (`propp.js`'s `select()` helper) are exactly the patterns modern "safe" refactors misjudge.

Four rules are downgraded from `error` to `warn` as a deliberate legacy baseline (`noInnerDeclarations` — 103 of 130 original errors, old-style `var`/`function` inside blocks; `noDoubleEquals`; `noInvalidUseBeforeDeclaration`; `noAssignInExpressions`) — pre-existing violations, not auto-fixable, not disabled (still visible via `npm run lint`), just not commit-blocking. Don't silently re-tighten these to `error` without first fixing (or accepting) the backlog — it'll block unrelated commits to nearly every file in the repo.

**Pre-commit hook is active**: `.githooks/pre-commit` (activated via `git config core.hooksPath .githooks`, auto-activates on `npm install` via the `prepare` script) runs `biome check` on staged `.js` files and blocks the commit on any `error`-severity finding. Override for one commit with `git commit --no-verify`; disable permanently with `git config --unset core.hooksPath`.

`npm run lint` / `npm run lint:fix` (safe fixes only — use `--unsafe` manually, and verify before trusting).


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:6cd5cc61 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Agent Context Profiles

The managed Beads block is task-tracking guidance, not permission to override repository, user, or orchestrator instructions.

- **Conservative (default)**: Use `bd` for task tracking. Do not run git commits, git pushes, or Dolt remote sync unless explicitly asked. At handoff, report changed files, validation, and suggested next commands.
- **Minimal**: Keep tool instruction files as pointers to `bd prime`; use the same conservative git policy unless active instructions say otherwise.
- **Team-maintainer**: Only when the repository explicitly opts in, agents may close beads, run quality gates, commit, and push as part of session close. A current "do not commit" or "do not push" instruction still wins.

## Session Completion

This protocol applies when ending a Beads implementation workflow. It is subordinate to explicit user, repository, and orchestrator instructions.

1. **File issues for remaining work** - Create beads for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **Handle git/sync by active profile**:
   ```bash
   # Conservative/minimal/default: report status and proposed commands; wait for approval.
   git status

   # Team-maintainer opt-in only, unless current instructions forbid it:
   git pull --rebase
   git push
   git status
   ```
5. **Hand off** - Summarize changes, validation, issue status, and any blocked sync/commit/push step

**Critical rules:**
- Explicit user or orchestrator instructions override this Beads block.
- Do not commit or push without clear authority from the active profile or the current user request.
- If a required sync or push is blocked, stop and report the exact command and error.
<!-- END BEADS INTEGRATION -->
