# Remove `_.deepClone` (underscore) from lib/propp.js

## Context

`lib/propp.js` is the only file in the repo that uses underscore (`var _ = _ ||
require("underscore");`, `lib/propp.js:16`). It has three real usages:

1. `_.mixin({ deepClone: function (o) {...} })` (lines 26-36) — a custom mixin, not a
   built-in underscore function. Its body is just `JSON.parse(JSON.stringify(o))` in a
   try/catch — no actual underscore functionality involved.
2. `_.deepClone(wordbank)` (line 220) — one call site.
3. `deepClone: _.deepClone` (line 1126) — re-exposed as a public method on the object
   `storyGen()` returns, and consumed externally by `lib/templates.js` (4 call sites:
   `storyGen().deepClone(narrator)`, `.deepClone(god.hero)`, `.deepClone(god.villain)`,
   `.deepClone(god.cache.characters)`).
4. `_.template(f)` (line 902) — separate, unrelated usage. **Out of scope for this
   spec** — gets its own spec later. `require("underscore")` stays in this pass because
   `_.template` still needs it.

This is step two of the "drop jQuery + underscore" effort (step one, jQuery removal
from `gui.js`, is done — see `docs/superpowers/specs/2026-08-08-remove-jquery-design.md`).
Following the same pattern: split into independent, separately-verifiable pieces.
`deepClone` is a pure function with zero existing test coverage but is trivially
unit-testable in isolation — unlike `_.template`, which is entangled with the
story-generation hot path and templating data across 3 files. Doing the easy,
testable piece first (per user request) before tackling the harder one.

## Goal

Replace `_.deepClone` with a local, non-underscore-dependent `deepClone` function,
with real unit tests (there are currently none for this function anywhere in the
repo). No behavior change. `require("underscore")` and `_.template` remain untouched.

## Non-goals

- Removing `_.template` or `require("underscore")` — separate spec, later.
- Any change to `lib/templates.js`'s 4 call sites — they call `storyGen().deepClone(...)`,
  a name that isn't changing, so they need no edits.
- Any behavior change to `deepClone` itself (e.g. handling functions/circular refs
  differently) — this is a mechanical extraction, not a rewrite.

## Design

In `lib/propp.js`:

1. Delete the `_.mixin({...})` block (lines 26-36).
2. Add a local function in its place:
   ```js
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
3. Line 220: `var bank = _.deepClone(wordbank);` → `var bank = deepClone(wordbank);`
4. Line 1126: `deepClone: _.deepClone,` → `deepClone: deepClone,` (keeps the public
   `storyGen().deepClone(...)` surface identical — `lib/templates.js` needs no changes)

`var _ = _ || require("underscore");` (line 16) stays — `_.template` (line 902) still
needs it.

## New tests

New file `tests/deepClone.tests.js` (matches this repo's existing one-file-per-concern
pattern, e.g. `tests/cleaner.tests.js`), testing `storyGen().deepClone` — the public
surface, not a private helper, since that's what `lib/templates.js` actually depends
on and what would break if this refactor got it wrong:

- Clones a nested plain object: result is deep-equal to the input but not the same
  reference (mutating the clone doesn't mutate the original, and vice versa).
- Clones arrays (including arrays of objects) the same way.
- Existing behavior, not new behavior, documented via tests rather than changed:
  functions on the input are dropped (JSON round-trip semantics — `JSON.stringify`
  omits function-valued properties).
  - A circular reference throws inside `JSON.stringify`, is caught, and the function
    returns `undefined` (logging the error and the object) rather than throwing.

## Testing / verification

`npm test` — must show 127 existing tests plus the new `deepClone.tests.js` tests, all
passing. No browser verification needed: `deepClone` is pure Node-testable logic with
no DOM dependency, and the browser loads the exact same `lib/propp.js` file, so Node
test coverage is representative here (unlike the jQuery work, which needed a live
browser because `gui.js` has no unit tests and jQuery only exists in that environment).

## Risks

Low. Single file, one function extracted verbatim, one call site changed, one public
API field re-pointed to the same logic under a different reference. The only real risk
is the extraction subtly changing the function (e.g. dropping the try/catch) — directly
mitigated by the new tests, which didn't exist before this spec and pin the behavior
down for the first time.
