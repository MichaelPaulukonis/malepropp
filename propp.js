// based on code found @ https://web.archive.org/web/20061112014356/http://www.brown.edu/Courses/FR0133/Fairytale_Generator/gen.html
//
//  PROPPIAN FAIRY TALE GENERATOR v1.0
//
//  Generator script: Nicole Wee
//  Fairy tale content: Laura Tan & Celeste Lim
//  Authored: April, 2001 for
//            FR133: Fairy Tales and Culture
//            Prof. Lewis Seifert
//            Brown University
//
//  for more information contact: fgen@brown.edu
//  https://web.archive.org/web/20061112014356/http://www.brown.edu/Courses/FR0133/Fairytale_Generator
//

"use strict";

var global;

var _ = _ || require('underscore');
var nlp = nlp || require('nlp_compromise');
var Tokenizer = Tokenizer || require('sentence-tokenizer');

// http://blog.elliotjameschong.com/2012/10/10/underscore-js-deepclone-and-deepextend-mix-ins/
// in case it is not clear, deepClone clones everything that can JSON-ified
// that means properties NOT FUNCTIONS
_.mixin({ deepClone: function (o) {
    try {
        return JSON.parse(JSON.stringify(o));
    } catch (ex) {
        console.log(ex.message);
        console.log(o);
    }
}});

var world = {};

// "enum", with numbers for comparison?
world.sizes = {
    'miniscule': 0,
    'tiny': 1,
    'small': 2,
    'medium-sized': 3,
    'large': 4,
    'enormous': 5
};

// in a description, 'medium' would be skipped
// eg, 'male child' (or boy), 'young man', 'man', 'middle-aged man', 'old man', 'ancient man'
world.ages = {
    'child': 0,
    'young' : 1,
    'medium': 2,
    'middle-aged': 3,
    'old': 4,
    'ancient': 5
};


world.aspect = {
    good: 'good',
    bad: 'bad'
};

world.gender = {
    female: 'female',
    male: 'male'
    // ,neuter: 'neuter'
};

world.healthLevel = {
    alive: 'alive',
    sickly: 'sickly',
    dead: 'dead'
};

// for interdiction (using two words for this...)
world.interdictionType = {
    movement: 'movement',
    action: 'action',
    speak: 'speakwith'
};


// we should have departure/death
// parents/siblings
// maybe make it simple: departure/death, familymember
world.absentationType = {
    departure: 'departure',
    death: 'death'
};

// elder := parents, grand-parents
// family := siblings and all those people we list.
world.absentationPerson = {
    elder: 'elder',
    elders: 'elders',
    parent: 'parent',
    parents: 'parents',
    sibling: 'sibling',
    siblings: 'siblings',
    family: 'family'
};

world.blankLine = '';

world.util = {};

world.func8subfuncs = {
        '1'   : 'kidnapping of person',
        '2'   : 'seizure of magical agent or helper',
        '2b'  : 'forcible seizure of magical helper',
        '3'   : 'pillaging or ruining of crops',
        '4'   : 'theft of daylight',
        '5'   : 'plundering in other forms',
        '6'   : 'bodily injury, maiming, mutilation',
        '7'   : 'causes sudden disappearance',
        '7b'  : 'bride is forgotten',
        '8'   : 'demand for delivery or enticement, abduction',
        '9'   : 'expulsion',
        '10'  : 'casting into body of water',
        '11'  : 'casting of a spell, transformation',
        '12'  : 'false substitution',
        '13'  : 'issues order to kill [requires proof]',
        '14'  : 'commits murder',
        '15'  : 'imprisonment, detention',
        '16'  : 'threat of forced matrimony',
        '16b' : 'threat of forced matrimony between relatives',
        '17'  : 'threat of cannibalism',
        '17b' : 'threat of cannibalism among relatives',
        '18'  : 'tormenting at night (visitation, vampirism)',
        '19'  : 'declaration of war'
    };



// http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
world.util.randomProperty = function(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (prop != 'id') {
                if (Math.random() < 1/++count)
                    result = obj[prop];
            }
        return result;
    };


var storyGen = function(settings) {

    // generates a random number
    var random = function(limit){
        var num = Math.floor(Math.random() * limit);
        return num;
    };

    // // http://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    // var randomProperty = function(obj) {
    //     var result;
    //     var count = 0;
    //     for (var prop in obj)
    //         if (prop != 'id') {
    //             if (Math.random() < 1/++count)
    //                 result = obj[prop];
    //         }
    //     return result;
    // };

    var pick = function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var pickRemove = function(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr.splice(index,1)[0];
    };

    // return true or false
    // 50-50 chance (unless override)
    var coinflip = function(chance) {
        if (!chance) { chance = 0.5; }
        return (Math.random() < chance);
    };


    // failing for
    // This is the way the world begins. just on the verge of Oblivion in the province Prussia, there was a hovel where Angelic Lauren lived.
    var capitalize = function(str) {
        // how about regex on start of each line w/in the string????
        if (!str) return null;
        return str.replace(/^[a-z]/mg, function(m) { return m.toUpperCase(); });
        return str.slice(0,1).toUpperCase() + str.slice(1);
    };


    // ugh. capitalize is defined in propp.js
    // bank { adjective: [], verbs: [] }
    var ig = function(bank) {

        var adjCount = random(4) + 1;
        var adjs = [];

        for (var i = 0; i < adjCount; i++) {
            adjs.push(capitalize(pick(bank.itembank.adjectives)));
        };

        var thing = capitalize(pick(bank.itembank.nouns));

        return adjs.join('-') + ' ' + thing;

    };


    // var itemGenerator = function() {
    //     // TODO since this is a depencency, IT SHOULD BE PASSED IN
    //     return ig(defaultbank.itembank);
    // };

    // this function creates things that are common to all template-worlds
    var god = function(settings, wordbank, t) {

        var theme = t;

        var bank = _.deepClone(wordbank);

        bank.itemGenerator = function() {
            return ig(bank);
        };

        if (wordbank) {
            // TODO: this is not enough!
            // need to have these things as adjectives....
            for (var i = 0; i < 10; i++) {
                bank.magicalitem.push(bank.itemGenerator());
            }
        }

        var cache = {};

        // see also https://github.com/dariusk/corpora/blob/master/data/archetypes/character.json
        var createCharacter = function(gndr, aspct) {
            // TODO: what happens when we've used up everything in the bank?
            // SOLUTION: don't worry about it: make the bank bigger than any of our templates
            // for now...
            gndr = gndr || world.util.randomProperty(world.gender);
            aspct = aspct || world.util.randomProperty(world.aspect);
            var adjs = (aspct === world.aspect.good ? bank.adjectives.personal : bank.adjectives.negative);
            var descr = [pick(adjs), pick(adjs)];
            var name = pickRemove(bank.names[gndr].concat(bank.names.neuter));

            // alt: two adjs in front, two-ads in back: "Big Bad Joan" or "Joan the Big and Bad"
            // WAY ALT: His Serene Highness Prince Robert Michael Nicolaus Georg Bassaraba von Brancovan von Badische, Marquis of Hermosilla, Count of Cabo St. Eugenio, Seventy-fourth Grand Master of the Knights of Malta,
            // another model is "Brienne of Tarth" - have some sort of origin location
            // we would NOT do this for "family", however.... so, some flag to pass in. :::sigh:::
            var nick = (coinflip() ? name + ' the ' + capitalize(pick(descr)) : capitalize(pick(descr)) + ' ' + name);

            return { name: name,
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
                     possessive: possessive(gndr)
                   };
        };

        var createCharacters = function(gndr, aspct, count) {
            var members = count || random(12) + 1;
            var acqs = [];
            for (var i = 0; i < members; i++) {
                var g = (!gndr || gndr === 'random' ? world.util.randomProperty(world.gender) : gndr);
                aspct = aspct || world.util.randomProperty(world.aspect);
                acqs.push(createCharacter(g, aspct));
            }
            return acqs;
        };

        // they are not characters at this point.
        var createFamily = function(gndr) {

            // mother, father, siblings
            // wife/husband, children

            var family = {
                mother: null,
                father: null,
                wife: null,
                husband: null,
                children: null,
                siblings: null
            };

            // small percentage of the time lives alone. waaaah!
            if (coinflip(0.1)) {
                // lives alone!
            } else {
                // TODO: siblings
                var maxSibs = (coinflip(0.3) ? 12 : 3);
                var sibCount = random(maxSibs);
                var boys = [];
                var girls = [];
                for (var i = 0; i < sibCount; i++) {
                    if (coinflip()) {
                        boys.push(pick(bank.names['male']));
                    } else {
                        girls.push(pick(bank.names['female']));
                    }
                }
                if (coinflip()) {
                    // mother, father, siblings
                    family.father = pick(bank.names['male']);
                    family.mother = pick(bank.names['female']);
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


        var place = function() {
            // don't need to do a pick-remove
            // but we should probably store all places
            // and make sure we never duplicate....
            return {
                residence: pick(bank.residence),
                vicinity: pick(bank.location),
                nation: pick(bank.nation),
                id: uid.toString('pl_') // prefix
            };
        };

        var getPlace = function(id) {
            var p;
            if (cache.places && cache.places[id]) { p = cache.places[id]; }
            return p;
        };

        var getCharacter = function(uid) {
            if (typeof uid === 'object') { return uid; }
            var c;
            if (cache.characters[uid]) { c = cache.characters[uid]; }
            return c;
        };

        // hero or villain
        var createHero = function(gndr, aspct, item) {
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
            if (item) { c.possessions.push(item); }

            return c;

        };

        var createMagicalHelper = function(g, aspct) {
            var person = createCharacter(g, aspct);
            person.name = capitalize(pick(bank.itembank.adjectives)) + ' ' + person.name;
            return person;
        };


        // differs from here in that there are no acquaintances
        // and only creates minions if a number is passed in
        // and there is a fantastic form
        var createVillain = function(g, aspct, item, minionCount) {
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
            if (item) { c.possessions.push(item); }

            c.form = (coinflip() ? 'human' : pick(bank.fantasticForm));

            return c;
        };

        var createHome = function() {
            return place();
        };

        var createFalsehero = function() {
            var g = world.util.randomProperty(world.gender);
            var c = createCharacter(g, world.aspect.bad);
            return c;
        };

        var createMagicalitem = function() {
            // pick REMOVE
            // which means we run of of the durned things.
            // why not just create them here AS NEEDED
            var item = (bank.magicalitem && bank.magicalitem.length > 0 ? pickRemove(bank.magicalitem) : bank.itemGenerator());
            return item;
        };

        var createPunished = function() {
            return pick(bank.punish);
        };

        // hrm. we are now storing people as string-ids. OUCH
        var getName = function(thing, property) {
            if (property && typeof property === 'function' ) { property = property(); }
            if (property && thing[property]) { return getCharacter(thing)[property]; }
            // if thing starts with "id_" then it is a character reference
            // or another sort of reference. hrm.
            if (thing.indexOf('id_') == 0) { property = property || select('name', 'nickname'); }
            var elem = (typeof thing === 'string' && thing.indexOf('id_') == -1 ? thing : getCharacter(thing)[property]);
            return elem;
        };

        var possessive = function(gndr) {
            // if character is passed in, reduce it to the target gender
            if (gndr && gndr.gender) { gndr = gndr.gender; }
            return (gndr === world.gender.male ? 'his' : (gndr === world.gender.female ? 'her' : 'its'));
        };

        // third-person
        var pronounobject = function(gndr) {
            // if character is passed in, reduce it to the target gender
            if (gndr && gndr.gender) { gndr = gndr.gender; }
            return (gndr === world.gender.male ? 'him' : (gndr === world.gender.female ? 'her' : 'them'));
        };

        var pronoun = function(gndr) {
            // if character is passed in, reduce it to the target gender
            if (gndr && gndr.gender) { gndr = gndr.gender; }
            return (gndr === world.gender.male ? 'he' : (gndr === world.gender.female ? 'she' : 'it'));
        };


        // calculate the speaking tone
        // VERY PRELIMINARY
        var tone = function(p1, p2) {
            // comparison of alignment or other characteristics
            // friendly - good <-> good | bad <-> bad
            // love - hero <->bride[groom]
            // dislike
            // hatred
            // mourning - person.alive -> person.dead
            // the latter suggests a post-mortem tone in the other direction. let's leave that for now?
            var t;
            if (p1 && p1.alignment && p2 && p2.alignment) {
                t = ((p1.alignment == p2.alignment) ? 'good' : 'bad');
            }
            return t;
        };

        // not really sure where this is going.
        // see if they are friendly? talk about the location? posessions?
        // pass in an intent?
        // adjectives are completely random. SO IT GOES.
        // TODO: get a better sense of "aspect"... forgot the correct term
        // the relationship of speaker to speaker
        // like, awe, fondness, sadness, dislike, hatred
        // if nobody to speak to, use an interjection, or a comment on the current location
        // if other person is dead, talk in memorium (how so, what to remember?)
        // if all is well, could talk about locale, descriptions, homes, posessions
        // would we want to _transfer_ a posession during conversation?
        // that could be interesting....
        // characters known to each other?
        // if not, they should introduce
        // one could know another
        // so, each char has a "knows" list of characters.
        // ugh. this will get recursive, and can't be serialized
        // should just be names, I suppose. more overhead, but serialization is kept. yes?
        // see also https://github.com/dariusk/corpora/blob/master/data/words/proverbs.json
        // dialogue
        var converse = function(p1, p2) {
            var c = [];

            // "Don't go bragging like that!" says a rich merchant
            // after somebody says something _about themselves_

            // "Why do you call me?"
            // "I didnt call you" replies the old man. "I don't even know who you are."

            var t = tone(p1, p2);
            var p1n = coinflip() ? p1.name : p1.nickname;
            var p2n = '';
            var says = '{{<%= select("said", "remarked", "noted", "mused", "exclaimed", "ejected", "rumbled", "muttered") %>}}';
            var reply = '{{<%= select("replied", "responded", "retorted", "volleyed", "returned", "muttered") %>}}';


            if (p1 && p2) {
                p2n = coinflip() ? p2.name : p2.nickname;

                // this should probably be handled by the calling code
                // AS WHO KNOWS
                // but for now.....
                c.push('{{P1N}} {{bumped}} into {{P2N}}.');

                // TODO: still pretty repetitive
                // and the punctuation is funky
                // not... interesting enough.
                c.push('"{{GG}} {{P1N}}" {{SAY}} {{P2N}}.', world.blankLine);
                c.push('"{{GG}} {{P2N}}" {{RPLY}} {{P1N}}.', world.blankLine);
                c.push('"Well, you certainly are ' + p1.description[0] + '," {{SAY}} {{P2N}}.', world.blankLine);
                c.push('"Yes, I am," {{conceded}} {{P1N}}. "But it\'s been said that I\'m also ' + p1.description[1] + '!"');

            } else if (p1 && !p2) {
                var punct = function() { return select('!', '.', '?'); };
                c.push('"' + capitalize(pick(bank.interjections))
                       + select('!', ',') + '" {{SAY}} {{P1N}}' + (coinflip() ? ' to nobody in particular.' : '.')
                       + (coinflip() ? '' : ' "' + capitalize(pick(bank.interjections)) + punct() + '"'));
            }

            // apply "TONE" to converstaion -- ie, are they on good terms with each other
            // this is extremely preliminary, and is currently either only "good" or "bad"
            // not applicable to solo "conversations"
            // so far.
            if (t === 'bad') {
                if (coinflip()) { c.push(world.blankLine, '"Don\'t go bragging like that!" says {{P2N}}'); }
                            }
            var tmpl = c.join('\n').replace(/{{P1N}}/mg, p1n).replace(/{{P2N}}/mg, p2n)
                    .replace(/{{SAY}}/mg, says).replace(/{{RPLY}}/mg, reply)
                    .replace(/{{GG}}/mg, function() { return pick(bank.greetings[t]); });

            return tmpl;
        };

        // battle between two people
        // each of which could have family and acquaintances join in
        // or does that need to be made explicit ???
        // if victor is not passed in, the result could be random!
        var battle = function(p1, p2, victor) {
            // TODO: who knows!

            // this really seems like something for the template, though. BLARG!


            // weapons!
            // the magical item that is passed from advisor to hero should be used
            // and the villain needs a weapon
            // aaaand, other things? Any other posession, I suppose? or just ones marked "weapon" ?
            // that could be interesting. Objects in the following form:
            // so, magical things fall into this category
            var thing = {
                item: 'egg', // name could be "Egg of Death" or "Death Egg" or "Primordial Magic Death Egg of the Borderlands" or something telse
                //
                name: 'Magical Egg of the Wong Foo the Elder',
                description: ['shiny', 'round', 'egg-shaped', 'magical', 'filigreed', 'expensive'],
                weapon: true, // or false
                magic: true, // or false
                // special powers? how would THAT work ????
                origin: {
                    // if a person gave the object, or it was found ?
                    person: null,
                    place: null
                }
            };

        };

        // list it out, using optional property for value
        // awkward construction....
        var list = function(arr, property) {
            var lst = '';
            if (arr.length > 0) {
                if (arr.length === 1) {
                    lst = getName(arr[0], property);
                }
                else if (arr.length === 2) {
                    lst = getName(arr[0], property) + ' and ' + getName(arr[1], property);
                } else {
                    for (var i = 0; i < arr.length - 1; i++) {
                        lst += getName(arr[i], property) + ', ';
                    }
                    lst += 'and ' + getName(arr[arr.length - 1], property);
                }
            }
            return lst;
        };

        var or = function(f1, f2) {
            return (coinflip() ? f1() : f2() );
        };

        // select one of any number of arguments
        var select = function() {
            return pick(arguments);
        };

        var dump = function(thing) {
            var target = (thing ? thing : cache);
            return JSON.stringify(target, null, '\t');
        };

        // TODO: optionally pass in.. anything?
        // narrator, to start with.
        var init = function() {
            // I don't think this is an issue anymore....
            if (!bank) { return; }
            try {

                cache.characters = settings.characters || {}; // this holds all the people, elsewhere, use a uid to reference individuals
                cache.places = {}; // holds uid of all places (in-progress)

                if (!settings.herogender || settings.herogender === 'random') { settings.herogender = world.util.randomProperty(world.gender); }
                if (!settings.villaingender || settings.villaingender === 'random') { settings.villaingender = world.util.randomProperty(world.gender); }
                if (!settings.peoplegender || settings.peoplegender === 'random') { settings.peoplegender = world.util.randomProperty(world.gender); }

                if (settings.narrator) { cache.narrator = settings.narrator; }

                // TODO: alternately pass in an aspect, so the hero (main character) is an anti-hero, and the villain is a good person!
                // maybe protagonist/antagonist and the main chars?
                // and hero/villain is a particular instantiation?
                // so that the protag is here, with antag as villain, OR protag as villain with antag as hero
                // and the other two combos. What would THAT do?
                cache.hero = settings.hero || createHero(settings.herogender, world.aspect.good);
                cache.villain = settings.villain || createVillain(settings.villaingender, world.aspect.bad, createMagicalitem(), 2);

                // TODO: magical item starts as a posession of the advisor, no?
                // NO: it could just be... lying about.
                // TODO: advisor gender could be a setting, so we can all-female stories.
                cache.advisor = settings.advisor || createCharacter(null, world.aspect.good);
                cache.advisor.introduced = false; // ugh.
                cache.magicalitem = settings.magicalitem || createMagicalitem();
                cache.magicalhelper = settings.magicalhelper || createMagicalHelper(null, world.aspect.good);
                cache.punished = settings.punished || createPunished();
                cache.task = pick(bank.task);
                // AAARGH. doesn't work...
                // cache.victim = settings.victim || getCharacter(pick(cache.hero.family.concat(cache.hero)));
                cache.ascension = pick(bank.ascension);
                cache.marries = pick(bank.marries);
                // if there's nobody in the family, there can't be a falsehero!
                // also, does not have to be viallain family
                // this is just "current implementation"
                // could be hero's family, villain, or the villain
                cache.falsehero = settings.falsehero || pick(cache.villain.family);

            } catch(ex) {
                // the last 3 items are non-standard.....
                var msg = ex.name + ' : ' + ex.message;
                if (ex.lineNumber && ex.columnNumber && ex.stack) {
                    msg += ' line: ' + ex.lineNumber + ' col: ' + ex.columnNumber + '\n'
                        + ex.stack;
                }
                console.log(msg);
            }
        }(settings);

        // god return
        return {
            init: init,
            advisor: cache.advisor,
            falsehero: cache.falsehero,
            hero: cache.hero,
            villain: cache.villain,
            createMagicalitem: createMagicalitem,
            // magicalitem: cache.magicalitem, // this remains the same EACH LOOP
            // either we give a new magicalitem, or we skip the donation sequence
            magicalhelper: cache.magicalhelper,
            task: cache.task,
            victim: cache.victim,
            ascension: cache.ascension,
            marriage: cache.marries,
            converse: converse,
            tone: tone,
            theme: theme,
            cache: cache, // hunh. exposing this?????
            or: or,
            list: list,
            possessive: possessive,
            pronounobject: pronounobject,
            pronoun: pronoun,
            // ooop. what's the difference?!!!
            pick: pick,
            select: select,
            coinflip: coinflip,
            capitalize: capitalize,
            randomProperty: world.util.randomProperty,
            dump: dump,
            interdictionType: world.interdictionType,
            location: place,
            wordbank: bank,
            nlp: nlp,
            createVillain: createVillain,
            createHero: createHero,
            punished: function() { return pick(bank.punish); },
            getCharacter: getCharacter
        };

    };


    // populate template
    // which may contain multiple sentences.
    var sentence = function(func, helper, params) {

        var f = '';
        var isFunc = (typeof func === 'function');
        if (func && func.active || func && isFunc) {
            if (isFunc) {
                // outro and other special methods
                f = func(helper);
            } else if (func.exec) {
                // special exec method
                f = func.exec(helper, params);
            } else {
                // old-style array-of-templates-with-no-other-logic
                f = func.templates[random(func.templates.length)];
            }

            var prior = f;
            // console.log(f);

            var vicn = '<%= coinflip() ? cache.victim.name : cache.victim.nickname %>';
            var villn = '<%= coinflip() ? villain.nickname : villain.name %>';
            var hn = '<%= coinflip() ? hero.nickname : hero.name %>';

            f = f.replace(/{{VICN}}/mg, vicn).replace(/{{HN}}/mg, hn).replace(/{{VN}}/mg, villn);
            var template = f;

            var t = _.template(f);
            f = t(helper);

            if (f.indexOf('NaN') >= 0) {
                console.log('prior: ' + prior + '\n\ntemplate: ' + template);
            }


            // TODO: attempt to parse sentences, and apply past tense....
            // TROUBLE: this means we will also swap the tense of the embedded tales
            // WAAAAH!
            // hrm....
            // how about... we check for the presence of a specific TAG, say '{{**}}''
            // if present, remove it an swap case
            // if not, pretend like nothing happened...
            // I AM NOT HAPPY WITH THE RESULTS
            f = f.replace(/{{\*\*}}/mg, ''); // so remove it
            if (f.indexOf('{{**}}') >= 0) {
                f = f.replace(/{{\*\*}}/mg, ''); // remove it
                f = f.replace(/{{|}}/mg, ''); // remove old-style verb-tags
                var tokenizer = new Tokenizer();
                tokenizer.setEntry(f);
                var sentences = tokenizer.getSentences();
                var tensed = [];

                for (var i = 0; i < sentences.length; i++) {
                    // console.log(sentences[i]);
                    if (this.settings.verbtense == 'past') {
                        tensed.push(capitalize(nlp.pos(sentences[i]).sentences[0].to_past().text()));
                    } else {
                        tensed.push(capitalize(nlp.pos(sentences[i]).sentences[0].to_present().text()));
                    }
                }

                // if there are paragraph breaks WE JUST LOST THEM
                f = tensed.join(' ');

            }
            // handle non-template transforms.
            var tag,
                re = /\{{.*?\}}/g,
                sentence = f;
            while((tag = re.exec(f)) !== null) {
                var verb = tag[0].replace(/\{|\}/g, '');
                // because I've set up module && module.exports
                // nlp thinks it's running in node.js....
                // can make a global switch.....
                var tense;
                if (this.settings.verbtense == 'past') {
                    tense = nlp.verb(verb).to_past();
                } else {
                    tense = nlp.verb(verb).to_present();
                }
                f = f.replace(tag[0], tense);
            }

            // exceptions
            f = f.replace(/wered/mg, 'were').replace(/weres/mg, 'are').replace(/strided/mg, 'strode').replace(/wased/mgi, 'WAS');

            f = capitalize(f);

        }

        return f;

    };

    // this is for "old-style" functions. BLARG!
    var enforceRules = function(story) {

        if (story['func2'].active || story['func3'].active) {
            story['func2'].active = true;
            story['func3'].active = true;
        }

        // magical item must be given to hero in order to be used
        // the obverse is not true (can be given but never used; pointless, but: whatever!)
        if (story['func18'].active) {
            story['func14'].active = true;
        }

        // if returning, must depart
        // converse is not true
        if (story['func21'].active) {
            story['func11'].active = true;
        }

        return story;

    };

    // takes an array of function names
    // returns the index of villainy (if found)
    // or -1 (not found)
    var findVillainy = function(storyFuncs) {
        for (var i = 0; i < storyFuncs.length; i++) {
            var f = settings.funcs[i];
            var subFunc;
            if (typeof f === 'object') {
                subFunc = f[1];
                f = f[0];
            }
            if (f === 'func8') return i;
        }
        return -1;
    };

    // generate the fairy tale
    var generate = function(settings, theme){

        try {

            this.settings = settings;
            var story = theme.templates(settings.functions, world, storyGen);
            var restartVillainy = this.findVillainy(settings.funcs);

            var tale = [];

            // the world is the things that have been created. no?
            // possibly not. since creation is called alla time again...
            this.universe = god(this.settings, theme.bank, theme);
            global = this.universe;

            for (var i = 0; i < settings.funcs.length; i++) {
                var f = settings.funcs[i];
                var subFunc = null;
                if (typeof f === 'object') {
                    subFunc = f[1];
                    f = f[0];
                }
                // console.log(settings.funcs[i]);
                var s2 = this.sentence(story[f], this.universe, subFunc);
                if (s2) { tale.push(s2); }

                if (s2.indexOf('NaN') >=0 ) {console.log(f); }

                if (this.universe.hero.health === world.healthLevel.dead) { break; }
                if (settings.bossfight && this.universe.villain.health == 'dead' && restartVillainy >= 0) {
                    if (this.universe.coinflip(0.8)) {
                        // we run out of names, because new villains have both family and acquaintances
                        // AND USE THEM ALL UP
                        this.universe.villain = this.universe.createVillain();
                        this.universe.cache.magicalitem = this.universe.createMagicalitem();
                        i = restartVillainy - 1; // one less, since it will be incremented on loop
                    } else {
                        restartVillainy = -1;
                    }
                }
            }
            tale.push(this.sentence(story.outro, this.universe));

            // TODO: get a new iterator
            // it will be an array that is BUILT
            // aaaand, let's presume that it has been passed in as part of SETTINGS
            // for (var index in story) {
            //     // console.log(index);
            //     var s = this.sentence(story[index], storyGen.world);
            //     if (s) {
            //         tale.push(s);
            //     }
            // }

            var title = this.sentence(story.title, this.universe);

            return {
                title: title,
                tale: tale.join('\n\n')
            };

            return tale.join('\n\n');


        } catch(ex) {
            // the last 3 items are non-standard.....
            var msg = ex.name + ' : ' + ex.message;
            if (ex.lineNumber && ex.columnNumber && ex.stack) {
                msg += ' line: ' + ex.lineNumber + ' col: ' + ex.columnNumber + '\n'
                    + ex.stack;
            }
            console.log(msg);
            return msg;
        }
    };


    // http://stackoverflow.com/questions/3231459/create-unique-id-with-javascript
    var uid = new function (prefix) {
        var u = 0;
        prefix = prefix || 'id_';
        this.toString = function () {
            return prefix + u++;
        };
    };


    if (!(this instanceof storyGen)) return new storyGen();

    return {
        settings: settings,
        random: random,
        coinflip: coinflip,
        enforceRules: enforceRules,
        findVillainy: findVillainy,
        generate: generate,
        god: god,
        itemGenerator: god.itemGenerator, // TODO: is this even used?
        pick: pick,
        pickRemove: pickRemove,
        randomProperty: world.util.randomProperty,
        sentence: sentence,
        uid: uid,
        world: world,
        deepClone: _.deepClone
    };


};

// should this be reduced back down to a 0..31 array?
storyGen.resetProppFunctions = function(onoff) {

    // if not passed in, turn it on
    // this is a legacy setting used (mainly?) by the GUI
    if (onoff == null) { onoff = true; }

    var propp = {

        "func0": { active: onoff, templates: [] },
        "func1": { active: onoff, templates: [] },
        "func2": { active: onoff, templates: [] },
        "func3": { active: onoff, templates: [] },
        "func4": { active: onoff, templates: [] },
        "func5": { active: onoff, templates: [] },
        "func6": { active: onoff, templates: [] },
        "func7": { active: onoff, templates: [] },
        "func8": { active: onoff, templates: [] },
        "func8a": { active: onoff, templates: [] },
        "func9": { active: onoff, templates: [] },
        "func10": { active: onoff, templates: [] },
        "func11": { active: onoff, templates: [] },
        "func12": { active: onoff, templates: [] },
        "func13": { active: onoff, templates: [] },
        "func14": { active: onoff, templates: [] },
        "func15": { active: onoff, templates: [] },
        "func16": { active: onoff, templates: [] },
        "func17": { active: onoff, templates: [] },
        "func18": { active: onoff, templates: [] },
        "func19": { active: onoff, templates: [] },
        "func20": { active: onoff, templates: [] },
        "func21": { active: onoff, templates: [] },
        "func22": { active: onoff, templates: [] },
        "func23": { active: onoff, templates: [] },
        "func24": { active: onoff, templates: [] },
        "func25": { active: onoff, templates: [] },
        "func26": { active: onoff, templates: [] },
        "func27": { active: onoff, templates: [] },
        "func28": { active: onoff, templates: [] },
        "func29": { active: onoff, templates: [] },
        "func30": { active: onoff, templates: [] },
        "func31": { active: onoff, templates: [] }
    };

    return propp;
};

world.resetProppFunctions = storyGen.resetProppFunctions;

// also... need a randomizer
// although... that's not really a preset...
storyGen.presets = {

    cinderella: {
        functions: ['func0', 'func1', 'func8', 'func8a', 'func14', 'func19', 'func23', 'func27', 'func31'],
        bossfight: false
    },
    hansel: {
        functions:['func0', 'func6', 'func7', 'func8', 'func8a', 'func16', 'func18', 'func20'],
        bossfight: false
    },
    snow_white: {
        functions:['func0', 'func1', 'func5', 'func6', 'func7', 'func11', 'func21', 'func30', 'func31'],
        bossfight: false
    },
    little_red_riding_hood: {
        functions:['func4', 'func5', 'func6', 'func7', 'func8', 'func9', 'func10', 'func16', 'func18'],
        bossfight: false
    },
    juniper:  {
        functions:['func6', 'func7', 'func8', 'func11', 'func12', 'func13', 'func14', 'func20', 'func30'],
        bossfight: false
    },
    barebones: {
        functions:['func0', 'func8', 'func14', 'func16', 'func18', 'func31'],
        bossfight: true
    },
    mostlyVillainy: {
        functions: ['func8', 'func18'],
        bossfight: false
    },
    shortWaterStory: {
        functions: [['func8', 'casting into body of water'], 'func18'],
        bossfight: true
        }
};




module = module || {};
module.exports = storyGen;
