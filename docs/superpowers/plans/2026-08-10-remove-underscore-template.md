# Remove `_.template` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace underscore's `_.template` (the last remaining underscore usage
in the repo) in `lib/propp.js` with a local, dependency-free `interpolate`
function built on `new Function` + native JS template-literal syntax, then
remove `require("underscore")` and the `<script>` tag that loads it.

**Architecture:** `interpolate(templateString, data)` translates `<%= expr %>`
tags in `templateString` to `${expr}`, wraps the result in a template
literal, and compiles it via `new Function` with one parameter per key of
`data` — replicating underscore's `with(obj)` bare-name scoping without
`with`. It replaces the `_.template(f)` / `t(helper)` pair inside
`sentence()`. This is new code (no prior `interpolate` existed), so it's
built test-first in the standard red-green sense, not characterization-first
like the `_.deepClone` removal was.

**Tech Stack:** mocha + chai, matching `tests/deepClone.tests.js` /
`tests/cleaner.tests.js` exactly (IIFE wrapping `describe`/`it` blocks).

---

## Task 1: Add `interpolate` with unit tests

**Files:**
- Create: `tests/interpolate.tests.js`
- Modify: `lib/propp.js` (add `interpolate` inside `storyGen`, expose on the
  returned object)

- [ ] **Step 1: Write the failing test file**

```js
var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    storygen = require("../lib/propp.js");

  describe("storyGen interpolate", function () {
    it("interpolates a simple property reference", function () {
      var result = storygen().interpolate("Hello <%= name %>!", {
        name: "World",
      });
      expect(result).to.equal("Hello World!");
    });

    it("evaluates a ternary expression", function () {
      var template = '<%= flag ? "yes" : "no" %>';
      expect(storygen().interpolate(template, { flag: true })).to.equal(
        "yes",
      );
      expect(storygen().interpolate(template, { flag: false })).to.equal(
        "no",
      );
    });

    it("evaluates a function-call expression", function () {
      var data = {
        greet: function (name) {
          return "hi " + name;
        },
      };
      var result = storygen().interpolate('<%= greet("Sam") %>', data);
      expect(result).to.equal("hi Sam");
    });

    it("interpolates multiple tags in a single template string", function () {
      var result = storygen().interpolate("<%= a %> and <%= b %>", {
        a: "one",
        b: "two",
      });
      expect(result).to.equal("one and two");
    });

    it("passes a template string through unchanged when it has no tags", function () {
      var result = storygen().interpolate("no tags here", {
        anything: "unused",
      });
      expect(result).to.equal("no tags here");
    });

    it("interpolates nested property access", function () {
      var data = { obj: { nested: { value: "deep" } } };
      var result = storygen().interpolate("<%= obj.nested.value %>", data);
      expect(result).to.equal("deep");
    });
  });
})();
```

- [ ] **Step 2: Run the tests to confirm they FAIL (interpolate doesn't exist yet)**

Run: `npm test`
Expected: 6 failing (each with an error like
`TypeError: storygen(...).interpolate is not a function`), the existing 132
tests still passing. If any failure has a different error message, stop and
check the test file for a typo before continuing.

- [ ] **Step 3: Implement `interpolate` inside `storyGen`**

In `lib/propp.js`, find the `deepClone` function (currently around line 174):

```js
  // http://blog.elliotjameschong.com/2012/10/10/underscore-js-deepclone-and-deepextend-mix-ins/
  // in case it is not clear, deepClone clones everything that can JSON-ified
  // that means properties NOT FUNCTIONS
  var deepClone = function (o) {
    try {
      return JSON.parse(JSON.stringify(o));
    } catch (ex) {
      console.log(ex.message);
      console.log(o);
      return undefined;
    }
  };
```

Add `interpolate` directly after it (same closure-scoped local-helper
pattern as `random`/`pick`/`pickRemove`/`coinflip`/`deepClone`):

```js
  // http://blog.elliotjameschong.com/2012/10/10/underscore-js-deepclone-and-deepextend-mix-ins/
  // in case it is not clear, deepClone clones everything that can JSON-ified
  // that means properties NOT FUNCTIONS
  var deepClone = function (o) {
    try {
      return JSON.parse(JSON.stringify(o));
    } catch (ex) {
      console.log(ex.message);
      console.log(o);
      return undefined;
    }
  };

  // replaces underscore's _.template: translates <%= expr %> tags to native
  // ${expr} template-literal interpolation, then compiles via new Function
  // with one parameter per key of `data` - this replicates underscore's
  // with(obj) bare-name scoping (any key of `data` is usable bare inside an
  // expression) without using `with`.
  var interpolate = function (templateString, data) {
    var keys = Object.keys(data);
    var body = templateString.replace(/<%=\s*(.+?)\s*%>/g, "${$1}");
    var fn = new Function(keys.join(","), "return `" + body + "`;");
    return fn.apply(
      null,
      keys.map(function (k) {
        return data[k];
      }),
    );
  };
```

Then find the object `storyGen` returns (currently around line 1109):

```js
  return {
    settings: settings,
    random: random,
    coinflip: coinflip,
    enforceRules: enforceRules,
    findVillainy: findVillainy,
    generate: generate,
    god: god,
    itemGenerator: god.itemGenerator, // TODO: is this even used?
    pick: pick,
    pickRemove: pickRemove,
    randomProperty: world.util.randomProperty,
    sentence: sentence,
    uid: uid,
    world: world,
    deepClone: deepClone,
  };
};
```

Add `interpolate` to it:

```js
  return {
    settings: settings,
    random: random,
    coinflip: coinflip,
    enforceRules: enforceRules,
    findVillainy: findVillainy,
    generate: generate,
    god: god,
    itemGenerator: god.itemGenerator, // TODO: is this even used?
    pick: pick,
    pickRemove: pickRemove,
    randomProperty: world.util.randomProperty,
    sentence: sentence,
    uid: uid,
    world: world,
    deepClone: deepClone,
    interpolate: interpolate,
  };
};
```

- [ ] **Step 4: Run the tests to confirm they PASS**

Run: `npm test`
Expected: 138 passing (132 + 6 new), 0 failing.

- [ ] **Step 5: Commit**

```bash
git add tests/interpolate.tests.js lib/propp.js
git commit -m "feat: add interpolate() as a replacement for _.template"
```

---

## Task 2: Wire `interpolate` into `sentence()`

**Files:**
- Modify: `lib/propp.js` (the `sentence` function, currently around
  line 866-921)

- [ ] **Step 1: Read current code**

Inside `sentence`, find:

```js
      var template = f;

      var t = _.template(f);
      f = t(helper);

      if (f.indexOf("NaN") >= 0) {
```

- [ ] **Step 2: Replace the two-line compile-and-call with `interpolate`**

```js
      var template = f;

      f = interpolate(f, helper);

      if (f.indexOf("NaN") >= 0) {
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: 138 passing (same as Task 1's Step 4), 0 failing.
`tests/malepropp.tests.js` iterates every Propp function across every theme
and generates real text through `sentence()` — this is the regression check
that every one of the 229 real `<%= %>` template strings still interpolates
correctly through the new code path. If anything fails here, the failure is
in how a *real* template string exercises `interpolate` differently from the
synthetic Task 1 cases — stop and investigate, don't just re-run.

- [ ] **Step 4: Commit**

```bash
git add lib/propp.js
git commit -m "refactor: replace _.template with interpolate() in sentence()"
```

---

## Task 3: Remove `require("underscore")` and the `<script>` tag

**Files:**
- Modify: `lib/propp.js:16`
- Modify: `index.html:211`

- [ ] **Step 1: Read current code (propp.js:16)**

```js
var _ = _ || require("underscore");
```

- [ ] **Step 2: Delete the line**

Remove `var _ = _ || require("underscore");` entirely.

- [ ] **Step 3: Confirm no other underscore usage remains**

Run: `grep -n "_\." lib/propp.js | grep -v "//"`
Expected: no output (or only matches that are clearly unrelated to the `_`
underscore object, e.g. inside comments or unrelated variable names like
`func_`). If any real `_.xxx` call turns up, stop — this plan assumed
`_.template` was the last usage; investigate before deleting the require
line.

- [ ] **Step 4: Read current code (index.html:211)**

```html
  <script type="text/javascript" src="scripts/underscore.js"></script>
```

- [ ] **Step 5: Delete the line**

Remove that `<script>` tag entirely. Leave `scripts/underscore.js` itself and
its `package.json` entry in place, untouched — same treatment
`scripts/jquery.min.js` got.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: 138 passing, 0 failing. (Node tests don't load `index.html`, but
this confirms deleting the `require` line didn't break anything that was
silently relying on the global `_`.)

- [ ] **Step 7: Commit**

```bash
git add lib/propp.js index.html
git commit -m "chore: remove underscore require and script tag (last usage was _.template)"
```

---

## Task 4: Full browser verification

**Files:** none (manual verification only)

- [ ] **Step 1: Serve the repo and open `index.html` in a real browser**

```bash
python3 -m http.server 8934
```

Open `http://localhost:8934/index.html`.

- [ ] **Step 2: Open the browser console and confirm no errors on page load**

No `ReferenceError` (e.g. for `_` or `underscore`), no other console errors.

- [ ] **Step 3: Generate a story**

Check a handful of function checkboxes (at minimum: `func8` villainy, which
is checked by default — leave it checked). Click the generate button. Confirm
a story renders.

- [ ] **Step 4: Inspect the generated text**

Confirm:
- No literal `<%= %>` tags leaked into the output (would mean the regex
  translation didn't match something).
- No `undefined` or `NaN` substrings in the generated text.
- No new console errors after generation.

- [ ] **Step 5: Trigger a story-within-a-story, if time allows**

Check the "interdiction" checkbox (func2) or "receipt of a magical agent"
checkbox (func14) in addition to the defaults, generate again, and confirm
the embedded subtale (introduced with `"I have a tale for you,"`) also
renders cleanly — this exercises `interpolate` through a second, freshly
cloned `storyGen` instance, not just the outer one.

- [ ] **Step 6: Stop the server**

```bash
lsof -ti :8934 | xargs -r kill
```

---

## Self-Review Notes

- **Spec coverage**: spec's Design section (translate `<%= %>` to `${}` at
  compile time, `new Function` with per-key params, expose on `storyGen`'s
  return object) maps to Task 1. Spec's "Once this lands" non-goal items
  (remove `require`, remove `<script>` tag, leave vendored file/package.json
  alone) map to Task 3. Spec's Testing/verification section (unit tests,
  full suite regression, required browser check) maps to Tasks 1, 2, and 4
  respectively. All 6 "New tests" bullets from the spec have a matching
  `it()` block in Task 1.
- **Non-goals respected**: no task touches the 229 `<%= %>` occurrences in
  `templates.js`/`templates.business.js`/`templates.descriptive.js`/
  `business.wordbank.js`. No task deletes `scripts/underscore.js` or its
  `package.json` entry. No task adds compilation caching.
- **Type/name consistency**: `interpolate` (the local function name) and
  `storyGen().interpolate` (the public method) are the same name throughout
  Tasks 1-2 — no renames introduced. `keys`/`data`/`templateString` parameter
  names are consistent between the spec's code sample and Task 1's
  implementation.
- **Task ordering**: Task 1 (build + unit-test `interpolate` in isolation)
  must land before Task 2 (wire it into the hot path), so a failure in Task 2
  is known to be about real-template-vs-synthetic-test differences, not
  about `interpolate` itself being broken. Task 3 (remove the require) must
  come after Task 2, since `_.template` is still the active implementation
  until Task 2's commit lands.
