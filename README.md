[Discussion of this work](https://github.com/dariusk/NaNoGenMo-2014/issues/6).

## What's going on in here?
I'm playing with some _Proppian_ story/skeleton generators. My end goal is to have a generator than I can call `n` times, until 50,000 words have been created. Each output should be distinctly different enough to have a passing resemblance to interesting. One of the steps there will be a templating system (underscore, probably), and word-replacement in the templates (WordNik, probably).

Last year, I spent a bunch of time refactoring/building a template system -- and while it was a good exercise, I never used it for anything much, and it isn't nearly as flexible as `underscore`.

As of today, 2014.10.22, I don't fully understand Propp's theories; while I doubt I will completely by the end of November, I hope to improve my knowledge, and get a better understanding of what I want to do by gradually reworking some other code that's pointing me in some directions.

I suspect that, after technical issues, the hardest work will be in creating the templates.

That may seem wrong-headed, but I am am not fully engaging the entire narrative-engine target at the deepest level. My attack is by nature _facile_ - I am interested in surface effects -- how it reads, how it feels, how it gets to 50,000 characters by the end of November 2014 -- not that the underlying model is theorhetically sound and academically rigorous.

I am interested in short-cuts, in making it _seem_ better than it is.

However, I am not interested in futher "gimmicks." The major gimmick, here, is the templating system masquerading as something intelligent to make a story.  TODO: add links to/extracts from discussions on NaNoGenMo gimmicks and usefulness. For example, I could generate the novel solely though BOSSMODE (kill the villain; repeat), or through NESTED-TALES (character tells a story that has a character that tells a story that....), or NESTED-BOSSMODE (both of them). But there are plenty (several) extnat strategies that rely on nesting/recursion. I want to try something different. Assuming I have the time.

Klein notes that "[t]he most complex problems in automatic Propp and Levi-Strauss concern logical qunatifications of functions. That is, the coherent selection of compatible characters, objects and functions" (Klein 1974, p23).

In contrast, a rather "dumb" selection of characters and objects will result in humorous or jarring discontinitues that will _distract_ from other technical faults in the underlying "narrative" construct.


## Notes on the extant proppian generators
The most-referenced version - [Fairy Tale Generator](https://web.archive.org/web/20061112014356/http://www.brown.edu/Courses/FR0133/Fairytale_Generator/gen.html) - was developed for a class (at Brown in ????). It's not the most faithful Propp version -- it breaks the 31 functions into 34 pieces, and makes them all optional and independent -- nothings depends on anything else. The high level of citations is in no doubt due to the readily pleasing effects, which are primarily due to the source materials included. Each function, instead of actually referencing characters, objects or other functions, consists of the random selection of pre-written sentences, independent of previous selections. Due to the nature of the writing, there _may be_ inter-references, but this is all accidental. They are well-written, and the use of indefinite determiners allows sentences to seemingly reference one another. Plus, a lot of themes occur again (soil, shoes, needles).

A perhaps better model is the [Proto-Proppian Generator](http://www.stonedragonpress.com/vladimir_propp/propp_generator_v1.htm) that has _awful_ output, in that its a listing of the selected functions, with some minor variations. however, the technical details are more correct (to my untrained eye), and the selection of functions is dependent on other selections (ie, not totally independent -- it follows rules). This is perhaps the better model for me to work with.

## TODOs

These are NOT in order; but are lightly clustered....

- [x] get node.js headless mode working ("novel builder")
- [x] title-maker templates
  - [ ] store list of villains encountered to possibly aid with title
- [x] novel-builder loop-through with word-count check
- [x] novel-builder writes to a file
- [ ] rules + randomizer - for embedded tales, headless running, &c
- [ ] journeys [partial]
- [ ] battle [partial]
- [x] pass in word.js dependency to wordbank.test.js
- [ ] more descriptors for characters - old|young|child, man|woman|person (villains and advisor/helpers can also be "things" like bear, dragon, cloud of flies) [villains as things partially implemented]
- [ ] fix locations - including visited locations
- [ ] villain can be a creature (bear, dragon, whatever, dark cloud, whatever) [partially implemented as description/title. nothing else impacted]
- [ ] family - so hero can be child/sibling, parent, grand-parent, etc.
- [ ] false hero
- [ ] hero/villain can have aspect changed on startup (eg, good/bad swap)
- [x] move/duplicate? (that is, refactor) punishments to apply as well in victory sequence
- [ ] magicalitem template enhancement (currently static placeholder)
- [ ] conversation enhancements
- [ ] terse mode (simple intro, etc. for embedded tales, or otherwise) [partial implementation for hero intro]
- [ ] theme selector, so that sub-tales can pick a different set of templates and wordbanks
- [ ] extra possibility: if hero dies, another family-member becomes the hero
- [ ] novel-builder framing device? (Count N visiting a mansion and reading volumes in the library)
- [ ] generate() stores all templates so that we could re-process them, like to switch tense, or something
- [ ] web page "publicly" accessible
 - [ ] web page has informational links active (and refs previous progenitors)


## Directions, and potential side-resources
* [NaNoGenMo 2014 resource "issue"](https://github.com/dariusk/NaNoGenMo-2014/issues/1)
* [NaNoGenMo 2013 resource "issue"](https://github.com/dariusk/NaNoGenMo/issues/11)
* [gutengrep](https://github.com/hugovk/gutengrep) for researching sentences in a large body og Gutenberg
* WordNik
* [corpora](https://github.com/dariusk/corpora/) (for locations, items, things like that)

* [list of online fairy tales](https://github.com/bscofield/fairy-tale-remix/blob/master/data/fairy-tales.json) - from a remixer that never got remixed.
* [Bros Grimm](https://github.com/baldmountain/GrimmsFairyTales/blob/master/Grimms%20Fairy%20Tales%20-%20The%20Brothers%20Grimm.hatter/document.txt) on github (From Gutenberg)
* [Indian Fairy Tales](https://github.com/GITenberg/Indian-Fairy-Tales_7128) on github, from Gutenberg.
 * there are others in this vein from the same group
* [The Project Gutenberg EBook of Russian Fairy Tales, by W. R. S. Ralston](http://www.gutenberg.org/files/22373/22373-h/22373-h.htm)
* 1001 nights
 * [The Book of the Thousand Nights and One Night](http://www.gutenberg.org/cache/epub/8655/pg8655.html)
 * [The Arabian Nights Entertainments](http://www.gutenberg.org/files/128/128-h/128-h.htm)
 * [The Arabian Nights: Their Best-known Tales](http://www.gutenberg.org/files/20916/20916-h/20916-h.htm) - illos by Maxfield Parrish!
 * [The Book of the Thousand Nights and a Night, Volume 3](http://www.gutenberg.org/cache/epub/3437/pg3437.html) - Richard Burton verson

* [Thompson's Motif-index of fold-literature](http://www.ualberta.ca/~urban/Projects/English/Motif_Index.htm)

* [alyphen's generator](https://github.com/dariusk/NaNoGenMo-2014/issues/73) has some interesting lists (all from Corpora, I believe). The sentences are purely random (based on a hard-coded gammar?) but read well. There's no connectivity, but the method of construction has some pointers.
  * particularly look at [nanogenmo.py](https://github.com/alyphen/nanogenmo/blob/master/nanogenmo/nanogenmo.py)

* [non-linear narrative](http://en.wikipedia.org/wiki/Nonlinear_narrative)

* [nlp_compromise](https://github.com/spencermountain/nlp_compromise)

* [Node Sentence Tokenizer](https://github.com/parmentf/node-sentence-tokenizer) for reprocessing text with nlp_compromise. yaaay!

* [random weighted choice](https://github.com/parmentf/random-weighted-choice) for when I want some templates more often than others, but not ALL the time....


### Semantic Networks
from reading about the MESSy system used by Klein.

* https://github.com/Planeshifter/node-concept-net
 * playing with it a bit. Might be a way to get some sentences or something. But it won't be all that random.
 * But it might help me build something up. Or not. who knows.
* https://www.npmjs.org/package/expert
* https://www.npmjs.org/package/file-concept-network
* https://www.npmjs.org/package/concept-network

* http://en.wikipedia.org/wiki/Cyc


### Titles
There was something on the FairyTale Plot Generator (below) that looked like it might be a title generator.
Basically, simple keyword replacement in templates.
Some variants:

[n] words about [hero] and [possessive] [situation]
[n] letters concerning [foo]
[n] sentences concerning the events of [situation|time|place]

things like that

Purple flowery synonyms for things in the story
example idea

[Fred defeats a dragon in the Valley] := The tale of Brave, Dauntless Fred and the giant undefeatable maurading Dragon of the beloved perfect emerald-green Valley

Some sort of automated title for each output will also be required. Using a different generator, though, but using the same word-bank. (Or I'll have to give up, and just use numbers. Waaaah! However, hrm.... GUIDs, some sort of weirdness with the wordbank, or everything -- not completely linear, computer garbled? A more munged version of Darius K's re-spellings that he did last year [TODO: link cite])

### template notes
Without serious NLG work, this is going to be template-driven.
Since limited variety is brought in by modifying the source words, and selection of "functions", switching around the templates is a necessity.
There should be AT LEAST 4 variations on each template.

## terminology update
According to Propp, there are only 7 possible characters: hero, false hero, villain, donor, helper, dispatcher, princess (sought-for person) and/or her father [correct as per gender];

While I use family and acquaintances, I should at least use the above terminology. Uh.... what's the "dispatcher" and "donor" ? I think donor := advisor in my current terminology...

### story object (code notes)
story as generated by Propp is really a template.
Word replacement to happen later - the engine shouldn't be doing that.
Really, if no replacement, then template := story.
Story itself, though, has a structure beyond that of the generator, since it would include the wordbank, title, and other potential info - time, location, characters, etc.

I'm beginning to think the templates I have should be more complicated -- that is, actual functions. Since they need to set other conditions -- death of character, etc.
That's something that may come about (semi) organically...

2014.11.09 the templates handling code has expanded to check to see if a particular property is present -- `exec` -- and if so, call it as a function (which it is. should prolly check the type, too). That will help a bit, maybe. The templates should be tied to a particular wordbank explicitly, and these things call the helper functions, not the other way around. That way a set of templates could over-ride a given function; say, the creation of magical-items and helpers (eg, use one single adjective instead of the default; or possibly none!). The template-wordbank would also hold a "title generator" -- called at the end, I suppose, so it could reference things that "happened".

I want to extend the wordbanks and templates to add some variety. Bororo-esque (from Raw & The Cook), Science Fictiony, Fantasy, normal-us, Western, dullsville, corporate (home is a office, region is a floor, country is a building/corporation. competition for promotion, villain is a co-worker, manager. magical items are staplers and meetings; magical helper is an intern or something), neo-noir, etc.

TODO: error-handling

TODO: node.js-ify, and then browserify so it can still be used with the web interface; but web-less for testing, etc. would be really nice. And is long overdue....


## Morphology (and incept dates?) of the Folktale

http://en.wikipedia.org/wiki/Vladimir_Propp

[Propp's Morphology and his 31/32 Narratemes](http://changingminds.org/disciplines/storytelling/plots/propp/propp.htm) - the Initial situation is not counted in the original 31 narratemes. For some reason.
* [another listing](http://www.movieoutline.com/articles/vladimir-propp-narratemes-and-morphology-of-the-folktale.html) - links to an Analysis of _Lawrence of Arabia_ using Propp's narratemes.
* [another variant](http://gointothestory.blcklst.com/2014/04/propps-31-narratemes.html) - with comparisons to Campbell's _monomyth_ and Aristotelian narrative structure.
* [another variant](http://writinghorrorfiction.blogspot.com/2010/02/vladimir-propps-31-dramatic-situations.html) - includes the seven character types (covered elsewhere?)

[Fairy Tale Generator](https://web.archive.org/web/20061112014356/http://www.brown.edu/Courses/FR0133/Fairytale_Generator/gen.html) - archive.org link, and source for some of the code herein. Heavily poeticized sentence/paragraph fragments. Doesn't always flow well. Need to jettison the original text (too static, too unique).
* [mirror made in 2006](http://tz69.3x.ro/Generator/gen.html) using HttTrack, so it grabbed all of the instructions, etc.
* as of 2014.10.22 I have not copied all of the associated info-texts that popup, although I did from the skeleton generator, below.

[Proto-Proppian Outline Generator](http://www.stonedragonpress.com/vladimir_propp/propp_generator_v1.htm) outputs skeleton, not text. brief look at the JS appears similar to the Fairytale generator, above.

[Bard](http://web.fdi.ucm.es/profesor/fpeinado/projects/bard/) appears to be a newer version; written in Java. Can't find anything else online.

http://tvtropes.org/pmwiki/pmwiki.php/Main/ProppsFunctionsOfFolktales


## prior art for story generators
*[ProjectPropp](http://projectpropp.yolasite.com/text-generator.php) - the js source is very procedural, but works.
 * [some notes](http://sandileonard.com/projects.php) on the above

*[FairyTale Plot Generator](http://www.springhole.net/writing_roleplaying_randomators/fairytaleplot.htm) - non-Propp. simple patchwork JS. Short output, nice variance.
 * [more (plot) generators](http://www.springhole.net/writing_roleplaying_randomators/plotgens.htm) from the same site

* [Fairy Tale Generator](http://www.jacobpedia.com/nhhl/FairyTaleGenerator/index.htm) - work done behind the scenes in PHP, souce not available (?). Interesting output. Good length. Users can contribute some items, which has resulted in a certain amount of word-salad. Not an unpleasant effect. Structure seems to be intro, quest assignments [1..n], quests, conclusion.

* [Funny Fairy Tale Generator](http://www.maiaappleby.com/funny-fairy-tale-generator/) - madlibs-style fill-in-blanks for an otherwise static output. Not a bad effect though, and the source indicates that the ur-text is roughly the Wizard of Oz.

* [Story Generator](https://github.com/aherriot/story-generator)
 * some interesting infrastructure and good-looking web interface, but majority of content is lacking.

* [Plot Narrator](https://github.com/kddekadenz/PlotNarrator/blob/master/unit1.pas) - it's in Pascal.
 * [notes](http://opengameart.org/content/plotnarrator)
 * [JavaScript port](https://github.com/anihex/SimpleStoryCreator) - no online version. Not as complicated as the proppian-gen I'm working with, but has some interesting ideas. With a larger word-bank might have enough variance?


## Further Research
[NLG Generator list](http://www.fb10.uni-bremen.de/anglistik/langpro/NLG-table/NLG-table-date-sort.html)
This should go somewhere; dumping it here so I see it again (found during Propp-searches)

This doc mentions an application by [Sheldon Klein](http://pages.cs.wisc.edu/~sklein/sklein.html)  that is more completely described (including source) in [this pdf](http://minds.wisconsin.edu/handle/1793/57894?show=full). An [expanded edition](http://pages.cs.wisc.edu/~sklein/Simulation-Meta-Symbolique%20d%27Hypotheses-Propp%20&%20Levi-Strauss.pdf) [pdf] is available, in French, but with extended source code.
See also [AUTOMATIC NOVEL WRITING,  UWCS Tech Report No. 186,109 pages.](http://www.cs.wisc.edu/%7Esklein/Automatic%20Novel%20Writing-1973-UWCS-TR183.pdf)

Of interest is [Meta-symbolic Simulation System (MESSY) user manual](http://pages.cs.wisc.edu/~sklein/Meta-symbolic%20Simulation%20System.pdf) by one of the same authors. This was used for the Murder Mystery sotories, the R&TC tales, and the Propp folktales. It's a very clear scan. The code is `Fortran V`.

I have some notes at [WordSalad.Generators](http://www.xradiograph.com/WordSalad.Generators), but they are mostly links (academic below).

* [Poetry Generators](http://www.narrabase.net/poetry_generators.html)

* http://www.newscientist.com/article/dn26377-told-by-a-robot-fiction-by-storytelling-computers.html?full=true#.VE-J98mRGkz
* [Story Generator Algorithms](http://www.lhn.uni-hamburg.de/article/story-generator-algorithms)
* [Computation Approaches to Storytelling and Creativity](http://aaaipress.org/ojs/indx.php/aimagazine/article/viewFile/2250/2101) - includes section "a brief history of story-telling systems"
* http://codercuckoo.wordpresscom/2013/07/26/final-project-story-generation/
* [Linear Logic Programming for Narrative Generation (pdf)](https://www.cs.cmu.edu/~cmartens/lpnmr13.pdf)
* http://dl.acm.org/citation.cfm?id=1087175
* https://research.cc.gatech.eu/eilab/mark-riedl
* https://research.cc.gatech.eu/inc/fabulist
* [Mark O. Riedl. Story Planning: Creativity Through Exploration, Retrieval, and Analogical Transformation. (pdf)](http://www.cc.gatech.edu/~riedl/pubs/mm.pdf)
 * https://research.cc.gatech.edu/inc/category/project-types/fabulist
* [Storytelling with Adjustable Narrator Styles and Sentiments (pdf)](http://www.cc.gatech.edu/~riedl/pubs/icids14.pdf)
* [Story Ploit Generation based on CBR](http://classes.soe.ucsc.edu/cmps148/Winter10/readings/StoryGenerationCBR.pdf)
* [Creative Storytelling Based on Exploration and Transformation of Constraint Rules](http://nil.fdi.ucm.es/sites/default/files/ijwcc08cast.pdf)
* [Computational Approaches to Creative Language](http://www.coli.uni-saarland.de/courses/cacl10/reading.html)
* [Generating Narrative Variation in Interactive Fiction](http://nickm.com/if/Generating_Narrative_Variation_in_Interactive_Fiction.pdf)
* [Story Generators: Models and Approaches for the Generation of Literary Artefacts](http://web.fdi.ucm.es/profesor/fpeinado/publications/2005-loenneker-story.pdf)


## Functions
After the initial situation is depicted, the tale takes the following sequence of 31 functions:

- ABSENTATION: A member of a family leaves the security of the home environment. This may be the hero or some other member of the family that the hero will later need to rescue. This division of the cohesive family injects initial tension into the storyline. The hero may also be introduced here, often being shown as an ordinary person.
- INTERDICTION: An interdiction is addressed to the hero ('don't go there', 'don't do this'). The hero is warned against some action (given an 'interdiction').
- VIOLATION of INTERDICTION. The interdiction is violated (villain enters the tale). This generally proves to be a bad move and the villain enters the story, although not necessarily confronting the hero. Perhaps they are just a lurking presence or perhaps they attack the family whilst the hero is away.
- RECONNAISSANCE: The villain makes an attempt at reconnaissance (either villain tries to find the children/jewels etc.; or intended victim questions the villain). The villain (often in disguise) makes an active attempt at seeking information, for example searching for something valuable or trying to actively capture someone. They may speak with a member of the family who innocently divulges information. They may also seek to meet the hero, perhaps knowing already the hero is special in some way.
- DELIVERY: The villain gains information about the victim. The villain's seeking now pays off and he or she now acquires some form of information, often about the hero or victim. Other information can be gained, for example about a map or treasure location.
- TRICKERY: The villain attempts to deceive the victim to take possession of victim or victim's belongings (trickery; villain disguised, tries to win confidence of victim). The villain now presses further, often using the information gained in seeking to deceive the hero or victim in some way, perhaps appearing in disguise. This may include capture of the victim, getting the hero to give the villain something or persuading them that the villain is actually a friend and thereby gaining collaboration.
- COMPLICITY: Victim taken in by deception, unwittingly helping the enemy. The trickery of the villain now works and the hero or victim naively acts in a way that helps the villain. This may range from providing the villain with something (perhaps a map or magical weapon) to actively working against good people (perhaps the villain has persuaded the hero that these other people are actually bad).
- VILLAINY or LACK: Villain causes harm/injury to family member (by abduction, theft of magical agent, spoiling crops, plunders in other forms, causes a disappearance, expels someone, casts spell on someone, substitutes child etc., commits murder, imprisons/detains someone, threatens forced marriage, provides nightly torments); Alternatively, a member of family lacks something or desires something (magical potion etc.). There are two options for this function, either or both of which may appear in the story. In the first option, the villain causes some kind of harm, for example carrying away a victim or the desired magical object (which must be then be retrieved). In the second option, a sense of lack is identified, for example in the hero's family or within a community, whereby something is identified as lost or something becomes desirable for some reason, for example a magical object that will save people in some way.
- MEDIATION: Misfortune or lack is made known, (hero is dispatched, hears call for help etc./ alternative is that victimized hero is sent away, freed from imprisonment). The hero now discovers the act of villainy or lack, perhaps finding their family or community devastated or caught up in a state of anguish and woe.
- BEGINNING COUNTER-ACTION: Seeker agrees to, or decides upon counter-action. The hero now decides to act in a way that will resolve the lack, for example finding a needed magical item, rescuing those who are captured or otherwise defeating the villain. This is a defining moment for the hero as this is the decision that sets the course of future actions and by which a previously ordinary person takes on the mantle of heroism.
- DEPARTURE: Hero leaves home;
- FIRST FUNCTION OF THE DONOR: Hero is tested, interrogated, attacked etc., preparing the way for his/her receiving of a magical agent or helper (donor);
- HERO'S REACTION: Hero reacts to actions of future donor (withstands/fails the test, frees captive, reconciles disputants, performs service, uses adversary's powers against him);
- RECEIPT OF A MAGICAL AGENT: Hero acquires use of a magical agent (directly transferred, located, purchased, prepared, spontaneously appears, eaten/drunk, help offered by other characters);
- GUIDANCE: Hero is transferred, delivered or led to whereabouts of an object of the search;
- STRUGGLE: Hero and villain join in direct combat;
- BRANDING: Hero is branded (wounded/marked, receives ring or scarf);
- VICTORY: Villain is defeated (killed in combat, defeated in contest, killed while asleep, banished);
- LIQUIDATION: Initial misfortune or lack is resolved (object of search distributed, spell broken, slain person revived, captive freed);
- RETURN: Hero returns;
- PURSUIT: Hero is pursued (pursuer tries to kill, eat, undermine the hero);
- RESCUE: Hero is rescued from pursuit (obstacles delay pursuer, hero hides or is hidden, hero transforms unrecognisably, hero saved from attempt on his/her life);
- UNRECOGNIZED ARRIVAL: Hero unrecognized, arrives home or in another country;
- UNFOUNDED CLAIMS: False hero presents unfounded claims;
- DIFFICULT TASK: Difficult task proposed to the hero (trial by ordeal, riddles, test of strength/endurance, other tasks);
- SOLUTION: Task is resolved;
- RECOGNITION: Hero is recognized (by mark, brand, or thing given to him/her);
- EXPOSURE: False hero or villain is exposed;
- TRANSFIGURATION: Hero is given a new appearance (is made whole, handsome, new garments etc.);
- PUNISHMENT: Villain is punished;
- WEDDING: Hero marries and ascends the throne (is rewarded/promoted).

Occasionally, some of these functions are inverted, as when the hero receives something whilst still at home, the function of a donor occurring early. More often, a function is negated twice, so that it must be repeated three times in Western cultures.

## Characters
- The villain — struggles against the hero.
- The dispatcher — character who makes the lack known and sends the hero off.
- The (magical) helper — helps the hero in their quest.
- The princess or prize and her father — the hero deserves her throughout the story but is unable to marry her because of an unfair evil, usually because of the villain. The hero's journey is often ended when he marries the princess, thereby beating the villain.
- The donor — prepares the hero or gives the hero some magical object.
- The hero or victim/seeker hero — reacts to the donor, weds the princess.
- The false hero — takes credit for the hero’s actions or tries to marry the princess.

These roles could sometimes be distributed among various characters, as the hero kills the villain dragon, and the dragon's sisters take on the villainous role of chasing him. Conversely, one character could engage in acts as more than one role, as a father could send his son on the quest and give him a sword, acting as both dispatcher and donor.
