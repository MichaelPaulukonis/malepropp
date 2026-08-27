import chai from "chai";
import brownTemplates from "../lib/default.templates.js";
import storygen from "../lib/propp.js";
import businessTemplates from "../lib/templates.business.js";
import descriptiveTemplates from "../lib/templates.descriptive.js";
// TODO: okay, make it an object or array
import slavicTemplates from "../lib/templates.js";
import wordbankFactory from "../lib/wordbank.test.js";
import words from "../lib/words.js";

var expect = chai.expect;
var wordbank = wordbankFactory(words);
var world = storygen().world; // hey, we're assuming this works w/o testing!

// TODO: this relies on storygen.resetProppFunction
// WHICH IS NOT TESTED PRIOR TO THIS FUNCTION OUCH
var commonSettings = function (templates) {
  templates = templates || slavicTemplates;

  var setts = {
    herogender: "female",
    villaingender: "female",
    peoplegender: "female",
    functions: storygen.resetProppFunctions(),
    bossmode: false,
    verbtense: "past",
    conclusion: false,
  };

  var theme = {
    bank: wordbank,
    templates: templates,
  };

  return { settings: setts, theme: theme };
};

var funcList = [
  "func0",
  "func1",
  "func2",
  "func3",
  "func4",
  "func5",
  "func6",
  "func7",
  "func8",
  "func8a",
  "func9",
  "func10",
  "func11",
  "func12",
  "func13",
  "func14",
  "func15",
  "func16",
  "func17",
  "func18",
  "func19",
  "func20",
  "func21",
  "func22",
  "func23",
  "func24",
  "func25",
  "func26",
  "func27",
  "func28",
  "func29",
  "func30",
  "func31",
];

describe("presets tests", function () {
  it("should provide non-null presets object", function () {
    expect(storygen.presets).to.not.be.null;
  });
});

describe("different templates function standalone", function () {
  var templates = {
    slavic: slavicTemplates,
    business: businessTemplates,
    brown: brownTemplates,
    descriptive: descriptiveTemplates,
  };

  // brown and descriptive have no story.title generator at all (title always
  // renders as ""), unlike slavic/business - matches gui.js's shoveToGui()
  // defensive fallback for themes without a title. Only assert title shape
  // when the theme actually produced one.
  var expectTitle = function (title) {
    if (title) {
      expect(title).to.have.length.above(5); // some have come in at 10. Maybe less is possible.
    }
  };

  var testTemplate = function (name, template) {
    describe(name + " storyGen functions standalone", function () {
      var cs = commonSettings(template);
      cs.settings.funcs = [];

      funcList.forEach(function (func) {
        it("correctly generates text for " + func, function () {
          cs.settings.funcs = [func];
          var sg = new storygen(cs.settings);
          var story = sg.generate(cs.settings, cs.theme);
          expect(story.tale).to.not.be.null;
          expectTitle(story.title);
          // brownTemplates' func0 is a deliberate blank placeholder
          // (templates.push("")) unlike every other func/theme - skip the
          // non-empty check for that one known case.
          if (!(name === "brown" && func === "func0")) {
            expect(story.tale).to.have.length.above(10);
          }
          expect(story.tale.indexOf("undefined")).to.equal(-1);
          // console.log(func, ': ', story.tale);
        });
      });

      describe(name + " func8 subfuntions", function () {
        it("exposes the subfunctions of func8", function () {
          expect(world.func8subfuncs).to.not.be.null;
          expect(typeof world.func8subfuncs).to.equal("object");
        });

        var subs = world.func8subfuncs;
        for (var subfunc in subs) {
          it(
            "generates text for func8, subfunc: " + subs[subfunc],
            function () {
              cs.settings.funcs = ["func8", subs[subfunc]];
              var sg = new storygen(cs.settings);
              var story = sg.generate(cs.settings, cs.theme);
              expect(story.tale).to.not.be.null;
              expect(story.tale).to.have.length.above(10);
              expectTitle(story.title);
              // console.log(subfunc, ': ', story.tale);
            },
          );
        }
      });
    });
  };

  for (var name in templates) {
    testTemplate(name, templates[name]);
  }
});

describe("storygen exposes villainy types", function () {
  it("should have a list of villainy types", function () {
    expect(storygen.villainyTypes).to.not.be.undefined;
    expect(storygen.villainyTypes).to.be.an("object");
    expect(Object.keys(storygen.villainyTypes)).to.have.length.above(0);
  });

  it('each type of villainy should "work"', function () {
    var cs = commonSettings();
    cs.settings.funcs = [["func8"]]; // BLANK (? blank, what?)

    for (var f in storygen.villainyTypes) {
      var subFunc = storygen.villainyTypes[f];
      var skipIntros = true;
      cs.settings.funcs[0].push(subFunc, skipIntros);
      var sg = new storygen(cs.settings);
      var story = sg.generate(cs.settings, cs.theme);
      expect(story.tale).to.not.be.null;
      expect(story.tale).to.have.length.above(10);
      expect(story.title).to.have.length.above(5);
    }
  });
});

describe("storygen utlities", function () {
  var utils = storygen.world.util;

  describe("capitalize", function () {
    it("should capitalize the first letter in a single word", function () {
      expect(utils.capitalize("word")).to.equal("Word");
    });

    it("should capitalize the first word in a sentence", function () {
      expect(utils.capitalize("this is a sentence.")).to.equal(
        "This is a sentence.",
      );
    });

    it("should capitalize the first word in each sentence of multiple sentences.", function () {
      expect(utils.capitalize("this is a sentence. so is this.")).to.equal(
        "This is a sentence. So is this.",
      );
    });

    it("should leave line-breaks (paragraphs) intact", function () {
      var sentIn = "this is.\n\ntwo paragraphs.";
      var sentOut = "This is.\n\nTwo paragraphs.";
      expect(utils.capitalize(sentIn)).to.equal(sentOut);
    });
  });
});

describe("storyGen this-binding independence", function () {
  it("sentence() works when detached from the storyGen instance (no `this` binding)", function () {
    var sg = new storygen({ verbtense: "past" });
    var detachedSentence = sg.sentence; // destructure - loses `this`

    expect(function () {
      detachedSentence(
        { active: true, templates: ["{{ran}}"] },
        {},
        null,
        "past",
      );
    }).to.not.throw();
  });

  it("generate() works when detached from the storyGen instance (no `this` binding)", function () {
    var cs = commonSettings();
    cs.settings.funcs = ["func8"];
    var sg = new storygen(cs.settings);
    var detachedGenerate = sg.generate; // destructure - loses `this`

    var story;
    expect(function () {
      story = detachedGenerate(cs.settings, cs.theme);
    }).to.not.throw();
    expect(story.tale).to.not.be.null;
  });
});

describe("findVillainy()", function () {
  it("uses its storyFuncs argument, not the closure's settings.funcs", function () {
    var cs = commonSettings();
    cs.settings.funcs = ["func1", "func2"]; // no func8 in the closure's settings
    var sg = new storygen(cs.settings);

    var otherFuncs = ["func0", "func8", "func30"];
    expect(sg.findVillainy(otherFuncs)).to.equal(1);
  });
});

describe("generate() error handling", function () {
  it("throws instead of returning the error message as a fake tale", function () {
    var cs = commonSettings();
    // theme.templates throwing simulates any failure inside generate()'s body
    cs.theme.templates = function () {
      throw new Error("boom");
    };
    var sg = new storygen(cs.settings);

    expect(function () {
      sg.generate(cs.settings, cs.theme);
    }).to.throw("boom");
  });
});

describe("sentence()", function () {
  it("returns an empty string for an inactive func", function () {
    var sg = new storygen({ verbtense: "past" });
    var result = sg.sentence(
      { active: false, templates: ["never shown"] },
      {},
      null,
      "past",
    );
    expect(result).to.equal("");
  });

  it("returns an empty string for an active func with no templates/exec", function () {
    var sg = new storygen({ verbtense: "past" });
    var result = sg.sentence({ active: true, templates: [] }, {}, null, "past");
    expect(result).to.equal("");
  });

  it("calls func.exec with helper and params when present", function () {
    var sg = new storygen({ verbtense: "past" });
    var received;
    var func = {
      active: true,
      exec: function () {
        received = Array.prototype.slice.call(arguments);
        return "exec result";
      },
    };
    var helper = { some: "helper" };
    var result = sg.sentence(func, helper, ["p1", "p2"], "past");

    expect(result).to.equal("Exec result"); // capitalize() runs on the output
    expect(received[0]).to.equal(helper);
    expect(received.slice(1)).to.deep.equal(["p1", "p2"]);
  });

  it("converts a {{verb}} tag to past tense when verbtense is past", function () {
    var sg = new storygen({ verbtense: "past" });
    var result = sg.sentence(
      { active: true, templates: ["The fox {{run}} away."] },
      {},
      null,
      "past",
    );
    expect(result).to.equal("The fox ran away.");
  });

  it("converts a {{verb}} tag to present tense otherwise", function () {
    var sg = new storygen({ verbtense: "present" });
    var result = sg.sentence(
      { active: true, templates: ["The fox {{run}} away."] },
      {},
      null,
      "present",
    );
    expect(result).to.equal("The fox runs away.");
  });
});

describe("storyGen RNG primitives", function () {
  it("random(limit) returns an integer in [0, limit)", function () {
    var sg = new storygen({});
    for (var i = 0; i < 50; i++) {
      var n = sg.random(5);
      expect(n).to.be.at.least(0);
      expect(n).to.be.below(5);
      expect(Number.isInteger(n)).to.equal(true);
    }
  });

  it("random(1) always returns 0", function () {
    var sg = new storygen({});
    expect(sg.random(1)).to.equal(0);
  });

  it("coinflip() returns a boolean", function () {
    var sg = new storygen({});
    expect(sg.coinflip()).to.be.a("boolean");
  });

  it("coinflip(1) is always true", function () {
    var sg = new storygen({});
    for (var i = 0; i < 20; i++) {
      expect(sg.coinflip(1)).to.equal(true);
    }
  });

  it("coinflip(0) does NOT mean never - `if (!chance)` treats 0 as unset and falls back to 0.5 (pre-existing quirk, not exercised anywhere in lib/ today)", function () {
    var sg = new storygen({});
    var results = [];
    for (var i = 0; i < 200; i++) {
      results.push(sg.coinflip(0));
    }
    expect(results).to.include(true); // would fail if coinflip(0) meant "never"
  });

  it("pick(arr) returns an element that is a member of the array", function () {
    var sg = new storygen({});
    var arr = ["a", "b", "c"];
    for (var i = 0; i < 20; i++) {
      expect(arr).to.include(sg.pick(arr));
    }
  });

  it("pickRemove(arr) removes and returns one element, shrinking the array", function () {
    var sg = new storygen({});
    var arr = ["a", "b", "c"];
    var picked = sg.pickRemove(arr);
    expect(["a", "b", "c"]).to.include(picked);
    expect(arr).to.have.length(2);
    expect(arr).to.not.include(picked);
  });

  it("randomProperty(obj) returns one of the object's own values", function () {
    var obj = { x: 1, y: 2, z: 3 };
    for (var i = 0; i < 20; i++) {
      expect(Object.values(obj)).to.include(
        storygen.world.util.randomProperty(obj),
      );
    }
  });
});

describe("storyGen.resetProppFunctions()", function () {
  it("defaults to active: true when called with no argument", function () {
    var propp = storygen.resetProppFunctions();
    expect(propp.func0.active).to.equal(true);
    expect(propp.func8.active).to.equal(true);
  });

  it("respects an explicit onoff argument", function () {
    var propp = storygen.resetProppFunctions(false);
    expect(propp.func0.active).to.equal(false);
    expect(propp.func31.active).to.equal(false);
  });

  it("includes every func in funcList", function () {
    var propp = storygen.resetProppFunctions();
    funcList.forEach(function (key) {
      expect(propp).to.have.property(key);
      expect(propp[key]).to.have.property("active");
      expect(propp[key]).to.have.property("templates").that.deep.equals([]);
    });
  });
});

describe("storyGen.presets", function () {
  var validFuncs = Object.keys(storygen.resetProppFunctions());

  Object.keys(storygen.presets).forEach(function (name) {
    it(name + " only references real func names and is non-empty", function () {
      var preset = storygen.presets[name];
      expect(preset.functions).to.have.length.above(0);
      preset.functions.forEach(function (f) {
        // shortWaterStory nests a [funcName, subFunc, skipIntro] array
        var funcName = Array.isArray(f) ? f[0] : f;
        expect(validFuncs).to.include(funcName);
      });
    });
  });
});
