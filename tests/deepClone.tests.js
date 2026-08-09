var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    storygen = require("../lib/propp.js");

  describe("storyGen deepClone", function () {
    it("clones a nested plain object without returning the same reference", function () {
      var original = { a: 1, b: { c: 2, d: [3, 4] } };
      var clone = storygen().deepClone(original);

      expect(clone).to.deep.equal(original);
      expect(clone).to.not.equal(original);
      expect(clone.b).to.not.equal(original.b);
    });

    it("does not let mutating the clone affect the original, or vice versa", function () {
      var original = { a: 1, nested: { value: "start" } };
      var clone = storygen().deepClone(original);

      clone.nested.value = "changed";
      expect(original.nested.value).to.equal("start");

      original.a = 999;
      expect(clone.a).to.equal(1);
    });

    it("clones arrays, including arrays of objects", function () {
      var original = [{ name: "hero" }, { name: "villain" }];
      var clone = storygen().deepClone(original);

      expect(clone).to.deep.equal(original);
      expect(clone).to.not.equal(original);
      expect(clone[0]).to.not.equal(original[0]);
    });

    it("drops function-valued properties (JSON round-trip semantics)", function () {
      var original = {
        name: "hero",
        greet: function () {
          return "hi";
        },
      };
      var clone = storygen().deepClone(original);

      expect(clone.name).to.equal("hero");
      expect(clone.greet).to.equal(undefined);
    });

    it("returns undefined for a circular reference instead of throwing", function () {
      var original = { name: "hero" };
      original.self = original;

      expect(function () {
        var result = storygen().deepClone(original);
        expect(result).to.equal(undefined);
      }).to.not.throw();
    });
  });
})();
