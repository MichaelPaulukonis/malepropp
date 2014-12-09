var businessbank = {};

// need a home
businessbank.residence = ['office', 'conference room', 'table', 'desk'];

// the vicinity of the home
businessbank.location = ['first floor', 'second floor', 'third floor', 'tenth floor', 'penthouse', 'executive row'];

// this should more be country. 'Nation' is short-hand.
businessbank.nation = ['Acme Corporation', 'Goliath National Bank', 'a large office building', 'another office building'];

businessbank.magicalitem = ['a red stapler', 'a new laptop', 'washroom key', 'potted plant', 'confidential memo', 'financial report'];

businessbank.task = ['increase revenue', 'enlarge market share', 'postpone the drawdowns', 'cook the books', 'delay the auditors'];

businessbank.punish = ['fired', 'demoted', 'sent to the mailroom'];

businessbank.ascension = ['is made king', 'becomes a god', 'becomes filled with knowledge'];
businessbank.ascension = ['is made CEO', 'is made CFO', 'is given a corner office', 'becomes chair of the board', 'gets keys to the executive washroom'];

businessbank.marries = ['marries', 'is given keys to the city', 'has parking tickets forgiven', 'dates for a few years, but decides to remain single' ];
businessbank.marries = ['is promoted', 'has parking tickets forgiven', 'works hard for a few years, then decides that consulting is the right career move', 'given a reserved parking space'];

businessbank.names = {

    male: ['Baitogogo', 'Jaffar', 'Tyrion Lannister', 'PeeWee Herman', 'Santa Claus',
           'Jolly Green Giant', 'Stay-Puft Marshmallow Man', 'Jacob',
           'Michael', 'Joshua', 'Matthew', 'Daniel', 'Christopher',
           'Andrew', 'Ethan', 'Joseph', 'William', 'Anthony', 'David',
           'Alexander', 'Nicholas', 'Ryan', 'Tyler', 'James', 'John',
           'Jonathan', 'Noah', 'Brandon', 'Christian', 'Dylan', 'Samuel',
           'Benjamin', 'Nathan'],

    female: ['Brienne of Tarth', 'Joan of Arc', 'Holly Shiftwell',
             'Lauren', 'Chloe', 'Natalie', 'Kayla', 'Jessica', 'Anna',
             'Victoria', 'Mia', 'Hailey', 'Sydney', 'Jasmine', 'Julia',
             'Morgan', 'Destiny', 'Rachel', 'Ella', 'Kaitlyn', 'Megan',
             'Katherine', 'Savannah', 'Jennifer', 'Alexandra', 'Allison',
             'Haley', 'Maria', 'Kaylee', 'Lily', 'Makayla'],

    // could also be "unisex"
    // see also http://en.wikipedia.org/wiki/Unisex_name
    neuter: [
        'the Easter Bunny',
        'TIAMAT',
        'the Spirit of 1776',
        'DEATH',
        'Pat',
        'Chris',
        'Leslie',
        'Alexis',
        'Amari',
        'Angel',
        'Ariel',
        'Armani',
        'Avery',
        'Blake',
        'Cameron',
        'Camryn',
        'Carter',
        'Casey',
        'Charlie',
        'Dakota',
        'Dallas',
        'Dylan',
        'Eden',
        'Elliot',
        'Elliott',
        'Emerson',
        'Emery',
        'Emory',
        'Finley',
        'Harley',
        'Harper',
        'Hayden',
        'Hunter',
        'Jamie',
        'Jayden',
        'Jaylin',
        'Jessie',
        'Jordan',
        'Jordyn',
        'Justice',
        'Kai',
        'Kamryn',
        'Kayden',
        'Kendall',
        'Lennon',
        'Logan',
        'London',
        'Lyric',
        'Marley',
        'Micah',
        'Milan',
        'Morgan',
        'Oakley',
        'Parker',
        'Payton',
        'Peyton',
        'Phoenix',
        'Quinn',
        'Reagan',
        'Reese',
        'Riley',
        'River',
        'Rory',
        'Rowan',
        'Ryan',
        'Rylan',
        'Rylee',
        'Sage',
        'Sawyer',
        'Sidney',
        'Skylar',
        'Skyler',
        'Sydney',
        'Tatum',
        'Taylor',
        'Teagan',
        'Zion'
    ]

};

// magical science items
// are there going to be categories?
// based on list from
// http://webcache.googleusercontent.com/search?q=cache:hHHDD1u3puMJ:www.ironwolfgames.com/2011/09/17/fun-with-science-fiction-buzzwords/&client=firefox-a&hl=en&gl=us&strip=1
businessbank.itembank = {

    adjectives: [
        'actionable',
        'value-added',
        'silver-bullet',
        'core competency',
        'alternate',
        'automatic',
        'auxiliary',
        'bespoke',
        'best-of-breed',
        'confidential',
        'dynamic',
        'executive',
        'external',
        'freelance',
        'greenfield',
        'infinite',
        'innovative',
        'internal',
        'organized',
        'pre-approved',
        'phase',
        'primary',
        'static',
        'secret'
        , 'unlimited'
    ],

    nouns: [
        'report',
        'briefcase',
        'review',
        'summary',
        'office',
        'desk',
        'memo',
        'summary'
    ]
};



businessbank.itemGenerator = function() {

    return storyGen.itemGenerator(businessbank.itembank);

};
