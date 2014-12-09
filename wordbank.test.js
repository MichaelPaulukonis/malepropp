var defaultbank = function(words) {


    // should probably include a description and a few adjectives and other properties
    // let's save that for later.
    var fantasticForm = ['bear', 'squirrel', 'cloud', 'swarm of ants', 'dragon', 'snake', 'serpent', 'eagle', 'hawk', 'rabbit', 'lion', 'fish', 'bat', 'wolf', 'dog', 'boar', 'pig', 'spider', 'griffin', 'harpy', 'jackal', 'demon'];

    var color = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

    // the specific location, like "home" or "office"
    var residence = ['grass hut', 'small house', 'barn', 'hovel', 'stately manor', 'decayed mansion', 'shack', 'shed', 'house'];

    // the vicinity of the home
    // the ones with articles are problematic:

    // Natural Kayla lived in a small house not far from _a_ small village in the kingdom Talexico.
    // [....]
    // Jasmine paid a visit to _a_ small village.

    // how can we refer to them definitively?
    // this has to be an object, I guess, with some sort of indicator
    // oh. an un-named place is first "a", then "the" ???
    // every place should have a name, though.
    // so, let's codify this.....
    var location = ['Hobbiton', 'New Haven', 'East Lansing', 'Madchester', 'Oblivion', 'a valley', 'a small village', 'a lonely intersection', 'Volochok', 'Orekhovo-Zuyevo', 'Krasnogorsk', 'Leninsk-Kuznetsky', 'Vyshny Volochyok', 'Belorechensk', 'Dubna', 'Zheleznodorozhny' ];

    // this should more be country. 'Nation' is short-hand.
    var nation = ['the Monastic State of the Teutonic Knights', 'Prussia', 'East Germany', 'Middle Earth', 'Orange County', 'Northern California', 'Talexico', 'Russia', 'the Ukraine', 'Lithuania', 'Finland' ,'Siberia', 'Karachay-Cherkess Republic', 'Stavropol Krai', 'Chelyabinsk Oblast', 'Yamalo-Nenets Autonomous Okrug', 'Nizhny Novgorod Oblast' ];

    // not sure how to handle punctuation
    // put it in here?
    var greetings = {
        good: ['Hello,', 'Hello there,', 'Hail and well met,', 'Greetings,', 'Ahoy!', 'Salutations!', 'Welcome,', 'Well, look who this is, it\'s', 'Nice to meet you', 'Gods be with you', 'God be with you'],
        bad: ['Oh.', 'Oh, it\'s you,', 'Oh, hello,', 'Oh, dear.', 'Ugh. It\s', 'Well, look who this is:', 'I\'ll see you in Hell,']
    };

    // TODO: things must also have properties
    // this is a proposal...
    // var thing = {
    //     item: 'egg', // name could be "Egg of Death" or "Death Egg" or "Primordial Magic Death Egg of the Borderlands" or something telse
    //     //
    //     name: 'Magical Egg of the Wong Foo the Elder',
    //     description: ['shiny', 'round', 'egg-shaped', 'magical', 'filigreed', 'expensive'],
    //     weapon: true, // or false
    //     magic: true, // or false
    //     // special powers? how would THAT work ????
    //     origin: {
    //         // if a person gave the object, or it was found ?
    //         person: null,
    //         place: null
    //     }
    // };

    var magicalitem = ['Singing Telegram', 'Singing Sword', 'Magic Accordion', 'pair of Air Jordans', 'Mad Skillz', '#SWAG'];

    // some can be premade; goal is to have a generator make things "like" this...
    var magicalitems = [
        {
            item: 'Singing Telegram',
            name: 'Singing Telegram of the Unione Occidentem',
            adjectives: ['papery', 'flat', 'sonorous', 'melodious', 'powerful', 'esoteric'],
            weapon: true,
            magic: true
        },
        {
            item: 'Singing Sword',
            name: 'Bing\s Singing Sword',
            adjectives: ['metallic', 'sharp', 'pointy', 'musical', 'melodious', 'powerful'],
            weapon: true,
            magic: true
        },
        {
            item: 'Magic Accordion',
            name: 'Benedetto\'s Magic Accordion',
            adjectives: ['clackity', 'reedy', 'angular', 'musical', 'melodious', 'powerful', 'esoteric', 'polkariffic'],
            weapon: true,
            magic: true
        }
        // TODO: 'pair of Air Jordans', 'Mad Skillz', '#SWAG'
    ];

    // "attend a dance"
    // "break a curse"
    // "defeat a giant"
    // "defeat a tyrant"
    // "save a prince"
    // "save a princess"
    // "slay a monster"
    // "escape an abusive parent"
    // "evade an unwanted lover"
    // "find a magic mirror"
    // "find a magic ring"
    // "outwit a faerie"
    // "outwit a witch"
    // "return home"
    // "solve a mystery"
    // "solve three riddles"
    // "overcome three challenges"
    var task = ['walk the dog', 'retrieve the Crown Jewels', 'find a hammer', 'cut down the tallest tree in the forest with a herring'];

    var punish = ['brought to justice', 'hung, drawn, and quartered', 'given a tongue-lashing'];

    // TODO: more codishness? if kingdom is involved, king plus marriage plus banquet, &c. several such things
    // or find a better way to spin out text from a small premise (HAH HAH HAH)
    // these are passive
    var ascension = ['{{is}} made king', '{{becomes}} a god', '{{becomes}} filled with knowledge', '{{is}} given keys to the city', '{{has}} parking tickets forgiven' ];

    var marries = ['{{marry}}', '{{dates}} for a few years, but {{decides}} to remain single' ];

    // TODO: this is a global reference, not passed in
    // AND OS IT FAILS IN NODE.JS
    var adjectives = words.adjectives;
    var interjections = words.interjections;

    var names = {

        male: ['Baitogogo', 'Jaffar', 'Tyrion Lannister', 'PeeWee Herman', 'Santa Claus',
	       'Jolly Green Giant', 'Stay-Puft Marshmallow Man', 'Jacob',
	       'Michael', 'Joshua', 'Matthew', 'Daniel', 'Christopher',
	       'Andrew', 'Ethan', 'Joseph', 'William', 'Anthony', 'David',
	       'Alexander', 'Nicholas', 'Ryan', 'Tyler', 'James', 'John',
	       'Jonathan', 'Noah', 'Brandon', 'Christian', 'Dylan', 'Samuel',
	       'Benjamin', 'Nathan'],

        female: ['Brienne of Tarth', 'Joan of Arc', 'Holly Shiftwell',
                 'Lauren', 'Chloe', 'Natalie', 'Kayla', 'Jessica', 'Anna',
                 'Victoria', 'Mia', 'Hailey', 'Sydney', 'Jasmine',
                 'Julia', 'Morgan', 'Destiny', 'Rachel', 'Ella',
                 'Kaitlyn', 'Megan', 'Katherine', 'Savannah', 'Jennifer',
                 'Alexandra', 'Allison', 'Haley', 'Maria', 'Kaylee',
                 'Lily', 'Makayla'],

        // could also be "unisex"
        // see also http://en.wikipedia.org/wiki/Unisex_name
        neuter: [ 'the Easter Bunny', 'TIAMAT', 'the Spirit of 1776',
                  'DEATH', 'Pat', 'Chris', 'Leslie', 'Alexis', 'Amari', 'Angel',
                  'Ariel', 'Armani', 'Avery', 'Blake', 'Cameron', 'Camryn',
                  'Carter', 'Casey', 'Charlie', 'Dakota', 'Dallas', 'Dylan', 'Eden',
                  'Elliot', 'Elliott', 'Emerson', 'Emery', 'Emory', 'Finley',
                  'Harley', 'Harper', 'Hayden', 'Hunter', 'Jamie', 'Jayden',
                  'Jaylin', 'Jessie', 'Jordan', 'Jordyn', 'Justice', 'Kai',
                  'Kamryn', 'Kayden', 'Kendall', 'Lennon', 'Logan', 'London',
                  'Lyric', 'Marley', 'Micah', 'Milan', 'Morgan', 'Oakley', 'Parker',
                  'Payton', 'Peyton', 'Phoenix', 'Quinn', 'Reagan', 'Reese',
                  'Riley', 'River', 'Rory', 'Rowan', 'Ryan', 'Rylan', 'Rylee',
                  'Sage', 'Sawyer', 'Sidney', 'Skylar', 'Skyler', 'Sydney', 'Tatum',
                  'Taylor', 'Teagan', 'Zion' ]
    };

    // magical science items
    // are there going to be categories?
    // based on list from
    // http://webcache.googleusercontent.com/search?q=cache:hHHDD1u3puMJ:www.ironwolfgames.com/2011/09/17/fun-with-science-fiction-buzzwords/&client=firefox-a&hl=en&gl=us&strip=1
    var itembank = {
        adjectives: [
            'auxiliary', 'alternate',
            'automatic', 'dynamic', 'electron', 'external', 'finite',
            'humanoid', 'infinite', 'internal', 'kinetic', 'linear',
            'multi-phase', 'neural', 'organic', 'phase', 'pneumatic',
            'positron', 'primary', 'quantum', 'static', 'sub-light',
            'sub-space', 'temporal' ],

        nouns: [
            'amplitude', 'buffer',
            'conduit', 'coordinates', 'core', 'data', 'deflector', 'drive',
            'emitter', 'event horizon', 'field', 'fluctuation', 'generator',
            'hull integrity', 'matrix', 'parameter', 'particle', 'plasma',
            'relay', 'rift', 'rupture', 'shield', 'singularity', 'system',
            'theory' ]
    };


    return {

        adjectives: adjectives,
        ascension: ascension,
        fantasticForm: fantasticForm,
        greetings: greetings,
        interjections: interjections,
        itembank: itembank,
        location: location,
        magicalitem: magicalitem,
        magicalitems: magicalitems,
        marries: marries,
        names: names,
        nation: nation,
        punish: punish,
        residence: residence,
        task: task

    };

};

module = module || {};
module.exports = defaultbank;
