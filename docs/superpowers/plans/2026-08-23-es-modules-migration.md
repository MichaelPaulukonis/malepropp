# ES Modules Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert malepropp's Node CLI, test suite, build script, and browser GUI from CommonJS (`require`/`module.exports`) and browser-global script-tag loading to native ES modules (`import`/`export`), with no bundler.

**Architecture:** Every `lib/*.js` file already returns a single factory function or object (`Cleaner`, `defaultbank`, `nTemplates`, etc.) via `module.exports` - each becomes a plain `export default`. `propp.js` gains explicit `import` statements for `Tokenizer`/`Cleaner` (replacing the `var X = X || require(...)` browser-global-fallback hack) and a runtime-branched load of `nlp_compromise` (npm package in Node, CDN-loaded `window.nlp_compromise` in the browser - these are two different pinned versions already, that divergence is pre-existing and out of scope here). `index.html` collapses from ~14 individually-ordered `<script>` tags to one `<script type="module" src="gui.js">` - the browser's module loader resolves the whole `lib/` dependency graph itself, so load order stops being something a human has to get right. `package.json` gets `"type": "module"` as the one flag-day cutover point: every `.js` file in the repo must be valid ESM syntax *before* that flag flips, because Node parses the whole tree as either CommonJS or ESM, never a per-file mix.

**Tech Stack:** Node 22 native ESM (already the engines floor), evergreen-browser native `<script type="module">`, no webpack/rollup/esbuild.

**Important - this is a flag-day cutover, not an incremental one:** Once any `lib/*.js` file uses `export default`, `require()`-ing it from a still-CommonJS caller throws a `SyntaxError` immediately (Node's CJS parser doesn't understand `export`). Conversely, once `package.json` says `"type": "module"`, a leftover `require(...)` call anywhere throws `ReferenceError: require is not defined` at runtime. There is no way to keep `npm test` green while only some files are converted. Tasks 1-14 below convert file *content* one file at a time (each checked with `npx biome check`, which parses ESM syntax fine regardless of `package.json`'s `type` field, so it catches typos without needing the whole graph to run). Task 15 is the actual cutover (`package.json`). Task 16 is the first point real runtime verification (`npm test`, `node index.js`, browser) becomes possible again - do not expect tests to pass before then.

---

### Task 1: Convert `lib/tokenizer.web.js` to ESM

**Files:**
- Modify: `lib/tokenizer.web.js:66-68`

- [x] **Step 1: Replace the CommonJS export tail**

Old (`lib/tokenizer.web.js:66-68`):
```js
if (typeof module !== "undefined" && module.exports) {
  module.exports = Tokenizer;
}
```

New:
```js
export default Tokenizer;
```

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/tokenizer.web.js`
Expected: no errors (warnings from the pre-existing legacy-baseline rules are fine, per `biome.json`'s downgraded rules - only new `error`-severity findings are a problem)

- [x] **Step 3: Commit**

```bash
git add lib/tokenizer.web.js
git commit -m "refactor: convert tokenizer.web.js to ESM export"
```

---

### Task 2: Convert `lib/cleaner.js` to ESM

**Files:**
- Modify: `lib/cleaner.js:65-66`

- [x] **Step 1: Replace the CommonJS export tail**

Old (`lib/cleaner.js:65-66`):
```js
var module = module || {};
module.exports = Cleaner;
```

New:
```js
export default Cleaner;
```

`Cleaner` stays a factory that takes `Tokenizer` as a constructor argument (`new Cleaner(Tokenizer)` at the call site) - no import needed inside this file, that dependency injection was already correct.

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/cleaner.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/cleaner.js
git commit -m "refactor: convert cleaner.js to ESM export"
```

---

### Task 3: Convert `lib/words.js` to ESM

**Files:**
- Modify: `lib/words.js:859-861`

- [x] **Step 1: Replace the CommonJS export tail**

Old (`lib/words.js:859-861`):
```js
var module = module || {};
module.exports = words;
```

New:
```js
export default words;
```

The file's other top-level `var`s (`adjectives`, `interjections`, etc.) stay exactly as they are - each `.js` file is now its own module scope, so there is no longer any risk of these names colliding with another file's globals (this was the root cause of the `words()`/`words` collision documented in `CLAUDE.md` - Task 18 updates that doc).

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/words.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/words.js
git commit -m "refactor: convert words.js to ESM export"
```

---

### Task 4: Convert `lib/wordbank.test.js` to ESM

**Files:**
- Modify: `lib/wordbank.test.js:483-484`

- [x] **Step 1: Replace the CommonJS export tail**

Old (`lib/wordbank.test.js:483-484`):
```js
var module = module || {};
module.exports = defaultbank;
```

New:
```js
export default defaultbank;
```

`defaultbank` stays a factory taking `words` as a parameter (`defaultbank(words)` at call sites) - unchanged.

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/wordbank.test.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/wordbank.test.js
git commit -m "refactor: convert wordbank.test.js to ESM export"
```

---

### Task 5: Convert `lib/business.wordbank.js` to ESM

**Files:**
- Modify: `lib/business.wordbank.js` (last 2 lines)

- [x] **Step 1: Replace the CommonJS export tail**

Old:
```js
var module = module || {};
module.exports = businessbank;
```

New:
```js
export default businessbank;
```

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/business.wordbank.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/business.wordbank.js
git commit -m "refactor: convert business.wordbank.js to ESM export"
```

---

### Task 6: Convert `lib/templates.js` to ESM

**Files:**
- Modify: `lib/templates.js:2389-2390`

- [x] **Step 1: Replace the CommonJS export tail**

Old (`lib/templates.js:2389-2390`):
```js
var module = module || {};
module.exports = nTemplates;
```

New:
```js
export default nTemplates;
```

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/templates.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/templates.js
git commit -m "refactor: convert templates.js to ESM export"
```

---

### Task 7: Convert `lib/templates.business.js` to ESM

**Files:**
- Modify: `lib/templates.business.js` (last 2 lines)

- [x] **Step 1: Replace the CommonJS export tail**

Old:
```js
var module = module || {};
module.exports = businessTemplates;
```

New:
```js
export default businessTemplates;
```

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/templates.business.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/templates.business.js
git commit -m "refactor: convert templates.business.js to ESM export"
```

---

### Task 8: Convert `lib/templates.descriptive.js` to ESM

**Files:**
- Modify: `lib/templates.descriptive.js` (last 2 lines)

- [x] **Step 1: Replace the CommonJS export tail**

Old:
```js
var module = module || {};
module.exports = descriptiveTemplates;
```

New:
```js
export default descriptiveTemplates;
```

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/templates.descriptive.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/templates.descriptive.js
git commit -m "refactor: convert templates.descriptive.js to ESM export"
```

---

### Task 9: Add an ESM export to `lib/default.templates.js`

**Files:**
- Modify: `lib/default.templates.js` (end of file)

This file currently has **no** `module.exports` at all - it's GUI-only today (`index.js` explicitly comments out requiring it: `// var defaultTemplates = require('./lib/default.templates.js');`). `gui.js` (Task 14) needs to `import` it, so it needs a real export.

- [x] **Step 1: Add an export at the end of the file**

Old (end of `lib/default.templates.js`):
```js
  propp["func31"].templates.push(
    "I was offered a place in the palace, but I could not accept.  I wanted to be with the mountain; I felt it move under my skin as I knew part of me was in the mountain too.",
  );

  return propp;
};
```

New:
```js
  propp["func31"].templates.push(
    "I was offered a place in the palace, but I could not accept.  I wanted to be with the mountain; I felt it move under my skin as I knew part of me was in the mountain too.",
  );

  return propp;
};

export default defaultTemplates;
```

- [x] **Step 2: Syntax check**

Run: `npx biome check lib/default.templates.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add lib/default.templates.js
git commit -m "refactor: add ESM export to default.templates.js"
```

---

### Task 10: Convert `lib/propp.js` to ESM

**Files:**
- Modify: `lib/propp.js:16-20` (head) and `lib/propp.js:1326-1327` (tail)

- [x] **Step 1: Replace the require block with imports**

Old (`lib/propp.js:16-20`):
```js
var nlp_compromise = nlp_compromise || require("nlp_compromise");
var nlp = nlp_compromise;
var Tokenizer = Tokenizer || require("./tokenizer.web.js");
var Cleaner = Cleaner || require("./cleaner");
var cleaner = new Cleaner(Tokenizer);
```

New:
```js
import Tokenizer from "./tokenizer.web.js";
import Cleaner from "./cleaner.js";

// nlp_compromise has no browser-safe build for the pinned 0.2.2 API this
// engine depends on (see CLAUDE.md), so the GUI instead loads a *different*,
// newer version from a CDN as a classic <script> before this module runs,
// exposing it as window.nlp_compromise - that Node/browser version skew is
// pre-existing and out of scope for this change. Static `import
// "nlp_compromise"` would break the browser (bare specifiers don't resolve
// without an import map), so the branch below is a dynamic import, which is
// only ever evaluated in the Node branch.
var nlp =
  typeof window !== "undefined" && window.nlp_compromise
    ? window.nlp_compromise
    : (await import("nlp_compromise")).default;

var cleaner = new Cleaner(Tokenizer);
```

Note the extension change on `Cleaner`'s specifier (`"./cleaner"` -> `"./cleaner.js"`) - ESM resolution requires explicit extensions; CommonJS's implicit `.js`-if-missing behavior doesn't apply.

- [x] **Step 2: Replace the CommonJS export tail**

Old (`lib/propp.js:1326-1327`):
```js
var module = module || {};
module.exports = storyGen;
```

New:
```js
export default storyGen;
```

This must stay the last line of the file, after `storyGen.world = world;`, `storyGen.villainyTypes = {...}`, `storyGen.resetProppFunctions = ...`, and `storyGen.presets = {...}` (all unchanged) - those are mutations on the same function object `storyGen` already refers to, so their position relative to `export default storyGen` doesn't matter functionally, but keeping the export last matches the file's existing structure and avoids re-reviewing unrelated code.

- [x] **Step 3: Syntax check**

Run: `npx biome check lib/propp.js`
Expected: no errors

- [x] **Step 4: Commit**

```bash
git add lib/propp.js
git commit -m "refactor: convert propp.js to ESM, dual-load nlp_compromise for Node/browser"
```

---

### Task 11: Convert `index.js` to ESM

**Files:**
- Modify: `index.js:1-8` (head) and `index.js:69` (inside `writeitout`)

- [x] **Step 1: Replace the require block with imports**

Old (`index.js:1-8`):
```js
// var defaultTemplates = require('./lib/default.templates.js');
var templates = require("./lib/templates.js");
var words = require("./lib/words.js");
// words is a requirement for wordbank.....
var wordbank = require("./lib/wordbank.test.js")(words);
var storygen = require("./lib/propp.js");

var world = storygen().world;
```

New:
```js
// import defaultTemplates from "./lib/default.templates.js";
import templates from "./lib/templates.js";
import words from "./lib/words.js";
import wordbankFactory from "./lib/wordbank.test.js";
import storygen from "./lib/propp.js";
import fs from "node:fs";

// words is a requirement for wordbank.....
var wordbank = wordbankFactory(words);

var world = storygen().world;
```

(`import` statements must be at the top of the file - this is why `fs` moves up from inside `writeitout` to here, and switches from the bare `"fs"` specifier to `"node:fs"` to match the convention already established in `scripts/build-pages.js`.)

- [x] **Step 2: Remove the now-redundant inline require**

Old (`index.js:68-69`, inside `writeitout`):
```js
var writeitout = function (text) {
  var fs = require("fs");

  var fn =
```

New:
```js
var writeitout = function (text) {
  var fn =
```

- [x] **Step 3: Syntax check**

Run: `npx biome check index.js`
Expected: no errors

- [x] **Step 4: Commit**

```bash
git add index.js
git commit -m "refactor: convert index.js to ESM"
```

---

### Task 12: Convert `scripts/build-pages.js` to ESM

**Files:**
- Modify: `scripts/build-pages.js:4-8`

- [x] **Step 1: Replace requires and the `__dirname` usage**

Old (`scripts/build-pages.js:4-8`):
```js
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
```

New:
```js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
```

ESM has no `__dirname`/`__filename` - `import.meta.url` + `fileURLToPath` is the standard replacement. The rest of the file (`fs.rmSync`, `fs.mkdirSync`, the `for...of` copy loop, `fs.cpSync`, `console.log`) is unchanged - `fs`/`path`'s ESM default export has the same API surface as the CJS `require()` return value.

- [x] **Step 2: Syntax check**

Run: `npx biome check scripts/build-pages.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add scripts/build-pages.js
git commit -m "refactor: convert build-pages.js to ESM"
```

---

### Task 13: Convert the 4 test files to ESM

**Files:**
- Modify: `tests/cleaner.tests.js`
- Modify: `tests/deepClone.tests.js`
- Modify: `tests/interpolate.tests.js`
- Modify: `tests/malepropp.tests.js`

All four files wrap their body in a `var tester = (function () { ... })();` IIFE whose only real purpose was to scope the `require()`'d variables - now that those become `import` bindings (already properly module-scoped, `import` statements must live at true top level, not inside a function), the IIFE has nothing left to do and is removed. `describe`/`it` are injected as true globals by the mocha CLI at run time regardless of module type, and none of these files ever call the `mocha` variable they required - only `chai` and the `lib/` files were actually used, so the `require("mocha")` line is simply dropped.

- [x] **Step 1: Convert `tests/cleaner.tests.js`**

Old (`tests/cleaner.tests.js:1-9`):
```js
var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    Tokenizer = require("../lib/tokenizer.web.js"),
    Cleaner = require("../lib/cleaner.js"),
    cleaner = new Cleaner(Tokenizer);

  describe("cleaner tests", function () {
```

New:
```js
import chai from "chai";
import Tokenizer from "../lib/tokenizer.web.js";
import Cleaner from "../lib/cleaner.js";

var expect = chai.expect;
var cleaner = new Cleaner(Tokenizer);

describe("cleaner tests", function () {
```

And at the end of the file (`tests/cleaner.tests.js:42-43`):

Old:
```js
  });
})();
```

New:
```js
});
```

(De-indent the body between these two edits by one level - it was previously inside the IIFE's `describe(...)` call at 2-space indent from the wrapper; `npm run lint:fix` in Step 3 below reformats this automatically, so hand-fixing indentation isn't required.)

- [x] **Step 2: Convert `tests/deepClone.tests.js`**

Old (`tests/deepClone.tests.js:1-7`):
```js
var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    storygen = require("../lib/propp.js");

  describe("storyGen deepClone", function () {
```

New:
```js
import chai from "chai";
import storygen from "../lib/propp.js";

var expect = chai.expect;

describe("storyGen deepClone", function () {
```

And at the end of the file (`tests/deepClone.tests.js:59-60`):

Old:
```js
  });
})();
```

New:
```js
});
```

- [x] **Step 3: Convert `tests/interpolate.tests.js`**

Old (`tests/interpolate.tests.js:1-7`):
```js
var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    storygen = require("../lib/propp.js");

  describe("storyGen interpolate", function () {
```

New:
```js
import chai from "chai";
import storygen from "../lib/propp.js";

var expect = chai.expect;

describe("storyGen interpolate", function () {
```

And at the end of the file (`tests/interpolate.tests.js:78-79`):

Old:
```js
  });
})();
```

New:
```js
});
```

- [x] **Step 4: Convert `tests/malepropp.tests.js`**

Old (`tests/malepropp.tests.js:1-13`):
```js
var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    // TODO: okay, make it an object or array
    slavicTemplates = require("../lib/templates.js"),
    businessTemplates = require("../lib/templates.business.js"),
    brownTemplates = require("../lib/default.templates.js"),
    descriptiveTemplates = require("../lib/templates.descriptive.js"),
    wordbank = require("../lib/wordbank.test.js")(require("../lib/words.js")),
    storygen = require("../lib/propp.js"),
    world = storygen().world; // hey, we're assuming this works w/o testing!
```

New:
```js
import chai from "chai";
// TODO: okay, make it an object or array
import slavicTemplates from "../lib/templates.js";
import businessTemplates from "../lib/templates.business.js";
import brownTemplates from "../lib/default.templates.js";
import descriptiveTemplates from "../lib/templates.descriptive.js";
import wordbankFactory from "../lib/wordbank.test.js";
import words from "../lib/words.js";
import storygen from "../lib/propp.js";

var expect = chai.expect;
var wordbank = wordbankFactory(words);
var world = storygen().world; // hey, we're assuming this works w/o testing!
```

And at the very end of the file (`tests/malepropp.tests.js:187`):

Old:
```js
})();
```

New: delete this line entirely (no replacement) - the file now just ends after the last `describe(...)` block's closing `});`.

- [x] **Step 5: Syntax check all four files**

Run: `npx biome check tests/`
Expected: no errors

- [x] **Step 6: Commit**

```bash
git add tests/
git commit -m "refactor: convert test suite to ESM"
```

---

### Task 14: Convert `gui.js` to ESM

**Files:**
- Modify: `gui.js:1` (insert imports before existing content)

`gui.js` currently has no `require`/`module.exports` at all - it relied entirely on browser globals set by earlier `<script>` tags (`storyGen`, `words`, `nTemplates`, `defaultbank`, `businessTemplates`, `businessbank`, `descriptiveTemplates`, `defaultTemplates`, and `world`, which it never declares itself, per `CLAUDE.md`'s documented quirk about `gui.js` loading before `propp.js`). None of that changes here - only the *source* of those bindings changes, from ambient globals to explicit imports at the top of the file. The rest of `gui.js` is untouched.

- [x] **Step 1: Add imports at the top of the file**

Old (`gui.js:1`):
```js
var gui = (function () {
```

New:
```js
import storyGen from "./lib/propp.js";
import words from "./lib/words.js";
import nTemplates from "./lib/templates.js";
import defaultbank from "./lib/wordbank.test.js";
import businessTemplates from "./lib/templates.business.js";
import businessbank from "./lib/business.wordbank.js";
import descriptiveTemplates from "./lib/templates.descriptive.js";
import defaultTemplates from "./lib/default.templates.js";

var world = storyGen.world;

var gui = (function () {
```

The `document.addEventListener("DOMContentLoaded", ...)` block at the bottom of the file (`gui.js:248-339`, using `storyGen.presets` and `world.func8subfuncs`) stays exactly as-is - that deferral exists because the DOM elements it queries (`#presets`, `#func8subfunc`) don't exist until parsing finishes, which is unrelated to and unaffected by this module conversion.

- [x] **Step 2: Syntax check**

Run: `npx biome check gui.js`
Expected: no errors

- [x] **Step 3: Commit**

```bash
git add gui.js
git commit -m "refactor: convert gui.js to ESM, import lib deps explicitly"
```

---

### Task 15: Update `index.html` for module script loading

**Files:**
- Modify: `index.html:194-217`

Because `gui.js` now `import`s the entire `lib/` dependency graph itself, the browser's module loader resolves it automatically - the ~12 individually-ordered `<script src="lib/...">` tags collapse to a single entry point. The `delete (window.module)` hack at the bottom also goes away: it existed only to erase the `window.module` global that the old `var module = module || {}` CommonJS-fallback pattern created, and no file does that anymore after Tasks 1-10.

- [x] **Step 1: Replace the script-loading block**

Old (`index.html:194-217`):
```html
  <!-- TODO: this should be local. ??? it slows down loading.... -->
  <script src="https://unpkg.com/nlp_compromise@4.1.2/builds/nlp_compromise.js"></script>
  <script type="text/javascript" src="lib/tokenizer.web.js"></script>
  <script type="text/javascript" src="lib/cleaner.js"></script>

  <script type="text/javascript" src="lib/default.templates.js"></script>
  <script type="text/javascript" src="lib/templates.js"></script>
  <script type="text/javascript" src="lib/words.js"></script>
  <script type="text/javascript" src="lib/wordbank.test.js"></script>

  <script type="text/javascript" src="lib/templates.business.js"></script>
  <script type="text/javascript" src="lib/business.wordbank.js"></script>

  <script type="text/javascript" src="lib/templates.descriptive.js"></script>

  <script type="text/javascript" src="gui.js"></script>
  <script type="text/javascript" src="lib/propp.js"></script>

  <script type="text/javascript">
    // remove when running in browser
    // one of the npm modules won't work in the browser if it remains
    // TODO: document which one!
    delete (window.module);
  </script>

</body>
```

New:
```html
  <!-- TODO: this should be local. ??? it slows down loading.... -->
  <!-- Classic (non-module) script, loaded first: sets window.nlp_compromise -->
  <!-- for lib/propp.js to pick up - see the comment in propp.js. -->
  <script src="https://unpkg.com/nlp_compromise@4.1.2/builds/nlp_compromise.js"></script>

  <!-- Single module entry point - gui.js imports the rest of lib/ itself, -->
  <!-- so the browser's module loader resolves the whole dependency graph; -->
  <!-- no manual script-tag ordering needed. -->
  <script type="module" src="gui.js"></script>

</body>
```

- [x] **Step 2: Commit**

```bash
git add index.html
git commit -m "refactor: load GUI as a single ES module entry point"
```

---

### Task 16: Flip the cutover flag and verify everything

**Files:**
- Modify: `package.json:1-8`

This is the flag-day cutover. Every `.js` file in the repo has been ESM-only since Tasks 1-15 (they'd already fail if loaded as CommonJS); this step tells Node to actually load them that way.

- [ ] **Step 1: Add `"type": "module"` to `package.json`**

Old (`package.json:1-8`):
```json
{
  "name": "malepropp",
  "version": "0.5.0",
  "description": "Story Generator using Proppiann Narratemes",
  "author": "Michael Paulukonis",
  "main": "index.js",
  "engines": {
    "node": ">=22.0.0"
  },
```

New:
```json
{
  "name": "malepropp",
  "version": "0.5.0",
  "description": "Story Generator using Proppiann Narratemes",
  "author": "Michael Paulukonis",
  "main": "index.js",
  "type": "module",
  "engines": {
    "node": ">=22.0.0"
  },
```

- [ ] **Step 2: Run the full lint**

Run: `npm run lint`
Expected: exits 0 (only pre-existing `warn`-level findings from the legacy-baseline rules in `biome.json`, no new `error`-level findings)

If there are unexpected formatting-only diffs from de-indenting the test files in Task 13, run `npm run lint:fix` (safe fixes only) and re-check.

- [ ] **Step 3: Run the test suite**

Run: `npm test`
Expected: all 141 tests pass (same count as before this migration - this is a syntax/loading refactor, not a behavior change)

If this fails, the error will point at whichever file still has a leftover `require`/`module.exports` or a missing `.js` extension on a relative import - re-check that file against its Task above before proceeding.

- [ ] **Step 4: Run the Node CLI smoke test**

Run: `node index.js`
Expected: prints `Written to wonder.tale.<random>.txt` then `DONE`, with no stack trace. Confirm the file exists and is non-trivial:

```bash
ls -la wonder.tale.*.txt
wc -w wonder.tale.*.txt
```

Expected: file exists, word count near 50000 (the CLI's target). Delete the generated file afterward (it's a local smoke-test artifact, already gitignored the same way prior runs were - confirm with `git status` that it doesn't show as untracked before deleting, and delete only if it does).

- [ ] **Step 5: Run the GUI build**

Run: `npm run build:pages`
Expected: prints `Staged GUI files into <path>/dist`, no errors. Confirm the staged files are what Task 15 produced:

```bash
grep -c "script" dist/index.html
cat dist/gui.js | head -5
```

Expected: `dist/index.html` has the two-script-tag block from Task 15; `dist/gui.js` starts with the `import` block from Task 14.

- [ ] **Step 6: Smoke-test the GUI in a real browser**

The module scripts need to be served over HTTP (`file://` blocks ES module imports via CORS) - start a static server from the repo root:

```bash
npx serve -l 5500 .
```

Then, using browser automation (`claude-in-chrome` or equivalent):
1. Navigate to `http://localhost:5500/index.html`
2. Open the browser console and confirm there are no errors on load (in particular, no "Failed to resolve module specifier" or "require is not defined")
3. Confirm the `Preset` dropdown is populated (proves `storyGen.presets` from the `DOMContentLoaded` handler in `gui.js` loaded correctly)
4. Click `Generate` with the default settings
5. Confirm the `Output` textarea populates with a non-empty story
6. Switch the `Theme` radio to `Office Setting`, click `Generate` again, confirm output changes and no console errors appear (this exercises the `businessbank`/`businessTemplates` imports)

Stop the static server (`Ctrl+C` in its terminal, or kill the background process) once verified.

- [ ] **Step 7: Commit**

```bash
git add package.json
git commit -m "chore: enable native ES modules (type: module)"
```

---

### Task 17: Update `CLAUDE.md` to reflect the ESM structure

**Files:**
- Modify: `CLAUDE.md` (the "order matters" / global-namespace paragraph in the Architecture section)

The existing `CLAUDE.md` documents the pre-conversion browser-global-collision hazard as live, current guidance (`"Files loaded as <script> tags in index.html share one global namespace..."` and the accompanying `words()`/`words` collision war story). After this migration that hazard no longer exists - each file is its own module scope - so leaving the warning as-is would actively mislead a future reader into thinking script-tag order still matters.

- [ ] **Step 1: Read the current Architecture section**

Run: `grep -n "share one global namespace" CLAUDE.md`

Locate the full paragraph (from `**Files loaded as \`<script>\` tags...**` through the end of that paragraph, and the following paragraph about the `var x = x || require('./y.js')` pattern).

- [ ] **Step 2: Replace the stale warning with the current ESM structure**

Replace both paragraphs (the global-namespace-collision warning and the `var x = x || require(...)` pattern explanation) with:

```markdown
**`lib/*.js` files are real ES modules** (`package.json` has `"type": "module"`) - each file has its own module scope and exports explicitly via `export default`, imported explicitly wherever it's used. This replaced an older setup where every `lib/*.js` file was loaded as a plain `<script>` tag sharing one global namespace, which caused a real bug: a helper function named `words()` added to `lib/tokenizer.web.js` was silently overwritten by `lib/words.js`'s own global `words` data object, loaded later in script-tag order - Node's tests passed fine (separate `require()` module scopes) while the browser broke (`words is not a function`). That whole class of bug is now structurally impossible - there's no shared global namespace left to collide in.

`index.html` loads a single `<script type="module" src="gui.js">` entry point; `gui.js`'s own `import` statements pull in the rest of `lib/` and the browser's module loader resolves that graph itself; no manually-ordered script-tag list to get wrong.

`lib/propp.js` is the one file with an environment-branched import: `nlp_compromise` has no browser-safe build for the pinned `0.2.2` API this engine depends on, so the GUI loads a *different*, newer version from a CDN as a classic (non-module) `<script>` before `gui.js` runs, exposing it as `window.nlp_compromise`; `propp.js` picks that up at runtime if present, otherwise dynamically imports the pinned npm package (Node path). That Node/browser version skew is pre-existing, not introduced by the ESM migration - see the `nlp_compromise@~0.2.2` note below.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for ESM module structure"
```

---

### Task 18: Close out the bead

- [ ] **Step 1: Close the beads issue**

Run: `bd close malepropp-a2u --reason="Converted lib/, index.js, gui.js, tests/, and scripts/build-pages.js to native ES modules; index.html now loads a single module entry point. No bundler introduced."`

- [ ] **Step 2: Report final status**

Run: `git status` and `git log --oneline main..HEAD` to summarize the branch's commits for handoff. Per this repo's conservative git profile, stop here - do not push or open a PR without the user's explicit go-ahead.

---

## Self-Review Notes

- **Spec coverage:** All of `lib/*.js` (9 files), `index.js`, `gui.js`, `index.html`, `scripts/build-pages.js`, `package.json`, and all 4 files in `tests/` are covered (Tasks 1-16). `npm test`, `npm run lint`, `node index.js`, and the browser GUI are all explicitly re-verified in Task 16. `CLAUDE.md`'s now-stale documentation is corrected in Task 17, since leaving it wrong would undermine the whole point of documenting the codebase accurately.
- **Out of scope, deliberately:** `scripts/jquery.min.js` and `scripts/underscore.js` (unused vendored leftovers, per `CLAUDE.md`) are untouched - they're not required by anything and Biome already excludes them. The `nlp_compromise` Node/browser version skew (`0.2.2` pinned vs. `4.1.2` CDN) is flagged in Tasks 10 and 17 but not fixed - fixing it would be a behavior change riding on top of a module-syntax refactor, which is exactly the kind of scope creep this plan should avoid. No internal logic in `propp.js`/`templates.js` changes (that's beads `malepropp-x82`/`malepropp-e9j`, separate work).
- **Placeholder scan:** every step above has literal before/after code, exact file paths, and exact commands with expected output - no "similarly for the rest" or "add appropriate handling" placeholders.
- **Type/name consistency:** `wordbankFactory` is the import name used consistently everywhere `wordbank.test.js`'s default export is imported (`index.js` Task 11, `tests/malepropp.tests.js` Task 13) to avoid shadowing the `wordbank` variable each caller builds from it; `words` is imported directly (not aliased) everywhere it's needed as the `words` factory argument, matching its own file's identity.
