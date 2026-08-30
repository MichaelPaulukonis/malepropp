import fs from "node:fs";
import chai from "chai";
import storygen from "../lib/propp.js";
import templates from "../lib/templates.js";
import wordbankFactory from "../lib/wordbank.test.js";
import words from "../lib/words.js";

var expect = chai.expect;
var wordbank = wordbankFactory(words);

describe("god()/generate() decomposition golden master (malepropp-x82)", function () {
  afterEach(function () {
    storygen.unseed();
  });

  it("produces byte-identical output to the frozen fixture", function () {
    var fixture = JSON.parse(
      fs.readFileSync("tests/fixtures/god-decomposition-golden.json", "utf8"),
    );
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
      seed: fixture.seed,
    };

    var theme = {
      bank: wordbank,
      templates: templates,
    };

    var sg = new storygen(settings);
    var tale = sg.generate(settings, theme);

    expect(tale.title).to.equal(fixture.title);
    expect(tale.tale).to.equal(fixture.tale);
  });
});
