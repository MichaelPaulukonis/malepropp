// based on code found @ https://web.archive.org/web/20061112014356/http://www.brown.edu/Courses/FR0133/Fairytale_Generator/gen.html
//
//  PROPPIAN FAIRY TALE GENERATOR v1.0
//
//  Generator script: Nicole Wee
//  Fairy tale content: Laura Tan & Celeste Lim
//  Authored: April, 2001 for
//            FR133: Fairy Tales and Culture
//            Prof. Lewis Seifert
//            Brown University
//
//  for more information contact: fgen@brown.edu
//  https://web.archive.org/web/20061112014356/http://www.brown.edu/Courses/FR0133/Fairytale_Generator


var defaultTemplates = function(propp) {

    // Proppian-function templates

    propp['func0'].templates.push('');

    // Absentation: Someone goes missing
    propp["func1"].templates.push("It is said in the place where I live the soil is made of our people.  People who toiled, sweat, cried, and screamed all bled into the ground and made us who we are today.");
    propp["func1"].templates.push("In the place where I live people wear soft leather bottomed shoes to glide over soil.  Our feet do not make a sound.  We show respect to those who fell to the floor during the wars of our times. ");
    propp["func1"].templates.push("In the place where I live it is said that if someone does not wear these shoes, those who fell into the ground will take you down with them, and you, too, will become a part of the land's history.");
    propp["func1"].templates.push("This is no lie.  I saw my father fall down before my eyes and watched, as the ground swallowed his clickitey-clackitey loud feet.  The ground swallowed him whole.");
    propp["func1"].templates.push("I left the house the day when mother the glutton ravished the last bean sprouts and apples left in the garden.  With no food left to eat and no responsible adult left to care I sought a cure for either problem, promising mother to return as soon as a remedy was procured.");
    propp["func1"].templates.push("In the bowels of the valleys where I live the smell of anger comes in bouts.  The smell rides down from the mountain sides on great horses wearing heavy armor and large blades; the smell drives at us with the sound of hooves pounding on soft valley soil. My father could scent this smell twenty-four hours before it came, but when he was hungry for something angry, to him the smell of war was everywhere.   The day he left to find the source of the scent was the day he left me all alone.");
    propp["func1"].templates.push("The day my father left home, the wind blew hard through the mountains and trees surrounding our village, filling our ears with its harsh whispers and our lungs with the breath of faraway places.  There are legends among my people of deceitful creatures in the mountains who blow winds of tempta over the surrounding lands when they are hungry and crave another victim.  The day my father left us, I stood in the doorway and watched him walk away, his leather-bottomed shoes carrying him farther and farther away.  I called to my father, hoping he would turn around and come back, but the wind swelled at that moment, snatching his name from my lips and whisking my hope away in one blow. ");
    propp["func1"].templates.push("He left in the night without saying good-bye.  It was the night a thousand ghosts whispered in the wind, and the trees rustled and shook outside our small wooden house.  On that night, I knelt and prayed before I climbed into bed.  I fell asleep wishing the ghosts would tire and the trees would stiffen, wishing the night would let me rest.  I awoke with the sun the next morning, happy for a new day.  I awoke, hearing my mother's sobbing.  Sobbing.  For, on that night of a thousand ghosts, my father had fallen into a slumber from which he would never awaken. ");
    propp["func1"].templates.push("Whenever the earth tremors or shakes, the old women in our village say that the souls of the dead buried beneath our feet are at war. 'Our ancestors died with sins in their hearts and grudges on their souls,' the old women claim.  'They were not at peace with the world when they entered the ground.  They shiver and shake in their graves, wanting to rid their souls of life's filth.'  The old women spoke to us children, and I believed their words, I believed that when the ground rumbled, the dead were struggling to clean their souls. After my mother died and was placed in the earth, I learned to step lightly, to move without making a sound.  I wanted my mother to rest, not to be awakened by the weight of and crushed by the weight of this world. ");
    propp["func1"].templates.push("The village people buried my father in a plot of land near our home.  Every night following his death, I prayed for rain.  I prayed that water from the heavens would soak the ground under which my father lay, so that his soul would not thirst as it had during his life.  I prayed the rain would cleanse my father's soul, and leave him to rest in peace. ");

    // Interdiction: hero is warned
    propp["func2"].templates.push("Sometimes when I looked into the soil I could feel father calling back out to me.  'Never leave without your leather-bottom shoes on,' he used to say to me.  'Never ever.'");
    propp["func2"].templates.push("'Precocious little boy,' mother called me.  She told me that if I were to ever follow father into the mountain mists I would lose myself forever. ");
    propp["func2"].templates.push("One last pear hung precariously from a tree growing on the other side of the fence.  It glowed like it was golden, and I could close my eyes and imagine the succulent juices falling down the back of my throat.  Pear juice.  An extravagance I could only dream about.  But the more I dreamt of this luxury the louder I heard my husband's voice cry out 'No, No,' and I would fall in the misery of my discontent.");
    propp["func2"].templates.push("Something inside told me never to venture farther than the fog allowed because I could never smell danger like my father could.");
    propp["func2"].templates.push("My father warned me never to enter the woods alone. ");
    propp["func2"].templates.push("There is a place in the mountains where they say one can stay and never go hungry.  There, they say, the rocks turn into meat upon contact, the trees yield bread soft, warm breads, and flowers bloom sweet candies.  My mother will not hear talk of this dream place at home.  'That is the place of the devil,' she says, and the look in her eyes tells me seeking this forbidden land will lead to a fate a thousand times worse than hunger. ");
    propp["func2"].templates.push("'To follow that path into the mountains is to walk into the hands of death.'  Day and night, my mother warns me.  She is afraid I will follow my brother who went to the mountains seeking a better life and never returned. ");
    propp["func2"].templates.push("The woman placed a smooth, black stone in my hand and moved my fingers to clasp it.  She told me that the stone would protect me, and warned me never to enter the woods without first securing it in my hand. ");
    propp["func2"].templates.push("The wind blew urgent whispers in my ears: 'Do not walk farther.  Turn around,' it whispered, 'turn around.' ");
    propp["func2"].templates.push("His watery eyes shone fiercely, his wrinkled mouth opened to reveal the series of gaps and crooked stained stones that were his teeth.  'Children who enter these woods never return,' he cackled, pointing a bony finger towards the dark trees. ");

    // Violation of Interdiction
    propp["func3"].templates.push("I forget sometimes what people tell me to do or not do.  What they tell me slips away into the backwaters of my memory where it drowns in all other memories forgotten.  ");
    propp["func3"].templates.push("I stepped outside with father's boots on, feeling the heaviness of his feet in mine. The people in my country's soil then clawed into his boots and pulled me down until I could no longer breathe in anything but dense thick soil and earthworm particles traveling into my mouth.  The spirits of my land traveled through me as well.  They drifted in and out of my body, trading places and laughing, laughing at me and my sad predicament.");
    propp["func3"].templates.push("I sometimes forget what people tell me to do or not do because my mouth, salivating and unruly, thinks for me.  So I did what I was not supposed to do.  I ate the last bit of food. And when I finished the little morsels left on my hands and mouth burned into my skin to render me shamed forever.");
    propp["func3"].templates.push("I could not stay like I promised, so I took father's satchel hidden underneath his bed and followed the smell of him.  If I could not smell anger, I could at least smell my father, wandering the valley bloodthirsty and violent.  In the search for my father, I found someone else.  Another man, smelling for something angry, with only one eye and a tangling beard.  He was distinctly foreign. ");
    propp["func3"].templates.push("That sweltering afternoon day I opened the trunk my grandmother forbade me to open.  Inside were a pair of leather bottomed shoes, a cap, and an empty canvas bag.  ");

    // Reconnaissance: Villain seeks something
    propp["func4"].templates.push("'How did you get here?' the man asked.");
    propp["func4"].templates.push("'Where did you get those shoes?' he asked me.");
    propp["func4"].templates.push("Suddenly all the people of the land appeared before me in spirit form.  They shouted, 'Where are you going to?' howled 'Where are you coming from?' and voraciously attacked me with their voiceless screams.  'Why are you here?  How do you get up there?'  ");
    propp["func4"].templates.push("A serpent in the stream asked me, 'What do you have in your bag?'");
    propp["func4"].templates.push("A child playing in the dirt asked me, 'Where did you get your shoes?'");
    propp["func4"].templates.push("She stood tall and menacing in her fire-infused robes.  'Where are you from,' her tongue flickered when she spoke, 'and where do you think you are going?' ");
    propp["func4"].templates.push("He grabbed the stone from my hand and began to inquire about its origin. ");
    propp["func4"].templates.push("'Tell me what it is you have come here seeking,' he growled through clenched teeth. ");
    propp["func4"].templates.push("'Why do the birds obey you while they only answer stupidly to my calls?' he asked. ");

    // Delivery: The villain gains information
    propp["func5"].templates.push("I told him I got them from my father.");
    propp["func5"].templates.push("I told them my grandmother left them for me.");
    propp["func5"].templates.push("I told them that the good graces gave me whatever I had.");
    propp["func5"].templates.push("I told a million answers to their biting quess to silence them.");
    propp["func5"].templates.push("'I can go anywhere I want to with a turn of this ring,' I boasted to the group of asinine country men.");

    // Trickery: Villain attempts to deceive victim.
    propp["func6"].templates.push("One of them who came forward looked nothing like the others.  She was dressed in white fluff and smelled clean.  Her eyes were like a child's.  'I'm in need of assistance,' she said softly.  'I need some help and I think you can help me.'");
    propp["func6"].templates.push("When I turned around seeking an open pathway, I was surprised to find that the stream surrounded me on all sides.  The serpent from across the way beckoned me with his tongue, unfurling it out over the water.  The tongue almost touched my shoes  'If you need to get across, walk over on this.  But please walk gently, for if you don't you may slide and fall off, and no one will ever find you again.'");
    propp["func6"].templates.push("The man smelled my skin and laughed. 'You smell like fresh meat,' he said.  'You smell like you expect to be killed and eaten alive.  What kind of boy would run around this fog like that?'");
    propp["func6"].templates.push("I told him I was only a callow youth with two foolish feet.  'I'm old and half blind, and couldn't care for eating the likes of you.  But in exchange for your shoes and satchel I'll tell you how to avoid the people who smell the anger running down the mountainside.  Didn't your father tell you?  The people who run down the mountain to the valley only come to eat youths with foolish feet like your own.'");
    propp["func6"].templates.push("One man stumbled towards me as if under a drunken afternoon spell.  His mouth hung open, saliva pouring down.  When he came beside me he spat into both my eyes and I screamed, falling to the grass beneath my feet.  I saw black and smelled drool and could not open my eyes. ");
    propp["func6"].templates.push("'Sugar and spice,' the old woman beckoned as she held out palms filled with cinnamon falling between her fingers like sand.  As she sprinkled it across the floor my head swum up in a dizzy spell of hunger.  I could no longer control my feet moving towards the cheap gimmicks of an old woman. ");

    // Complicity: Unwitting helping of the enemy
    propp["func7"].templates.push("I gave him my satchel and shoes as he asked me, then I shed my clothes as he advised me to do. 'Wear this,' he said, and he shed his own skin.  It fell off in a pile on the soil floor looking like a tablecloth used in my home.  When I clothed myself in his skin I no longer smelled like my home or the valley.  Instead I became like the men on the mountain.  I smelled distinctly foreign.   I thanked the man and watched as he dressed himself in my own clothes.  He said he would wear them until new skin grew on his back.");
    propp["func7"].templates.push("All of the people's voices came prying into me, digging through the hairs of my scalp to find answers to their quess.  They sifted through my body like water sifts through rice.  I felt their presence probing through the deep recesses of my head until they discovered what they longed to know. I told them how I was searching for my father.  I told them that his shoes brought me here.  I told them about his satchel and the magic that was inside.  That magic would take me back home whenever I needed to leave.  ");
    propp["func7"].templates.push("'What weighs you down will make you drown,' he said with a loud crescent shaped grin.  I believed him.  I may have been a fool but with my head thrown asunder by the crashing tides of water I took off my shoes and bag and threw them across the stream on the other bank.");

    // 2nd Sphere: The Body of the story
    // 8A - Villainy: The need is identified (Villainy)
    // function 8 (and/or 8a) is always present in tale
    // antagonist(s) causes harm or injury to victim(s)/member of protagonist's family = villainy - A    propp["func8"].templates.push("The girl knelt down at my feet, pressing her furry costume against my skin.  'Please help me,' she said, and kissed one foot.  She kissed the other.  And when I looked down I found both the leather-bottomed shoes gone and bare toes remaining.  They froze in the mountain wind.  At my feet a white wolf with childlike eyes stared up at me, grinned, and ran off with two shoes in her jaws.");
    propp["func8"].templates.push("From the corner of my eye, I saw the man from the mountain open his razored jaw and draw a poisoned needle from underneath his tongue.  I watched the needle fly from his finger through my father's ear and out the other, turning all his fluids into ones of pure jade and stone.  Then the foreigner strapped my jaded father to his back and continued to ride into forbidding wastelands.");
    propp["func8"].templates.push("As the cinnamon fell on my eyelids I felt a burden shift onto my shoulders.  I could not open my eyes but could tell my knees were sunk halfway into the weak soil.  I heard the old woman exhaust her laughter into my ears, filling them with tones of mockery and deceit.");
    propp["func8"].templates.push("Under my feet I felt the rhythm of aches and sighs breathe with each step I took.  I felt like I was walking on quicksand.  And indeed, when I tried to move my feet I could not feel my toes but only the inability to move them on the surface of palpable danger.  When I turned to ask for his help he only laughed.  Then I began to think it was he who was making my feet turn to stone.");
    propp["func8"].templates.push("The men of the earth hungered for my people's flesh.  If I did not provide them with a sacrifice to abate their sorrows, they would take my body and walk amongst my people like one of the undead.  They would find ways to sip their lives into their own empty souls.");

    //  8a - Lack: The need is identified (Lack)
    // function 8a: one member of family lacks/desires something = lack - a
    propp["func8a"].templates.push("Inside my head lived a frightened little boy who nibbled at his nails whenever a strange man glanced at him.  I could not leave that fright alone.");
    propp["func8a"].templates.push("Without my father I stood on two rotten feet inundated with fear.");
    propp["func8a"].templates.push("My ring and shoes vanished under the guise of morning.");
    propp["func8a"].templates.push("While I stood and shook I prayed for the knowledge to come and fill that part of my head that knew and understood nothing of this world.");
    propp["func8a"].templates.push("There was a hopelessness that permeated my world, emanating from my skin, soaking into all my organs.  My stomach no longer bothered to call atten to itself.  Instead, it swallowed its growls, seeking nourishment in emptiness.");

    // Mediation: hero discovers the lack
    propp["func9"].templates.push("From the mountainside I watched a giant crane fly down beside me and place two of its feathers onto my feet for flight. ");
    propp["func9"].templates.push("The animal's footsteps still laid deep in the soil after the morning's dew.  I thought of following them, and my shoes, and anything else the animal had taken with her.");
    propp["func9"].templates.push("My mother bade me to return home twice to comfort her hunger.  But on the third time the hunger sunk such a pit in her stomach that it fell into the ground and would not move.  ");
    propp["func9"].templates.push("The man beside me glanced at me with his only eye.  'You boy, you go.  I can see inside of you with this eye of mine and you are good.  Listen to me.  Leave the mountain far behind you because those who killed your father want to hurt you too.'");

    // Counteraction: hero chooses positive action
    propp["func10"].templates.push("'Let me go to find what I seek,' I said.  ");
    propp["func10"].templates.push("'Let me go then,' I said.  ");

    // Departure: hero leave on mission
    propp["func11"].templates.push("I felt my legs lift from the ground and follow the white bird's path that trailed along the movements of air. ");
    propp["func11"].templates.push("I left with these things, the only things left in a house barren.  I left wearing the leather-bottomed shoes grandmother blessed before she died. I left mother nibbling on her fingers in want of food. ");
    propp["func11"].templates.push("I never strayed too far from home because the thought of father returning home always came back to me.  But when air blew away the last remnant of his scent I knew he would not return.  So I set out, again, watching my mother's stomach sink into the floor.  I did not turn my head as I heard the people pull her into the ground.");
    propp["func11"].templates.push("I fled, I fled so fast that my feet did not feel the ground.  Instead they chafed the cold breeze as my heels vibrated like wings of locusts and dragonflies.  ");
    propp["func11"].templates.push("I told myself not to look back, don't look back.  I looked down at my feet and watched them as they carried me away, slowly, slowly, farther and farther away from my home.  They trudged onward like the two front paws of a sad, whimpering puppy who's been left in the cold for a night.  I did not turn back once, I kept my head forward, my eyes down, knowing my journey away from home had begun.");
    propp["func11"].templates.push("I had no choice but to leave.  Out, away from home was the only place I could go.  The wind rustled the walls of our wooden shack, but neither my father nor my mother stirred from their deep slumbers.  I put only a small piece of bread and a snippet of dried meat in my satchel, fastened my shoes, and quietly walked out of my home, our small wooden home, into the wind and fog that enveloped me into the night.");
    propp["func11"].templates.push("The sun shone bright on my upturned face.  My eyelids closed, my mouth smiling, I let the heat seep into my every pore.  Walking towards the sun, away from my house, I couldn't feel happier.");
    propp["func11"].templates.push("I left my home and family to find and entered the woods.  I walked deeper and deeper into the world of trees that reached the sky and damp earth that smelled of life, into a world I had always been warned not to enter.  The day I left my home, I could sense the adventure that lay ahead.  Armed with nothing but courage in my chest and good sense on my shoulders, I let my feet lead me into the great unknown.");
    propp["func11"].templates.push("There was nothing to pack into my satchel but a stale crust of bread, which I grabbed and ate on my way out of the door.  I was finally leaving our old wooden house, the house in which my father had breathed his last, the house I shared with my empty shell of a mother, the house where my only joy was my friendship with the fat gray pigeon that visited our home's single window daily.");

    // Testing: hero is challenged to prove heroic qualities
    propp["func12"].templates.push("A woman from the mountain dressed in dragon scales walked down towards me. Her feet were as bare as mine but that did not seem to matter, because wherever she stepped her feet did not make a sound.  'I hear of a man who can perform miracles.  He walks across the soil without danger and carries with him his father's ring.  Are you this man?'");
    propp["func12"].templates.push("A woman with childlike eyes appeared before me.  She looked very much like a girl I had seen before but older, and instead of crow black hair she had white hair like snow.  'You there, come here.  Please help me.'  I shyed away from her calls.  'No, please, you don't understand.  My sister is caught in a huntsman's trap and I need someone to help release her.'  I looked at where she pointed and indeed, there was the girl in wolf form hanging dangerously under a poisoned needle.");
    propp["func12"].templates.push("When I walked far enough I saw my father's body lying in the field of haze.  In the side of his neck he wore a needle five inches long and three hairs thick.  But before the final breaths left his throat he said, 'Promise me, promise that you will take my bones and find them a good place to rest.'  I promised this as his eyes shut for their last slumber.");
    propp["func12"].templates.push("The white bird in the sky asked me if I could pull out the needle that rendered its foot into a half-crescent shape.");
    propp["func12"].templates.push("I saw the devilish look in the serpent's eye as his spiny tongue wrapped around my body.  My legs felt as if they were being stabbed with a thousand tiny needles. ");

    // Reaction: hero responds to test
    propp["func13"].templates.push("Holding my father's blade I cut what kept me from moving.  I did not care to look whether it was a serpent's tongue or the branch of a tree.");
    propp["func13"].templates.push("I pulled the needle out of where it would cause harm, and happy that I did so.  ");
    propp["func13"].templates.push("When I touched the needle it magically fell loose and landed on the inside of my palm.");
    propp["func13"].templates.push("I tore myself away from the life-threatening needles and pines.  ");
    propp["func13"].templates.push("After I took the needle from its place, I pryed my father's bones from the floor and put them in my satchel.");

    //  Acquisition: hero gains magical item
    propp["func14"].templates.push("Then the bird came down beside me, and thanked me graciously for my good work.  In return, she left two feathers attached to my heels to replace the leather-bottomed shoes I lost.  'They will take you where you want to go, and you no longer will fear the people the live in the ground.'  ");
    propp["func14"].templates.push("'Take that needle and pin it to the inside of your shirt.  From then no one will be able to touch you without feeling the hurt of needles on the bare sides of their palms'");
    propp["func14"].templates.push("My father's bones and needle transformed into a suit of skin.  It smelled distinctly foreign like the mountain.  When I put it on I felt like the mountain was traveling along my shoulder blades.  It felt restless.");
    propp["func14"].templates.push("When I placed the needle I had taken on my palm, it moved in the direc where I needed to go.  The bones taken from the ground shielded me from any harm.");
    propp["func14"].templates.push("It looked like an ordinary onion, with a brown papery peel, a smooth, lined, slightly yellowed outer layer.  I turned it over and over in my hands, wondering how this vegetable could be of any help to me.  'Its juices make all who consume it unable to tell a falsehood for a short period of time.  Feed this to one from whom you must extract important and true informa from.  Use it wisely,' the old woman advised.  I cupped the onion in my hands as if it were a fragile ornament that would shatter into millions of tiny magical pieces of it were dropped.  I knew this powerful bulb would aid me on my journey.");
    propp["func14"].templates.push("The little man handed what looked like a small wooden piccolo.  The small, thin object looked old but not dusty like the man's worn garments.  'A single note from this musical stick will bring rain from the heavens to satisfy this thirsty land,' the little man said to me.  'But heed my words, should you be tempted to produce sweet melodies to entertain yourself and those around you, mother nature will heighten the aching of the earth around you: the sky will heave torrents of rain producing a monsoon that will be echoed by the quaking of the earth as it splits, spewing forth fiery magma that will consume you and your vanity.");
    propp["func14"].templates.push("The fairy placed a single seed in my palm which I immediately planted and tended to for months.  For days, I watered the seed, showered it with words of encouragement as it grew into a young sprout, and gave it proper space and care as it blossomed fully into a magnificent red rose that granted any wish that I whispered lovingly into its soft petals.");
    propp["func14"].templates.push("The silver fish leapt from the water from his gurgling mouth came a bubble that solidified and dropped into my lap.  Just as quickly as he had emerged, the fish plopped back into the water, leaving me to puzzle over this mysterious orb.");

    // Guidance: hero reaches destination
    propp["func15"].templates.push("The mists grew heavy.  When I stretched my arm out I could not see past my hand, but it did not matter.  When I closed my eyes my feet moved along with the rhythm of the mountain and its soils. Faster and faster I could almost feel myself fly.");
    propp["func15"].templates.push("When the people of the soil touched my feet they fell back into the ground with shrieks and cries.  Now I could reach the top of the mountain without fear of falling down.");
    propp["func15"].templates.push("The woman in dragon scales glided up the mountain and vanished in the mists.  The needle bade me to follow her snow white hairs that glistened like silver strands of dew.");
    propp["func15"].templates.push("As I closed my eyes I could hear my father's voice guide me along the hidden pathways of the mountain unbeknownst to boys who sit and watch the sun rise and fall in their beds.");

    propp["func16"].templates.push("The man who killed my father stood on the open ground with an army of people waiting to rise from the earth.  He brandished a blade in his hand and struck it towards the sun.");
    propp["func16"].templates.push("A foreigner stopped me on my rise toward the mountaintop.  He had one eye and loose skin that folded around his body like paper cloth.  Laid before him was a set of colored tablets and sticks.  'Stay for a game,' he said to me.  'After you win your game with me I'll let you go on your way.'");
    propp["func16"].templates.push("As I approached the top of the mountain a white spectacle blinded me for an instant.  When I blinked again I saw a white dragon shifting over the mountain like a layer of foam riding ocean waves.  I could tell by its movement that it was a territorial creature; I could tell that it would fight me before allowing me to press further.");
    propp["func16"].templates.push("Then, as I was about to reach the top of the mountain, a giant form appeared before me in the shape of soil.  As I came closer to it I realized that it was not a giant form but composed of hundreds of small people from the earth.  The mountain had come alive, and it did not want me to pass its presence.");

    propp["func17"].templates.push("The blade struck me against my face and left a blood spot in the shape of a star.");
    propp["func17"].templates.push("Forms circulated around my body on all sides and I could no longer breathe.  Lungs tight and waist constricted I watched as my skin turned into the color of soil.  I could no longer distinguish my body from the mountain's.");
    propp["func17"].templates.push("Dizzy and hallucinatory spells yielded me to the man's desires.  As I played his game he pressed one of the playing tablets to my forehead.  There it left a mark of doom that I thought would signal my inevitable fate.");
    propp["func17"].templates.push("As I fought blindly as callow youths do, a white bird flew by my side and attached a feather to my bleeding wounds.  They began to heal instantaneously.");
    propp["func17"].templates.push("Burned marks of fire and hot metal left my body colored red with pain.");

    propp["func18"].templates.push("But since I had been given my gift I did not fear what stood in front of me.  As his body touched mine if fell to the floor covered in a carpet of needles.");
    propp["func18"].templates.push("Through the blind frenzy of earth and shadows I plunged my dagger into the creature's heart and watched as it melted into rain.");
    propp["func18"].templates.push("When he placed his hand upon me he let out a great cry and then vanished into the earth.");
    propp["func18"].templates.push("I watched as the folds of his skin began to swallow him alive under the sadness of defeat.");

    propp["func19"].templates.push("As I reached the mountain's top I took my father's bones and held them to the ground.  The people of the earth relinquished their skins and flesh taken over the years of people passing over their home.  The skins attached the bones and rose, forming into the figure of a man I knew from when I was young.");
    propp["func19"].templates.push("With no one to block me from my path I continued to follow my needle to the topmost peak of the mountain.  There lay the lady of white hair and dragon scales bleeding with a wolf-girl licking her wounds.  I reached inside her cut to take the strength she possessed in her creature form. ");
    propp["func19"].templates.push("From within the bowels of the creature I found my leather bottomed shoes and ring that father left to me.  There at the top of the mountain I decided to bury my father's bones.");
    propp["func19"].templates.push("The mists cleared away and the soil grew cold and silent.  In place of the menace that blinded my sight was a small jade figure of my father, wearing his leather-bottomed shoes and ring.  So it was there that I put my father's bones to rest and took the jade figure in his place.");
    propp["func19"].templates.push("As soon as my parched, cracked lips touched the cool water of the clear spring, my tongue began to hungrily lap the coolness into my throat to fill my stomach, to fill my blood.  The last time I had coughed with a wet throat or laughed with a satisfied stomach had been so long ago.  The rushing of the waterfall that fed the spring I was drinking from drowned all sounds from my ears so that I was left in a world where all I need worry about is swallowing this fountain of nourishment.  When I had had my fill, or as much as I could handle at the moment, I stood and viewed the paradise that surrounded me: the lush vegeta that yielded precious ruby apples and pears yellow with inviting ripeness.  All around me were luxuries I had never imagined I would live to consume.");
    propp["func19"].templates.push("In the chest were more than enough gold, pearls, and sparkling jewels to feed my family for a lifetime.");
    propp["func19"].templates.push("The handsome man presented a room full of gold, silver, and precious jewels.  'All of this is yours,' he said.  My mind was in a whirl: there wasn't a dream in the world I could not obtain with these riches.  Heaven was as close as the sparkling gems I beheld all around me.");

    propp["func20"].templates.push("So I began my journey home.");
    propp["func20"].templates.push("I pressed onwards to a safe haven where my father would be in good hands.");
    propp["func20"].templates.push("My head seemed to clear once I set foot on the grounds that surrounded the small, crooked house, my home I had been away from for what seemed like an eternity.  I could hear my mother tongue calling from the rustling trees, the voices of my ancestors rumbling through the dusty earth at my feet, the song of my dead father coming from the throat of a sad and melodious bird.  I was home again.");
    propp["func20"].templates.push("Waves of comfort and relief washed over my tired limbs as my father and mother embraced and kissed me.  The familiar sights of my home and scents of my family soothed me so much that I nearly forgot the heavy pack I had carried for hours on my back, a sack filled with treasures I had collected throughout my journey to bring back to my family.");
    propp["func20"].templates.push("After all this time away, it seemed a mirage in a desert of hopelessness.  My disbelief vanished when I saw my mother appear at the door of our small, cramped home of decaying wood.  Home, I was finally home.");
    propp["func20"].templates.push("I saw the familiar clearing with my father's chopping block and the axe he used for splitting wood on the ground beside it.  Home.  I ran through the trees, the wind in my ears, my breath leaving my throat in heavy huffs, my feet slapping the earth beneath the trees of these woods, these woods that had stood between myself and my home for so long.");

    propp["func21"].templates.push("My feet, wearing their newfound bottomed shoes, pressed gently across the soils as not to wake the men clamoring upwards.  But I still felt a shadow trail at my footsteps that did not feel like my own.  As I walked faster the shadow moved behind me as well, sometimes touching my bare skin with sodden ground. ");
    propp["func21"].templates.push("The sound of pattering steps quickly nipped at my heels as I ran.  Looking behind me, I saw that the wolf-girl had grown larger.  She carried on her back her sister, a lady wearing dragon scales whose white hair trailed in the wind.");
    propp["func21"].templates.push("With each step I took, the people of soil tried to clench my feet harder and began to pull me down.");
    propp["func21"].templates.push("In my path stood a young pear tree, that, on first appearance looked wretched and covered with soil.  But the second time I looked at it the sapling had already blossomed into a maturity.  It grew pears the size of my mother's hands.  It waved to me with its branches, beckoning me towards the sweet fruit.  As I attempted to climb the three, the leaves enclosed me and stung my skin with nectar.");

    propp["func22"].templates.push("As I struggled to break loose I remembered my father's ring and turned it twice.  I felt my body lose its corporeality and fade into particles of mist, evading my pursuer's grasp.");
    propp["func22"].templates.push("I called out,'Help, please, help!'  The white crane grazed the skin of my pursuer and held my shirt between its beak.  ");
    propp["func22"].templates.push("In an attempt to lose my pursuer I took hold of the tall silver needle in my pocket and threw it to the ground, watching it form a wall of iron thread and knots. ");
    propp["func22"].templates.push("I watched as my magic needle pricked a hole in the tree trunk large enough for me to hide in.  Without knowing where I had gone my pursuer stopped in its search disappeared, leaving behind an abundance of pears for me to take.");
    propp["func22"].templates.push("As I felt the creature take me into her jaws I saw my father come, from behind a tree.  From thirty feet away he shot the creature and the jaws fell lose, emptying me onto the floor.  The skin on my chest had impressions of teeth marks, but no blood appeared.");

    propp["func23"].templates.push("When I returned home Mother was not there.  Instead, there was a man leaning against our door, sipping guava juice through a straw.  He told me the lady of the house had left to search for her son, and that he had taken residence.  I looked down on him and winced.  His feet stank of manure.");
    propp["func23"].templates.push("When I reached a house I knocked to ask for a cup of water to cool my senses. The lady, upon seeing my shoes, let me in.");
    propp["func23"].templates.push("Before I entered my home my brothers came out, and, thinking I was a peddler, asked how much the jade I carried was worth.");
    propp["func23"].templates.push("Mother could not recognize the sound of my footsteps at the door.");
    propp["func23"].templates.push("Before I entered the foreign kingdom, a general dressed in black and red wearing white paint asked me who I was and how I came.  I told him about my shoes, about my needle, and about the creature I had slain.  His eyes opened in delight, and he scribbled down my boasts on a parchment of yellow paper. ");

    propp["func24"].templates.push("Before I could tell my mother anything the boys spoke for me.  'We've found father,' they cried.  She burst into tears and hugged them both, ignoring my stinking presence.");
    propp["func24"].templates.push("'I killed the creature that has been plaguing us all,' he cried.  I looked at him in shock, and immediately protested in front of the king.");
    propp["func24"].templates.push("'This man,' he pointed at me, 'this man killed our father.  See the blood on his shirt Mother?  See it?  The smell is like one of our own.'");
    propp["func24"].templates.push("My brother hit me on my head, and while I lay in a half-awake state I felt him dig through my pockets and saddle bag.  'Look mother, look what I have for you,' he shouted. ");

    propp["func25"].templates.push("'And who are you boy?' Mother asked me.  Her weak eyes did not recognize my much-changed face and form.  I told her I was her son but she did not believe me.  'If you are the son that left so many days ago, and if you are the one who brought back this jade figure of father, then you are the one who will be able to restore him to his normal shape.'  She flicked her wrist and flung the jade piece at me.");
    propp["func25"].templates.push("'As a child, my son could dance along the soil so quickly that the men who died and live in the ground could not catch him.  Prove this to me now,'");
    propp["func25"].templates.push("'If you are my son then where are your father's leather bottomed shoes and ring?'");
    propp["func25"].templates.push("The bearded man approached me in heavy garb of silk and flower embroidery.  He told me that my tongue would be tested for truth by way of needle.  'If upon the needle's prick your tongue does not bleed you will be telling the truth.  If, however, it does bleed, you are a liar, and hence will swallow poison through your broken tongue.'");

    propp["func26"].templates.push("Without hesitance I lifted my pant legs began to dance in father's leather bottomed shoes.  The soles breezed across the floor, cutting the mist with rhythmic mos.  I then turned the ring on my finger and watched my father rise, soil shedding from his skin.  His shaved face and clean hands stood against the paling crowd. This impressed the people who stood before me, as did the fact that my tongue did not bleed from the needle it held.");

    propp["func27"].templates.push("'My son!' Mother cried out to me.");
    propp["func27"].templates.push("The man in heavy robes looked at the man beside me and asked, 'So now I ask that you take the same truth by needle test that this man took.'");
    propp["func27"].templates.push("My family pressed their hands on various swells of my body as they embraced me with joy.");
    propp["func27"].templates.push("As Mother smoothed her hand over Father's forehead she looked at me reassuringly.");

    propp["func28"].templates.push("People began to move away from the other person, who now shook his head and his hands.  He kneeled to the floor and placed his head there in mercy.");
    propp["func28"].templates.push("As mother embraced me, she looked at my brothers with great disdain and hurt.");
    propp["func28"].templates.push("Father began to tell my story (with added embellishments and nuances) of rescue and courage to the others.");
    propp["func28"].templates.push("Everyone then stared through the guise of the false man beside me.  The person, who acted as a substitute for my accomplishments, began to bite his nails in a rampant manner. ");

    propp["func29"].templates.push("My mother's embrace rendered the burns and boils on my skin pristine.");
    propp["func29"].templates.push("A familiar gold and silken robe of dragon scales was placed in my hands on account of me killing the creature.  For an odd reason I could not help but feel regret.  The girl with the white hair and her foxlike sibling did not mean any real harm but only wanted to protect the mountain as the men of soil bade them do.");
    propp["func29"].templates.push("The soil on my skin turned into sprinkles of gold dust.  The people proclaimed me some kind of god.");
    propp["func29"].templates.push("Mother licked fingers and placed them to my face, wiping the thick layer of dirt away.  Then I truly began to look like my father's son, in form, face, and color.");

    propp["func30"].templates.push("My false neighbor kowtowed to the floor in mercy.  Father and the man in robes let him do so until his forehead bled from its meetings with the hard stone floor.");
    propp["func30"].templates.push("The needle from my tongue flung towards the lying man and struck him in the heart.  It gave him poison at the place where it would hurt the most, and soon the man became a limp purple figure of stone.");
    propp["func30"].templates.push("My lying brothers cried when they were forced to walk on the ground without their leather bottomed shoes.  I watched as they, like my father had once, were swallowed by the ground and mouths hungry for stinking flesh.");
    propp["func30"].templates.push(" I watched as a hammer blasted the head of my lying neighbor into the ground.  The blood that came from their bodies seeped into the soil and appeased any anger towards me or my Father. ");
    propp["func30"].templates.push("The earth rumbled and the trees shook, and before the old hag could spit another curse at me, the ground beneath her split in two, swallowing her rickety bones and hollow heart.");
    propp["func30"].templates.push("Suddenly a swarm of angry vultures swooped upon the ogre and began to peck at every pore and crevice of his body.  Together, a mass of flapping and buzzing around a core of struggling flesh, they danced a violent dance.  His pitiful screams were drowned in a sea of hundreds of angry screeches and the sounds of countless beaks piercing flesh.  I ran from this bloody scene as quickly as I could.");

    propp["func31"].templates.push("A girl with snow white hair came to the house later that day, looking for the man with the leather-bottomed shoes and coat of dragon scales.  She told me she was betrothed to that man who had taken her creature form and made her human.  She reminded me of the mountain.  She was beautiful.");
    propp["func31"].templates.push("As the soil on me continued to turn into gold, the ground of our garden sprouted trees, fruits, and vegetables.  My family and I stared in a daze as we watched our land grow rich and the people of the soil draw away.");
    propp["func31"].templates.push("I was offered a place in the palace, but I could not accept.  I wanted to be with the mountain; I felt it move under my skin as I knew part of me was in the mountain too.");

    return propp;

};
