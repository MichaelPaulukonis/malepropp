// lib/god/characters.js
//
// Character-creation cluster, extracted from propp.js's god() closure
// (malepropp-x82, slice 2). Real dependency-injection design, not a drop-in
// move - takes one options object (per final review of slice 1) rather than
// a long positional-argument list, since it needs bank/cache/settings/world
// plus half a dozen rng/string helpers and the pronoun helpers.
//
// `place` is injected rather than owned here: createHero/createVillain/
// createHome call it, but place()/getPlace() belong to the place cluster
// (malepropp-x82.2, not yet extracted) and still live in propp.js's god().

var createCharacterHelpers = function (deps) {
  var world = deps.world;
  var bank = deps.bank;
  var cache = deps.cache;
  var settings = deps.settings;
  var pick = deps.pick;
  var pickRemove = deps.pickRemove;
  var coinflip = deps.coinflip;
  var capitalize = deps.capitalize;
  var random = deps.random;
  var uid = deps.uid;
  var place = deps.place;
  var possessive = deps.pronounHelpers.possessive;
  var pronounobject = deps.pronounHelpers.pronounobject;
  var pronoun = deps.pronounHelpers.pronoun;
  var reflexivePronoun = deps.pronounHelpers.reflexivePronoun;

  // see also https://github.com/dariusk/corpora/blob/master/data/archetypes/character.json
  var createCharacter = function (gndr, aspct) {
    // TODO: what happens when we've used up everything in the bank?
    // SOLUTION: don't worry about it: make the bank bigger than any of our templates
    // for now...
    gndr = gndr || world.util.randomProperty(world.gender);
    aspct = aspct || world.util.randomProperty(world.aspect);
    var adjs =
      aspct === world.aspect.good
        ? bank.adjectives.personal
        : bank.adjectives.negative;
    var descr = [pick(adjs), pick(adjs)];
    var name = pickRemove(bank.names[gndr].concat(bank.names.neuter));

    // alt: two adjs in front, two-ads in back: "Big Bad Joan" or "Joan the Big and Bad"
    // WAY ALT: His Serene Highness Prince Robert Michael Nicolaus Georg Bassaraba von Brancovan von Badische, Marquis of Hermosilla, Count of Cabo St. Eugenio, Seventy-fourth Grand Master of the Knights of Malta,
    // another model is "Brienne of Tarth" - have some sort of origin location
    // we would NOT do this for "family", however.... so, some flag to pass in. :::sigh:::
    var nick = coinflip()
      ? name + " the " + capitalize(pick(descr))
      : capitalize(pick(descr)) + " " + name;

    return {
      name: name,
      nickname: nick,
      alignment: aspct,
      gender: gndr,
      possessions: [],
      health: world.healthLevel.alive,
      description: descr,
      knows: [], // people known to character (identifier, not object-reference, so we don't get all circular)
      id: uid.toString(),
      getCharacter: getCharacter,
      object: pronounobject(gndr),
      pronoun: pronoun(gndr),
      reflexivePronoun: reflexivePronoun(gndr),
      possessive: possessive(gndr),
    };
  };

  var createCharacters = function (gndr, aspct, count) {
    var members = count || random(12) + 1;
    var acqs = [];
    for (var i = 0; i < members; i++) {
      var g =
        !gndr || gndr === "random"
          ? world.util.randomProperty(world.gender)
          : gndr;
      aspct = aspct || world.util.randomProperty(world.aspect);
      acqs.push(createCharacter(g, aspct));
    }
    return acqs;
  };

  // they are not characters at this point.
  var createFamily = function (gndr) {
    // mother, father, siblings
    // wife/husband, children

    var family = {
      mother: null,
      father: null,
      wife: null,
      husband: null,
      children: null,
      siblings: null,
    };

    // small percentage of the time lives alone. waaaah!
    if (coinflip(0.1)) {
      // lives alone!
    } else {
      // TODO: siblings
      var maxSibs = coinflip(0.3) ? 12 : 3;
      var sibCount = random(maxSibs);
      var boys = [];
      var girls = [];
      for (var i = 0; i < sibCount; i++) {
        if (coinflip()) {
          boys.push(pick(bank.names["male"]));
        } else {
          girls.push(pick(bank.names["female"]));
        }
      }
      if (coinflip()) {
        // mother, father, siblings
        family.father = pick(bank.names["male"]);
        family.mother = pick(bank.names["female"]);
        family.siblings = { brothers: boys, sisters: girls };
      } else {
        // spouse, siblings
        // GONNA BE TRADITIONAL HERE, SO FAR
        if (gndr === world.gender.male) {
          family.wife = pick(bank.names.female);
        } else {
          family.husband = pick(bank.names.male);
        }
        family.children = { boys: boys, girls: girls };
      }
    }

    return family;
  };

  var getCharacter = function (uid) {
    if (typeof uid === "object") {
      return uid;
    }
    var c;
    if (cache.characters[uid]) {
      c = cache.characters[uid];
    }
    return c;
  };

  // hero or villain
  var createHero = function (gndr, aspct, item) {
    // oooooh, we just want to ADD properties to the character
    // so we d on't repeat the name, gender, posessions, etc....
    var c = createCharacter(gndr, aspct);
    var family = createCharacters(settings.peoplegender, aspct);
    var acquaintances = createCharacters(settings.peoplegender, aspct);
    c.family = [];
    c.acquaintances = [];
    c.knows = [];

    for (var i = 0; i < family.length; i++) {
      c.family.push(family[i].id);
      c.knows.push(family[i].id);
      cache.characters[family[i].id] = family[i];
    }

    // TODO: NOT THERE YET
    // do a full-on createCharacter for each
    // so that they are in the character bank
    // and STILL have a simple family: []
    // that can be used for reference
    // except... how to pull from family array to relationship ?!?!!????
    // UGH UGH UGH UGH UGH
    //
    // I just want to be able to say "lived alone" or "lived with mother, father and 7 brothers" or something
    // and, of cours,e be able to make use of those people....
    //
    // c.family = createFamily(gndr);

    for (i = 0; i < acquaintances.length; i++) {
      c.acquaintances.push(acquaintances[i].id);
      c.knows.push(acquaintances[i].id);
      cache.characters[acquaintances[i].id] = acquaintances[i];
    }

    c.home = place();
    c.location = c.home.residence;
    c.introduced = false;
    if (item) {
      c.possessions.push(item);
    }

    return c;
  };

  var createMagicalHelper = function (g, aspct) {
    var person = createCharacter(g, aspct);
    person.name =
      capitalize(pick(bank.itembank.adjectives)) + " " + person.name;
    return person;
  };

  // differs from here in that there are no acquaintances
  // and only creates minions if a number is passed in
  // and there is a fantastic form
  var createVillain = function (g, aspct, item, minionCount) {
    if (!minionCount) minionCount = 1;
    var c = createCharacter(g, aspct);
    c.family = [];
    c.acquaintances = []; // leave blank
    if (minionCount) {
      c.family = createCharacters(settings.peoplegender, aspct, minionCount);
      // TODO not in the character cache?
    }
    c.home = place();
    c.location = c.home.residence;
    c.introduced = false; // introduced in story
    if (item) {
      c.possessions.push(item);
    }

    c.form = coinflip() ? "human" : pick(bank.fantasticForm);

    return c;
  };

  var createHome = function () {
    return place();
  };

  var createFalsehero = function () {
    var g = world.util.randomProperty(world.gender);
    var c = createCharacter(g, world.aspect.bad);
    return c;
  };

  var createMagicalitem = function () {
    // pick REMOVE
    // which means we run of of the durned things.
    // why not just create them here AS NEEDED
    var item =
      bank.magicalitem && bank.magicalitem.length > 0
        ? pickRemove(bank.magicalitem)
        : bank.itemGenerator();
    return item;
  };

  var createPunished = function () {
    return pick(bank.punish);
  };

  return {
    createCharacter: createCharacter,
    createCharacters: createCharacters,
    createFamily: createFamily,
    createHero: createHero,
    createVillain: createVillain,
    createMagicalHelper: createMagicalHelper,
    createHome: createHome,
    createFalsehero: createFalsehero,
    createMagicalitem: createMagicalitem,
    createPunished: createPunished,
    getCharacter: getCharacter,
  };
};

export default createCharacterHelpers;
