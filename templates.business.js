var businessTemplates = function(story, world, storyGen) {

  var tersely = true;

  var blankLine = '';

  story = story || [];


  story.title = function(god) {

    var subject = god.hero;
    var villForm;
    if (god.hero.health === world.healthLevel.dead && god.villain.health === world.healthLevel.alive && god.villain.introduced) {
      subject = god.villain;
    } else if (god.villain.form !== 'human') {
      villForm = god.villain.form;
    }

    var tale = god.select('report', 'summary', 'memorandum', 'email', 'note', 'presentation', 'lunch-and-learn', 'perfomance review');
    var sn = god.select(subject.name, subject.nickname);
    var pron = god.pronoun(subject);
    var poss = god.possessive(subject);
    var mi = '';

    var templates = [
      '<%= hero.nickname %>',
      'The {{TL}} of {{SN}} and {{POSS}} actions',
      (god.coinflip() ? 'The Doings of ' : '') + '{{SN}} of <%= hero.home.nation %>',
      (god.coinflip() ? 'Employee ' : '') + '{{SN}} and what {{PRON}} did' + (god.coinflip() ? ' in <%= hero.home.nation %>' : '')
    ];


    var t = god.pick(templates);

    return t.replace(/{{TL}}/mg, tale).replace(/{{PRON}}/mg, pron).replace(/{{POSS}}/mg, poss)
      .replace(/{{SN}}/mg, sn).replace(/{{VF}}/mg, villForm)
      .replace(/{{MI}}/mg, mi);

  };

  // TODO: this should be back in the god() function
  // as it is common to templates
  story.createVictim = function(god) {

    var victim = god.getCharacter(god.pick(god.hero.family.concat(god.hero.acquaintances)));
    god.cache.victim = victim;
    return victim;

  };

  story.createLack = function(god) {

    // TODO: need to have verbs/object set apart, so we can resolve this....
    // TODO: need there to be a lack THING, then there can be additional things to say.
    var lacks = ['{{needs}} an mentor, an intern, or just somebody to talk to',
                 '{{needs}} a mentor or business case',
                 ['{{needs}} a patent or two',  'Possibly three. No more than that. Unless they {{were}} collectible'],
                 ['{{needs}} articles of incorporate of a declaration of bankruptcy', 'Either would do'],
                 ['{{needs}} money or means of existence', 'Times {{were}} tough'],
                 ['{{had}} lacks in other forms', 'Tsk tsk. Those lacks']
                ];

    var l = god.pick(lacks);
    var p = god.pick(god.hero.family); // argh, this ain't gonna work...
    var t = l;
    // if special array, capture first separately
    if (typeof l === 'object' && l.length && l.length === 2) {
      t = l[0] + '. ' + l[1];
      l = l[0];
    }
    var lack = {
      lack: l,
      text: t,
      person: p
    };

    god.cache.lack = lack;

    return lack;

  };


  // 0: Initial situation
  // TODO: multiple sentences within a template may not be punctuated correctly.
  // hrm. maybe they should each appear as a sub-component, so they can be processed externally?
  // for example, if sentence begins with <%= list(acquainainces()) %> and the first is 'the Easter Bunny' it will not be auto-capitalised
  // since that only works on the first letter of the template-output (erroneously called 'sentence' in the code).
  // TODO: what about "lives alone." how would THAT be figured out???
  story['func0'].exec = function(god, subFunc) {

    var t = [];

    var templates = [
      '{{HN}} works in a <%= hero.home.residence %> near <%= hero.home.location %> in <%= hero.home.nation %>. {{HN}} works with <%= list(hero.family) %>. S/he knows <%= list(hero.acquaintances) %> from work.'
    ];

    t.push(god.pick(templates));

    return t.join('\n');

  };


  // Proppian-function templates
  // Absentation: Someone goes missing
  // this could be the hero leaving home
  // so we\'d have to have more logic to cover this
  // TODO: also need to define the action, so it can be dealt with in Resuloution (func20)
  story['func1'].exec = function(god, subFunc) {

    var t = [];

    // if (!god.hero.introduced) { t.push(story.introduceHero(god, tersely)); }

    if (!god.cache.victim) { story.createVictim(god); }


    var templates = [
      '{{VICN}} doesn\'t come into work.',
      '{{VICN}} is unexpectedly fired, leaving {{HN}} devastated.'
    ];

    god.cache.victim.health = world.healthLevel.dead;

    // there should be concern for the first, grief for the latter two
    // and abstention could simple be left for work. Sheesh!

    t.push(god.pick(templates));

    if (god.hero != god.cache.victim) {
      t.push(blankLine, god.converse(god.hero).replace('!', '?'));
    }

    return t.join('\n');


  };

  // Interdiction: hero is warned
  // story['func2'].templates.push('{{HN}} is warned.');
  // TODO: introduction of personage from interdiction
  // TODO: rework the d**n interdiction template-function
  // this is now just a proof-of-concept of executing larger functions to deal with templates
  story['func2'].exec = function(world) {
    // world is not actually used here (now)...
    return '{{HN}} is warned.';

  };

  // Violation of Interdiction
  story['func3'].exec = function(god) {

    var text = [];

    var templates = [
      '<%= list(villain.family, "nickname") %> are in league with {{VN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };

  // Reconnaissance: Villain seeks something
  story['func4'].exec = function(god) {

    //  function 4: antagonist(s) makes attempt at reconnaissance = reconnaissance - (epsilon)
    // 1 - reconnaissance by antagonist(s) to obtain information about victim(s) / protagonist(s)
    // 2 - inverted form of reconnaissance by victim(s) / protagonist(s) to obtain information about antagonist(s)
    // 3 - reconnaissance by other person(s)

    var text = [];

    var templates = [
      '{{VN}} pays a visit to {{HH}}.',
      '{{HH}} plays host to {{VN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');

  };


  // Delivery: The villain gains information
  story['func5'].exec = function(god) {

    var text = [];

    var templates = [
      '{{VN}} gains information.',
      'After a chat with <%= pick(hero.family).name %>, {{VN}} learns some interesting news.',
      'While skulking about <%= hero.home.residence %>, {{VN}} overhears some gossip about {{HN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };

  // Trickery: Villain attempts to deceive victim.
  story['func6'].exec = function(god) {

    var text = [];

    if (!god.cache.victim) { story.createVictim(god); }

    var templates = [
      // TODO: hrm. how would this be done...
      '{{VN}} attempts to deceive {{VICN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };

  // Complicity: Unwitting helping of the enemy
  story['func7'].exec = function(god) {

    var text = [];

    var templates = [
      '{{HN}} unwittingly helps {{VN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };


  // 2nd Sphere: The Body of the story
  // 8A - Villainy: The need is identified (Villainy)
  // function 8 (and/or 8a) is always present in tale
  // antagonist(s) causes harm or injury to victim(s)/member of protagonist's family = villainy - A
  story['func8'].exec = function(god, subFunc, skipIntros) {
    var text = [];

    // TODO: test all of these
    // world.func8subfuncs = {
    //     '1'   : 'kidnapping of person',
    //     '2'   : 'seizure of magical agent or helper',
    //     '2b'  : 'forcible seizure of magical helper',
    //     '3'   : 'pillaging or ruining of crops',
    //     '4'   : 'theft of daylight',
    //     '5'   : 'plundering in other forms',
    //     '6'   : 'bodily injury, maiming, mutilation',
    //     '7'   : 'causes sudden disappearance',
    //     '7b'  : 'bride is forgotten',
    //     '8'   : 'demand for delivery or enticement, abduction',
    //     '9'   : 'expulsion',
    //     '10'  : 'casting into body of water',
    //     '11'  : 'casting of a spell, transformation',
    //     '12'  : 'false substitution',
    //     '13'  : 'issues order to kill [requires proof]',
    //     '14'  : 'commits murder',
    //     '15'  : 'imprisonment, detention',
    //     '16'  : 'threat of forced matrimony',
    //     '16b' : 'threat of forced matrimony between relatives',
    //     '17'  : 'threat of cannibalism',
    //     '17b' : 'threat of cannibalism among relatives',
    //     '18'  : 'tormenting at night (visitation, vampirism)',
    //     '19'  : 'declaration of war'
    // };

    var templates = [];
    subFunc = subFunc || god.randomProperty(storyGen.villainyTypes);

    switch(subFunc) {
    case 'kidnapping of person':
      templates.push('{{VN}} kidnaps <%= select(hero.family, hero.acquaintances).name %>.');
      break;

    case 'seizure of magical agent or helper':
      templates.push('{{VN}} <%= select("forcibly seizes", "kidnaps", "makes off with") %> <%= magicalhelper.name %>.');
      break;

    case 'forcible seizure of magical helper':
      templates.push('The report is destroyed by {{VN}}. All begin to feel the discomfort of chaos.');
      break;

    case 'pillaging or ruining of crops':
      templates.push('{{VN}} has absconded with the office supplies!');
      break;

    case 'theft of daylight':
      templates.push('Suddenly, it becomes as night. {{VN}} has shut off the power!');
      break;

    case 'plundering in other forms':
      templates.push('{{VN}} engages in plundering in other forms.');
      break;

    case 'bodily injury, maiming, mutilation':
      templates.push('{{VN}} causes bodily injury, maiming, mutilation.');
      break;

    case 'causes sudden disappearance':
      templates.push('{{VN}} causes a sudden disappearance.');
      break;

    case 'bride is forgotten':
      // TODO: casts a spell? that's not very professional
      templates.push('{{HN}}\'s intern is forgotten after {{VN}} casts a spell.');
      break;

    case 'demand for delivery or enticement, abduction':
      templates.push('{{VN}} makes a demand for delivery or enticement, abduction.');
      break;

    case 'expulsion':
      templates.push('{{HN}} is driven from <%= hero.home.residence %>.');
      break;

    case 'casting into body of water':
      templates.push('{{VN}} throws {{HN}} into <%= select("the toilet", "a drinking fountain", "the decorative fountain in the lobby") %>.');
      break;

    case 'casting of a spell, transformation':
      templates.push('It is hard to describe the charged atmosphere once {{VN}} has their policies enacted.');
      break;

    case 'false substitution':
      templates.push('A false substitution is perpretrated by {{VN}}.');
      break;

    case 'issues order to kill [requires proof]':
      templates.push('{{VN}} issues order to terminate [requires proof].');
      break;

    case 'commits murder':
      templates.push('{{VN}} practically commits murder.');
      break;

    case 'imprisonment, detention':
      templates.push('{{HN}} is called into an unexpected meeting.');
      break;

    case 'threat of forced matrimony':
      // TODO: this isn't matrimony. Hostile takeover? merger of divisions?
      templates.push('{{VN}} threatens to fire <%= pick(hero.family).name %>.');
      break;

    case 'threat of forced matrimony between relatives':
      templates.push('{{VN}} <%= select("insinuates", "suggests", "muses") %> that <%= list(hero.family) %> could be forced to transfer to his/her division.');
      break;

    case 'threat of cannibalism':
      templates.push('There is a threat of layoffs.');
      break;

    case 'threat of cannibalism among relatives':
      templates.push('Thanks to the ravages {{VN}}\'s disruptions have left on the firm, there is the threat of layoffs among {{HN}}\'s work-group. <%= list(hero.family) %> eye each other nervously.');
      break;

    case 'tormenting at night (visitation, vampirism)':
      // insomnia, can't sleep
      templates.push('{{HN}} is tormented during meetings by <%= pick(villain.family).name %>.');
      break;

    case 'declaration of war':
      templates.push('{{VN}} declares inter-office war on {{HN}}.');
      break;

    }

    text.push(god.pick(templates));

    return text.join('\n');


  };


  //  8a - Lack: The need is identified (Lack)
  // function 8a: one member of family lacks/desires something = lack - a
  // or.... figure out a better way to accomplish this...
  story['func8a'].exec = function(god) {

    if (!god.cache.lack) { story.createLack(god); }
    var lack = god.cache.lack;

    var person = god.getCharacter(god.cache.lack.person);
    var name = (god.coinflip() ? person.nickname : person.name);
    // 'cept they could also be a relative.
    var friendof = (person.introduced ? '' : ', a friend of {{HN}},');
    person.introduced = true;

    var sent = '{{PN}}{{FO}} {{LACK}}.';

    return sent.replace(/{{PN}}/mg, name).replace(/{{FO}}/mg, friendof).replace(/{{LACK}}/mg, lack.text);

  };


  // Mediation: hero discovers the lack
  story['func9'].exec = function(god) {

    var text = [];

    if (!god.cache.lack) { story.createLack(god); }
    var lack = god.cache.lack;

    var person = god.getCharacter(god.cache.lack.person);
    var name = (god.coinflip() ? person.nickname : person.name);
    // 'cept they could also be a relative.
    var friendof = (person.introduced ? '' : ', a friend of {{HN}},');
    person.introduced = true;


    var templates = [
      '{{HN}} discovers that ' + god.cache.lack.person.name + ' ' + god.cache.lack.lack
    ];

    text.push(god.pick(templates));

    return text.join('\n');

  };

  // Counteraction: hero chooses positive action
  // TODO: positiveaction()
  story['func10'].exec = function(god) {

    var text = [];

    var templates = [
      '{{HN}} chooses positive action.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };
  // Departure: hero leave on mission
  // TODO: journey() function
  // where is task created?
  // TODO: IT SHOULD BE IN HERE. maybe?
  story['func11'].templates.push('{{HN}} left <%= hero.location %> to <%= task %>.');

  // 3rd Sphere: The Donor Sequence
  // Testing: hero is challenged to prove heroic qualities
  story['func12'].exec = function(god, subfunc) {

    // "function 12: protagonist(s) tested, interogated, attacked, etc.
    // which prepares way for receiving magical agent or helper = first
    // function of donor (D)"

    var templates = [
      'D1 - donor tests protagonist(s)',
      'D2 - donor greets and interrogates protagonist(s)',
      'D3 - request of favor after death',
      'D4 - entreaty of prisoner for freedom,  or *D4 - entreaty of prisoner for freedom, with preliminary imprisonment',
      'D5 - request for mercy',
      'D6 - request for division, or d6 - argument without express request for division',
      'D7 - other requests, or *D7 - other requests, with preliminary helpless situation of person making request, or d7 - helpless situation of donor without stated request, possibility of rendering service',
      'D8 - attempt to destroy',
      'D9 - combat with hostile donor',
      'D10 - offer of magical agent as an exchange'];

    return '{{HN}} {{was}} challenged to prove business qualifications.';

  };
  // Reaction: hero responds to test
  story['func13'].exec = function(god, subFunc) {

    // 'function 13: protagonist(s) reacts to actions of future donor =
    // protagonist(s)'s reaction (E)'

    var templates = [
      'E1 - protagonist(s) withstands ordeal (or not)',
      'E2 - protagonist(s) answers greeting (or not)',
      'E3 - protagonist(s) renders service to dead person (or not)',
      'E4 - protagonist(s) frees of captive',
      'E5 - mercy to suppliant',
      'E6 - protagonist(s)completes apportinment and reconciles disputants, or Evi - protagonist(s) deceives disputants',
      'E7 - performance of some other service, fulfillment of request, pious deeds',
      'E8 - attempt at destruction averted by turnabout',
      'E9 - protagonist(s) vanquishes hostile donor (or not)',
      'E10 - deception in an exchange, protagonist(s) employs magical agent on donor'];

    return '{{HN}} {{responded}} to this test.';

  };

  //  Acquisition: hero gains magical item
  story['func14'].exec = function(god, item) {

    // 'function 14: protagonist(s) acquires use of magical agent = acquisition of magical agent (F)',


    var proppFunction14 = [
      'F1 - agent is directly transferred, or f1 - gift is of a material '
        + 'nature, or F- - agent is not transferred, or F= - protagonist(s)\'s '
        + 'negative reaction provokes cruel retribution',
      'F2 - agent is pointed out',
      'F3 - agent is prepared',
      'F4 - agent is sold and purchased, or F43 - agent is made on order',
      'F5 - agent is found by chance',
      'F6 - agent suddenly appears of its own accord, or Fvi - agent appears from out of earth',
      'F7 - agent is drunk or eaten',
      'F8 - agent is seized',
      'F9 - agent offers its services, places itself at someone\'s '
        + 'disposal, or f9 - agent indicates it will appear of its own accord '
        + 'in some time of need, or F96 - meeting with magical helper(s) who '
        + 'offers their services'
    ];

    var text = [];


    item = item || god.createMagicalitem();
    // but we never get rid of the previous item.....
    god.hero.possessions.push(item);

    if (!god.advisor.introduced) {
      text.push('{{HN}} {{MET}} {{AN}}.');
      text.push(god.converse(god.advisor, god.hero));
    } else {
      text.push('{{HN}} {{MET}} {{AN}} again.');
    }

    var hn = '<%= select(hero.name, hero.nickname) %>';
    var an = '<%= select(advisor.name, advisor.nickname) %>';
    var met = '<%= select("met", "encountered", "came across", "found", "was found by", "bumped into") %>';

    // TODO: make this into conversation with a goal?
    text.push('"Here," said {{AN}}, "you\'ll need this," and gave {{HN}} the {{IT}}.');
    text.push('"What\'s this?" asked {{HN}}.');
    // TODO: magical items will have propeties that can be enumerated, here....
    text.push('"What does it look like?" replied {{AN}}. "It\'s a special, magical {{IT}}. Perhaps you can use it in your struggle with {{VN}}."');
    if (god.coinflip()) {
      text.push('"Thanks!" said a <%= select("grateful", "thankful") %> {{HN}}'
                + (god.coinflip() ? god.select(' gratefully', ' thankfully') : '') + '.');
    }

    god.advisor.introduced = true;


    var para = text.join('\n\n').replace(/{{HN}}/g, hn).replace(/{{AN}}/g, an).replace(/{{IT}}/g, item).replace(/{{MET}}/g, met);

    return para;

  };

  // Guidance: hero reaches destination
  // TODO: destination is related to task
  story['func15'].exec = function(god, subFunc) {

    // function 15: protagonist(s) transferred, delivered or led to vicinity of object of search = transference, guidance (G)

    var templates = [
      'G1 - protagonist(s) flies thru air',
      'G2 - protagonist(s) travels on ground or water',
      'G3 - protagonist(s) is led',
      'G4 - route is shown to protagonist(s)',
      'G5 - protagonist(s) makes use of stationary means of communication (stairs, bridge, passageway. etc.)',
      'G6 - marked trail shows the way (blood, tracks, yarn, etc.)'
    ];

    return '{{HN}} reaches destination.';

  };

  // Struggle: hero and villain do battle
  // TODO: battle() function
  // TODO: _FOR MY PURPOSES_ combine the functions of 16 and 18, and put 17 in the middle as well (make it a parameter)
  // TODO: if villain and hero have not met, they must converse
  story['func16'].exec = function(god) {

    var text = [];

    var templates = [
      '{{HN}} and {{VN}} do battle.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');

  };

  // Branding: hero is branded
  // TODO: make this a function callable from 16/18
  story['func17'].exec = function(god) {

    // see http://tvtropes.org/pmwiki/pmwiki.php/Main/AcheyScars

    var proppFunction17 = ['function 17: protagonist(s) branded = branding (J)',
                           'J1 - application of mark to body of protagonist(s) (wound, brand)',
                           'J2 - transference of token (ring, towel, etc.)'];

    var text = [];

    var templates = [
      '{{HN}} is changed by the encounter.',
      '{{HN}} is scarred internally.',
      'This day would never be forgotten by {{HN}}.',
      '{{HN}} receives a stylish scarf as a souvenir of the encounter!',
      '{{VN}}\'s head pops off, and is scavenged by {{HN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };

  // Victory: Villain is defeated
  story['func18'].exec = function(god, item) {


    var proppFunction18 = ['function 18: antagonist(s) defeated = victory (I)',
                           'I1 - antagonist(s) defeated in open battle, or *I1 - antagonist(s) defeated by one protagonist(s) while the other(s) hide',
                           'I2 - antagonist(s) defeated in contest',
                           'I3 - antagonist(s) defeated at game of chance',
                           'I4 - antagonist(s) defeated in weighing with scales',
                           'I5 - protagonist(s) kills antagonist(s) without preliminary fight',
                           'I6 - direct expulsion of antagonist(s)'];


    // proof-of-concept YES, but doesn't use the magical item, above.
    // I guess that should be part of the punishment/defeat
    // optionally, LEVELS?
    // or maybe not...... punishments in these stories are often beyond the pale.....
    // t.push(story.punish(god, god.villain));

    // god.cache.villains = god.cache.villains || [];
    // god.cache.villains.push(god.villain);

    var text = [];

    item = item || god.createMagicalitem();
    god.hero.possessions.push(item);


    var templates = [
      'Through deft use of {{IT}}, {{VN}} is defeated.',
      '{{HN}} <%= select("deploys", "uses", "manipulates") %> {{IT}} to <%= select("defeat", "trounce", "vanquish", "annoy") %> {{VN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n').replace(/{{IT}}/g, item);


  };

  // Resolution: Initial misfortune or lack is resolved
  // pass in a param object, by name?
  story['func19'].exec = function(god, subFunc) {

    // function 19: initial misfortune or lack is liquidated = liquidation (K)

    var proppFunction19 = [
      'K1 - direct acquistion thru application of force or cunning, or Ki - direct acquistion thru application of force or cunning, with one person compelling another',
      'K2 - acquisition accomplished by several helpers at once',
      'K3 - acquisition achieved with help of an enticement or decoy(s)',
      'K4 - liquidation of misfortune as direct result of previous actions',
      'K5 - object of search attained instantly thru use of magical agent',
      'K6 - poverty done away with thru use of magical agent',
      'K7 - object of search captured',
      'K8 - breaking of spell on victim',
      'K9 - resuscitation of slain, or Kix - resuscitation, with preliminary obtaining of water of life',
      'K10 - release from captivity',
      'KF1 - liquidation in form F: object of search is transferred',
      'KF2 - liquidation in form F: object of search is pointed out',
      'KF3 - liquidation in form F: object of search is prepared',
      'KF4 - liquidation in form F: object of search is sold, purchased, or KF43 - liquidation in form F: object of search is made on order',
      'KF5 - liquidation in form F: object of search is found',
      'KF6 - liquidation in form F: object of search appears of its own accord, or KFvi - liquidation in form F: object of search appears from out of earth',
      'KF7 - liquidation in form F: object of search is drunk or eaten',
      'KF8 - liquidation in form F: object of search is seized',
      'KF9 - liquidation in form F: object of search offers its services, places itself at someone\'s disposal, or KF96 - liquidation in form F: object of search are helpers who offers their services'
    ];

    var text = [];

    var templates = [
      'Initial misfortune or lack is resolved.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };

  // 4th Sphere: The hero\'s return
  // In the final (and often optional) phase of the storyline, the hero returns home, hopefully uneventfully and to a hero\'s welcome, although this may not always be the case.

  // Return: hero sets out for home
  // TODO: how could I write something like hero.home.residence.possess and get "her home" or "his shed" ?
  story['func20'].exec = function(god) {

    var text = [];

    var tmpls = [
      '{{HN}} set out for <%= possessive(hero) %> <%= hero.home.residence %>.'
    ];

    text.push(god.pick(tmpls));

    return text.join('\n');

  };

  // Pursuit: hero is chased
  // TODO: character/thing that chases
  // TODO: chase() function
  story['func21'].exec = function(god, subFunc) {

    // function 21: protagonist(s) pursued = pursuit (Pr)

    var templates = [
      'Pr1 - antagonist(s) flies thru air',
      'Pr2 - antagonist(s) demands guilty person',
      'Pr3 - antagonist(s) pursues, accompanied by series of transformations into animals',
      'Pr4 - antagonist(s) pursues, with tranformations into enticing objects',
      'Pr5 - antagonist(s) attempts to devour protagonist(s)',
      'Pr6 - antagonist(s) attempts to destroy protagonist(s)',
      'Pr7 - antagonist(s) attempts to gnaw thru tree with protagonist(s) up in it'
    ];

    return '{{HN}} {{was}} chased.';

  };

  // Rescue: pursuit ends
  // TODO: template to end the above
  story['func22'].exec = function(god, subFunc) {

    // function 22: rescue of protagonist(s) from pursuit = rescue (Rs)

    var proppFunction22 = [
      'Rs1 - protagonist(s) carried thru air or runs quickly',
      'Rs2 - protagonist(s) places obstacles in path of pursuers [with transformation]',
      'Rs3 - fleeing, with transformation to escape recognition',
      'Rs4 - fleeing with concealment of escapee',
      'Rs5 - concealment of escapee by blacksmiths',
      'Rs6 - escapee goes thru series of transformations into animals, plants & stones',
      'Rs7 - warding off temptation of enticing object(s)',
      'Rs8 - rescue or salvation from being devoured',
      'Rs9 - rescue or salvation from being destroyed',
      'Rs10 - leap into another tree'
    ];

    return 'the pursuit ended.';

  };

  // Arrival: hero arrives unrecognized
  story['func23'].templates.push('{{HN}} arrived in <%= hero.home.vicinity %> but {{was}} unrecognized.');

  // Claim: False hero makes unfounded claims
  story['func24'].templates.push('<%= falsehero.name %> made unfounded claims.');

  // Task: Difficult task proposed to the hero
  story['func25'].exec = function(god, subFunc) {

    // function 25: difficult task proposed to protagonist(s) = difficult task (M)

    var proppFunction25 = [
      'M1 - ordeal by food and drink',
      'M2 - ordeal by fire',
      'M3 - riddle guessing',
      'M4 - ordeal of choice',
      'M5 - hide and seek',
      'M6 - test of strength',
      'M7 - test of adroitness',
      'M8 - test of fortitude',
      'M9 - test of endurance',
      'M10 - tasks of supply, or Mx - tasks of manufacture',
      'M11 - sorting tasks',
      'M12 - other tasks'
    ];

    return '<%= advisor.name %> charged {{HN}} to <%= task %>.';

  };

  // Solution: Task is resolved
  story['func26'].exec = function(god, subFunc) {

    // function 26: task resolved = solution (N)

    var proppFunction26 = [
      'N1 - food and drink consumed',
      'N2 - fire survived',
      'N3 - riddle guessed',
      'N4 - correct choice selected',
      'N5 - protagonist(s) not found',
      'N6 - test of strength passed',
      'N7 - test of adroitness passed',
      'N8 - test of fortitude passed',
      'N9 - test of endurance passed',
      'N10 - object(s) supplied, or Nx - object(s) manufactured',
      'N11 - sorting tasks completed',
      'N12 - other tasks completed'
    ];

    var templates = [
      '<%= task %> {{was}} completed.',
      '<%= task %> {{was}} completed by {{HN}}.',
      '{{HN}} finishes off <%= task %>.'
    ];

    return god.pick(templates);

  };

  // Recognition: hero is recognised
  story['func27'].exec = function(god, subFunc) {

    // function 27: protagonist(s) recognized = recognition (Q)

    var proppFunction27 = [
      'Q1 - recognition of protagonist(s) by mark on body',
      'Q2 - recognition of protagonist(s) by token',
      'Q3 - recognition of protagonist(s) by accomplishment of difficult task',
      'Q4 - recognition of protagonist(s) by family member'
    ];

    return '{{HN}} {{was}} recognized.';

  };

  // Exposure: False hero is exposed
  // So he regained his wife and went home with her. But as for the false wife, he took a gun and shot her.
  story['func28'].exec = function(god, subFunc) {

    // function 28: false protagonist(s) or antagonist(s) exposed = exposure (Ex)

    var proppFunction28 = [
      'Ex1 - exposure of false protagonist(s) or antagonist(s) by lack of mark on body',
      'Ex2 - exposure of false protagonist(s) or antagonist(s) by lack of token',
      'Ex3 - exposure of false protagonist(s) or antagonist(s) by failure to accomplish difficult task',
      'Ex4 - exposure of false protagonist(s) or antagonist(s) thru song / lament'
    ];

    return '<%= falsehero.name %> {{was}} exposed.';

  };

  // Transfiguration: hero is given a new appearance
  // TODO: character description, associated adjectives ???
  story['func29'].exec = function(god, subFunc) {

    // function 29: protagonist(s) given new appearance = transfiguration (T)

    var proppFunction29 = [
      'T1 - new physical appearance by magical action of helper',
      'T2 - protagonist(s) builds palace',
      'T3 - protagonist(s) puts on new garments',
      'T4 - humorous and rationalized forms, new appearance achieved by deception'
    ];

    return '{{HN}} {{was}} given a new appearance.';

  };

  // Punishment: Villain is punished
  story['func30'].exec = function(god, subFunc) {

    // function 30: false protagonist(s) or antagonist(s) punished = punishment (U)

    var proppFunction30 = [
      'U - punishment of false protagonist(s) or antagonist(s)',
      'U- - false protagonist(s) or antagonist(s) pardoned'
    ];

    // rules will tell us a bit about when this can be created or not
    // if villain is dead, it would have to be the false hero
    // if the false hero is dead... WELL I DO NOT KNOW
    // TODO: person = falsefriend or villain (or henchperson?)

    var text = [];

    var templates = [
      '{{VN}} is <%= punished() %> by {{HN}}.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');


  };

  // Wedding: hero marries and ascends the throne
  story['func31'].exec = function(god, subFunc) {

    // function 31: protagonist(s) marries and ascends throne = wedding (W)

    var proppFunction31 = [
      'W#* - protagonist(s) weds and ascends throne ',
      'W# - protagonist(s) weds',
      'W* - protagonist(s) ascends throne',
      'w1 - protagonist(s) promised marriage',
      'w2 - protagonist(s) resumes marriage',
      'wo - protagonist(s) given monetary reward or other forms of material gain'
    ];

    var text = [];

    var templates = [
      '{{HN}} <%= select(marriage, ascension) %>. It\'s a good life.',
      '{{HN}} <%= marriage %> and <%= ascension %>.',
      '{{HN}} settles down and <%= select(marriage, ascension) %>.',
      'Everything works out for {{HN}}, who <%= select(marriage, ascension) %>.'
    ];

    text.push(god.pick(templates));

    return text.join('\n');

  };

  // from person, separate out the living and the dead
  story.latd = function(person, god) {

    var dead = [];
    var living = [];
    var people = person.family;
    if (person.acquaintances) { people = people.concat(person.acquaintances); }
    for (var i = 0; i < people.length; i++) {
      var c = god.getCharacter(people[i]);
      var dora = (c.health == world.healthLevel.dead ? dead : living);
      dora.push(people[i]);
    }

    return {
      living: living,
      dead: dead
    };

  };

  story.outro = function(god) {

    // And then they went home, and there they lived and enjoyed themselves, feasting and revelling, and drinking mead and wine.
    // I was there, too, and had liquor to drink; it didn't go into my mouth, but only ran down my beard

    var templates = [
      'All of this took place long before your company was founded, so it\'s not surprising that you don\'t remember it. But it happened, and it is still taught in business school.',
      'This may sound fantastic, but the laws were different in those days, and it all happened exactly as I have told you.',
      'Whether you believe it or not, this is what happened, for what I tell you can be found in the document library.'
    ];

    var hero = god.hero;
    var ld = story.latd(hero, god);
    var narr = god.cache.narrator || null;

    var t = [];
    // this could get convoluted (Which is good!) "and I tell you this story as you can tell your children"
    // 'and I tell you this story as I told your mother  [or father] and her mother before her' [or father as the case may be].

    if (narr || (god.coinflip(0.2) && ld.living.length > 0)) {
      var name = god.select('name', 'nickname');
      narr = (narr ? narr.name : god.getCharacter(god.pick(ld.living))[name]);
      t.push((god.coinflip() ? 'This may sound fantastic, but ' : '') + 'in all the world there is nothing stranger than the truth, and it all happened exactly as I have told you, for I was there as an auditor, as sure as my name is ' + narr + '.');
    } else {
      t.push(god.pick(templates));
    }

    return t.join('\n');

  };

  return story;

};


var module = module || {};
module.exports = businessTemplates;
