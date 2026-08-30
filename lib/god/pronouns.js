// lib/god/pronouns.js
//
// Pure gender-lexicon helpers, extracted from propp.js's god() closure
// (malepropp-x82, slice 1). No dependency on bank/cache/settings - only
// needs world.gender, passed in explicitly so this is independently
// testable and has no import cycle back into propp.js.

var createPronounHelpers = function (world) {
  var reduceToGender = function (gndr) {
    // if a character object is passed in, reduce it to its .gender
    return gndr && gndr.gender ? gndr.gender : gndr;
  };

  var possessive = function (gndr) {
    gndr = reduceToGender(gndr);
    return gndr === world.gender.male
      ? "his"
      : gndr === world.gender.female
        ? "her"
        : "its";
  };

  // third-person
  var pronounobject = function (gndr) {
    gndr = reduceToGender(gndr);
    return gndr === world.gender.male
      ? "him"
      : gndr === world.gender.female
        ? "her"
        : "them";
  };

  var pronoun = function (gndr) {
    gndr = reduceToGender(gndr);
    return gndr === world.gender.male
      ? "he"
      : gndr === world.gender.female
        ? "she"
        : "it";
  };

  // none of these deal with plurals
  var reflexivePronoun = function (gndr) {
    gndr = reduceToGender(gndr);
    return gndr === world.gender.male
      ? "himself"
      : gndr === world.gender.female
        ? "herself"
        : "itself";
  };

  return {
    possessive: possessive,
    pronounobject: pronounobject,
    pronoun: pronoun,
    reflexivePronoun: reflexivePronoun,
  };
};

export default createPronounHelpers;
