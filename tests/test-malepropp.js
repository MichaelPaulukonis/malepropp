// see http://vowsjs.org/
var vows = require('vows'),
    assert = require('assert');

var templates = require('../templates.js');
var wordbank = require('../wordbank.test.js')(require('../words.js'));
var storygen = require('../propp.js');

var world = storygen().world; // hey, we're assuming this works w/o testing!


vows.describe('Test the story generator').addBatch({

    'presets exist': {
        topic: function() { return storygen.presets; },
        'presets exist': function(topic) {
            assert.isNotNull(topic);
        }
        }

}).run();

// vows.describe('Test the sentence generator').addBatch({

//     'When tag-count > word-count, words will repeat': {
//         // original implementation of code had infinite loop if tag-count > word-count
//         topic: function() { return sentence.generate(1); },

//         'we get a valid sentence': function(topic) {
//             assert.equal(topic, 'A noun is a noun is a noun.');
//         }
//     },
//     'Random seeds produce predictable results': {
//         // also note that tests are run asynchronously, and in their own context
//         // redefing the sentence properties does not affect other sentences
//         topic: function() {
//             sentence.seed = 'foo';
//             sentence.words = { noun: ["noun", "toy", "boat"] };
//             return [ sentence.generate(1), sentence.generate(1) ];
//         },
//         'Should be the same thing every time': function(topic) {
//             assert.deepEqual(topic, ['A toy is a boat is a noun.', 'A toy is a boat is a noun.']);
//         }
//     },
//     'First letter of sentence is capitalized': {
//         // we could check that the first-letter is equal to the first-letter toUpperCase
//         // but that might be arbitrarily true for the other sentence templates.
//         topic: function() { return sentence.generate(0); },
//         'Capitalized': function(topic) {
//             assert.equal(topic, 'This will be capitalized');
//         }
//     },
//     'Constant templates generate as constants': {
//         // No errors for a template with no tags
//         // and it returns itself (capitalized)
//         topic: function() { return sentence.generate(0); },
//         'This is a constant template': function(topic) {
//             assert.equal(topic, 'This will be capitalized');
//         }
//     },
//     'The first [0th] template can be explicitly referenced': {
//         // An early implementation had a poor truthiness check that failed when template-index := 0
//         topic: function() { return sentence.generate(0); },
//         'First template used': function(topic) {
//             assert.equal(topic, 'This will be capitalized');
//         }
//     },
//     'A tag not found in the words-array is ignored': {
//         // this may not be the desired behavior on-going
//         // but it's better than crashing
//         topic: function() { return sentence.generate(2); },
//         'Unknown tag is ignored': function(topic) {
//             assert.equal(topic, 'A {thing} is not found.');
//         }
//     },
//     'cache-less selector chooses from self': {
//         topic: function() {
//             sentence.templates = ["This has {one|one} option."];
//             return sentence.generate(0);
//         },
//         'choses from self': function(topic) {
//             assert.equal(topic, "This has one option.");
//         }
//     }
// }).run(); // run it


// vows.describe('Test the memory').addBatch({
//     'remembered-tag is reused': {
//         topic: function() {
//             // assert that the first word occurs three times
//             // perhaps not the best test in the world....
//             // if type:identifier is not recognized as a valid word, it will not be replaced in template
//             sentence.words = {
//                 noun: ["noun", "bear", "cat"],
//                 "noun:1": ["noun", "bear", "car"]
//             };
//             sentence.templates = ["{noun:1} is a {noun:1} is a {noun:1}"];
//             var s = sentence.generate(0);
//             var firstWord = s.split(" ")[0];
//             var r = new RegExp(firstWord, "ig");
//             return s.match(r).length;
//         },
//         'remembers tag': function(topic) {
//             assert.equal(topic, 3);
//         }
//     }
// }).run();
