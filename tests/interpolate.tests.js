import chai from "chai";
import storygen from "../lib/propp.js";

var expect = chai.expect;

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

  it("interpolates a tag whose expression spans a newline", function () {
    var result = storygen().interpolate("<%= a +\n b %>", {
      a: "one",
      b: "two",
    });
    expect(result).to.equal("onetwo");
  });

  it("renders null and undefined as an empty string, matching _.template", function () {
    var data = { missing: undefined, empty: null };
    expect(storygen().interpolate("<%= missing %>", data)).to.equal("");
    expect(storygen().interpolate("<%= empty %>", data)).to.equal("");
  });

  it("evaluates a tag's expression exactly once", function () {
    var calls = 0;
    var data = {
      pick: function () {
        calls += 1;
        return "picked";
      },
    };
    var result = storygen().interpolate("<%= pick() %>", data);
    expect(result).to.equal("picked");
    expect(calls).to.equal(1);
  });
});
