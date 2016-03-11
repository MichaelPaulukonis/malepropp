'use strict';

var Cleaner = function(Tokenizer) {

    // web-ready version of cleaner. mostly.
    var cleaner = function(text) {

        if (text === undefined || text.trim().length === 0) { return ''; }

        var clean = text;

        var rules = [
            // removes spaces before punctuation
            { regex: /\s+([.,;:!?])/g, output: '$1' }
            // I'm not sure about this one. spaces and single-quotes. why?
            // { regex: /\s+'\s+/g, output: '\'' },
            // if quote at end of line, and preced by space - remove it
            // partial heuristic
            ,{ regex: /\s+(['"])$/g, output: '$1' }
        ];

        // pass in Tokenizer from external....
        var st = new Tokenizer('dummy');

        var cleanSentences = function(text) {

            st.setEntry(text);
            var sentences = st.getSentences();

            var cleaned = [],
                skipSentence = false;

            for (let i = 0, sl = sentences.length; i < sl; i++) {
                if (skipSentence) {
                    skipSentence = false;
                } else {
                    var sentence = sentences[i];
                    // for each (var r in rules) {
                    for (var ri in rules) {
                        var r = rules[ri];
                        sentence = sentence.replace(r.regex, r.output);
                    }
                    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

                    if (i < sentences.length - 1 && sentences[i+1].match(/^['"]$/)) {
                        sentence += sentences[i+1];
                        skipSentence = true;
                    }

                    cleaned.push(sentence);
                }
            }

            return cleaned.join(' ').trim();

        };

        clean = cleanSentences(clean);

        return clean;

    };

    return cleaner;

};


var module = module || {};
module.exports = Cleaner;
