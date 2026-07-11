const SUBSET_COUNT = 5;

const DATA = [
    {
        "author": "J. R. R. Tolkien",
        "quote": "In the great tapestry of existence, woven upon the loom of Arda, the question of human behavior stands as a riddle enshrouded in the mists of antiquity. To discern the true essence of their nature, we must venture beyond the mere dichotomy of nature and nurture, for their souls are forged through the interplay of both, as intricate as the interlocking strands of an Elven song. From the moment of their awakening, their spirits are imbued with a spark of the divine, endowed with a longing for noble deeds and aspirations. Yet, as they journey through the mazes of life, their paths are shaped by the ever-turning wheels of fortune, the influences of their kin, and the trials of the world. Thus, the dance of nature and nurture intertwines, orchestrating the symphony of human behavior, harmonizing the melodies of their inherent qualities with the echoes of their upbringing and experiences. As the Light and Shadow blend in twilight, so too do these forces shape the essence of humanity, for in the end, it is their choices amidst the cosmic symphony that shall define their souls' eternal course."
    },
    {
        "author": "Homer",
        "quote": "Sing to me, Muse, of the enigmatic question that haunts the hearts of mortal men, whether human behavior is but a reflection of nature's decree or the nurture bestowed upon them by the gods. As the mighty ships of the Achaeans traverse the wine-dark sea, so too do the minds of men traverse the boundless depths of this ponderous query. Some contend that in the core of their being, mortal souls are formed, molded by the divine essence breathed into them at birth, their conduct an intricate dance of innate virtues and vices. Others, in contrast, argue that the myriad encounters and trials that befall them along the winding paths of life shape the fibers of their character, as a potter sculpts clay upon the wheel. Yet, in truth, it is a blend of these celestial threads and earthly weavings that ensnares the mortal heart, and only through the hands of the Fates will the tapestry of human behavior be unveiled, a tapestry woven in the cosmic loom of destiny and free will."
    },
    {
        "author": "Mark Twain",
        "quote": "Now, listen here, folks, for I reckon this question 'bout human behavior, whether it's driven by nature or nurture, has got folks scratchin' their heads like a hound with fleas. Some say it's in a person's blood, inheritin' their ways from their kinfolk like a worn-out pair of britches passed down through generations. Others argue it's the raisin' and learnin' that shapes a body's manners and inclinations, like a blacksmith hammerin' out a horseshoe on his anvil. Well, I'm here to tell ya, it's a mix of both, like a Missouri mud pie with a sprinkle of cinnamon on top. It's the blend of a man's birthright and the folks he rubs shoulders with that stirs the stew of human behavior, addin' flavor and kick to the pot. So, don't go lookin' for a simple answer, my friends, 'cause it's a tricky critter that dances to its own fiddle tune, just like a river meanderin' through the countryside."
    },
    {
        "author": "William Shakespeare",
        "quote": "To ponder upon the tempestuous quandary that besets mortal hearts, whether 'tis the essence of their birth or the tutelage of their surroundings that shapes their very being, doth lead me down a thorny path of contemplation. Perchance, within the crucible of one's nature lies the seeds of destiny, a celestial tapestry woven by the Fates themselves, whose threads doth guide their steps upon this mortal stage. Yet, lo, the forge of nurture, with its ardor and fervor, doth fashion the clay of their existence, imbuing the soul with wisdom and folly alike. Methinks, dear brethren, that 'tis a dance betwixt these twin forces, wherein lies the truth. For human behavior, like a chameleon, doth adapt and transform, shaped by the interplay of nature and nurture, entwined like ivy upon a stone wall."
    },
    {
        "author": "F. Scott Fitzgerald",
        "quote": "In the dim-lit parlors of society's salons, the enigma of human behavior beckons, a question that drifts like smoke, haunting the restless minds of those who dare to seek its elusive truth. Is it the flicker of nature's flame that ignites the passions within, or the gentle hand of nurture that sculpts the contours of character? In the grand theater of existence, where destinies intermingle like a waltz in moonlit gardens, one cannot escape the dance of these intertwined forces. For we are but vessels, fashioned by the gods with a touch of whimsy, shaped by the circumstances and influences that surround our fragile hearts. And yet, beneath the gilded surface, a current flows, an undercurrent of longing and desire, whispering of the raw, primal instincts that dwell within our souls. It is this intricate dance between the inheritance of our blood and the weight of our experiences that paints the portrait of human behavior, a brushstroke upon the canvas of life. And so, we drift upon the ebb and flow of these invisible tides, forever entangled in the mystery of our own existence."
    },
    {
        "author": "Jane Austen",
        "quote": "Oh, dear reader, the contemplation of human behavior, whether dictated by the innate constitution of one's nature or the external influences of nurturing, doth stir the sensibilities of my reflective mind. Pray, let us delve into this delicate matter with the poise and discernment befitting our refined society. In the fair tapestry of existence, where lives intertwine like delicate threads, we must consider the interplay of these fundamental forces that shape our characters. It is an elegant dance of inherited dispositions and the tender caress of familial and societal guidance that shape our actions, our manners, and the very essence of our being. For, as surely as the tender bud unfolds its petals under the sun's gentle gaze, so too does the human spirit unfurl, responding to the harmonious symphony of nature and the nurturing touch that guides it towards enlightenment. Thus, let us embrace the notion that it is in the exquisite balance between nature and nurture that we may find the truest elucidation of human behavior, for our souls are molded by the subtle intermingling of these intricate threads, ever weaving the tapestry of our lives."
    },
    {
        "author": "David Foster Wallace",
        "quote": "The question of whether human behavior emerges from the primordial essence of one's nature or emerges through the intricate dance of external influences and nurturing is a labyrinthine enigma that confounds our feeble attempts at comprehension. In this vast and bewildering cosmos, the forces of biology intertwine with the complex web of upbringing, culture, and environment, rendering any facile binary division as inadequate to encapsulate the kaleidoscope of human existence. Behold, dear interlocutor, the tapestry of human behavior, a tapestry interwoven with infinite shades of gray, where strands of inherent disposition intertwine with the warp and weft of social conditioning and lived experience. In this expansive vista of human conduct, the dichotomy of nature versus nurture dissipates, giving way to a nuanced interplay of influences that defy simplistic categorization, beckoning us to embrace the inherent complexity and embrace the unending quest for understanding."
    },
    {
        "author": "Charles Dickens",
        "quote": "It was the best of times, it was the worst of times, it was the age of conflicting notions, it was the epoch of perplexity. The riddle that entwines the very fabric of human behavior, whether it is dictated by the deep-rooted essence of nature or the formative influences of nurture, has long stirred the souls of men. Is it the fickle hand of destiny that guides our steps, or the gentle shaping of circumstance and upbringing that molds our hearts? Oh, the interplay of these opposing forces, like the ebb and flow of the Thames' murky waters, swirls in the chambers of our minds. Aye, we may ponder the sum of inherited qualities, the echoes of ancestral spirits that reverberate within us, and yet, the potent elixir of external influences, the touch of teachers, mentors, and companions, works its alchemy upon our being. And so, we wander through the pages of life, characters in a sprawling novel, driven by a maddening fusion of nature's decree and the hands that nurture our tender souls."
    },
    {
        "author": "Ernest Hemingway",
        "quote": "Human behavior, stripped down to its bare bones, is a thing of simplicity. Nature and nurture may dance around it like shadows in the night, but the truth lies in the essence of a person's being. Deep within, there's a fire, a burning core that defines who they are. It's the grit and resilience that courses through their veins, the stubborn determination that propels them forward. No matter the hand they're dealt, whether it's the cards of fate or the molding touch of upbringing, it's that raw, unyielding spirit that shapes their path. So, when the question arises, ponder not the intricacies of nature versus nurture, but instead, embrace the elemental truth that human behavior is driven by the indomitable force that resides within each and every one of us."
    },
    {
        "author": "J. K. Rowling",
        "quote": "In the enchanting realm where the mysteries of human behavior unfold, the confluence of nature and nurture weaves a spellbinding tale. Like a wizard's intricate potion, the essence of who we are is a fusion of inherent traits and the nurturing tendrils that shape our lives. From the moment we first draw breath, destiny whispers its secrets, and the delicate dance between our innate inclinations and the experiences that shape us begins. The magical brew of our heritage mingles with the alchemy of our surroundings, instilling in us the very essence of character. As we traverse the corridors of existence, it is our choices, borne from the tapestry of our nature and the influences that guide us, that illuminate the path before us. And thus, dear reader, the grand tapestry of human behavior unfurls, an enchanting blend of nature's hand and the nurturing touch that weaves the very fabric of our magical journey."
    },
    {
        "author": "Stephen King",
        "quote": "In the shadowed corridors of the human psyche, an age-old question lurks, an itch beneath the skin that begs to be scratched. Is it the twisted roots of our nature, deeply entwined in our very marrow, that drive us to our darkest deeds? Or do the horrors of our upbringing, the scars etched upon our souls, mold us into the monsters we become? Well, my friends, let me tell you, it's a chilling dance between the two, like a sinister waltz through the chambers of a haunted house. Our genetics may lay the groundwork, plant the seeds of madness, but it's the macabre symphony of upbringing, the symphony conducted by our twisted families, our deranged communities, that plays the tune of our twisted fates. So, if you ask me, it's the wicked combination of nature's taint and the malignant nurture that shapes us into the monsters we fear."
    },
    {
        "author": "Stephenie Meyer",
        "quote": "In the moonlit realm where secrets and passions intertwine, the question of human behavior emerges like a captivating riddle, beckoning us into the depths of the unknown. Is it the ethereal essence of one's nature, a primal force coursing through their veins, that guides their every step? Or is it the tender nurturing, the delicate touch of love and experience, that shapes their destiny? Ah, dear reader, in this enchanting tapestry of life, the answer lies in the magic of both nature and nurture, like the interplay of sunlight and shadow upon a bewitching landscape. For within us, there exists a celestial melody, an intricate symphony composed of our inherent qualities and the tender harmonies of our surroundings. It is through this celestial dance that human behavior, like a cherished love story, unfolds, driven by the harmony of nature and the enchantment of nurture, creating a spellbinding tale as timeless as eternity itself."
    },
    {
        "author": "Ayn Rand",
        "quote": "In the realm of human action and the pursuit of individual greatness, the question of nature versus nurture is an inconsequential distraction, perpetuated by the weak and the envious. The essence of human behavior lies not in the arbitrary influences of external forces, but in the inviolable core of one's own nature, driven by reason and self-interest. It is the innate qualities of the exceptional few that dictate their path, unaffected by the feeble claims of environmental determinism. Those who strive for greatness embrace their inherent capacities, unshackled by the constraints of societal expectations or the delusions of collective responsibility. For it is the will and the spirit of the individual, unburdened by the misguided notion of nurture, that shapes the course of their destiny and defines the heights they will ascend."
    },
];

// https://stackoverflow.com/a/6274381
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function randomSubset(count) {
    shuffle(DATA);
    let subset = DATA.slice(0, count);
    return subset;
}

function createSelectList(array) {
    let select = document.createElement("select");
    array.forEach((x) => {
        let opt = document.createElement("option");
        opt.value = x;
        opt.textContent = x;
        select.appendChild(opt);
    });
    return select;
}

function populateTable() {
    let dataSubset = randomSubset(SUBSET_COUNT);
    let table = document.getElementById("quotes-table");
    let authorOptions = dataSubset.map(x => x.author).sort();
    shuffle(dataSubset);
    dataSubset.forEach((dataRow) => {
        let tableRow = table.insertRow(-1);
        let authorCell = tableRow.insertCell(0);
        let select = createSelectList(authorOptions);
        authorCell.appendChild(select);
        let quoteCell = tableRow.insertCell(1);
        let text = document.createTextNode(dataRow.quote);
        quoteCell.appendChild(text);
    });
}

function arrayToObject(array) {
    let retval = {};
    array.forEach((row) => {
        retval[row.author] = row.quote;
    });
    return retval;
}

function calculateResults() {
    let correctCount = 0;
    let table = document.getElementById("quotes-table");
    let answers = arrayToObject(DATA);
    // Start at 1 to skip header
    for (let i = 1, row; row = table.rows[i]; i++) {
        let authorSelection = row.cells[0].firstChild.value;
        let quote = row.cells[1].innerText;
        if (answers[authorSelection] === quote) {
            correctCount++;
        }
    }
    document.getElementById("results").textContent = correctCount + " / " + SUBSET_COUNT;
}

document.addEventListener("DOMContentLoaded", function () {
    populateTable();
});
