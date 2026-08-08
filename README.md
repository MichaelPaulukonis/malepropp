Try it out at http://michaelpaulukonis.github.io/malepropp/

## What is this

A story generator using Vladimir Propp's narrative "functions" (Proppian narratemes) to combinatorially assemble fairy-tale-shaped stories from templates. Runs headless (`node index.js`, "novel builder" — generates until a word-count target, writes to a file) or via the browser GUI at the link above.

See [docs/history-and-references.md](docs/history-and-references.md) for design musings, prior-art surveys, Propp's function/character reference, and external research links.

## Branches

- `master` — engine + GUI source.
- `dev` — active cleanup/development, forked from `master` (not `gh-pages` — see branch analysis below).
- `gh-pages` — the deployed GUI (separate branch, not built from `master`'s root/`docs`). Diverged from `master` mainly by stripping dev-tooling (`package.json`, `tests/`, committed `node_modules`) for a lean static deploy, not by advancing the engine — `master`'s engine files (`propp.js`, `templates.business.js`, `business.wordbank.js`, `gui.js`) are identical or near-identical to `gh-pages`'s.
- `origin/tumblr` — a working Tumblr-posting bot lived here for ~7 years, posting to `fairytalesbot.tumblr.com` via the `tumblrwks` client (see commit `ee87a17 "working tumblr poster"`). Credentials were gitignored and are gone, but the posting code itself is intact. Forked from `gh-pages` (not `master`) partway through `gh-pages`'s history, and never received `gh-pages`'s later engine work (`business.wordbank.js`/`templates.business.js` refinements) — diff before assuming it's a peer of the other branches.

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
 - [ ] preset randomizer
 - [ ] UI should clear checkboxes when preset is selected
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
- [ ] alternate theme available (as of 2014.12 the "business" world no longer works)
- [ ] novel-builder framing device? (Count N visiting a mansion and reading volumes in the library)
- [ ] generate() stores all templates so that we could re-process them, like to switch tense, or something
- [x] web page "publicly" accessible - see http://michaelpaulukonis.github.io/malepropp/
 - [ ] web page has informational links active (and refs previous progenitors)
- [ ] unit tests - not that YOU may care about these, but it sure helps with testing (IN PROGRESS)
