# Remove `_.deepClone` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace underscore's `_.deepClone` (a custom mixin, not a real underscore
function) in `lib/propp.js` with a local, dependency-free `deepClone` function, backed
by new unit tests that didn't exist before. `require("underscore")` stays — `_.template`
still needs it, and is out of scope (separate future spec).

**Architecture:** This is a refactor of existing, working, but untested behavior — not
new functionality. So the test-writing step is "characterization tests first": write
tests against the *current* `_.deepClone`-based implementation, confirm they pass
(this pins down the existing behavior and is itself a useful, previously-missing
safety net), *then* do the mechanical extraction, then confirm the same tests still
pass unchanged. This is TDD's spirit (tests before the change) adapted to a refactor
rather than the usual red-then-green-on-new-code cycle, since there's no new behavior
to make "go green."

**Tech Stack:** mocha + chai, matching the existing `tests/cleaner.tests.js` /
`tests/malepropp.tests.js` pattern exactly (IIFE wrapping `describe`/`it` blocks).

---

## Task 1: Add characterization tests for `storyGen().deepClone`

**Files:**
- Create: `tests/deepClone.tests.js`

- [ ] **Step 1: Write the test file**

```js
var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    storygen = require("../lib/propp.js");

  describe("storyGen deepClone", function () {
    it("clones a nested plain object without returning the same reference", function () {
      var original = { a: 1, b: { c: 2, d: [3, 4] } };
      var clone = storygen().deepClone(original);

      expect(clone).to.deep.equal(original);
      expect(clone).to.not.equal(original);
      expect(clone.b).to.not.equal(original.b);
    });

    it("does not let mutating the clone affect the original, or vice versa", function () {
      var original = { a: 1, nested: { value: "start" } };
      var clone = storygen().deepClone(original);

      clone.nested.value = "changed";
      expect(original.nested.value).to.equal("start");

      original.a = 999;
      expect(clone.a).to.equal(1);
    });

    it("clones arrays, including arrays of objects", function () {
      var original = [{ name: "hero" }, { name: "villain" }];
      var clone = storygen().deepClone(original);

      expect(clone).to.deep.equal(original);
      expect(clone).to.not.equal(original);
      expect(clone[0]).to.not.equal(original[0]);
    });

    it("drops function-valued properties (JSON round-trip semantics)", function () {
      var original = { name: "hero", greet: function () { return "hi"; } };
      var clone = storygen().deepClone(original);

      expect(clone.name).to.equal("hero");
      expect(clone.greet).to.equal(undefined);
    });

    it("returns undefined for a circular reference instead of throwing", function () {
      var original = { name: "hero" };
      original.self = original;

      expect(function () {
        var result = storygen().deepClone(original);
        expect(result).to.equal(undefined);
      }).to.not.throw();
    });
  });
})();
```

- [ ] **Step 2: Run the tests to confirm they PASS against the current, unrefactored code**

Run: `npm test`
Expected: 132 passing (127 existing + 5 new), 0 failing. This confirms the new tests
correctly describe the *existing* `_.deepClone`-based behavior before anything changes
— if any of these fail here, the test is wrong (fix the test), not the implementation.

- [ ] **Step 3: Commit**

```bash
git add tests/deepClone.tests.js
git commit -m "test: add characterization tests for storyGen deepClone"
```

---

## Task 2: Replace `_.deepClone` with a local function

**Files:**
- Modify: `lib/propp.js:26-36` (the `_.mixin` block)
- Modify: `lib/propp.js:220` (the internal call site)
- Modify: `lib/propp.js:1126` (the public API export)

- [ ] **Step 1: Read current code (mixin block, lines 23-36)**

```js
// http://blog.elliotjameschong.com/2012/10/10/underscore-js-deepclone-and-deepextend-mix-ins/
// in case it is not clear, deepClone clones everything that can JSON-ified
// that means properties NOT FUNCTIONS
_.mixin({
  deepClone: function (o) {
    try {
      return JSON.parse(JSON.stringify(o));
    } catch (ex) {
      console.log(ex.message);
      console.log(o);
      return undefined;
    }
  },
});
```

- [ ] **Step 2: Replace with a local function declaration**

```js
// http://blog.elliotjameschong.com/2012/10/10/underscore-js-deepclone-and-deepextend-mix-ins/
// in case it is not clear, deepClone clones everything that can JSON-ified
// that means properties NOT FUNCTIONS
function deepClone(o) {
  try {
    return JSON.parse(JSON.stringify(o));
  } catch (ex) {
    console.log(ex.message);
    console.log(o);
    return undefined;
  }
}
```

- [ ] **Step 3: Read current code (internal call site, line 220)**

```js
var bank = _.deepClone(wordbank);
```

- [ ] **Step 4: Replace**

```js
var bank = deepClone(wordbank);
```

- [ ] **Step 5: Read current code (public API export, line 1126)**

```js
    deepClone: _.deepClone,
```

- [ ] **Step 6: Replace**

```js
    deepClone: deepClone,
```

- [ ] **Step 7: Run the full test suite — same tests, same file, code changed underneath**

Run: `npm test`
Expected: 132 passing (127 + the 5 from Task 1), 0 failing, identical result to Task
1's Step 2. If anything changes here, the extraction introduced a behavior difference
— stop and investigate, don't just re-run.

- [ ] **Step 8: Commit**

```bash
git add lib/propp.js
git commit -m "refactor: replace _.deepClone with local deepClone function"
```

---

## Self-Review Notes

- **Spec coverage**: spec's 4 design steps (delete mixin, add local function, fix
  internal call site, fix public export) map 1:1 to Task 2's Steps 1-6. Spec's "new
  tests" section maps to Task 1, with all 5 listed behaviors (nested clone, mutation
  independence, array clone, function-dropping, circular reference) each getting their
  own `it()` block.
- **Non-goals respected**: `require("underscore")` (line 16) and `_.template` (line
  902) are not touched by either task — nothing in this plan references them.
  `lib/templates.js`'s 4 `storyGen().deepClone(...)` call sites need no changes since
  the public method name is unchanged (verified: Task 2 Step 6 keeps the key
  `deepClone`, just repoints the value).
- **Type/name consistency**: `deepClone` (the local function) and `storyGen().deepClone`
  (the public method) are the same name used consistently across both tasks — no
  renames introduced.
- **Test-then-refactor ordering**: Task 1 must land and pass *before* Task 2 touches
  `lib/propp.js`, so the tests are proven correct against known-working code first.
