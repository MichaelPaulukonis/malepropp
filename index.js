// var defaultTemplates = require('./default.templates.js');
var templates = require('./templates.js');
var words = require('./words.js');
// words is a requirement for wordbank.....
var wordbank = require('./wordbank.test.js')(words);
var storygen = require('./propp.js');

var world = storygen().world;

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

        // console.log(sg);

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
    }
};



// http://stackoverflow.com/questions/18679576/counting-words-in-string
var wordcount = function(s) {

    s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
    s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
    s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
    return s.split(' ').length;

};


var writeitout = function(text) {

    var fs = require('fs');

    var fn = 'wonder.tale.' + (Math.random() * 0x1000000000).toString(36) + '.txt';

    fs.writeFile(fn, text);

    console.log('\n\nWritten to ' + fn);

};

var novel = function() {


    // console.log(oneStory());

    var wc = 0;
    var n = [];

    while (wc < 50000) {

        var tale = oneStory();

        // console.log(tale);

        // there's a bug that is killing tales.
        // it's NOT BEING LOGGED BLARG
        if (tale && tale.title && tale.tale) {

            var formatted = tale.title.toUpperCase() + '\n\n' + tale.tale + '\n\n';

            wc += wordcount(formatted);

            n.push(formatted);

        }

    }

    writeitout(n.join('\n\n'));

    console.log('DONE');


};

// TODO: take in some param; if present, output a set n stories

novel();

// console.log(oneStory());
// console.log(oneStory());
// console.log(oneStory());
