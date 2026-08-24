# Fix generate()/sentence() this-binding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `lib/propp.js`'s `generate()` and `sentence()` work correctly when called without relying on `this` binding, by passing `settings`/`universe` explicitly as parameters instead of reading them off `this`.

**Architecture:** `sentence()` currently reads `this.settings.verbtense` in two places and has no way to get that value any other way. `generate()` currently stashes `settings`/`universe` onto `this` (the `storyGen` instance) purely so `sentence()` can read them back via `this` when `generate()` calls `this.sentence(...)`. Since `generate`, `sentence`, and `findVillainy` are all `var`-declared inside the same `storyGen(settings)` closure, `generate()` can call `sentence(...)`/`findVillainy(...)` directly as plain closure references - no `this` needed for dispatch at all. The fix: give `sentence()` an explicit `verbtense` parameter, have `generate()` pass it directly, and stop routing through `this` anywhere except the one place external code actually depends on it (see below).

**Tech Stack:** Plain JS (no new deps), mocha/chai (existing test suite).

**Load-bearing constraint - do not break this:** `lib/templates.js:466-468` does:
```js
var sg = new storyGen(setts);
var tale = sg.generate(setts, god.theme);
tale.universe = sg.universe;
```
It reads `sg.universe` **after** `generate()` returns, relying on `generate()` having written `this.universe` onto the returned instance as a side effect. `generate()` must keep assigning `this.universe = universe;` once, even though internally it will use a local `universe` variable for everything else. `this.settings = settings` has no such external reader anywhere in the repo (confirmed by grep across `index.js`, `gui.js`, `tests/`, `lib/templates.js`) and can be dropped entirely.

---

### Task 1: Add a failing test that demonstrates the this-binding bug, then fix it

**Files:**
- Modify: `tests/malepropp.tests.js` (add a new test, at the end of the file)
- Modify: `lib/propp.js:909-1014` (`sentence()`)
- Modify: `lib/propp.js:1055-1138` (`generate()`)

- [ ] **Step 1: Write the failing test**

Append this to the end of `tests/malepropp.tests.js` (after the existing `describe("storygen utlities", ...)` block, i.e. after line 187):

```js
describe("storyGen this-binding independence", function () {
  it("sentence() works when detached from the storyGen instance (no `this` binding)", function () {
    var sg = new storygen({ verbtense: "past" });
    var detachedSentence = sg.sentence; // destructure - loses `this`

    expect(function () {
      detachedSentence(
        { active: true, templates: ["{{ran}}"] },
        {},
        null,
        "past",
      );
    }).to.not.throw();
  });

  it("generate() works when detached from the storyGen instance (no `this` binding)", function () {
    var cs = commonSettings();
    cs.settings.funcs = ["func8"];
    var sg = new storygen(cs.settings);
    var detachedGenerate = sg.generate; // destructure - loses `this`

    var story;
    expect(function () {
      story = detachedGenerate(cs.settings, cs.theme);
    }).to.not.throw();
    expect(story.tale).to.not.be.null;
    expect(story.tale.indexOf(" : ")).to.equal(-1); // not an error message masquerading as a tale
  });
});
```

The first test uses a template string (`"{{ran}}"`) containing a verb tag, which is what forces `sentence()`'s code path down into the branch that currently reads `this.settings.verbtense` (lib/propp.js:995) - a template with no `{{tag}}` markers wouldn't exercise the bug at all. The second test exercises `generate()`'s own `this.settings`/`this.universe` reliance the same way, via a real (if minimal) function list.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx mocha tests/malepropp.tests.js --grep "this-binding independence"`

Expected: both tests **FAIL**. The first with something like `TypeError: Cannot read properties of undefined (reading 'verbtense')` (thrown from inside `sentence()` at `lib/propp.js:995`, propagating up through the `expect(...).to.not.throw()` assertion). The second currently will NOT throw visibly - `generate()`'s own `try/catch` (lib/propp.js:1124) catches the `this`-related `TypeError` and does `return msg;`, so instead the `story.tale.indexOf(" : ").to.equal(-1)` assertion fails (the caught error message, formatted as `"TypeError : Cannot read properties of undefined..."`, contains `" : "` and gets returned as if it were `msg`, a bare string - `story.tale` will actually be `undefined` since `msg` isn't a `{title, tale}` object, so the real failure will likely be on the `expect(story.tale).to.not.be.null` line with `story` itself not having a `.tale` property, or a thrown error trying to read `.tale` off a string. Either way: red, for a reason that traces back to the `this`-binding bug, not a flaky/unrelated failure.

- [ ] **Step 3: Fix `sentence()` - accept `verbtense` explicitly instead of reading `this.settings.verbtense`**

Old (`lib/propp.js:909`):
```js
  var sentence = function (func, helper, params) {
```

New:
```js
  var sentence = function (func, helper, params, verbtense) {
```

Old (`lib/propp.js:968`, inside the `{{**}}` tense-swap branch):
```js
          if (this.settings.verbtense == "past") {
```

New:
```js
          if (verbtense == "past") {
```

Old (`lib/propp.js:995`, inside the verb-tag replacement loop):
```js
        if (this.settings.verbtense == "past") {
```

New:
```js
        if (verbtense == "past") {
```

- [ ] **Step 4: Fix `generate()` - use a local `universe` var, drop `this.settings`, call `sentence`/`findVillainy` as plain closure references with the new `verbtense` argument**

Old (`lib/propp.js:1055-1064`):
```js
  var generate = function (settings, theme) {
    try {
      this.settings = settings;
      var story = theme.templates(settings.functions, world, storyGen);
      var restartVillainy = this.findVillainy(settings.funcs);

      var tale = [];

      this.universe = god(this.settings, theme.bank, theme);
```

New:
```js
  var generate = function (settings, theme) {
    try {
      var story = theme.templates(settings.functions, world, storyGen);
      var restartVillainy = findVillainy(settings.funcs);

      var tale = [];

      var universe = god(settings, theme.bank, theme);
      this.universe = universe; // lib/templates.js reads sg.universe after generate() returns - keep this assigned
```

Old (`lib/propp.js:1065-1100`, the main loop - every `this.universe` becomes `universe`, and the one `this.sentence(...)` call gets the new `verbtense` argument):
```js
      for (var i = 0; i < settings.funcs.length; i++) {
        var f = settings.funcs[i];
        var params = null;
        if (typeof f === "object") {
          // capture ALL OTHER POSSIBLE PARAMS
          params = f.slice(1);
          f = f[0];
        }
        // console.log(settings.funcs[i]);
        // subFunc could be multiple params
        // we need to flatten everything and use apply... maybe?
        // var s2 = this.sentence.apply(null, [].concat(story[f], this.universe, subFunc));
        var s2 = this.sentence(story[f], this.universe, params);
        if (s2) {
          tale.push(s2);
        }

        if (this.universe.hero.health === world.healthLevel.dead) {
          break;
        }
        if (
          settings.bossfight &&
          this.universe.villain.health == "dead" &&
          restartVillainy >= 0
        ) {
          if (this.universe.coinflip(0.8)) {
            // we run out of names, because new villains have both family and acquaintances
            // AND USE THEM ALL UP
            this.universe.villain = this.universe.createVillain();
            this.universe.cache.magicalitem = this.universe.createMagicalitem();
            i = restartVillainy - 1; // one less, since it will be incremented on loop
          } else {
            restartVillainy = -1;
          }
        }
      }
```

New:
```js
      for (var i = 0; i < settings.funcs.length; i++) {
        var f = settings.funcs[i];
        var params = null;
        if (typeof f === "object") {
          // capture ALL OTHER POSSIBLE PARAMS
          params = f.slice(1);
          f = f[0];
        }
        // console.log(settings.funcs[i]);
        // subFunc could be multiple params
        // we need to flatten everything and use apply... maybe?
        // var s2 = sentence.apply(null, [].concat(story[f], universe, subFunc));
        var s2 = sentence(story[f], universe, params, settings.verbtense);
        if (s2) {
          tale.push(s2);
        }

        if (universe.hero.health === world.healthLevel.dead) {
          break;
        }
        if (
          settings.bossfight &&
          universe.villain.health == "dead" &&
          restartVillainy >= 0
        ) {
          if (universe.coinflip(0.8)) {
            // we run out of names, because new villains have both family and acquaintances
            // AND USE THEM ALL UP
            universe.villain = universe.createVillain();
            universe.cache.magicalitem = universe.createMagicalitem();
            i = restartVillainy - 1; // one less, since it will be incremented on loop
          } else {
            restartVillainy = -1;
          }
        }
      }
```

Old (`lib/propp.js:1102-1118`, the outro/title `this.sentence` calls):
```js
      // TODO: unless prohibited, include outro by default
      if (settings.conclusion) {
        tale.push(this.sentence(story.outro, this.universe));
      }

      // TODO: get a new iterator
      // it will be an array that is BUILT
      // aaaand, let's presume that it has been passed in as part of SETTINGS
      // for (var index in story) {
      //     // console.log(index);
      //     var s = this.sentence(story[index], storyGen.world);
      //     if (s) {
      //         tale.push(s);
      //     }
      // }

      var title = this.sentence(story.title, this.universe);
```

New:
```js
      // TODO: unless prohibited, include outro by default
      if (settings.conclusion) {
        tale.push(sentence(story.outro, universe, null, settings.verbtense));
      }

      // TODO: get a new iterator
      // it will be an array that is BUILT
      // aaaand, let's presume that it has been passed in as part of SETTINGS
      // for (var index in story) {
      //     // console.log(index);
      //     var s = sentence(story[index], storyGen.world);
      //     if (s) {
      //         tale.push(s);
      //     }
      // }

      var title = sentence(story.title, universe, null, settings.verbtense);
```

(The commented-out block is dead code - only its inner `this.sentence` reference is updated for consistency with the rest of the file, in case it's ever revived; no functional change since it's still commented out.)

Note `sentence(story.outro, universe, null, settings.verbtense)` and `sentence(story.title, universe, null, settings.verbtense)` add an explicit `null` for the `params` argument, matching `sentence`'s 4-parameter signature (`func, helper, params, verbtense`) - the original calls omitted `params` entirely (relying on it being `undefined`, which is falsy the same way `null` is for every use of `params` inside `sentence()`), so this is a no-op change in behavior, just explicit.

- [ ] **Step 5: Run the new tests again to verify they pass**

Run: `npx mocha tests/malepropp.tests.js --grep "this-binding independence"`
Expected: both tests **PASS**.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all tests pass. Count should be **143** (141 existing + 2 new tests from Step 1) - if it's not 143, something about the new tests or the fix is wrong; investigate before proceeding.

- [ ] **Step 7: Run the Node CLI smoke test**

Run: `node index.js`
Expected: prints `Written to wonder.tale.<random>.txt` then `DONE`, no stack trace. Confirm the file is non-trivial:
```bash
ls -la wonder.tale.*.txt
wc -w wonder.tale.*.txt
```
Expected: word count near 50000. Delete the file afterward (confirm it's gitignored first with `git check-ignore -v <filename>`).

- [ ] **Step 8: Smoke-test the GUI in a real browser**

This refactor touches the exact code path every story generation goes through, including `lib/templates.js:466-468`'s embedded-tale generation (which reads `sg.universe` after calling `generate()` - the one behavior this plan is specifically protecting). Start a static server and drive the GUI:

```bash
npx serve -l 5500 . &
```

Load browser automation tools if not already loaded (ToolSearch: `"select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__read_console_messages"`), then:

1. Navigate to `http://localhost:5500/index.html`
2. Read console messages, confirm no errors on load
3. Click `Generate` with default settings, confirm the `Output` textarea populates with non-empty text and no console errors
4. Switch `Theme` to "Office Setting", click `Generate` again, confirm different output, no console errors
5. If any preset's function list is likely to exercise `lib/templates.js`'s nested-tale `sg.generate(...)`/`sg.universe` path (check `templates.js` around line 400-470 for which `story.*` function calls `createLack`/embeds a sub-tale, and pick a preset/function selection that includes it), select it and Generate once more specifically to exercise that path, confirming no errors
6. Read console messages one final time

Stop the server afterward (`lsof -ti:5500 | xargs kill`).

- [ ] **Step 9: Commit**

```bash
git add tests/malepropp.tests.js lib/propp.js
git commit -m "fix: pass settings/universe explicitly to sentence()/generate() instead of via this

sentence() read this.settings.verbtense and generate() stashed
settings/universe onto this purely so sentence() could read them back
through this.sentence(...) - both broke silently if either function
was ever called detached from the storyGen instance (destructured,
passed as a callback). generate/sentence/findVillainy are all
declared in the same closure, so generate() now calls them as plain
closure references with an explicit verbtense parameter instead.

this.universe is still assigned once (lib/templates.js reads
sg.universe after calling generate()); this.settings is dropped
entirely (no external reader exists)."
```

---

## Self-Review Notes

- **Spec coverage:** `sentence()`'s `this.settings.verbtense` reads (2 sites) and `generate()`'s `this.settings`/`this.universe` reliance (all sites, including the two internal call-site prefixes to drop for `sentence`/`findVillainy`) are all covered in Task 1. The `this.universe = universe;` external-contract preservation and the `this.settings` removal are both explicitly handled per the investigation notes.
- **Out of scope, deliberately:** `findVillainy`'s own closure-captured `settings` (from the outer `storyGen(settings)` factory, not `this.settings`) is untouched - a different fragility class than this bead's this-binding scope, and changing it isn't requested. `enforceRules` is untouched - zero live callers anywhere in the repo. The `if (!(this instanceof storyGen)) return new storyGen();` constructor guard at the bottom of the file is untouched - unrelated to `generate()`/`sentence()`.
- **Placeholder scan:** every step has literal before/after code and exact commands/expected output - no "similarly for the rest," no "add appropriate handling."
- **Type/signature consistency:** `sentence(func, helper, params, verbtense)` is the new 4-arg signature everywhere it's declared (Step 3) and everywhere it's called (Step 4, all three call sites in `generate()`, plus both new test calls in Step 1). No call site left on the old 3-arg form.
