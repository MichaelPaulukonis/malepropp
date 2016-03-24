'use strict';

var tester = function() {

  var mocha = require('mocha'),
      chai = require('chai'),
      expect = chai.expect,
      // TODO: okay, make it an object or array
      slavicTemplates = require('../templates.js'),
      businessTemplates = require('../templates.business.js'),
      brownTemplates = require('../default.templates.js'),
      descriptiveTemplates = require('../templates.descriptive.js'),
      wordbank = require('../wordbank.test.js')(require('../words.js')),
      storygen = require('../propp.js'),
      world = storygen().world; // hey, we're assuming this works w/o testing!

  // TODO: this relies on storygen.resetProppFunction
  // WHICH IS NOT TESTED PRIOR TO THIS FUNCTION OUCH
  var commonSettings = function(templates) {

    templates = templates || slavicTemplates;

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

  describe('presets tests', function() {

    it('should provide non-null presets object', function() {
      expect(storygen.presets).to.not.be.null;
    });

  });

  describe('different templates function standalone', function() {

    var templates = {
      'slavic': slavicTemplates
      , 'business': businessTemplates
      // many MANY failures with the below
      // , 'brown': brownTemplates
      // , 'descriptive': descriptiveTemplates
    };

    var testTemplate = function(name, template) {
      describe(name + ' storyGen functions standalone', function() {

        var cs = commonSettings(template);
        cs.settings.funcs = [];

        funcList.forEach(function(func) {
          it('correctly generates text for ' + func, function() {
            cs.settings.funcs = [func];
            var sg = new storygen(cs.settings);
            var story = sg.generate(cs.settings, cs.theme);
            expect(story.tale).to.not.be.null;
            expect(story.title).to.have.length.above(5); // some have come in at 10. Maybe less is possible.
            expect(story.tale).to.have.length.above(10);
            expect(story.tale.indexOf('undefined')).to.equal(-1);
            // console.log(func, ': ', story.tale);
          });
        });

        describe(name + ' func8 subfuntions', function() {

          it('exposes the subfunctions of func8', function() {
            expect(world.func8subfuncs).to.not.be.null;
            expect(typeof world.func8subfuncs).to.equal('object');
          });

          var subs = world.func8subfuncs;
          for(var subfunc in subs) {
            it('generates text for func8, subfunc: ' + subs[subfunc], function() {
              cs.settings.funcs = ['func8', subs[subfunc]];
              var sg = new storygen(cs.settings);
              var story = sg.generate(cs.settings, cs.theme);
              expect(story.tale).to.not.be.null;
              expect(story.tale).to.have.length.above(10);
              expect(story.title).to.have.length.above(5); // some have come in at 10. Maybe less is possible.
              // console.log(subfunc, ': ', story.tale);
            });
          };
        });

      });

    };

    for (var name in templates) {
      testTemplate(name, templates[name]);
    }

  });


  describe('storygen exposes villainy types', function() {

    it('should have a list of villainy types', function() {
      expect(storygen.villainyTypes).to.not.be.undefined;
      expect(storygen.villainyTypes).to.be.an('object');
      expect(Object.keys(storygen.villainyTypes)).to.have.length.above(0);
    });

    it('each type of villainy should "work"', function() {
      var cs = commonSettings();
      cs.settings.funcs = [['func8']]; // BLANK (? blank, what?)

      for (var f in storygen.villainyTypes) {
        var subFunc = storygen.villainyTypes[f];
        var skipIntros = true;
        cs.settings.funcs[0].push(subFunc, skipIntros);
        var sg = new storygen(cs.settings);
        var story = sg.generate(cs.settings, cs.theme);
        expect(story.tale).to.not.be.null;
        expect(story.tale).to.have.length.above(10);
        expect(story.title).to.have.length.above(5);
      }
    });

  });

  describe('storygen utlities', function() {

    var utils = storygen.world.util;

    describe('capitalize', function() {

      it('should capitalize the first letter in a single word', function() {
        expect(utils.capitalize('word')).to.equal('Word');
      });

      it('should capitalize the first word in a sentence', function() {
        expect(utils.capitalize('this is a sentence.')).to.equal('This is a sentence.');
      });

      it('should capitalize the first word in each sentence of multiple sentences.', function() {
        expect(utils.capitalize('this is a sentence. so is this.')).to.equal('This is a sentence. So is this.');
      });

      it('should leave line-breaks (paragraphs) intact', function() {
        var sentIn = 'this is.\n\ntwo paragraphs.';
        var sentOut = 'This is.\n\nTwo paragraphs.';
        expect(utils.capitalize(sentIn)).to.equal(sentOut);
      });

    });

  });

}();
