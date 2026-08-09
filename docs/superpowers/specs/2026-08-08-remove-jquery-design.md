# Remove jQuery from GUI

## Context

`gui.js` (browser GUI only) uses jQuery for DOM manipulation — 18 call sites, all
simple selector/read/write/event-binding operations. jQuery is loaded via a vendored
`scripts/jquery.min.js`, referenced only from `index.html`. No other file in the repo
uses jQuery (confirmed via repo-wide grep — `lib/*.js`, `index.js`, `tests/*.js` are
clean).

This is step one of a larger "drop jQuery + underscore" effort. Underscore
(`_.template`, `_.mixin`/`deepClone` in `lib/propp.js`) is out of scope here — separate
file, separate risk profile (template-engine replacement on the hot generation path),
gets its own spec later.

## Goal

Replace all jQuery usage in `gui.js` with vanilla DOM APIs. No behavior change. No new
abstraction/wrapper layer — direct 1:1 swaps only (YAGNI).

## Non-goals

- Removing `_.template`/`_.mixin` from `lib/propp.js` (separate spec).
- Deleting `scripts/jquery.min.js` or the `jquery` entry in `package.json` — left in
  place per decision below (dead weight, deferred).
- Any refactor of `gui.js` beyond the jQuery→vanilla swap (no restructuring, no new
  functions, no behavior fixes to existing TODOs/bugs noted in comments).

## Design

Straight per-call-site translation, in `gui.js`:

| jQuery | Vanilla replacement |
|---|---|
| `$("input[type=checkbox]")` | `document.querySelectorAll("input[type=checkbox]")` |
| `.each(function(i, el) {...})` on a NodeList | `.forEach(function(el) {...})` (NodeList has native `.forEach`) |
| `$(element).prop("checked", toggle)` | `element.checked = toggle` |
| `$("#" + id).val(x)` | `document.getElementById(id).value = x` |
| `$("#" + id).val()` | `document.getElementById(id).value` |
| `$("input[name=x][type=radio]:checked").val()` | `document.querySelector("input[name=x][type=radio]:checked").value` |
| `$("#selectall").click(fn)` | `document.getElementById("selectall").addEventListener("click", fn)` |
| `$(document).ready(fn)` | call `fn()` directly — `gui.js` is a plain (non-`defer`, non-`async`) `<script>` tag placed just before `</body>`, after all markup, so the DOM is already parsed when it runs. No listener needed. |
| `$("<option />").val(v).text(t)` | `var opt = document.createElement("option"); opt.value = v; opt.textContent = t;` |
| `parent.append(opt)` | `parent.appendChild(opt)` |
| `$.each(obj, function(key, val) {...})` | `Object.keys(obj).forEach(function(key) { var val = obj[key]; ... })` |
| `inp.change(fn)` | `inp.addEventListener("change", fn)` |
| `$(this).val()` inside a `function(){}` handler | `this.value` (handler stays a plain `function`, not an arrow, so `this` is still the element) |

`index.html`: remove `<script type="text/javascript" src="scripts/jquery.min.js"></script>`
only. The underscore `<script>` tag stays — `lib/propp.js` still requires it.

## Testing / verification

1. `npm test` — must still pass (127 tests). jQuery isn't on the Node code path, so
   this is mainly a "didn't break anything else" check.
2. Real browser session (serve the repo locally), exercising every call site that
   changed:
   - Theme radio buttons (office/test/descriptive/original) — confirm selection reads
     correctly and generation works per theme.
   - Tense radio buttons, hero/villain/people gender radios.
   - "Select all" button.
   - Presets `<select>` — populated correctly on load, selecting a preset checks the
     right boxes, "-- Select a preset --" / "Select all" / "manual" special values
     still behave as before.
   - func8 sub-function `<select>` — populated from `world.func8subfuncs`, value read
     correctly when func8 is active.
   - Generate a story from each theme, confirm output renders in the textarea.
   - Check browser console for errors (`$ is not defined`, etc.) after the jQuery
     `<script>` tag is removed.

## Risks

Low. Single file, mechanical translation, no shared state with the underscore-based
engine code in `lib/`. Main risk is a missed call site — mitigated by the grep-verified
exhaustive list above (18 sites, all enumerated) and the browser walkthrough covering
every one.
