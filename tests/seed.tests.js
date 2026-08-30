import chai from "chai";
import storygen from "../lib/propp.js";
import slavicTemplates from "../lib/templates.js";
import wordbankFactory from "../lib/wordbank.test.js";
import words from "../lib/words.js";

var expect = chai.expect;
var wordbank = wordbankFactory(words);

var commonSettings = function () {
  var setts = {
    herogender: "female",
    villaingender: "female",
    peoplegender: "female",
    functions: storygen.resetProppFunctions(),
    funcs: ["func0", "func2", "func3", "func8", "func30", "func31"],
    bossmode: false,
    verbtense: "past",
    conclusion: false,
  };

  var theme = {
    bank: wordbank,
    templates: slavicTemplates,
  };

  return { settings: setts, theme: theme };
};

describe("storyGen.seed", function () {
  afterEach(function () {
    storygen.unseed();
  });

  it("produces byte-identical tale text across two generate() calls with the same seed", function () {
    var cs1 = commonSettings();
    storygen.seed(12345);
    var sg1 = new storygen(cs1.settings);
    var story1 = sg1.generate(cs1.settings, cs1.theme);

    var cs2 = commonSettings();
    storygen.seed(12345);
    var sg2 = new storygen(cs2.settings);
    var story2 = sg2.generate(cs2.settings, cs2.theme);

    expect(story2.tale).to.equal(story1.tale);
    expect(story2.title).to.equal(story1.title);
  });

  it("produces different tale text for two different seeds", function () {
    var cs1 = commonSettings();
    storygen.seed(1);
    var sg1 = new storygen(cs1.settings);
    var story1 = sg1.generate(cs1.settings, cs1.theme);

    var cs2 = commonSettings();
    storygen.seed(2);
    var sg2 = new storygen(cs2.settings);
    var story2 = sg2.generate(cs2.settings, cs2.theme);

    expect(story2.tale).to.not.equal(story1.tale);
  });

  it("settings.seed on construction is equivalent to calling storyGen.seed() first", function () {
    var cs1 = commonSettings();
    cs1.settings.seed = 999;
    var sg1 = new storygen(cs1.settings);
    var story1 = sg1.generate(cs1.settings, cs1.theme);

    var cs2 = commonSettings();
    storygen.seed(999);
    var sg2 = new storygen(cs2.settings);
    var story2 = sg2.generate(cs2.settings, cs2.theme);

    expect(story2.tale).to.equal(story1.tale);
  });

  it("storyGen.unseed() reverts to real Math.random and still generates a valid story", function () {
    storygen.seed(42);
    storygen.unseed();
    var cs = commonSettings();
    var sg = new storygen(cs.settings);
    var story = sg.generate(cs.settings, cs.theme);
    expect(story.tale).to.have.length.above(10);
  });
});
