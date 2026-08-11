var tester = (function () {
  var mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    storygen = require("../lib/propp.js");

  describe("storyGen interpolate", function () {
    it("interpolates a simple property reference", function () {
      var result = storygen().interpolate("Hello <%= name %>!", {
        name: "World",
      });
      expect(result).to.equal("Hello World!");
    });

    it("evaluates a ternary expression", function () {
      var template = '<%= flag ? "yes" : "no" %>';
      expect(storygen().interpolate(template, { flag: true })).to.equal("yes");
      expect(storygen().interpolate(template, { flag: false })).to.equal("no");
    });

    it("evaluates a function-call expression", function () {
      var data = {
        greet: function (name) {
          return "hi " + name;
        },
      };
      var result = storygen().interpolate('<%= greet("Sam") %>', data);
      expect(result).to.equal("hi Sam");
    });

    it("interpolates multiple tags in a single template string", function () {
      var result = storygen().interpolate("<%= a %> and <%= b %>", {
        a: "one",
        b: "two",
      });
      expect(result).to.equal("one and two");
    });

    it("passes a template string through unchanged when it has no tags", function () {
      var result = storygen().interpolate("no tags here", {
        anything: "unused",
      });
      expect(result).to.equal("no tags here");
    });

    it("interpolates nested property access", function () {
      var data = { obj: { nested: { value: "deep" } } };
      var result = storygen().interpolate("<%= obj.nested.value %>", data);
      expect(result).to.equal("deep");
    });
  });
})();
