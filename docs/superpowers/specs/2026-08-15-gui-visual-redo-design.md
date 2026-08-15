# GUI visual redo: table/center layout → responsive grid + storybook theme

## Context

`index.html` and `propp.css` are unchanged from the jQuery/underscore era
(both those deps were already removed from the GUI in earlier work — see
`docs/superpowers/specs/2026-08-08-remove-jquery-design.md` and the
underscore-removal specs in the same directory). The markup is a
`<table col="3">` inside a `<center>` tag, `propp.css` forces
`min-width:800px !important` (no responsive behavior at all), and each of the
four function groups (`#introduction`, `#storybody`, `#donorsequence`,
`#herosreturn`) gets a flat, semantically-arbitrary background color
(`lightblue`, `azure`, `cadetblue`, `chartreuse`) as its only visual marker.

Confirmed via grep that none of those four group IDs (`introduction` /
`storybody` / `donorsequence` / `herosreturn`) or the `sphere` class are read
by any JS (`gui.js`, `lib/*.js`) — they're pure CSS hooks, free to restructure
or rename without touching behavior.

This is bead `malepropp-qh1` ("Modernize GUI visual design"), raised as an
ad-hoc request with no specific direction given up front — scope and
direction were established through brainstorming (this doc is the output of
that session).

There's also a small pre-existing UX wart this redo is a natural point to
fix: two overlapping "clear" controls exist after recent work
(`malepropp-fdb`, `malepropp-cpm`) —
- the native `<input type="reset" value="clear">` (`index.html:198`), which
  resets the whole form including gender/tense radios and the output
  `<textarea>`, and
- the new `#clear` button (`gui.js`, added this session), which only unchecks
  function checkboxes and resets the two `<select>`s.

## Goal

Replace the table/center layout with responsive, semantic HTML + CSS Grid,
reskin to a warm "storybook/parchment" visual theme with a manual light/dark
toggle, drop the four flat per-group background colors in favor of
heading/border-based grouping, and merge the two clear controls into one.
No new runtime dependencies — stays vanilla DOM/CSS, consistent with the
repo's existing jQuery/underscore-removal direction (see CLAUDE.md).

Scope note (explicit user decision during brainstorming): this is a
**layout + visual rework only**. Reconsidering *how* functions are grouped
or selected, or redesigning the output area's interaction model, is
explicitly deferred to a future pass — tracked separately, not part of this
spec.

## Design

### Structure (`index.html`)

Replace `<table><center>` with semantic HTML:
- `<header>` — title.
- `<main>`, laid out via CSS Grid (see below) containing:
  - Four `<fieldset>` + `<legend>` blocks, one per function group
    (introduction / story body / donor sequence / hero's return) — replaces
    the four `<ul class="sphere" id="...">` blocks. `<fieldset>`/`<legend>`
    is the semantically-correct native grouping element for a cluster of
    checkboxes, and gets automatic grouping semantics for free (no ARIA
    needed).
  - A sidebar block: preset `<select>`, Randomize/Clear buttons, theme
    radios, links, gender/tense/bossfight settings — same controls as
    today, just reflowed.
  - Actions row: Generate button, (merged) Clear button.
  - Output `<textarea>` — stays a `<textarea>` (kept editable/selectable,
    same as today; redesigning this interaction is out of scope per the
    scope note above).

All existing `name`/`id` attributes on inputs (`func0`..`func31`, `bossfight`,
`herogender`/`villaingender`/`peoplegender`, `tense`, `theme`, `presets`,
`func8subfunc`, `randomize`, `clear`) are preserved unchanged — `gui.js` and
`lib/propp.js` (`window.document.myform[...]`) read the form by name, and
none of that lookup code changes.

### Layout (`propp.css`)

CSS Grid on the `<main>` element:

```
grid-template-areas:
  "func1 func2 sidebar"
  "settings settings sidebar"
  "actions actions sidebar";
grid-template-columns: 1fr 1fr 220px;
```

Below a `~700px` breakpoint, collapses to a single column
(`grid-template-columns: 1fr`, areas stacked: func groups, settings, sidebar,
actions) via a `@media (max-width: 700px)` override — replaces the current
`min-width:800px !important` hard floor entirely.

### Visual theme (`propp.css`)

CSS custom properties on `:root` for a light "parchment" theme (warm cream
background, dark ink-brown text/accents, serif type — `Georgia,
'Iowan Old Style', 'Times New Roman', serif`, no external font/CDN
dependency), and a `[data-theme="dark"]` override block for a dark "ink"
theme (dark brown/near-black background, warm tan/cream text and accents) —
same structure validated in the brainstorming mockups. Example tokens:

```css
:root {
  --bg: #f4ecd8;
  --surface: #fffdf7;
  --border: #c9b789;
  --text: #4a3423;
  --accent: #6b3f2a;
  --accent-text: #fdf6e8;
}
[data-theme="dark"] {
  --bg: #2a2118;
  --surface: #332619;
  --border: #5a4a35;
  --text: #e8dcc0;
  --accent: #c9a86a;
  --accent-text: #2a2118;
}
```

All existing color/background rules in `propp.css` (including the four
`#introduction`/`#storybody`/`#donorsequence`/`#herosreturn` flat
backgrounds) are replaced by rules using these tokens. Function groups are
now visually distinguished by `<legend>` heading + a bottom border under the
legend, not by background fill — same info (which sphere a function belongs
to), calmer presentation.

### Theme toggle (`gui.js` + `index.html`)

- A toggle button (placed near the title/header) flips a `data-theme`
  attribute on `<html>` between unset (light, the default) and `"dark"`.
- Persisted via `localStorage` (e.g. key `malepropp-theme`); on load, `gui.js`
  reads the stored value (if any) and applies it before/at
  `DOMContentLoaded` to avoid a flash of the wrong theme.
- No `prefers-color-scheme` auto-detection — manual toggle only, per
  brainstorming decision.

### Clear button consolidation (`index.html` + `gui.js`)

- Remove the native `<input type="reset" value="clear">` (`index.html:198`)
  entirely.
- The existing `#clear` button's handler (`gui.js`, added this session) is
  extended to also reset gender/tense/bossfight radios to their documented
  defaults (female/female/female, past tense, bossfight unchecked) and clear
  the output `<textarea>`'s contents — i.e. it now does everything the old
  reset input did, plus what it already did (uncheck all function
  checkboxes, reset both dropdowns).
- Only one "Clear" control remains in the UI; no relabeling needed since
  there's no longer a second control to disambiguate against.

## Non-goals

- Rethinking function grouping/selection UX (e.g. collapsing groups,
  reordering, different control types) — explicitly deferred by the user
  ("2 now, 3 some other time" in brainstorming, referring to the
  visual-polish/layout-rework/full-UX-rethink scope options).
- Redesigning the output `<textarea>` beyond restyling (e.g. no copy button,
  no rendered/read-only view, no rich text) — deferred, same reason.
- `prefers-color-scheme` auto dark mode — user explicitly chose manual
  toggle over automatic OS-following.
- Any new build step, CSS framework, or JS dependency (Tailwind, PostCSS,
  etc.) — stays plain CSS/vanilla DOM, consistent with the repo's existing
  no-jQuery/no-underscore direction.
- Changing `gui.js`'s existing `pushSettingsToGuiNew`/`gui.setall`/
  `gui.randomize` logic beyond what's needed for the clear-button merge —
  those were just fixed/added this session and are working correctly.
- Deleting or reorganizing `lib/*.js` — this is GUI-file-only work
  (`index.html`, `propp.css`, `gui.js`), per the repo's existing
  engine/presentation split (CLAUDE.md).

## Testing / verification

- `npm test` — must stay at 141 passing; none of this touches `lib/`, so no
  behavior change expected, but run it to confirm no accidental breakage
  (e.g. if `index.html`'s `<script>` load order gets touched).
- `npm run lint` (Biome) — no new errors on `gui.js`. `index.html` stays
  outside Biome's lint scope (per `biome.json`, unchanged).
- **Browser verification required** (visual/layout change, not unit-testable):
  - Load the page at normal width — grid layout matches the approved mockup,
    no leftover table/center artifacts.
  - Resize below ~700px — confirm single-column collapse, no horizontal
    scroll, no overlapping controls.
  - Toggle dark mode — confirm all text/controls remain readable (no
    invisible-text-on-background regressions), confirm it persists across a
    page reload (`localStorage`).
  - Select a preset, then click the single Clear button — confirm function
    checkboxes, both dropdowns, gender/tense/bossfight radios, and the
    output textarea all return to their documented defaults.
  - Click Generate at least once in both themes — confirm output renders
    normally (this exercises no new code path, but confirms the textarea
    restyle didn't break visibility/scroll of generated text).
  - Check browser console for errors on load and after each interaction
    above.

## Risks

Low-medium. No changes to `lib/` or story-generation logic — purely
`index.html` markup, `propp.css`, and additive/consolidating changes in
`gui.js` (theme persistence, merged clear handler). Main risk is
visual/layout regressions (things not lining up, dark-mode contrast issues)
rather than functional breakage, since all form `name`/`id` attributes and
existing event-handler wiring are preserved unchanged. Mitigated by the
required browser verification pass above before considering this done.
