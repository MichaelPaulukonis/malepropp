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

  // fnq.4: generate() is the engine's settings-in/tale-out boundary, so it
  // must always revert rngState to real Math.random() when it's done - even
  // if the caller seeded manually and forgot to call unseed(). Otherwise a
  // warm process (e.g. a reused Lambda container) leaks deterministic output
  // into every later unseeded caller.
  it("a forgotten seed() does not leak deterministic output to the next unseeded caller", function () {
    var runForgottenSeedThenUnseededGenerate = function () {
      var cs1 = commonSettings();
      storygen.seed(777);
      var sg1 = new storygen(cs1.settings);
      sg1.generate(cs1.settings, cs1.theme); // caller forgets storygen.unseed()

      var cs2 = commonSettings();
      var sg2 = new storygen(cs2.settings); // never seeded
      return sg2.generate(cs2.settings, cs2.theme);
    };

    var resultA = runForgottenSeedThenUnseededGenerate();
    var resultB = runForgottenSeedThenUnseededGenerate();

    // Pre-fix: both runs reseed to 777 identically, so the "forgotten"
    // rngState left behind by sg1 is the same each time, and sg2 silently
    // continues that same deterministic stream - resultA and resultB would
    // be byte-identical. Post-fix, sg2 draws from real Math.random(), so the
    // two runs diverge.
    expect(resultA.tale).to.not.equal(resultB.tale);
  });
});
