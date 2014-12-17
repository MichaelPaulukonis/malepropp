// see http://vowsjs.org/
var vows = require('vows'),
    assert = require('assert');

var templates = require('../templates.js');
var wordbank = require('../wordbank.test.js')(require('../words.js'));
var storygen = require('../propp.js');

var world = storygen().world; // hey, we're assuming this works w/o testing!


vows.describe('Test the presets').addBatch({

    'presets exist': {
        topic: function() { return storygen.presets; },
        'presets exist': function(topic) {
            assert.isNotNull(topic);
        }
    }

}).run();

vows.describe('Test world utilities').addBatch({

   // TODO:

}).run();

// TODO: this relies on storygen.resetProppFunction
// WHICH IS NOT TESTED PRIOR TO THIS FUNCTION OUCH
var commonSettings = function() {

        var setts = {
            herogender: 'female',
            villaingender: 'female',
            peoplegender: 'female',
            functions: storygen.resetProppFunctions(),
            bossmode: false,
            verbtense: 'past',
            conclusion: false
        };

        var theme = {
            bank: wordbank,
            templates: templates
        };

    return { settings: setts, theme: theme };

};

vows.describe('storyGen functions standalone').addBatch({

    // this is "one" test that actually runs 32 different tests
    // more, really, I guess....
    'all funcs': {
        topic: function() {
            var cs = commonSettings();
            cs.settings.funcs = []; // BLANK
            return cs;
        },
        'each function works solo (mostly)': function(topic) {

            // NOTE: func3 requires func2
            // but it currently does a console.log and returns a single-space
            // so, it's not actually erroring yet....
            var funcList = [
                'func0', 'func1', 'func2', 'func3', 'func4',
                'func5', 'func6', 'func7', 'func8', 'func8a',
                'func9', 'func10', 'func11', 'func12', 'func13',
                'func14', 'func15', 'func16', 'func17',
                'func18', 'func19', 'func20', 'func21',
                'func22', 'func23', 'func24', 'func25',
                'func26', 'func27', 'func28', 'func29',
                'func30', 'func31'
            ];

            // TODO: intro and outro is included by default
            // there should be a way to turn it off
            for (var i = 0; i < funcList.length; i++) {
                var func = funcList[i];
                topic.settings.funcs = [func];
                var sg = new storygen(topic.settings);
                var story = sg.generate(topic.settings, topic.theme);
                assert.isNotNull(story.tale);
                console.log(func + ' : ' + story.tale);
            }

        }

    }


    // 'func0': {
    //     topic: function() {
    //         var cs = commonSettings();
    //         cs.settings.funcs = ['func0'];
    //         return cs;
    //     },
    //     'func0 story is generated': function(topic) {
    //         var sg = new storygen(topic.settings);
    //         var tale = sg.generate(topic.settings, topic.theme);
    //         assert.isNotNull(tale);
    //     }
    // }
    // 'func1': {
    //     topic: function() {
    //         var cs = commonSettings();
    //         cs.settings.funcs = ['func1'];
    //         return cs;
    //     },
    //     'func1 story is generated': function(topic) {
    //         var sg = new storygen(topic.settings);
    //         var tale = sg.generate(topic.settings, topic.theme);
    //         assert.isNotNull(tale);
    //     }
    // },
    // 'func2': {
    //     topic: function() {
    //         var cs = commonSettings();
    //         cs.settings.funcs = ['func2'];
    //         return cs;
    //     },
    //     'func2 story is generated': function(topic) {
    //         var sg = new storygen(topic.settings);
    //         var tale = sg.generate(topic.settings, topic.theme);
    //         assert.isNotNull(tale);
    //     }
    // }

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
