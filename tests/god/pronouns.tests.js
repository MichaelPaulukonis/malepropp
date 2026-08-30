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
    // These lock in reduceToGender's passthrough branch (`gndr && gndr.gender
    // ? gndr.gender : gndr`) for falsy inputs. Covered once here rather than
    // on all four functions since reduceToGender is shared identically by
    // possessive/pronounobject/pronoun/reflexivePronoun - one function's
    // coverage is enough to lock in the shared helper's behavior.
    it("returns 'its' for null", function () {
      expect(pronouns.possessive(null)).to.equal("its");
    });
    it("returns 'its' for undefined", function () {
      expect(pronouns.possessive(undefined)).to.equal("its");
    });
    it("returns 'its' for an empty string", function () {
      expect(pronouns.possessive("")).to.equal("its");
    });
    it("returns 'its' for a character object with no .gender", function () {
      expect(pronouns.possessive({})).to.equal("its");
    });
    it("returns 'its' for a character object with .gender: null", function () {
      expect(pronouns.possessive({ gender: null })).to.equal("its");
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
