// var defaultTemplates = require('./default.templates.js');
var templates = require('./templates.js');
var words = require('./words.js');
// words is a requirement for wordbank.....
var wordbank = require('./wordbank.test.js')(words);
var storygen = require('./propp.js');

var world = storygen().world;
var config = require('./config.js');

var Tumblr = require('tumblrwks');
var tumblr = new Tumblr(
  {
  consumerKey: config.consumerKey,
  consumerSecret: config.consumerSecret,
  accessToken: config.accessToken,
  accessSecret: config.accessSecret
  },
  'fairytalesbot.tumblr.com'
);

var oneStory = function() {

  try {

    var text = [];

    // nope nope nope

    var presets = world.util.randomProperty(storygen.presets);


    var setts = {
      herogender: 'random',
      villaingender: 'random',
      peoplegender: 'random',
      functions: storygen.resetProppFunctions(),
      // randomizer
      funcs: presets.functions,
      // funcs: ['func0', 'func2', 'func3', 'func8', 'func30', 'func31'],
      // funcs: ['func0', 'func2', 'func3', ['func8', 'commits murder'], 'func30', 'func31'],
      // funcs: [['func8', 'casting into body of water'], 'func30'],
      // bossmode: true,
      bossmode: presets.bossmode,
      verbtense: 'past'
    };

    var theme = {
      bank: wordbank,
      templates: templates
    };


    var sg = new storygen(setts);

    var tale = sg.generate(setts, theme);

    return tale;

  } catch(ex) {
    // the last 3 items are non-standard.....
    var msg = ex.name + ' : ' + ex.message;
    if (ex.lineNumber && ex.columnNumber && ex.stack) {
      msg += ' line: ' + ex.lineNumber + ' col: ' + ex.columnNumber + '\n'
        + ex.stack;
    }
    console.log(msg);
    return 'An error has occured';
  }
};


var teller = function() {

    var story = oneStory();

    if (story && story.title && story.tale) {

      tumblr.post('/post',
                  {type: 'text', title: story.title, body: story.tale},
                  function(err, json){
                    console.log(err, json);
                  });

    }

  console.log('DONE');

};

teller();
