import chai from "chai";
import createPronounHelpers from "../../lib/god/pronouns.js";

var expect = chai.expect;

var world = {
  gender: {
    female: "female",
    male: "male",
  },
};

describe("createPronounHelpers", function () {
  var pronouns = createPronounHelpers(world);

  describe("possessive", function () {
    it("returns 'his' for male", function () {
      expect(pronouns.possessive("male")).to.equal("his");
    });
    it("returns 'her' for female", function () {
      expect(pronouns.possessive("female")).to.equal("her");
    });
    it("returns 'its' for anything else", function () {
      expect(pronouns.possessive("neuter")).to.equal("its");
    });
    it("reduces a character object to its .gender", function () {
      expect(pronouns.possessive({ gender: "male" })).to.equal("his");
    });
  });

  describe("pronounobject", function () {
    it("returns 'him' for male", function () {
      expect(pronouns.pronounobject("male")).to.equal("him");
    });
    it("returns 'her' for female", function () {
      expect(pronouns.pronounobject("female")).to.equal("her");
    });
    it("returns 'them' for anything else", function () {
      expect(pronouns.pronounobject("neuter")).to.equal("them");
    });
  });

  describe("pronoun", function () {
    it("returns 'he' for male", function () {
      expect(pronouns.pronoun("male")).to.equal("he");
    });
    it("returns 'she' for female", function () {
      expect(pronouns.pronoun("female")).to.equal("she");
    });
    it("returns 'it' for anything else", function () {
      expect(pronouns.pronoun("neuter")).to.equal("it");
    });
  });

  describe("reflexivePronoun", function () {
    it("returns 'himself' for male", function () {
      expect(pronouns.reflexivePronoun("male")).to.equal("himself");
    });
    it("returns 'herself' for female", function () {
      expect(pronouns.reflexivePronoun("female")).to.equal("herself");
    });
    it("returns 'itself' for anything else", function () {
      expect(pronouns.reflexivePronoun("neuter")).to.equal("itself");
    });
  });
});
