/*jshint node:true, laxcomma:true */
"use strict";

function Tokenizer() {

  if (!(this instanceof Tokenizer)) {
    return new Tokenizer();
  }

  this.entry = null;
  this.sentences = null;

}

// wrapped in an IIFE so these helpers don't leak into the global scope -
// this file is loaded as a plain <script> in the browser (no module scope),
// and top-level names here would collide with other globals (eg. words.js
// also declares a global `words`)
(function () {
  // collapse runs of whitespace and trim - was Sugar's String#compact
  function compact(str) {
    return str.replace(/\s+/g, ' ').trim();
  }

  // split on whitespace - was Sugar's String#words
  function words(str) {
    return compact(str).split(' ');
  }

  Tokenizer.prototype = {
    setEntry : function (entry) {
      this.entry = compact(entry);
      this.sentences = null;
      return this;
    },
    // Split the entry into sentences.
    getSentences : function () {
      // this.sentences = this.entry.split(/[\.!]\s/);
      var entryWords = words(this.entry);
      var endingWords = entryWords.filter(function(w) {
        return /[.!?]$/.test(w);
      });

      var self = this;
      var lastSentence = entryWords[0];
      self.sentences = [];
      entryWords.reduce(function (prev, cur, index, array) {
        var curReplaced = cur;

        if (endingWords.indexOf(prev) != -1) {
          self.sentences.push(compact(lastSentence));
          lastSentence = "";
        }
        lastSentence = lastSentence + " " + curReplaced;
        return cur;
      });
      self.sentences.push(compact(lastSentence));
      return this.sentences;
    },
    // Get the tokens of one sentence
    getTokens : function (sentenceIndex) {
      var s = 0;
      if(typeof sentenceIndex === 'number') s = sentenceIndex;
      return words(this.sentences[s]);
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Tokenizer;
}
