# GUI Visual Redo (Storybook/Parchment) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `index.html`'s table/center layout with a responsive, semantic CSS Grid layout, reskin `propp.css` to the storybook/parchment theme (light + manual dark toggle) approved in `docs/superpowers/specs/2026-08-15-gui-visual-redo-design.md`, and merge the two overlapping "clear" controls into one that fully resets the form.

**Architecture:** Three files change together: `propp.css` (complete rewrite — CSS custom-property tokens for light/dark, grid layout, component styles), `index.html` (complete rewrite of the `<body>` — `<header>`/`<main>`/`<fieldset>`/`<legend>` in place of `<table>`/`<center>`, plus a tiny inline anti-flash script in `<head>`), and `gui.js` (additive — theme-toggle click handler + `localStorage` persistence, and an extension of the existing `#clear` handler). All existing form-control `name`/`id` values are preserved so no other JS call site changes.

**Tech Stack:** Plain HTML/CSS/vanilla JS — no new dependencies, consistent with the repo's existing no-jQuery/no-underscore direction (see `CLAUDE.md`).

---

## Before you start

This is GUI-only work with no unit-test coverage (the `npm test` suite covers `lib/` engine code only — `index.html`/`gui.js`/`propp.css` have never had automated tests). Verification in this plan is **manual browser verification**, using a local static file server + the `mcp__claude-in-chrome__*` browser tools. Every task that touches `index.html`/`propp.css`/`gui.js` ends with a real load-and-look step — don't skip it.

To serve the files locally during verification:

```bash
cd /Users/michaelpaulukonis/projects/malepropp
python3 -m http.server 8901 >/tmp/malepropp-http.log 2>&1 &
```

Then navigate a browser tab to `http://localhost:8901/index.html`. Kill it when done: `pkill -f "http.server 8901"`.

---

### Task 1: Rewrite `propp.css` and `index.html`

These two files must land together — new CSS class names only make sense against the new markup, and vice versa. This task also fixes a pre-existing bug: the original `index.html` has **two elements with `id="donorsequence"`** (one `<ul>` for func12–15, a second for func16–19) which is invalid HTML. This rewrite consolidates func16–19 into the "Hero's return" group (matching the visual-design mockups already approved by the user), which both fixes the duplicate ID and matches Propp's own numbering better (16–19 are the struggle/victory/liquidation beats that lead into the hero's return, not a second donor sequence).

It also adds real `<label for="...">` associations for every function checkbox — currently the checkbox text is bare text inside an `<li>`, not wrapped in or associated with a `<label>`, so clicking the visible word does nothing. Every input keeps its existing `name` (the thing `gui.js` and `lib/propp.js` actually read), gains a matching `id` (previously absent on the 33 function checkboxes), and its visible text becomes a `<label for="id">`.

**Files:**
- Modify: `propp.css` (complete rewrite)
- Modify: `index.html` (complete rewrite)

- [ ] **Step 1: Replace `propp.css`**

Replace the entire file contents:

```css
:root {
  --bg: #f4ecd8;
  --surface: #fffdf7;
  --border: #c9b789;
  --text: #4a3423;
  --text-dim: #8a6d47;
  --accent: #6b3f2a;
  --accent-text: #fdf6e8;
  --font-body: Georgia, "Iowan Old Style", "Times New Roman", serif;
}

[data-theme="dark"] {
  --bg: #2a2118;
  --surface: #332619;
  --border: #5a4a35;
  --text: #e8dcc0;
  --text-dim: #c9a86a;
  --accent: #c9a86a;
  --accent-text: #2a2118;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  padding: clamp(1rem, 3vw, 2.5rem);
}

a {
  color: var(--accent);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.block-title {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  margin-bottom: 0.4rem;
}

.page {
  max-width: 1100px;
  margin: 0 auto;
}

header.title-block {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--border);
  padding-bottom: 0.9rem;
  margin-bottom: 1.5rem;
}

header.title-block h1 {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  letter-spacing: 0.01em;
}

header.title-block p.tagline {
  margin: 0.3rem 0 0;
  font-style: italic;
  color: var(--text-dim);
  font-size: 0.95rem;
}

.theme-toggle {
  font-family: var(--font-body);
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0.5rem 0.9rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
}

.theme-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
}

main.layout {
  display: grid;
  grid-template-columns: 1fr 1fr 220px;
  gap: 1.5rem;
}

@media (max-width: 700px) {
  main.layout {
    grid-template-columns: 1fr;
  }
}

fieldset.group {
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
  margin-bottom: 1.5rem;
}

.sidebar fieldset.group {
  border-top: none;
  padding-top: 0;
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.check-item {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  font-size: 0.95rem;
}

.check-item input[type="checkbox"] {
  accent-color: var(--accent);
}

.check-item label {
  cursor: pointer;
}

.subfunction {
  margin: 0.5rem 0 0 1.6em;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

select {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 0.45rem 0.6rem;
  border-radius: 2px;
}

aside.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.radio-cluster {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.radio-cluster .check-item {
  font-size: 0.9rem;
}

.radio-cluster input[type="radio"] {
  accent-color: var(--accent);
}

.links-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.settings-row {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  border-top: 1px solid var(--border);
  padding-top: 1.25rem;
  margin-top: 0.5rem;
}

.settings-row .field {
  min-width: 12rem;
}

.inline-radios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.inline-radios .check-item {
  font-size: 0.85rem;
}

.inline-radios input[type="radio"] {
  accent-color: var(--accent);
}

.actions-row {
  grid-column: 1 / -1;
  border-top: 1px solid var(--border);
  padding-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
}

button {
  font-family: var(--font-body);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.6rem 1.2rem;
  border-radius: 2px;
}

.btn-ghost {
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
}

.btn-ghost:hover {
  background: rgba(107, 63, 42, 0.08);
}

[data-theme="dark"] .btn-ghost:hover {
  background: rgba(201, 168, 106, 0.12);
}

.btn-generate {
  background: var(--accent);
  color: var(--accent-text);
  border: none;
  font-size: 1rem;
  padding: 0.7rem 1.6rem;
  margin-left: auto;
}

.btn-generate:hover {
  filter: brightness(1.08);
}

section.output {
  margin-top: 1.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.25rem;
  border-radius: 3px;
}

section.output h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-dim);
}

#output {
  width: 100%;
  min-height: 220px;
  resize: vertical;
  font-family: var(--font-body);
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--text);
  background: transparent;
  border: none;
}
```

- [ ] **Step 2: Replace `index.html`**

Replace the entire file contents:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>MalePropp Tale Generator</title>

  <link href="propp.css" rel="stylesheet" />

  <script>
    (function () {
      try {
        if (localStorage.getItem("malepropp-theme") === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
        }
      } catch (e) {}
    })();
  </script>
</head>

<body>

  <form name="myform" onsubmit="return false;" action="">
    <div class="page">

      <header class="title-block">
        <div>
          <h1>Proppian Fairy Tale Generator</h1>
          <p class="tagline">Select your functions and generate a fairy tale.</p>
        </div>
        <button type="button" id="theme-toggle" class="theme-toggle">Switch to dark</button>
      </header>

      <main class="layout">

        <section aria-label="Narrative function selection: introduction and story body">
          <fieldset class="group">
            <legend class="block-title">Introduction</legend>
            <div class="check-list">
              <div class="check-item"><input name="func0" id="func0" type="checkbox" /><label for="func0" title="not a Propp function">introduction</label></div>
              <div class="check-item"><input name="func1" id="func1" type="checkbox" /><label for="func1" title="1: Absentation: Someone goes missing">absention</label></div>
              <div class="check-item"><input name="func2" id="func2" type="checkbox" /><label for="func2" title="2: Interdiction: hero is warned">interdiction</label></div>
              <div class="check-item"><input name="func3" id="func3" type="checkbox" /><label for="func3" title="3: Violation of Interdiction">violation</label></div>
              <div class="check-item"><input name="func4" id="func4" type="checkbox" /><label for="func4" title="4: Reconnaissance: Villain seeks something">reconnaissance</label></div>
              <div class="check-item"><input name="func5" id="func5" type="checkbox" /><label for="func5" title="5: Delivery: The villain gains information">delivery</label></div>
              <div class="check-item"><input name="func6" id="func6" type="checkbox" /><label for="func6" title="6: Trickery: Villain attempts to deceive victim.">trickery</label></div>
              <div class="check-item"><input name="func7" id="func7" type="checkbox" /><label for="func7" title="7: Complicity: Unwitting helping of the enemy">complicity</label></div>
            </div>
          </fieldset>

          <fieldset class="group">
            <legend class="block-title">Story body</legend>
            <div class="check-list">
              <div class="check-item"><input name="func8" id="func8" type="checkbox" checked="checked" /><label for="func8" title="8: Villainy: The need is identified (Villainy)">villainy</label></div>
              <div class="check-item"><input name="func8a" id="func8a" type="checkbox" /><label for="func8a" title="8a: Lack: The need is identified (Lack)">lack</label></div>
              <div class="check-item"><input name="func9" id="func9" type="checkbox" /><label for="func9" title="9: Mediation: hero discovers the lack">mediation</label></div>
              <div class="check-item"><input name="func10" id="func10" type="checkbox" /><label for="func10" title="10: Counteraction: hero chooses positive action">beginning counteraction</label></div>
              <div class="check-item"><input name="func11" id="func11" type="checkbox" /><label for="func11" title="11: Departure: hero leave on mission">departure</label></div>
            </div>
            <div class="subfunction">
              <label class="block-title" for="func8subfunc">Villainy type</label>
              <select name="func8subfunc" id="func8subfunc">
                <option value="random">Random</option>
              </select>
            </div>
          </fieldset>
        </section>

        <section aria-label="Narrative function selection: donor sequence and hero's return">
          <fieldset class="group">
            <legend class="block-title">Donor sequence</legend>
            <div class="check-list">
              <div class="check-item"><input name="func12" id="func12" type="checkbox" /><label for="func12" title="12: Testing: hero is challenged to prove heroic qualities">first function of the donor</label></div>
              <div class="check-item"><input name="func13" id="func13" type="checkbox" /><label for="func13" title="13: Reaction: hero responds to test">hero's reaction</label></div>
              <div class="check-item"><input name="func14" id="func14" type="checkbox" /><label for="func14" title="14: Acquisition: hero gains magical item">receipt of a magical agent</label></div>
              <div class="check-item"><input name="func15" id="func15" type="checkbox" /><label for="func15" title="15: Guidance: hero reaches destination">guidance</label></div>
            </div>
          </fieldset>

          <fieldset class="group">
            <legend class="block-title">Hero's return</legend>
            <div class="check-list">
              <div class="check-item"><input name="func16" id="func16" type="checkbox" /><label for="func16" title="16: Struggle: hero and villain do battle">struggle</label></div>
              <div class="check-item"><input name="func17" id="func17" type="checkbox" /><label for="func17" title="17: Branding: hero is branded">branding</label></div>
              <div class="check-item"><input name="func18" id="func18" type="checkbox" /><label for="func18" title="18: Victory: Villain is defeated">victory</label></div>
              <div class="check-item"><input name="func19" id="func19" type="checkbox" /><label for="func19" title="19: Resolution: Initial misfortune or lack is resolved">liquidation</label></div>
              <div class="check-item"><input name="func20" id="func20" type="checkbox" /><label for="func20" title="20: Return: hero sets out for home">return</label></div>
              <div class="check-item"><input name="func21" id="func21" type="checkbox" /><label for="func21" title="21: Pursuit: hero is chased">pursuit</label></div>
              <div class="check-item"><input name="func22" id="func22" type="checkbox" /><label for="func22" title="22: Rescue: pursuit ends">rescue</label></div>
              <div class="check-item"><input name="func23" id="func23" type="checkbox" /><label for="func23" title="23: Arrival: hero arrives unrecognized">unrecognized arrival</label></div>
              <div class="check-item"><input name="func24" id="func24" type="checkbox" /><label for="func24" title="24: Claim: False hero makes unfounded claims">unfounded claims</label></div>
              <div class="check-item"><input name="func25" id="func25" type="checkbox" /><label for="func25" title="25: Task: Difficult task proposed to the hero">difficult task</label></div>
              <div class="check-item"><input name="func26" id="func26" type="checkbox" /><label for="func26" title="26: Solution: Task is resolved">solution</label></div>
              <div class="check-item"><input name="func27" id="func27" type="checkbox" /><label for="func27" title="27: Recognition: hero is recognised">recognition</label></div>
              <div class="check-item"><input name="func28" id="func28" type="checkbox" /><label for="func28" title="28: Exposure: False hero is exposed">exposure</label></div>
              <div class="check-item"><input name="func29" id="func29" type="checkbox" /><label for="func29" title="29: Transfiguration: hero is given a new appearance">transfiguration</label></div>
              <div class="check-item"><input name="func30" id="func30" type="checkbox" /><label for="func30" title="30: Punishment: Villain is punished">punishment</label></div>
              <div class="check-item"><input name="func31" id="func31" type="checkbox" /><label for="func31" title="31: Wedding: hero marries and ascends the throne">wedding</label></div>
            </div>
          </fieldset>
        </section>

        <aside class="sidebar" aria-label="Generator settings">
          <div class="field">
            <label class="block-title" for="presets">Preset</label>
            <select name="presets" id="presets"></select>
          </div>

          <fieldset class="group">
            <legend class="block-title">Theme</legend>
            <div class="radio-cluster">
              <div class="check-item"><input name="theme" type="radio" id="r1" value="test" checked="checked" /><label for="r1">Vaguely Russian</label></div>
              <div class="check-item"><input name="theme" type="radio" id="r2" value="office" /><label for="r2">Office Setting</label></div>
              <div class="check-item"><input name="theme" type="radio" id="r3" value="original" /><label for="r3">Brown</label></div>
              <div class="check-item"><input name="theme" type="radio" id="r4" value="descriptive" /><label for="r4">Descriptive (raw function skeleton)</label></div>
            </div>
          </fieldset>

          <ul class="links-list">
            <li>links:</li>
            <li><a href="https://web.archive.org/web/20061112014356/http://www.brown.edu/Courses/FR0133/Fairytale_Generator/gen.html">original</a></li>
            <li><a href="http://fairytalesbot.tumblr.com/">Tumblrbot</a></li>
            <li><a href="https://github.com/MichaelPaulukonis/malepropp">source</a></li>
            <li><a href="https://github.com/MichaelPaulukonis/NaNoGenMo2014/tree/master/propp.gen">original repo</a></li>
            <li><a href="https://github.com/dariusk/NaNoGenMo-2014/issues/6">disscussion</a></li>
          </ul>
        </aside>

        <div class="settings-row">
          <fieldset class="field">
            <legend class="block-title">Hero</legend>
            <div class="inline-radios">
              <div class="check-item"><input name="herogender" id="herogenderfemale" type="radio" value="female" checked="checked" /><label for="herogenderfemale">female</label></div>
              <div class="check-item"><input name="herogender" id="herogendermale" type="radio" value="male" /><label for="herogendermale">male</label></div>
              <div class="check-item"><input name="herogender" id="herogenderneuter" type="radio" value="neuter" /><label for="herogenderneuter">neuter</label></div>
              <div class="check-item"><input name="herogender" id="herogenderrandom" type="radio" value="" /><label for="herogenderrandom">random</label></div>
            </div>
          </fieldset>

          <fieldset class="field">
            <legend class="block-title">Villain</legend>
            <div class="inline-radios">
              <div class="check-item"><input name="villaingender" id="villaingenderfemale" type="radio" value="female" checked="checked" /><label for="villaingenderfemale">female</label></div>
              <div class="check-item"><input name="villaingender" id="villaingendermale" type="radio" value="male" /><label for="villaingendermale">male</label></div>
              <div class="check-item"><input name="villaingender" id="villaingenderneuter" type="radio" value="neuter" /><label for="villaingenderneuter">neuter</label></div>
              <div class="check-item"><input name="villaingender" id="villaingenderrandom" type="radio" value="" /><label for="villaingenderrandom">random</label></div>
            </div>
          </fieldset>

          <fieldset class="field">
            <legend class="block-title">Others</legend>
            <div class="inline-radios">
              <div class="check-item"><input name="peoplegender" id="peoplegenderfemale" type="radio" value="female" checked="checked" /><label for="peoplegenderfemale">female</label></div>
              <div class="check-item"><input name="peoplegender" id="peoplegendermale" type="radio" value="male" /><label for="peoplegendermale">male</label></div>
              <div class="check-item"><input name="peoplegender" id="peoplegenderneuter" type="radio" value="neuter" /><label for="peoplegenderneuter">neuter</label></div>
              <div class="check-item"><input name="peoplegender" id="peoplegenderrandom" type="radio" value="" /><label for="peoplegenderrandom">random</label></div>
            </div>
          </fieldset>

          <fieldset class="field">
            <legend class="block-title">Verb tense</legend>
            <div class="inline-radios">
              <div class="check-item"><input name="tense" id="tensepast" type="radio" value="past" checked="checked" /><label for="tensepast">past</label></div>
              <div class="check-item"><input name="tense" id="tensepresent" type="radio" value="present" /><label for="tensepresent">present</label></div>
            </div>
          </fieldset>

          <div class="field">
            <label class="block-title">&nbsp;</label>
            <div class="check-item"><input name="bossfight" id="bossfight" type="checkbox" /><label for="bossfight">Boss Fight</label></div>
          </div>
        </div>

        <div class="actions-row">
          <button type="button" id="randomize" class="btn-ghost">Randomize</button>
          <button type="button" id="clear" class="btn-ghost">Clear</button>
          <button type="submit" id="generate" class="btn-generate" onclick="javascript:guiGet();" accesskey="g" title="shift-alt g">Generate</button>
        </div>

      </main>

      <section class="output">
        <h2>Output</h2>
        <label class="visually-hidden" for="output">Generated story text</label>
        <textarea id="output" name="fairytale" cols="35" rows="20"></textarea>
      </section>

    </div>
  </form>


  <!-- TODO: this should be local. ??? it slows down loading.... -->
  <script src="https://unpkg.com/nlp_compromise@4.1.2/builds/nlp_compromise.js"></script>
  <script type="text/javascript" src="lib/tokenizer.web.js"></script>
  <script type="text/javascript" src="lib/cleaner.js"></script>

  <script type="text/javascript" src="lib/default.templates.js"></script>
  <script type="text/javascript" src="lib/templates.js"></script>
  <script type="text/javascript" src="lib/words.js"></script>
  <script type="text/javascript" src="lib/wordbank.test.js"></script>

  <script type="text/javascript" src="lib/templates.business.js"></script>
  <script type="text/javascript" src="lib/business.wordbank.js"></script>

  <script type="text/javascript" src="lib/templates.descriptive.js"></script>

  <script type="text/javascript" src="gui.js"></script>
  <script type="text/javascript" src="lib/propp.js"></script>

  <script type="text/javascript">
    // remove when running in browser
    // one of the npm modules won't work in the browser if it remains
    // TODO: document which one!
    delete (window.module);
  </script>

</body>

</html>
```

- [ ] **Step 3: Serve locally and load in a browser tab**

```bash
cd /Users/michaelpaulukonis/projects/malepropp
python3 -m http.server 8901 >/tmp/malepropp-http.log 2>&1 &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8901/index.html
```

Expected: `200`. Navigate a browser tab to `http://localhost:8901/index.html`.

- [ ] **Step 4: Visual check**

Confirm: no `<table>`/`<center>` artifacts, parchment background renders, four function groups show with heading + top border (no flat color fills), sidebar (Preset/Theme/links) sits in the third column, Hero/Villain/Others/Verb tense/Boss Fight sit in a row below the two function-group columns, Randomize/Clear/Generate buttons sit below that, output box at the bottom. Click a few of the visible checkbox labels (e.g. "villainy", "struggle") and confirm the checkbox toggles — this is the label-association fix, it did not work before this task.

- [ ] **Step 5: Console check**

Using `mcp__claude-in-chrome__read_console_messages` with `onlyErrors: true` on the tab — expect no errors. (The theme-toggle and clear-all-fields behavior aren't wired yet — that's Task 2 — so the toggle button and full-reset behavior are not tested here yet.)

- [ ] **Step 6: Commit**

```bash
git add index.html propp.css
git commit -m "$(cat <<'EOF'
feat: rewrite GUI layout to responsive grid + storybook theme

Replaces the table/center layout (no responsive behavior at all,
min-width:800px hard floor) with semantic HTML (header/main/
fieldset+legend) and CSS Grid, collapsing to one column below
~700px. Reskins to the storybook/parchment theme approved in
docs/superpowers/specs/2026-08-15-gui-visual-redo-design.md.

Also fixes a pre-existing bug: two elements shared
id="donorsequence" (invalid HTML) — func16-19 are now grouped
under "Hero's return" instead, matching Propp's own numbering.
Every function checkbox also gains a real <label for> association
for the first time (previously bare text, unclickable).

Theme toggle and full-reset Clear button are wired in a follow-up
commit.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Wire up the theme toggle and merge Clear behavior in `gui.js`

The `#theme-toggle` button and anti-flash `<head>` script already exist from Task 1 — this task adds the click handler and `localStorage` persistence. It also extends the existing `#clear` button handler (added earlier this session for `malepropp-cpm`) to reset the theme/gender/tense radios and empty the output textarea — folding in what the now-removed native `<input type="reset">` used to do (Task 1 already deleted that input from `index.html`).

**Files:**
- Modify: `gui.js:280-295` (inside the `DOMContentLoaded` handler, `randomize`/`clear` button wiring)

- [ ] **Step 1: Add the theme-toggle wiring**

In `gui.js`, inside the existing `document.addEventListener("DOMContentLoaded", function () { ... })` block, immediately after the `var clearBtn = ...` block (currently ending around line 295, right before `var s = document.getElementById("func8subfunc");`), add:

```javascript
  var THEME_STORAGE_KEY = "malepropp-theme";

  var themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    var updateThemeToggleLabel = function () {
      var isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      themeToggleBtn.textContent = isDark ? "Switch to light" : "Switch to dark";
    };
    updateThemeToggleLabel();

    themeToggleBtn.addEventListener("click", function () {
      var isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? "light" : "dark");
      } catch (e) {}
      updateThemeToggleLabel();
    });
  }
```

- [ ] **Step 2: Extend the `#clear` handler to reset everything**

Replace the existing `clearBtn` block:

```javascript
  var clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      inp.value = "unselected";
      gui.setall(false);
      document.getElementById("func8subfunc").selectedIndex = 0;
    });
  }
```

with:

```javascript
  var clearBtn = document.getElementById("clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      inp.value = "unselected";
      gui.setall(false);
      document.getElementById("func8subfunc").selectedIndex = 0;
      document.getElementById("r1").checked = true;
      document.getElementById("herogenderfemale").checked = true;
      document.getElementById("villaingenderfemale").checked = true;
      document.getElementById("peoplegenderfemale").checked = true;
      document.getElementById("tensepast").checked = true;
      window.document.myform.output.value = "";
    });
  }
```

(`gui.setall(false)` already unchecks every checkbox on the page, including `bossfight` — no separate line needed for it, same as before.)

- [ ] **Step 3: Lint check**

```bash
cd /Users/michaelpaulukonis/projects/malepropp
./node_modules/.bin/biome check gui.js
```

Expected: no new errors introduced (pre-existing `noUnusedVariables` warnings on `story`/`guiGet` are fine, unrelated to this change).

- [ ] **Step 4: Browser verification**

With the local server still running (or restarted per Task 1 Step 3), reload `http://localhost:8901/index.html` and, using `mcp__claude-in-chrome__javascript_tool`, run:

```javascript
pushPreset('cinderella');
document.getElementById('func8subfunc').selectedIndex = 3;
document.getElementById('r2').checked = true; // office theme
document.getElementById('herogendermale').checked = true;
document.getElementById('output').value = "some generated text";
document.getElementById('clear').click();
({
  checked: Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(e => e.name),
  theme: document.querySelector('input[name=theme]:checked').id,
  heroGender: document.querySelector('input[name=herogender]:checked').id,
  subfunc: document.getElementById('func8subfunc').selectedIndex,
  output: document.getElementById('output').value,
});
```

Expected: `checked: []`, `theme: "r1"`, `heroGender: "herogenderfemale"`, `subfunc: 0`, `output: ""`.

- [ ] **Step 5: Theme toggle verification**

```javascript
var btn = document.getElementById('theme-toggle');
var before = document.documentElement.getAttribute('data-theme');
btn.click();
var afterClick = document.documentElement.getAttribute('data-theme');
var stored = localStorage.getItem('malepropp-theme');
({ before, afterClick, stored, label: btn.textContent });
```

Expected: `before: null`, `afterClick: "dark"`, `stored: "dark"`, `label: "Switch to light"`. Reload the page (`mcp__claude-in-chrome__navigate` to the same URL) and confirm `document.documentElement.getAttribute('data-theme')` is still `"dark"` immediately after load (this proves the `<head>` anti-flash script from Task 1 is working) — then click the toggle again and confirm it goes back to `null`/light and `localStorage` updates to `"light"`.

- [ ] **Step 6: Full npm test run**

```bash
cd /Users/michaelpaulukonis/projects/malepropp
npm test
```

Expected: `141 passing` (unchanged — this task doesn't touch `lib/`).

- [ ] **Step 7: Commit**

```bash
git add gui.js
git commit -m "$(cat <<'EOF'
feat: wire up theme toggle and full-reset Clear button

Theme toggle flips a data-theme attribute on <html>, persisted to
localStorage (key: malepropp-theme) and re-applied synchronously
via the anti-flash <head> script added in the previous commit.

Clear now also resets the theme/gender/tense radios to their
documented defaults and empties the output textarea, replacing
the native <input type="reset"> removed from index.html in the
previous commit (which reset the same fields, plus everything the
Clear button already handled: function checkboxes and both
dropdowns).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Final verification pass

Runs the full manual verification checklist from `docs/superpowers/specs/2026-08-15-gui-visual-redo-design.md`'s Testing section end-to-end, since Tasks 1–2 verified their own pieces in isolation but not the whole flow together.

**Files:** none (verification only)

- [ ] **Step 1: Responsive collapse check**

With the browser tab open at `http://localhost:8901/index.html`, use `mcp__claude-in-chrome__resize_window` (or the browser's own responsive tools) to narrow the viewport below 700px width. Confirm: layout collapses to a single column, no horizontal scrollbar appears, no controls overlap.

- [ ] **Step 2: Dark mode readability check**

Toggle dark mode on (via the `#theme-toggle` button). Take a screenshot (`mcp__claude-in-chrome__computer` with `action: "screenshot"`). Visually confirm all text is legible against its background (no dark-text-on-dark-background or light-text-on-light-background regions) in both the parchment/main area and the surface/output-box area.

- [ ] **Step 3: End-to-end generate check, both themes**

In light mode, click a preset from the `#presets` dropdown, then click `#generate`. Confirm the output textarea fills with generated story text (not empty, not literal `<%= %>` tags, no `undefined`/`NaN`). Toggle to dark mode and click `#generate` again. Confirm the same.

- [ ] **Step 4: Console error check**

```javascript
// via mcp__claude-in-chrome__read_console_messages, onlyErrors: true
```

Expected: no errors, across all interactions performed in Steps 1–3.

- [ ] **Step 5: Full test + lint sweep**

```bash
cd /Users/michaelpaulukonis/projects/malepropp
npm test
./node_modules/.bin/biome check gui.js
```

Expected: `141 passing`; no new lint errors.

- [ ] **Step 6: Update the README TODO**

The README already marks `preset randomizer` and `UI should clear checkboxes when preset is selected` as done from earlier this session. Check `README.md`'s TODO list (around line 40-49) for any item this redo also resolves (e.g. general UI modernization) and mark it if present; otherwise no change needed — `malepropp-qh1` ("Modernize GUI visual design") is the bead tracking this work and gets closed via `bd close`, not a README line.

- [ ] **Step 7: Close the beads issue and report status**

```bash
cd /Users/michaelpaulukonis/projects/malepropp
bd close malepropp-qh1 --reason="Implemented per docs/superpowers/specs/2026-08-15-gui-visual-redo-design.md and docs/superpowers/plans/2026-08-15-gui-visual-redo-plan.md — storybook/parchment theme, responsive CSS Grid layout, merged Clear button, manual dark-mode toggle. Verified live in browser (layout collapse, dark-mode contrast, end-to-end generate in both themes). npm test 141 passing, biome clean."
git status
```

Report the final `git status` and stop — per this repo's conservative git profile, do not push without explicit request (the last two commits from Tasks 1–2 are local only at this point unless the user already asked for a push).

- [ ] **Step 8: Kill the local dev server**

```bash
pkill -f "http.server 8901"
```
