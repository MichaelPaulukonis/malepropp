// scripts/capture-god-decomposition-golden.js
//
// Golden-master capture for the god() decomposition (malepropp-x82).
// Run this ONCE, before any decomposition change, and commit the fixture
// it produces. Every later slice's regression task re-generates with the
// same seed and diffs against this frozen file - any output drift means
// the refactor changed observable behavior, not just internal structure.
//
// Re-run and re-commit ONLY if a change is intentionally altering story
// output (e.g. a real content/template change, not a pure refactor).

import fs from "node:fs";
import storygen from "../lib/propp.js";
import templates from "../lib/templates.js";
import wordbankFactory from "../lib/wordbank.test.js";
import words from "../lib/words.js";

var wordbank = wordbankFactory(words);
var preset = storygen.presets.barebones;

var settings = {
  herogender: "female",
  villaingender: "male",
  peoplegender: "female",
  functions: storygen.resetProppFunctions(),
  funcs: preset.functions,
  bossfight: preset.bossfight,
  verbtense: "past",
  conclusion: true,
  seed: 20260830,
};

var theme = {
  bank: wordbank,
  templates: templates,
};

var sg = new storygen(settings);
var tale = sg.generate(settings, theme);

var fixture = {
  seed: settings.seed,
  preset: "barebones",
  title: tale.title,
  tale: tale.tale,
};

fs.writeFileSync(
  "tests/fixtures/god-decomposition-golden.json",
  JSON.stringify(fixture, null, 2) + "\n",
);

console.log("Wrote tests/fixtures/god-decomposition-golden.json");
