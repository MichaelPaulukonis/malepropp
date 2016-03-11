/*jshint node:true, laxcomma:true */
"use strict";

// sugar is a dependency, and should be loaded in the browser prio to loading the tokenizer
// var sugar = require('sugar');

function Tokenizer() {

  if (!(this instanceof Tokenizer)) {
    return new Tokenizer();
  }

  this.entry = null;
  this.sentences = null;

}

Tokenizer.prototype = {
  setEntry : function (entry) {
    this.entry = entry.compact();
    this.sentences = null;
    return this;
  },
  // Split the entry into sentences.
  getSentences : function () {
    // this.sentences = this.entry.split(/[\.!]\s/);
    var words = this.entry.words();
    var endingWords = words.filter(function(w) {
      return w.endsWith(/[\.!\?]/);
    });

    var self = this;
    var lastSentence = words[0];
    self.sentences = [];
    words.reduce(function (prev, cur, index, array) {
      var curReplaced = cur;

      if (endingWords.indexOf(prev) != -1) {
        self.sentences.push(lastSentence.compact());
        lastSentence = "";
      }
      lastSentence = lastSentence + " " + curReplaced;
      return cur;
    });
    self.sentences.push(lastSentence.compact());
    return this.sentences;
  },
  // Get the tokens of one sentence
  getTokens : function (sentenceIndex) {
    var s = 0;
    if(typeof sentenceIndex === 'number') s = sentenceIndex;
    return this.sentences[s].words();
  }
};

module = module || {};
module.exports = Tokenizer;
