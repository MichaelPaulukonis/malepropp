# Seedable RNG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `lib/propp.js`'s story generation reproducible: `storyGen.seed(n)` (or `settings.seed`) pins every internal random draw to a deterministic sequence, so two `generate()` calls with the same seed and settings produce byte-identical output — while unseeded behavior stays exactly as it is today (real `Math.random()`).

**Architecture:** One module-scope `nextRandom()` helper in `propp.js` that all 5 existing `Math.random()` call sites route through. Unseeded, it's `Math.random()` verbatim. Seeded (via `storyGen.seed(n)`), it draws from an inline mulberry32 generator. `god.randomProperty` needs no separate change — it's already an alias of the same module-level function, so it inherits seeding automatically.

**Tech Stack:** Vanilla JS (ES modules), mocha + chai (existing test stack), no new dependencies.

---

## Reference: current call sites (before this plan)

```
lib/propp.js:138   if (Math.random() < 1 / ++count) result = obj[prop];   // world.util.randomProperty
lib/propp.js:160   var num = Math.floor(Math.random() * limit);           // random()
lib/propp.js:165   return arr[Math.floor(Math.random() * arr.length)];    // pick()
lib/propp.js:169   var index = Math.floor(Math.random() * arr.length);    // pickRemove()
lib/propp.js:179   return Math.random() < chance;                        // coinflip()
```

## File Structure

- Modify: `lib/propp.js` — add module-scope RNG core + `storyGen.seed`/`storyGen.unseed` statics; route the 5 call sites above through it; add `settings.seed` constructor sugar.
- Create: `tests/seed.tests.js` — new test file covering seeded determinism, differing seeds, `settings.seed` sugar, and `unseed()`.

---

### Task 1: Write failing tests for seeded determinism

**Files:**
- Create: `tests/seed.tests.js`

- [ ] **Step 1: Write the test file**

```js
import chai from "chai";
import storygen from "../lib/propp.js";
import slavicTemplates from "../lib/templates.js";
import wordbankFactory from "../lib/wordbank.test.js";
import words from "../lib/words.js";

var expect = chai.expect;
var wordbank = wordbankFactory(words);

var commonSettings = function () {
  var setts = {
    herogender: "female",
    villaingender: "female",
    peoplegender: "female",
    functions: storygen.resetProppFunctions(),
    funcs: ["func0", "func2", "func3", "func8", "func30", "func31"],
    bossmode: false,
    verbtense: "past",
    conclusion: false,
  };

  var theme = {
    bank: wordbank,
    templates: slavicTemplates,
  };

  return { settings: setts, theme: theme };
};

describe("storyGen.seed", function () {
  afterEach(function () {
    storygen.unseed();
  });

  it("produces byte-identical tale text across two generate() calls with the same seed", function () {
    var cs1 = commonSettings();
    storygen.seed(12345);
    var sg1 = new storygen(cs1.settings);
    var story1 = sg1.generate(cs1.settings, cs1.theme);

    var cs2 = commonSettings();
    storygen.seed(12345);
    var sg2 = new storygen(cs2.settings);
    var story2 = sg2.generate(cs2.settings, cs2.theme);

    expect(story2.tale).to.equal(story1.tale);
    expect(story2.title).to.equal(story1.title);
  });

  it("produces different tale text for two different seeds", function () {
    var cs1 = commonSettings();
    storygen.seed(1);
    var sg1 = new storygen(cs1.settings);
    var story1 = sg1.generate(cs1.settings, cs1.theme);

    var cs2 = commonSettings();
    storygen.seed(2);
    var sg2 = new storygen(cs2.settings);
    var story2 = sg2.generate(cs2.settings, cs2.theme);

    expect(story2.tale).to.not.equal(story1.tale);
  });

  it("settings.seed on construction is equivalent to calling storyGen.seed() first", function () {
    var cs1 = commonSettings();
    cs1.settings.seed = 999;
    var sg1 = new storygen(cs1.settings);
    var story1 = sg1.generate(cs1.settings, cs1.theme);

    var cs2 = commonSettings();
    storygen.seed(999);
    var sg2 = new storygen(cs2.settings);
    var story2 = sg2.generate(cs2.settings, cs2.theme);

    expect(story2.tale).to.equal(story1.tale);
  });

  it("storyGen.unseed() reverts to real Math.random and still generates a valid story", function () {
    storygen.seed(42);
    storygen.unseed();
    var cs = commonSettings();
    var sg = new storygen(cs.settings);
    var story = sg.generate(cs.settings, cs.theme);
    expect(story.tale).to.have.length.above(10);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx mocha tests/seed.tests.js`
Expected: FAIL — `TypeError: storygen.seed is not a function` (it doesn't exist yet).

- [ ] **Step 3: Commit**

```bash
git add tests/seed.tests.js
git commit -m "test: add failing tests for storyGen.seed() determinism (malepropp-fnq.3)"
```

---

### Task 2: Add the RNG core and wire the 5 call sites through it

**Files:**
- Modify: `lib/propp.js:32` (insert RNG core after this line), `lib/propp.js:138,160,165,169,179` (route through `nextRandom()`), `lib/propp.js:1163` area (add `storyGen.seed`/`storyGen.unseed` statics)

- [ ] **Step 1: Insert the RNG core right after `var cleaner = new Cleaner(Tokenizer);` (propp.js:32)**

Find:
```js
var cleaner = new Cleaner(Tokenizer);

// exposed statically as storyGen.world, as well as with instances
var world = {};
```

Replace with:
```js
var cleaner = new Cleaner(Tokenizer);

// Seedable RNG (malepropp-fnq.3). rngState is null by default, meaning
// nextRandom() calls Math.random() directly - zero behavior change for
// every caller that never seeds. storyGen.seed(n) swaps rngState to a
// mulberry32 generator so repeat calls with the same seed replay
// identically, enabling before/after diffing when refactoring generation
// logic. Math.random() itself cannot be seeded in any JS engine, hence
// the inline algorithm rather than a param on Math.random().
var rngState = null;

// mulberry32: https://gist.github.com/tommyettinger/46a874533244883189143505d203312
var mulberry32 = function (seed) {
  var state = seed >>> 0;
  return function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    var t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

var nextRandom = function () {
  return rngState === null ? Math.random() : rngState();
};

// exposed statically as storyGen.world, as well as with instances
var world = {};
```

- [ ] **Step 2: Route `world.util.randomProperty` through `nextRandom()` (propp.js:133-141)**

Find:
```js
world.util.randomProperty = function (obj) {
  var result;
  var count = 0;
  for (var prop in obj)
    if (prop != "id") {
      if (Math.random() < 1 / ++count) result = obj[prop];
    }
  return result;
};
```

Replace with:
```js
world.util.randomProperty = function (obj) {
  var result;
  var count = 0;
  for (var prop in obj)
    if (prop != "id") {
      if (nextRandom() < 1 / ++count) result = obj[prop];
    }
  return result;
};
```

- [ ] **Step 3: Route `random`, `pick`, `pickRemove`, `coinflip` through `nextRandom()` (propp.js:157-180)**

Find:
```js
var storyGen = function (settings) {
  // generates a random number
  var random = function (limit) {
    var num = Math.floor(Math.random() * limit);
    return num;
  };

  var pick = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  var pickRemove = function (arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
  };

  // return true or false
  // 50-50 chance (unless override)
  var coinflip = function (chance) {
    if (!chance) {
      chance = 0.5;
    }
    return Math.random() < chance;
  };
```

Replace with:
```js
var storyGen = function (settings) {
  if (settings && settings.seed != null) {
    storyGen.seed(settings.seed);
  }

  // generates a random number
  var random = function (limit) {
    var num = Math.floor(nextRandom() * limit);
    return num;
  };

  var pick = function (arr) {
    return arr[Math.floor(nextRandom() * arr.length)];
  };

  var pickRemove = function (arr) {
    var index = Math.floor(nextRandom() * arr.length);
    return arr.splice(index, 1)[0];
  };

  // return true or false
  // 50-50 chance (unless override)
  var coinflip = function (chance) {
    if (!chance) {
      chance = 0.5;
    }
    return nextRandom() < chance;
  };
```

Note: `storyGen.seed` is referenced here before its own definition further down the file. This is safe — `storyGen` is a function expression; the body above only runs when something later calls `new storyGen(...)`, by which point the whole module (including the static assignment added in Step 4) has already finished evaluating.

- [ ] **Step 4: Add `storyGen.seed`/`storyGen.unseed` statics, right after `storyGen.world = world;` (propp.js:1163)**

Find:
```js
storyGen.world = world;
```

Replace with:
```js
storyGen.world = world;

// Seed the shared RNG (malepropp-fnq.3) so subsequent random draws -
// random()/pick()/pickRemove()/coinflip()/randomProperty(), including
// mid-generation calls made via god.randomProperty - replay identically.
// Calling seed(n) again with the same n always restarts the sequence from
// scratch, regardless of what ran in between.
storyGen.seed = function (n) {
  rngState = mulberry32(n >>> 0);
};

// Revert to real Math.random().
storyGen.unseed = function () {
  rngState = null;
};
```

- [ ] **Step 5: Run the new tests, confirm they pass**

Run: `npx mocha tests/seed.tests.js`
Expected: PASS (4 passing)

- [ ] **Step 6: Run the full suite, confirm nothing else broke**

Run: `npm test`
Expected: PASS (296 passing - the 292 pre-existing plus the 4 new ones)

- [ ] **Step 7: Commit**

```bash
git add lib/propp.js
git commit -m "feat: add seedable RNG (storyGen.seed/unseed) behind existing random helpers (malepropp-fnq.3)"
```

---

### Task 3: Lint check

**Files:**
- None new — verifies Task 2's edit is clean.

- [ ] **Step 1: Run the linter**

Run: `npm run lint`
Expected: no new errors introduced in `lib/propp.js` (pre-existing warn-level findings in other files are fine, per CLAUDE.md's documented baseline)

- [ ] **Step 2: If there are findings in the new code, fix them and re-run**

Run: `npm run lint`
Expected: clean

(No commit needed here unless Step 2 required a fix — if it did, commit with `git commit -m "fix: address lint findings in seedable RNG code (malepropp-fnq.3)"`.)

---

## Self-Review Notes

- **Spec coverage:** all 5 `Math.random()` call sites routed (randomProperty, random, pick, pickRemove, coinflip) — Task 2 Steps 2-3. `storyGen.seed`/`unseed` statics — Task 2 Step 4. `settings.seed` construction sugar — Task 2 Step 3. `god.randomProperty` needs no edit (already an alias, confirmed in spec) — no task needed, noted here so it isn't mistaken for a gap. Tests for determinism, differing seeds, `settings.seed` sugar, and `unseed()` — Task 1.
- **No placeholders:** every step has literal code and exact commands.
- **Type/name consistency:** `nextRandom`, `rngState`, `mulberry32`, `storyGen.seed`, `storyGen.unseed` are named identically everywhere they're introduced and used across Task 2's steps.
