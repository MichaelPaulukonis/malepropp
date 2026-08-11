# Remove `_.template` (underscore) from lib/propp.js

## Context

`lib/propp.js` is the only file in the repo that uses underscore (`var _ = _ ||
require("underscore");`, `lib/propp.js:16`). The `_.deepClone` mixin usage was
already removed (see `docs/superpowers/specs/2026-08-08-remove-underscore-deepclone-design.md`),
leaving exactly one remaining usage:

```js
var t = _.template(f);
f = t(helper);
```

(`lib/propp.js:900-901`, inside the `sentence(func, helper, params)` function).

`helper` is always `this.universe` — the return value of the internal `god(...)`
function (`lib/propp.js:215`), a flat object with ~25 keys (`hero`, `villain`,
`cache`, `coinflip`, `select`, `pick`, `randomProperty`, `converse`,
`pronounobject`, etc.). Underscore's compiled template runs the interpolated
expression inside `with(obj)`, so any of those ~25 keys — and nested property
access off them (`hero.name`, `cache.victim.nickname`) — can be referenced
bare inside a `<%= %>` tag.

This is the second and final step of the "drop jQuery + underscore" effort
(jQuery removal and `_.deepClone` removal are both done and merged to `dev`).
Unlike `_.deepClone`, this usage is entangled with the story-generation hot
path: every generated sentence, across every Propp function and every theme,
passes through it.

**Verified template syntax, repo-wide** (`lib/templates.js`,
`lib/templates.business.js`, `lib/templates.descriptive.js`,
`lib/business.wordbank.js` — the only files containing template strings
consumed by `sentence()`):

- 229 occurrences of `<%= expr %>` (interpolation).
- 0 occurrences of `<% %>` (evaluate/control-flow tags).
- 0 occurrences of `<%- %>` (escape tags).
- 0 literal backticks, 0 literal `${`, 0 literal backslash characters in any
  template string's actual data value.

Expressions used inside `<%= %>` tags include ternaries
(`coinflip() ? cache.victim.name : cache.victim.nickname`) and nested function
calls (`select("said", "remarked", "noted", ...)`) — not just bare property
lookups, so any replacement must support arbitrary JS expression evaluation,
not just simple string substitution.

## Goal

Replace `_.template` with a local, dependency-free `interpolate` function that
compiles a `<%= %>`-tagged template string plus a flat data object into
rendered text, using native JS template-literal syntax (`${expr}`) via
`new Function` as the compilation mechanism. No behavior change to generated
output. `require("underscore")` is fully removed from `propp.js` once this is
the last usage (see Non-goals for exact scope).

## Design

In `lib/propp.js`, inside `storyGen` (same closure-scoping pattern used for
`random`/`pick`/`pickRemove`/`coinflip`/`deepClone`):

```js
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

- `<%= expr %>` tags are translated to `${expr}` at compile time, inside
  `interpolate` itself — the 229 template strings in `templates.js` and
  friends are **not** rewritten; they keep authoring templates with `<%= %>`
  syntax, unchanged.
- `new Function(keys.join(","), ...)` gives the compiled function one
  parameter per key of `data` (`helper`), called immediately with the
  corresponding values via `.apply`. This replicates underscore's
  `with(obj)` bare-name scoping for `data`'s own top-level keys, without
  using `with` (which Biome's lint rules and general modern-JS practice both
  avoid).
- `sentence()`'s call site (`lib/propp.js:900-901`) becomes:
  ```js
  f = interpolate(f, helper);
  ```
- `interpolate` is exposed on `storyGen`'s returned object (same as
  `deepClone` was) so it's independently unit-testable via
  `storyGen().interpolate(...)`.

Once this lands (last underscore usage removed):

- Delete `var _ = _ || require("underscore");` (`lib/propp.js:16`).
- Delete the `<script src="scripts/underscore.js">` tag from `index.html`.

## Non-goals

- Rewriting the 229 `<%= %>` occurrences in `templates.js` /
  `templates.business.js` / `templates.descriptive.js` /
  `business.wordbank.js` to native `${}` syntax. They stay exactly as
  authored; translation happens at compile time inside `interpolate`.
- Deleting the vendored `scripts/underscore.js` file or its `package.json`
  entry. Same treatment `scripts/jquery.min.js` got — stop loading/requiring
  it, leave the file and package.json entry as unused leftovers.
- Adding template compilation caching. Underscore's `_.template(f)` was
  already recompiling from scratch on every single call (no memoization);
  `interpolate` preserves that — same performance characteristics, not a
  regression, not an improvement.
- Any change to `god(...)`'s returned object shape (the ~25 keys `helper`
  exposes) — `interpolate` consumes whatever `helper` already is.

## Behavior parity notes

- **Recompilation cost**: unchanged (see Non-goals) — both old and new
  implementations compile a fresh function per call.
- **Scoping for names not on `helper`**: underscore's `with(obj)` falls
  through to the normal JS scope chain (ultimately globals) for any
  identifier not found on `obj`. `new Function`'s body has no closure over
  `propp.js`'s local scope either — unresolved names there also fall through
  to globals. Same failure mode either way if a template ever references a
  name that isn't one of `helper`'s keys; not a new risk introduced by this
  change, and the full `sentence()` call graph already exercises every real
  template string via the existing test suite (see Testing).
- **Escaping**: confirmed zero literal backticks, `${`, or backslashes in any
  of the 229 real template strings' data values, so no escaping logic is
  needed before embedding a template string into the `new Function` body.

## New tests

New file `tests/interpolate.tests.js` (matches the repo's one-file-per-concern
pattern, e.g. `tests/deepClone.tests.js`), testing `storyGen().interpolate`
directly with fabricated data objects — no need to exercise real story
generation to unit-test this in isolation:

- Simple property interpolation (`<%= name %>` with `{ name: "..." }`).
- Ternary expressions (`<%= flag ? "a" : "b" %>`).
- Function-call expressions (`<%= greet("world") %>` with a function in the
  data object).
- Multiple `<%= %>` tags in a single template string.
- A template string with zero `<%= %>` tags (pass-through, unchanged).
- Nested property access (`<%= obj.nested.value %>`).

## Testing / verification

- `npm test` — must show all existing tests plus the new
  `interpolate.tests.js` tests, all passing. `tests/malepropp.tests.js`
  already iterates every Propp function across every theme, generating real
  text through `sentence()` — this exercises the 229 real template strings
  through `interpolate`, not just the synthetic unit-test cases.
- **Browser verification required** (unlike the `_.deepClone` removal, which
  was Node-only): this is the hot path for every generated sentence in the
  GUI. Generate at least one full story in the browser after the change and
  confirm it reads normally — no `undefined`/`NaN`/raw `<%= %>` tags leaking
  into the output, no console errors.

## Risks

Medium — higher than the `_.deepClone` removal, since this touches the
story-generation hot path used by every Propp function rather than a single
isolated utility. Mitigated by: the existing `tests/malepropp.tests.js`
suite already exercising every real template string end-to-end, new targeted
unit tests for `interpolate` covering the actual expression shapes found in
the templates (ternaries, function calls, multi-tag strings), and a required
browser smoke test before merge.
