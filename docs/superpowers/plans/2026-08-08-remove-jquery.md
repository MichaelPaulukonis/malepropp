# Remove jQuery from GUI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all 18 jQuery call sites in `gui.js` with vanilla DOM APIs, remove the jQuery `<script>` tag from `index.html`, with no behavior change.

**Architecture:** Straight per-call-site mechanical translation (see spec table at `docs/superpowers/specs/2026-08-08-remove-jquery-design.md`). No new abstraction layer. `gui.js` has no existing unit tests (it's DOM-manipulation glue code, not covered by `tests/`), so verification is: `npm test` after every edit (regression check — jQuery isn't on the Node code path, this just confirms nothing else broke) plus one comprehensive real-browser walkthrough as the final task, covering every changed call site.

**Tech Stack:** Vanilla browser DOM APIs (`querySelector`/`querySelectorAll`, `addEventListener`, `NodeList.forEach`, `document.createElement`). No new dependencies.

---

## Task 1: `gui.setall` — checkbox toggle helper

**Files:**
- Modify: `gui.js:20-25`

**Files:**
- [ ] **Step 1: Read current code**

```js
var setall = function (toggle) {
  var funcs = $("input[type=checkbox]");
  funcs.each(function (index, element) {
    $(element).prop("checked", toggle);
  });
};
```

- [ ] **Step 2: Replace with vanilla DOM**

```js
var setall = function (toggle) {
  var funcs = document.querySelectorAll("input[type=checkbox]");
  funcs.forEach(function (element) {
    element.checked = toggle;
  });
};
```

- [ ] **Step 3: Run regression tests**

Run: `npm test`
Expected: 127 passing (unchanged — this code isn't on the Node path)

- [ ] **Step 4: Commit**

```bash
git add gui.js
git commit -m "refactor: replace jQuery in gui.setall with vanilla DOM"
```

---

## Task 2: `pushSettingsToGuiNew` — func8 sub-select value

**Files:**
- Modify: `gui.js` (inside `pushSettingsToGuiNew`, the `if (id) { ... }` block, originally around line 104-106)

- [ ] **Step 1: Read current code**

```js
if (id) {
  $("#" + id).val(subFunc);
}
```

- [ ] **Step 2: Replace with vanilla DOM**

```js
if (id) {
  document.getElementById(id).value = subFunc;
}
```

- [ ] **Step 3: Run regression tests**

Run: `npm test`
Expected: 127 passing

- [ ] **Step 4: Commit**

```bash
git add gui.js
git commit -m "refactor: replace jQuery in pushSettingsToGuiNew with vanilla DOM"
```

---

## Task 3: `getFunctionsFromGui` — radio reads + func8 sub-select read

**Files:**
- Modify: `gui.js` (inside `getFunctionsFromGui`, originally lines 124-126 and 139)

- [ ] **Step 1: Read current code (radio reads)**

```js
var herog = $("input[name=herogender][type=radio]:checked").val();
var villaing = $("input[name=villaingender][type=radio]:checked").val();
var peopleg = $("input[name=peoplegender][type=radio]:checked").val();
```

- [ ] **Step 2: Replace with vanilla DOM**

```js
var herog = document.querySelector(
  "input[name=herogender][type=radio]:checked",
).value;
var villaing = document.querySelector(
  "input[name=villaingender][type=radio]:checked",
).value;
var peopleg = document.querySelector(
  "input[name=peoplegender][type=radio]:checked",
).value;
```

- [ ] **Step 3: Read current code (func8 sub-select read, further down the same function)**

```js
if (index === "func8") {
  var subFunc = "func8subfunc";
  var sf = $("#" + subFunc).val();
  var sfv;
```

- [ ] **Step 4: Replace with vanilla DOM**

```js
if (index === "func8") {
  var subFunc = "func8subfunc";
  var sf = document.getElementById(subFunc).value;
  var sfv;
```

- [ ] **Step 5: Run regression tests**

Run: `npm test`
Expected: 127 passing

- [ ] **Step 6: Commit**

```bash
git add gui.js
git commit -m "refactor: replace jQuery in getFunctionsFromGui with vanilla DOM"
```

---

## Task 4: `guiGet` — theme/tense radio reads

**Files:**
- Modify: `gui.js` (inside `guiGet`, originally lines 175-176)

- [ ] **Step 1: Read current code**

```js
var selectedTheme = $("input[name=theme][type=radio]:checked").val();
settings.verbtense = $("input[name=tense][type=radio]:checked").val();
```

- [ ] **Step 2: Replace with vanilla DOM**

```js
var selectedTheme = document.querySelector(
  "input[name=theme][type=radio]:checked",
).value;
settings.verbtense = document.querySelector(
  "input[name=tense][type=radio]:checked",
).value;
```

- [ ] **Step 3: Run regression tests**

Run: `npm test`
Expected: 127 passing

- [ ] **Step 4: Commit**

```bash
git add gui.js
git commit -m "refactor: replace jQuery in guiGet with vanilla DOM"
```

---

## Task 5: top-level click handler + presets/func8 population block

This is the biggest chunk — the `$("#selectall").click(...)` binding and the entire
`$(document).ready(function () {...})` block at the bottom of `gui.js` (originally
lines 216-248).

**Files:**
- Modify: `gui.js:216-248` (end of file, top-level statements)

- [ ] **Step 1: Read current code**

```js
$("#selectall").click(function () {
  gui.setall(true);
});

// TODO: use the preset when generating
// no, when selected update the gui....
// and then get rid of the other links
$(document).ready(function () {
  var inp = $("#presets");
  var ps = storyGen.presets;
  inp.append($("<option />").val("unselected").text("-- Select a preset --"));
  inp.append($("<option />").val("selectall").text("Select all"));
  $.each(ps, function (key) {
    inp.append($("<option />").val(key).text(key));
  });

  inp.change(function () {
    var preset = $(this).val();
    if (preset === "unselected") {
      gui.setall(false);
    } else if (preset === "selectall") {
      gui.setall(true);
    } else if (preset !== "manual") {
      pushPreset(preset);
    }
  });

  var s = $("#func8subfunc");
  var sf = world.func8subfuncs;
  $.each(world.func8subfuncs, function (key, value) {
    s.append($("<option />").val(value).text(value));
  });
});
```

- [ ] **Step 2: Replace with vanilla DOM**

`$(document).ready(fn)` becomes a direct call to `fn()` — `gui.js` is loaded via a
plain `<script>` tag placed right before `</body>` (see `index.html:228`), after all
markup, so the DOM is already parsed when this file runs. `$("<option />").val(v).text(t)`
becomes `document.createElement("option")` + assigning `.value`/`.textContent`.
`$.each(obj, fn)` becomes `Object.keys(obj).forEach(...)`. `$(this).val()` inside a
plain `function(){}` handler becomes `this.value` (the handler stays a non-arrow
function, so `this` is still the changed element).

```js
document.getElementById("selectall").addEventListener("click", function () {
  gui.setall(true);
});

// TODO: use the preset when generating
// no, when selected update the gui....
// and then get rid of the other links
(function () {
  var inp = document.getElementById("presets");
  var ps = storyGen.presets;

  var unselectedOpt = document.createElement("option");
  unselectedOpt.value = "unselected";
  unselectedOpt.textContent = "-- Select a preset --";
  inp.appendChild(unselectedOpt);

  var selectallOpt = document.createElement("option");
  selectallOpt.value = "selectall";
  selectallOpt.textContent = "Select all";
  inp.appendChild(selectallOpt);

  Object.keys(ps).forEach(function (key) {
    var opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    inp.appendChild(opt);
  });

  inp.addEventListener("change", function () {
    var preset = this.value;
    if (preset === "unselected") {
      gui.setall(false);
    } else if (preset === "selectall") {
      gui.setall(true);
    } else if (preset !== "manual") {
      pushPreset(preset);
    }
  });

  var s = document.getElementById("func8subfunc");
  Object.keys(world.func8subfuncs).forEach(function (key) {
    var value = world.func8subfuncs[key];
    var opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;
    s.appendChild(opt);
  });
})();
```

Note: the original `var sf = world.func8subfuncs;` line was dead (assigned, never
read — `$.each` re-reads `world.func8subfuncs` directly). Dropped, not carried
forward — don't reintroduce unused variables.

- [ ] **Step 3: Run regression tests**

Run: `npm test`
Expected: 127 passing

- [ ] **Step 4: Commit**

```bash
git add gui.js
git commit -m "refactor: replace jQuery in preset/func8 population with vanilla DOM"
```

---

## Task 6: Remove jQuery `<script>` tag from `index.html`

**Files:**
- Modify: `index.html:212`

- [ ] **Step 1: Read current code**

```html
<script type="text/javascript" src="scripts/underscore.js"></script>
<script type="text/javascript" src="scripts/jquery.min.js"></script>
```

- [ ] **Step 2: Remove the jQuery line (underscore stays — `lib/propp.js` still needs it)**

```html
<script type="text/javascript" src="scripts/underscore.js"></script>
```

- [ ] **Step 3: Run regression tests**

Run: `npm test`
Expected: 127 passing

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "chore: stop loading jQuery in index.html"
```

---

## Task 7: Full browser verification

No automated test covers `gui.js` — this task is the real verification, per the
spec's testing section. Serve the repo locally and exercise every call site that
changed across Tasks 1-6.

**Files:** none (verification only)

- [ ] **Step 1: Serve the repo locally**

```bash
npx http-server . -p 8080
```

(Or any static file server — the repo has no bundler/build step for the GUI.)

- [ ] **Step 2: Open the browser and check the console**

Navigate to `http://localhost:8080/index.html`. Open devtools console. Confirm no
errors on load (specifically: no `$ is not defined`, no `Uncaught TypeError` from
`gui.js`).

- [ ] **Step 3: Exercise the presets `<select>`**

Confirm on page load the dropdown is populated with `-- Select a preset --`,
`Select all`, and one entry per key in `storyGen.presets`. Select a real preset
(not the two special ones) — confirm the corresponding checkboxes get checked.
Select `-- Select a preset --` — confirm all checkboxes clear. Select `Select all`
— confirm all checkboxes check.

- [ ] **Step 4: Exercise the "Select all" button**

Click the `Select all` button (`#selectall`). Confirm every function checkbox
becomes checked.

- [ ] **Step 5: Exercise func8 sub-function select**

Confirm `#func8subfunc` is populated with entries from `world.func8subfuncs`.
Check the `func8` checkbox, pick a specific (non-"random") sub-function value,
generate a story, confirm no console errors.

- [ ] **Step 6: Exercise radio groups**

For each of hero gender, villain gender, people gender, tense, and theme
(office/test/descriptive/original): select each option, generate a story, confirm
the generated output reflects the selection (e.g. theme changes template style)
and no console errors appear.

- [ ] **Step 7: Generate a story per theme**

For each of the 4 themes, click generate, confirm text appears in the output
textarea (`window.document.myform.output`) with no console errors.

- [ ] **Step 8: Record result**

If all of the above pass with a clean console, the jQuery removal is verified.
If anything fails, fix the specific `gui.js` call site (referring back to Tasks
1-5) and re-run this task's steps from Step 2.

---

## Self-Review Notes

- **Spec coverage**: all 18 call sites enumerated in the spec's table are covered
  across Tasks 1-5 (verified by re-matching each row in the design doc's table to
  a task above). `index.html` script-tag removal is Task 6. Full verification
  checklist mirrors the spec's testing section exactly (Task 7).
- **Non-goals respected**: no changes to `lib/propp.js`, no deletion of
  `scripts/jquery.min.js` or `package.json`'s `jquery` entry, no unrelated `gui.js`
  refactor beyond the jQuery swap (the one dead-variable removal in Task 5 is
  incidental to the block being fully rewritten, not a separate cleanup pass).
- **Type/name consistency**: `gui.setall`, `pushSettingsToGuiNew`, `getFunctionsFromGui`,
  `guiGet`, `pushPreset`, `storyGen.presets`, `world.func8subfuncs` are all pre-existing
  names, used identically to current `gui.js` — no renames introduced.
