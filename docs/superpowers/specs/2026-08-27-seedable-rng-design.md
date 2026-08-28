# Seedable RNG for lib/propp.js (malepropp-fnq.3)

## Problem

`lib/propp.js` calls `Math.random()` at 5 call sites: `world.util.randomProperty`
(module scope, propp.js:138) and `random`/`pick`/`pickRemove`/`coinflip`
(inside the `storyGen` closure, propp.js:160/165/169/179). `Math.random()`
cannot be seeded — no JS engine exposes its internal state — so there is no
way to generate the same story twice. That blocks before/after diffing when
refactoring generation logic, which matters most for the upcoming
malepropp-x82 split of `god()`/`nTemplates()`.

`randomProperty` is also aliased onto `god` (propp.js:892, :1154) and called
mid-generation by `templates.js`'s `execN` functions (e.g. picking an
interdiction or villainy type) — so it's on the hot path of story text
generation, not just settings selection.

Separately, `index.js` (the Node CLI) calls the same module-level
`world.util.randomProperty(storygen.presets)` once, *before* constructing a
`storyGen` instance, to pick a random preset. `gui.js` never does this — the
GUI's preset choice is a user-driven dropdown, already deterministic.

## Approach

One shared, module-scope swappable RNG source in `propp.js`. All 5
`Math.random()` call sites route through one internal `nextRandom()`
helper instead of calling `Math.random()` directly.

- Default (unseeded): `nextRandom()` calls `Math.random()`. Zero behavior
  change, zero added cost, for every existing caller that never seeds.
- Seeded: `nextRandom()` draws from an inline **mulberry32** generator
  instead. Mulberry32 is ~4 lines of integer arithmetic (one seed word,
  one multiply-xor-shift step per call) — not a dependency, just inline
  code, consistent with this repo's no-added-deps stance.

Math.random() has no seed parameter in any JS engine (V8's Xorshift128+
state is intentionally unexposed), so an inline deterministic algorithm is
required for seeding to be possible at all — there's no way to seed the
built-in.

### API

```js
storyGen.seed(n);     // static. n: non-negative integer.
                       // Resets shared RNG state deterministically —
                       // calling seed(n) twice always replays identically
                       // regardless of what ran in between.
storyGen.unseed();     // static. Reverts nextRandom() to Math.random().
```

Construction sugar:

```js
new storyGen({ ...settings, seed: 12345 });
// equivalent to: storyGen.seed(12345); new storyGen(settings);
```

This covers the primary use case the bead calls out directly: fixed
settings, `generate()` called twice with the same seed, diff the output
byte-for-byte.

Callers who additionally need to reproduce *which preset got picked*
(currently only `index.js`, which calls `world.util.randomProperty(presets)`
before constructing `storyGen` at all) call `storyGen.seed(n)` explicitly
first — same shared source, no separate mechanism needed. This is optional;
most callers (tests, diffing) construct with explicit settings and never
hit this path.

### Scope

In scope:
- `world.util.randomProperty` (propp.js:133-141)
- `random`, `pick`, `pickRemove`, `coinflip` (propp.js:159-180, inside the
  `storyGen` closure)
- `god.randomProperty` — no separate change needed, it's already an alias
  of `world.util.randomProperty` (propp.js:892, :1154), so it inherits
  seeding for free once the module-level function is seedable.

Out of scope:
- Changing `index.js`'s or `gui.js`'s existing preset-selection call sites
  — they keep working as-is; seeding them is opt-in via `storyGen.seed()`
  called first, not a required change.
- Any change to `pickRemove`'s array-mutation behavior (still splices).

## Testing

- New unit tests in `tests/malepropp.tests.js` (or a new
  `tests/seed.tests.js`): `storyGen.seed(n)` then `generate()` twice with
  identical settings produces byte-identical `tale` text; two different
  seeds (or unseeded) produce different output with overwhelming
  probability.
- All 292 existing tests must keep passing unchanged — none of them seed,
  so `nextRandom()` stays on the `Math.random()` path for them, identical
  to current behavior.
- No performance-sensitive assertions needed; mulberry32 is a handful of
  integer ops, negligible next to string templating work already done per
  story.
