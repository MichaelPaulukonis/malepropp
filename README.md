Try it out at <http://michaelpaulukonis.github.io/malepropp/>

## What is this

A story generator using Vladimir Propp's narrative "functions" (Proppian narratemes) to combinatorially assemble fairy-tale-shaped stories from templates. Runs headless (`node index.js`, "novel builder" — generates until a word-count target, writes to a file) or via the browser GUI at the link above.

See [docs/history-and-references.md](docs/history-and-references.md) for design musings, prior-art surveys, Propp's function/character reference, and external research links.

## Story-within-a-story

Two Propp functions embed a fully separate generated tale inside the outer story (`story.subtale` in `lib/templates.js`) — deep-cloning the narrator/hero/villain/characters into a fresh `storyGen` instance so the embedded tale can't mutate the outer story's state:

- **func2 — Interdiction** (`interdiction` checkbox, "1st sphere"): after the hero meets their advisor and is warned, the magical helper is introduced and tells the hero a tale.
- **func14 — Acquisition** ("receipt of a magical agent" checkbox, hero gains a magical item): the advisor tells the hero a tale.

Both triggers are unconditional — check the corresponding function's checkbox in the GUI (or include it in a headless preset's `functions` list) and the embedded tale generates automatically; there's no separate toggle for the story-within-a-story behavior itself.

## Branches

- `main` — engine + GUI source, the active/default branch (as of 2026-08-19; formerly developed under `dev`, which forked from the old `master` — see branch analysis below). Not built from a `docs/` folder; `gh-pages` is a separate deploy branch, published via `npm run deploy` (see `scripts/build-pages.js`).
- `gh-pages` — the deployed GUI, live at the link above. Rebuilt by `npm run deploy`, which stages `index.html`/`propp.css`/`gui.js`/`lib/*.js` into `dist/` and pushes it via the `gh-pages` npm package (`--nojekyll`). No dev-tooling (`package.json`, `tests/`, `node_modules`) — a lean static deploy, same convention this author uses across other repos.
- `legacy` — a frozen copy of the old `master` branch (pre-2026-08-19), kept for history. Not maintained.
- `origin/tumblr` — a working Tumblr-posting bot lived here for ~7 years, posting to `fairytalesbot.tumblr.com` via the `tumblrwks` client (see commit `ee87a17 "working tumblr poster"`). Credentials were gitignored and are gone, but the posting code itself is intact. Forked from `gh-pages` (not `master`) partway through `gh-pages`'s history, and never received `gh-pages`'s later engine work (`business.wordbank.js`/`templates.business.js` refinements) — diff before assuming it's a peer of the other branches. Kept as-is: candidate for revival as an AWS Lambda app (same pattern as this author's `poeticalbot`/`listbot`), not just dead code.

## Testing

```bash
npm test              # mocha tests/
npm run test_cleaner
npm run test_propp
```

## TODOs

These are NOT in order; but are lightly clustered....

- [x] get node.js headless mode working ("novel builder")
- [x] title-maker templates
  - [x] store list of villains encountered to possibly aid with title
  - [ ] each villain in title has a unique defeat word (instead of one word followed by ```list(villains)```)
- [x] novel-builder loop-through with word-count check
- [x] novel-builder writes to a file
- [x] presets - for embedded tales, headless running, &c; also available in UI
- [x] preset randomizer
- [x] UI should clear checkboxes when preset is selected
- [ ] rules to validate selections based on Propp (or other needs)
- [ ] journeys [partial]
- [ ] battle [partial - more templates added]
- [x] pass in word.js dependency to wordbank.test.js
- [ ] more descriptors for characters - old|young|child, man|woman|person (villains and advisor/helpers can also be "things" like bear, dragon, cloud of flies) [villains as things partially implemented]
- [ ] fix locations - including visited locations
- [ ] villain can be a creature (bear, dragon, whatever, dark cloud, whatever) [partially implemented as description/title. nothing else impacted]
- [ ] family - so hero can be child/sibling, parent, grand-parent, etc.
- [ ] extra possibility: if hero dies, another family-member becomes the hero (prerequisite: family)
- [ ] false hero
- [ ] hero/villain can have aspect changed on startup (eg, good/bad swap)
- [x] move/duplicate? (that is, refactor) punishments to apply as well in victory sequence
- [ ] magicalitem template enhancement (currently static placeholder)
- [ ] conversation enhancements
- [ ] terse mode (simple intro, etc. for embedded tales, or otherwise) [partial implementation for hero intro]
- [ ] theme selector, so that sub-tales can pick a different set of templates and wordbanks (may be possible)
- [x] alternate theme available (business/office theme works as of 2026-08-24 - no functional issues found, only stylistic ones common to templates in general)
- [ ] novel-builder framing device? (Count N visiting a mansion and reading volumes in the library)
- [ ] generate() stores all templates so that we could re-process them, like to switch tense, or something
- [x] web page "publicly" accessible - see <http://michaelpaulukonis.github.io/malepropp/>
  - [x] web page has informational links active (and refs previous progenitors)
- [x] unit tests - not that YOU may care about these, but it sure helps with testing (IN PROGRESS)
