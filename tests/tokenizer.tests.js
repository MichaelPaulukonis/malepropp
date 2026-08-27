import chai from "chai";
import Tokenizer from "../lib/tokenizer.web.js";

var expect = chai.expect;

describe("Tokenizer", function () {
  describe("setEntry", function () {
    it("collapses runs of whitespace and trims", function () {
      var t = new Tokenizer();
      t.setEntry("  hello    world  ");
      expect(t.entry).to.equal("hello world");
    });

    it("returns `this` for chaining", function () {
      var t = new Tokenizer();
      expect(t.setEntry("hello")).to.equal(t);
    });
  });

  describe("getSentences", function () {
    it("returns a single sentence unchanged when there is only one", function () {
      var t = new Tokenizer();
      t.setEntry("This is a sentence.");
      expect(t.getSentences()).to.deep.equal(["This is a sentence."]);
    });

    it("splits on sentence-ending punctuation", function () {
      var t = new Tokenizer();
      t.setEntry("This is one. This is two.");
      expect(t.getSentences()).to.deep.equal(["This is one.", "This is two."]);
    });

    it("treats text with no terminal punctuation as one sentence", function () {
      var t = new Tokenizer();
      t.setEntry("No terminal punctuation here");
      expect(t.getSentences()).to.deep.equal(["No terminal punctuation here"]);
    });

    it("collapses internal whitespace within each split sentence", function () {
      var t = new Tokenizer();
      t.setEntry("Hello!  Multiple   spaces.  Here.");
      expect(t.getSentences()).to.deep.equal([
        "Hello!",
        "Multiple spaces.",
        "Here.",
      ]);
    });
  });

  describe("getTokens", function () {
    it("defaults to the first sentence when no index is given", function () {
      var t = new Tokenizer();
      t.setEntry("This is one. This is two.");
      t.getSentences();
      expect(t.getTokens()).to.deep.equal(["This", "is", "one."]);
    });

    it("returns the words of the sentence at the given index", function () {
      var t = new Tokenizer();
      t.setEntry("This is one. This is two.");
      t.getSentences();
      expect(t.getTokens(1)).to.deep.equal(["This", "is", "two."]);
    });
  });
});
