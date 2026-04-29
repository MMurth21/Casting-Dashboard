const castingData = {
  appState: {
    selectedActorId: null,
    theme: "light",
    budgetLimit: 70000000,
    currentTotal: 20000000
  },

  roles: {
    "Rey Skywalker": {
      assignedActorId: "fixed-rey",
      isLocked: true,
      shadow: false,
      subtitle: "The Anchor",
      bio: "The last Jedi, now tasked with building the first true Order. Daisy Ridley returns as the franchise cornerstone."
    },
    "Kaelen Sol": {
      assignedActorId: null,
      isLocked: false,
      shadow: true,
      subtitle: "The Prodigy",
      bio: "A former First Order cadet who deserted during the final battle of Exegol. Rey's first true success story — balancing military discipline with a deep, compassionate connection to the Force."
    },
    "Vaneen Kor": {
      assignedActorId: null,
      isLocked: false,
      shadow: true,
      subtitle: "The Nihilist Antagonist",
      bio: "Leader of The Nihil Bound. A brilliant scientist and philosopher who believes the Force creates 'Main Character Energy' that destroys ordinary lives. Seeks to democratize the galaxy by making everyone Force-blind."
    },
    "Jaxen Vane": {
      assignedActorId: null,
      isLocked: false,
      shadow: true,
      subtitle: "The Rogue",
      bio: "A survivor of a dark-side cult who just wants to survive. Knows the Nihil's 'Void tech' and serves as the cynical Han Solo-type foil to Rey's optimism."
    },
    "Chancellor Aris Thorne": {
      assignedActorId: null,
      isLocked: false,
      shadow: true,
      subtitle: "The Political Weight",
      bio: "Leader of the New Republic's Galactic Alliance. Tired of Jedi business interfering with commerce and reconstruction — the bureaucratic wall Rey must climb to get help."
    },
    "T-0": {
      assignedActorId: null,
      isLocked: false,
      shadow: true,
      subtitle: "The Dripless Droid",
      bio: "A repurposed First Order interrogation droid that Rey has programmed to be a librarian. Constantly anxious — hardware built for violence, software wired for peace."
    }
  },

  actors: [

    // ── Rey Skywalker ─────────────────────────────────────────────────────
    {
      id: "fixed-rey",
      name: "Daisy Ridley",
      role: "Rey Skywalker",
      stats: { rtScore: 82, cost: 20000000, divaRating: 2 },
      background: { ethnicity: "White", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Franchise cornerstone. Physicality and sincerity are irreplaceable for continuity. Non-negotiable.",
        type: "Heroic Lead",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "April – October 2026",
        strengths: ["Physicality", "Sincerity", "Franchise Continuity"],
        genreExperience: ["Action", "Sci-Fi", "Drama"],
        articles: [
          { headline: "Daisy Ridley on New Star Wars Story and 'Sometimes I Think About Dying'", publication: "Variety", url: "https://variety.com/2024/film/features/daisy-ridley-star-wars-return-worthwile-story-sometimes-i-think-about-dying-1235871459/" },
          { headline: "Daisy Ridley Teases New Star Wars Film Is Taking Story In A Different Direction", publication: "Deadline", url: "https://deadline.com/2024/01/daisy-ridley-star-wars-film-rey-skywalker-1235792304/" },
          { headline: "Daisy Ridley & Tom Bateman on Writing 'Magpie'", publication: "IndieWire", url: "https://www.indiewire.com/features/interviews/daisy-ridley-tom-bateman-interview-writing-magpie-1234962837/" }
        ],
        currentEventsReason: "Strong press cycle anchored by the new SW announcement; universally praised for franchise loyalty and her willingness to return."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: ["Tring Park"],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 4,
        franchiseOverlap: ["Star Wars"],
        ageBracket: 34
      }
    },

    // ── Kaelen Sol ────────────────────────────────────────────────────────
    {
      id: "kaelen-butler",
      name: "Austin Butler",
      role: "Kaelen Sol",
      stats: { rtScore: 80, cost: 15000000, divaRating: 3 },
      background: { ethnicity: "White", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Brooding, intense physicality. Reads as a conflicted warrior immediately — the military rigidity feels lived-in rather than performed.",
        type: "Heroic Lead",
        agency: "CAA",
        availability: "Checking",
        availabilityWindow: "May – September 2026",
        strengths: ["Intensity", "Physicality", "Brooding Charisma"],
        genreExperience: ["Drama", "Action", "Sci-Fi"],
        articles: [
          { headline: "Austin Butler's 'Dune 2' Method Acting Was Less Intense Than 'Elvis'", publication: "Variety", url: "https://variety.com/2024/film/news/austin-butler-dune-2-method-acting-less-intense-elvis-1235919694/" },
          { headline: "Austin Butler Addresses 'Pirates Of The Caribbean' Casting Rumors", publication: "Deadline", url: "https://deadline.com/2024/06/austin-butler-addresses-pirates-caribbean-reboot-casting-rumors-1235974593/" },
          { headline: "Austin Butler–Edward Berger Package 'The Barrier' Hits The Market", publication: "Deadline", url: "https://deadline.com/2024/11/the-barrier-edward-berger-austin-butler-package-macmillan-hedges-1236184160/" }
        ],
        currentEventsReason: "Elvis Oscar momentum and Dune 2 acclaim sustained into 2025; clean press with no controversy, consistently named a top young lead."
      },
      chemistryFactors: {
        originRegion: "US-West",
        trainingLineage: [],
        actingEthos: "method",
        pastCollaborations: [
          { actorId: "vaneen-ferguson", sentiment: "positive", note: "Co-starred in Dune: Part Two (2024) as Feyd-Rautha alongside Ferguson's Lady Jessica; professional on-set relationship, no documented friction" }
        ],
        publicSentiment: 4,
        franchiseOverlap: ["Dune"],
        ageBracket: 34
      }
    },
    {
      id: "kaelen-mccormack",
      name: "Daryl McCormack",
      role: "Kaelen Sol",
      stats: { rtScore: 85, cost: 3000000, divaRating: 1 },
      background: { ethnicity: "Two or more races/Other", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Soulful and grounded. Brings a warmth that softens Kaelen's military edge — his compassion reads as earned, not performed. High ceiling at a fraction of the cost.",
        type: "Heroic Lead",
        agency: "Independent",
        availability: "Pinned",
        availabilityWindow: "March – August 2026",
        strengths: ["Emotional Depth", "Warmth", "Naturalism"],
        genreExperience: ["Drama", "Thriller", "Romance"],
        articles: [
          { headline: "Daryl McCormack Talks 'Knives Out 3' and 'Pride and Prejudice'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-features/daryl-mccormack-knives-out-wake-up-dead-man-pride-prejudice-1236445480/" },
          { headline: "'Knives Out 3' Adds Daryl McCormack to Cast", publication: "Variety", url: "https://variety.com/2024/film/news/knives-out-3-cast-daryl-mccormack-1236019883/" },
          { headline: "Daryl McCormack Talks 'Twisters' and Next Phase of His Career", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/daryl-mccormack-twisters-career-1235508244/" }
        ],
        currentEventsReason: "Rising critical darling with Knives Out 3 attached; clean press record and strong industry goodwill heading into his breakout window."
      },
      chemistryFactors: {
        originRegion: "Ireland",
        trainingLineage: ["Bow Street Academy"],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 4,
        franchiseOverlap: [],
        ageBracket: 31
      }
    },
    {
      id: "kaelen-poulter",
      name: "Will Poulter",
      role: "Kaelen Sol",
      stats: { rtScore: 82, cost: 8000000, divaRating: 2 },
      background: { ethnicity: "White", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Excels at 'shattered' backstories. Guardians Vol. 3 proved he can carry earnestness inside a genre spectacle without going soft.",
        type: "Heroic Lead",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "April – September 2026",
        strengths: ["Vulnerability", "Sincerity", "Physical Range"],
        genreExperience: ["Action", "Sci-Fi", "Drama", "Horror"],
        articles: [
          { headline: "How Will Poulter Went From Conscientious Objector to Soldier of Fortune in 'Warfare'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-features/will-poulter-interview-warfare-1236177908/" },
          { headline: "Will Poulter on 'Black Mirror' Episode 'Plaything,' Colin Ritman", publication: "Variety", url: "https://variety.com/2025/tv/global/will-poulter-black-mirror-plaything-colin-ritman-1236367087/" },
          { headline: "Will Poulter & Adam Meeks Talk Sundance Drama 'Union County'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/will-poulter-sundance-movie-union-county-adam-meeks-addiction-1236478234/" }
        ],
        currentEventsReason: "Warfare received strong critical praise; known publicly for a thoughtful, conflict-free persona and consistent awards circuit goodwill."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: ["Drama Centre London"],
        actingEthos: "technical",
        pastCollaborations: [
          { actorId: "kaelen-woonatai", sentiment: "positive", note: "Co-starred in Warfare (2025); praised each other's commitment and on-set chemistry extensively across press tours" }
        ],
        publicSentiment: 4,
        franchiseOverlap: ["MCU"],
        ageBracket: 33
      }
    },
    {
      id: "kaelen-melton",
      name: "Charles Melton",
      role: "Kaelen Sol",
      stats: { rtScore: 79, cost: 4000000, divaRating: 2 },
      background: { ethnicity: "Asian", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "May December tape showed real sensitivity and heroic magnetism. Underrated for a role that rewards quiet strength — could be the surprise of the film.",
        type: "Heroic Lead",
        agency: "CAA",
        availability: "Pinned",
        availabilityWindow: "May – October 2026",
        strengths: ["Sensitivity", "Magnetism", "Physical Presence"],
        genreExperience: ["Drama", "Romance", "Action"],
        articles: [
          { headline: "'May December' Star Charles Melton On Cannes, 'Glee,' And Making Kimchi", publication: "Deadline", url: "https://deadline.com/2024/01/may-december-charles-melton-interview-1235708785/" },
          { headline: "Charles Melton Is the Biggest Surprise This Awards Season", publication: "Rolling Stone", url: "https://www.rollingstone.com/tv-movies/tv-movie-features/charles-melton-interview-may-december-oscars-natalie-portman-julianne-moore-riverdale-1234917450/" },
          { headline: "How 'Beef' Creator Lee Sung Jin Landed Season 2 Star Charles Melton", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-features/beef-lee-sung-jin-charles-melton-season-2-interview-1236568622/" }
        ],
        currentEventsReason: "May December breakthrough generated sustained awards buzz; clean public profile with no controversy and strong critical momentum into Beef Season 2."
      },
      chemistryFactors: {
        originRegion: "US-West",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 4,
        franchiseOverlap: [],
        ageBracket: 35
      }
    },
    {
      id: "kaelen-woonatai",
      name: "D'Pharaoh Woon-A-Tai",
      role: "Kaelen Sol",
      stats: { rtScore: 91, cost: 2000000, divaRating: 1 },
      background: { ethnicity: "Two or more races/Other", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Reservation Dogs tape is extraordinary. Brings a rebellious rawness that would redefine Kaelen entirely. Highest ceiling in this pool by a wide margin.",
        type: "Heroic Lead",
        agency: "Independent",
        availability: "Pinned",
        availabilityWindow: "June – November 2026",
        strengths: ["Raw Energy", "Authenticity", "Rebellious Spirit"],
        genreExperience: ["Drama", "Comedy", "Action"],
        articles: [
          { headline: "D'Pharaoh Woon-A-Tai on 'Reservation Dogs' Finally Getting It Due", publication: "Deadline", url: "https://deadline.com/2024/08/reservation-dogs-dpharaoh-woon-a-tai-interview-emmys-1236033993/" },
          { headline: "D'Pharaoh Woon-A-Tai on 'Reservation Dogs' Impact on Indigenous Storytelling", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-features/dpharaoh-woon-a-tai-reservation-dogs-interview-indigenous-storytelling-1235966697/" },
          { headline: "Warfare Cast Q&A: Will Poulter, Kit Connor, D'Pharaoh Woon-A-Tai", publication: "IndieWire", url: "https://www.indiewire.com/features/interviews/warfare-cast-will-poulter-kit-connor-dpharaoh-woon-a-tai-1235110882/" }
        ],
        currentEventsReason: "Emmy recognition for Reservation Dogs and Warfare casting have elevated his profile; industry favorite with clean press and strong Indigenous storytelling advocacy."
      },
      chemistryFactors: {
        originRegion: "Canada",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [
          { actorId: "kaelen-poulter", sentiment: "positive", note: "Co-starred in Warfare (2025); praised each other's commitment and on-set chemistry extensively across press tours" }
        ],
        publicSentiment: 5,
        franchiseOverlap: [],
        ageBracket: 23
      }
    },

    // ── Vaneen Kor ────────────────────────────────────────────────────────
    {
      id: "vaneen-debicki",
      name: "Elizabeth Debicki",
      role: "Vaneen Kor",
      stats: { rtScore: 88, cost: 8000000, divaRating: 2 },
      background: { ethnicity: "White", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Imposing and ethereal. The Crown work demonstrated she can make composed authority feel genuinely threatening without ever raising her voice.",
        type: "Villain Lead",
        agency: "UTA",
        availability: "Pinned",
        availabilityWindow: "April – August 2026",
        strengths: ["Ethereal Presence", "Composed Menace", "Intelligence"],
        genreExperience: ["Drama", "Thriller", "Sci-Fi", "Historical"],
        articles: [
          { headline: "Elizabeth Debicki Talks 'MaXXXine' Role After Playing Princess Diana", publication: "Deadline", url: "https://deadline.com/2024/07/elizabeth-debicki-maxxxine-role-medicinal-palate-cleanser-playing-princess-diana-the-crown-1236002672/" },
          { headline: "Elizabeth Debicki Wins Emmy for Supporting Actress In Drama Series", publication: "Deadline", url: "https://deadline.com/2024/09/elizabeth-debicki-wins-supporting-actress-drama-series-the-crown-1236086282/" },
          { headline: "Elizabeth Debicki & Emma Corrin on Failed 'Crown' Auditions, Sharing the Role of Diana", publication: "Variety", url: "https://variety.com/2024/tv/news/elizabeth-debicki-emma-corrin-playing-diana-the-crown-1236021961/" }
        ],
        currentEventsReason: "Emmy win for The Crown cemented her as one of the most acclaimed prestige performers working; universally praised with zero controversy."
      },
      chemistryFactors: {
        originRegion: "Australia",
        trainingLineage: ["VCA"],
        actingEthos: "technical",
        pastCollaborations: [],
        publicSentiment: 5,
        franchiseOverlap: ["MCU"],
        ageBracket: 35
      }
    },
    {
      id: "vaneen-ferguson",
      name: "Rebecca Ferguson",
      role: "Vaneen Kor",
      stats: { rtScore: 86, cost: 12000000, divaRating: 3 },
      background: { ethnicity: "White", currentEvents: "Neutral" },
      metadata: {
        tapeNotes: "A master of 'composed but dangerous.' Dune proved she can anchor sci-fi world-building with minimal exposition. The Vaneen role reads as if written for her archetype.",
        type: "Villain Lead",
        agency: "CAA",
        availability: "Checking",
        availabilityWindow: "July – November 2026",
        strengths: ["Composed Danger", "Physicality", "Screen Authority"],
        genreExperience: ["Sci-Fi", "Action", "Thriller", "Drama"],
        articles: [
          { headline: "Rebecca Ferguson on 'Idiot' Co-Star Who 'Screamed' at Her On Set", publication: "Variety", url: "https://variety.com/2025/film/news/rebecca-ferguson-idiot-co-star-screamed-on-set-1236546641/" },
          { headline: "Rebecca Ferguson On 'Silo' & 'Mission: Impossible' Memories", publication: "Deadline", url: "https://deadline.com/2024/04/20-questions-on-deadline-podcast-rebecca-ferguson-interview-silo-news-mission-impossible-1235889398/" },
          { headline: "Rebecca Ferguson: 'I Will Shove Someone Under a Bus to Make a Point'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/rebecca-ferguson-interview-tom-cruise-1236397784/" }
        ],
        currentEventsReason: "Publicly named a screaming co-star in interviews, generating mixed press; story remains unresolved and has tempered an otherwise strong public image."
      },
      chemistryFactors: {
        originRegion: "Sweden",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [
          { actorId: "kaelen-butler", sentiment: "positive", note: "Co-starred in Dune: Part Two (2024); Austin Butler is not the unidentified screaming co-star — no documented issues between them" }
        ],
        publicSentiment: 2,
        franchiseOverlap: ["Dune", "Mission Impossible"],
        ageBracket: 42
      }
    },
    {
      id: "vaneen-goth",
      name: "Mia Goth",
      role: "Vaneen Kor",
      stats: { rtScore: 84, cost: 6000000, divaRating: 4 },
      background: { ethnicity: "Two or more races/Other", currentEvents: "Negative" },
      metadata: {
        tapeNotes: "Pearl and X prove she can sustain genuine unease for a full runtime. A zealot interpretation of Vaneen — less philosophical, more feral. High risk, highest impact.",
        type: "Villain Lead",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "May – September 2026",
        strengths: ["Intensity", "Unease", "Zealot Commitment"],
        genreExperience: ["Horror", "Drama", "Thriller"],
        articles: [
          { headline: "Mia Goth on Starring in 'Frankenstein': 'I've Never Been So Scared'", publication: "Variety", url: "https://variety.com/2025/film/actors/mia-goth-starring-frankenstein-scared-1236542779/" },
          { headline: "MaXXXine Star Mia Goth, Director Ti West on the End of the X Trilogy", publication: "Variety", url: "https://variety.com/2024/scene/news/maxxxine-mia-goth-ti-west-1236048040/" },
          { headline: "Mia Goth on 'The Odyssey' and 'Star Wars: Starfighter'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/mia-goth-interview-the-odyssey-star-wars-starfighter-1236465342/" }
        ],
        currentEventsReason: "An assault lawsuit filed by an extra on the MaXXXine set in 2024 remains active; the legal exposure is a significant reputational liability for a studio production."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: [],
        actingEthos: "method",
        pastCollaborations: [
          { actorId: "jaxen-atj", sentiment: "negative", note: "Ex-spouses (married 2012, divorced 2022); tabloid coverage documents ongoing personal and professional friction during shared promotional circuits" }
        ],
        publicSentiment: -2,
        franchiseOverlap: [],
        ageBracket: 32
      }
    },
    {
      id: "vaneen-negga",
      name: "Ruth Negga",
      role: "Vaneen Kor",
      stats: { rtScore: 92, cost: 4000000, divaRating: 1 },
      background: { ethnicity: "Two or more races/Other", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Deeply expressive and morally complex. Passing showed she can hold internal contradiction with complete conviction. Undervalued — this role could be definitively hers.",
        type: "Villain Lead",
        agency: "Independent",
        availability: "Pinned",
        availabilityWindow: "April – September 2026",
        strengths: ["Moral Complexity", "Expressiveness", "Conviction"],
        genreExperience: ["Drama", "Thriller", "Historical", "Sci-Fi"],
        articles: [
          { headline: "Ruth Negga on Chase Infiniti in 'Presumed Innocent'", publication: "IndieWire", url: "https://www.indiewire.com/features/interviews/ruth-negga-on-chase-infiniti-presumed-innocent-1235163502/" },
          { headline: "Ruth Negga on 'Passing' and the Importance of the Past", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-features/passing-ruth-nega-1235073216/" },
          { headline: "Ruth Negga Interview: 'Passing' Is a 'Fuck You Machine' to the Establishment", publication: "IndieWire", url: "https://www.indiewire.com/awards/consider-this/ruth-negga-interview-passing-1234676289/" }
        ],
        currentEventsReason: "Critically celebrated for Passing and Presumed Innocent; widely regarded as one of the most undervalued performers working, with a spotless press record."
      },
      chemistryFactors: {
        originRegion: "Ireland",
        trainingLineage: ["Trinity College Dublin"],
        actingEthos: "technical",
        pastCollaborations: [],
        publicSentiment: 4,
        franchiseOverlap: [],
        ageBracket: 44
      }
    },
    {
      id: "vaneen-chan",
      name: "Gemma Chan",
      role: "Vaneen Kor",
      stats: { rtScore: 80, cost: 8000000, divaRating: 2 },
      background: { ethnicity: "Asian", currentEvents: "Neutral" },
      metadata: {
        tapeNotes: "Cold, calculated authority. Eternals showed she can carry sci-fi world-building with minimal exposition. Vaneen's 'scientist-philosopher' reads naturally on her.",
        type: "Villain Lead",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "May – October 2026",
        strengths: ["Cold Authority", "Intelligence", "Poise"],
        genreExperience: ["Sci-Fi", "Drama", "Action"],
        articles: [
          { headline: "Gemma Chan Joins 'Five-Star Weekend' Series at Peacock", publication: "Variety", url: "https://variety.com/2025/tv/news/gemma-chan-five-star-weekend-peacock-1236424995/" },
          { headline: "Gemma Chan Developing Anna May Wong Biopic With Working Title Films", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/anna-may-wong-biopic-gemma-chan-1235118243/" },
          { headline: "Gemma Chan & Shawn Levy Developing Time Travel Series at Netflix", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-news/gemma-chan-shawn-levy-netflix-time-travel-limited-series-1235174410/" }
        ],
        currentEventsReason: "In a relatively quiet period between major releases; no controversy but limited cultural visibility — development projects haven't yet generated public heat."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: ["RADA"],
        actingEthos: "technical",
        pastCollaborations: [],
        publicSentiment: 3,
        franchiseOverlap: ["MCU"],
        ageBracket: 43
      }
    },
    {
      id: "vaneen-atj",
      name: "Anya Taylor-Joy",
      role: "Vaneen Kor",
      stats: { rtScore: 94, cost: 18000000, divaRating: 5 },
      background: { ethnicity: "Two or more races/Other", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "The Queen's Gambit is a masterclass in intellectual dominance. Expensive and schedule-heavy, but the marquee value is unmatched in this pool.",
        type: "Villain Lead",
        agency: "CAA",
        availability: "Checking",
        availabilityWindow: "August – December 2026",
        strengths: ["Intellectual Dominance", "Screen Magnetism", "Marquee Value"],
        genreExperience: ["Drama", "Thriller", "Sci-Fi", "Action"],
        articles: [
          { headline: "Anya Taylor-Joy Talks 'Furiosa' Prep, 'Dune 3' Hopes, Surprise Wedding", publication: "Variety", url: "https://variety.com/2024/film/news/anya-taylor-joy-furiosa-dune-3-surprise-wedding-1235992889/" },
          { headline: "Anya Taylor-Joy Went Months On 'Furiosa' Set Without Speaking", publication: "Variety", url: "https://variety.com/2024/film/news/anya-taylor-joy-furiosa-set-not-speaking-1236000553/" },
          { headline: "Anya Taylor-Joy Says She's Never Been More Alone Than on 'Furiosa' Set", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/anya-taylor-joy-intense-furiosa-filming-1235898317/" }
        ],
        currentEventsReason: "Furiosa global press tour praised; surprise wedding generated warm tabloid coverage. Method dedication is framed as commitment, not controversy."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 4,
        franchiseOverlap: [],
        ageBracket: 30
      }
    },

    // ── Jaxen Vane ────────────────────────────────────────────────────────
    {
      id: "jaxen-keoghan",
      name: "Barry Keoghan",
      role: "Jaxen Vane",
      stats: { rtScore: 90, cost: 10000000, divaRating: 3 },
      background: { ethnicity: "White", currentEvents: "Negative" },
      metadata: {
        tapeNotes: "Saltburn confirmed he is the most unpredictable wild card working today. Jaxen's survival instinct and dark-side history will feel genuinely unnerving.",
        type: "Anti-Hero",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "April – August 2026",
        strengths: ["Unpredictability", "Magnetism", "Menace"],
        genreExperience: ["Drama", "Thriller", "Action", "Sci-Fi"],
        articles: [
          { headline: "Barry Keoghan & Franz Rogowski on Andrea Arnold's 'Bird'", publication: "IndieWire", url: "https://www.indiewire.com/features/interviews/barry-keoghan-franz-rogowski-andrea-arnold-bird-interview-1235008760/" },
          { headline: "Will Barry Keoghan Be in 'The Batman 2'?", publication: "Variety", url: "https://variety.com/2024/film/news/barry-keoghan-joker-batman-2-1236136417/" },
          { headline: "Barry Keoghan Met With Ringo Starr to 'Study Him' for Upcoming Film", publication: "Rolling Stone", url: "https://www.rollingstone.com/tv-movies/tv-movie-news/barry-keoghan-ringo-starr-upcoming-films-meeting-1235334206/" }
        ],
        currentEventsReason: "Tabloid fallout from the Sabrina Carpenter breakup — including reported behavior allegations — has significantly dented public sentiment despite strong critical standing."
      },
      chemistryFactors: {
        originRegion: "Ireland",
        trainingLineage: [],
        actingEthos: "method",
        pastCollaborations: [],
        publicSentiment: -1,
        franchiseOverlap: ["DC"],
        ageBracket: 33
      }
    },
    {
      id: "jaxen-patel",
      name: "Dev Patel",
      role: "Jaxen Vane",
      stats: { rtScore: 88, cost: 10000000, divaRating: 2 },
      background: { ethnicity: "Asian", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "The Green Knight is the tape to watch — rugged, weary, morally adrift. Jaxen's 'just want to survive' energy maps perfectly onto his range.",
        type: "Anti-Hero",
        agency: "CAA",
        availability: "Pinned",
        availabilityWindow: "May – October 2026",
        strengths: ["Rugged Heroism", "World-Weariness", "Physicality"],
        genreExperience: ["Drama", "Action", "Fantasy", "Sci-Fi"],
        articles: [
          { headline: "Why Dev Patel Needed to Make 'Monkey Man'", publication: "Rolling Stone", url: "https://www.rollingstone.com/tv-movies/tv-movie-features/monkey-man-dev-patel-interview-1234995357/" },
          { headline: "Dev Patel on 'Monkey Man' Sequel and Trans Representation", publication: "Variety", url: "https://variety.com/2024/film/columns/dev-patel-monkey-man-sequel-trans-representation-1235960318/" },
          { headline: "Dev Patel to Star in Tarsem Singh Tennis Crime Thriller", publication: "Variety", url: "https://variety.com/2024/film/global/dev-patel-tarsem-singh-the-journeyman-agc-caa-afm-1236197483/" }
        ],
        currentEventsReason: "Monkey Man directorial debut was culturally celebrated; strong advocacy press for diverse representation with a completely clean public record."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 5,
        franchiseOverlap: [],
        ageBracket: 36
      }
    },
    {
      id: "jaxen-white",
      name: "Jeremy Allen White",
      role: "Jaxen Vane",
      stats: { rtScore: 95, cost: 10000000, divaRating: 4 },
      background: { ethnicity: "White", currentEvents: "Neutral" },
      metadata: {
        tapeNotes: "The Bear is a sustained high-wire act of street-smart grit. Jaxen's cynicism and chaos feel native to him. Currently the hottest actor in the pool.",
        type: "Anti-Hero",
        agency: "UTA",
        availability: "Checking",
        availabilityWindow: "June – October 2026",
        strengths: ["Intensity", "Grit", "Controlled Volatility"],
        genreExperience: ["Drama", "Thriller", "Action"],
        articles: [
          { headline: "Jeremy Allen White on 'The Bear' Season 5 and 'Mandalorian & Grogu'", publication: "Variety", url: "https://variety.com/2025/film/columns/jeremy-allen-white-the-bear-season-5-mandalorian-grogu-1236591934/" },
          { headline: "Jeremy Allen White Discusses the 'Boundary' of Playing Bruce Springsteen", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/jeremy-allen-white-boundary-bruce-springsteen-moments-1236407393/" },
          { headline: "Jeremy Allen White Got More Texts About Springsteen Than 'The Bear'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/jeremy-allen-white-bruce-springsteen-texts-the-bear-1236301206/" }
        ],
        currentEventsReason: "Ongoing public divorce proceedings with Addison Timlin have generated steady tabloid coverage; critical standing remains sky-high but personal press is a distraction."
      },
      chemistryFactors: {
        originRegion: "US-Northeast",
        trainingLineage: ["LaGuardia High School"],
        actingEthos: "method",
        pastCollaborations: [
          { actorId: "t0-edebiri", sentiment: "positive", note: "Co-stars on The Bear (2022–present); well-documented creative partnership and mutual admiration across press circuits and award shows" }
        ],
        publicSentiment: 2,
        franchiseOverlap: [],
        ageBracket: 35
      }
    },
    {
      id: "jaxen-stanfield",
      name: "Lakeith Stanfield",
      role: "Jaxen Vane",
      stats: { rtScore: 86, cost: 6000000, divaRating: 5 },
      background: { ethnicity: "Black/African American", currentEvents: "Neutral" },
      metadata: {
        tapeNotes: "Eccentric and deeply magnetic. Atlanta shows he can make unpredictability feel lived-in rather than performed. Needs a director who understands his process.",
        type: "Anti-Hero",
        agency: "WME",
        availability: "Checking",
        availabilityWindow: "July – November 2026",
        strengths: ["Eccentricity", "Magnetism", "Unpredictability"],
        genreExperience: ["Drama", "Comedy", "Thriller", "Sci-Fi"],
        articles: [
          { headline: "LaKeith Stanfield Joins Jennifer Lawrence In Thriller 'Die, My Love'", publication: "Deadline", url: "https://deadline.com/2024/08/lakeith-stanfield-jennifer-lawrence-die-my-love-1236037280/" },
          { headline: "LaKeith Stanfield Joins Raoul Peck Film 'Ernest Cole: Lost and Found'", publication: "Variety", url: "https://variety.com/2024/film/news/lakeith-stanfield-raoul-peck-ernest-cole-lost-and-found-documentary-1235907766/" },
          { headline: "Why Raoul Peck Cast Lakeith Stanfield to Voice Apartheid Photographer Ernest Cole", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/why-raoul-peck-lakeith-stanfield-earnest-cannes-1235903343/" }
        ],
        currentEventsReason: "Past social media controversies haven't fully cleared; currently in a quieter professional period — no active press heat in either direction."
      },
      chemistryFactors: {
        originRegion: "US-West",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 1,
        franchiseOverlap: [],
        ageBracket: 34
      }
    },
    {
      id: "jaxen-atj",
      name: "Aaron Taylor-Johnson",
      role: "Jaxen Vane",
      stats: { rtScore: 78, cost: 12000000, divaRating: 3 },
      background: { ethnicity: "White", currentEvents: "Negative" },
      metadata: {
        tapeNotes: "Bullet Train showed high energy and kinetic physical capability. Less nuanced than others in the pool but delivers a Han Solo foil energy that lands immediately.",
        type: "Anti-Hero",
        agency: "CAA",
        availability: "Pinned",
        availabilityWindow: "April – July 2026",
        strengths: ["Kinetic Energy", "Physicality", "Action Instincts"],
        genreExperience: ["Action", "Sci-Fi", "Drama", "Thriller"],
        articles: [
          { headline: "Aaron Taylor-Johnson on James Bond Rumors and Making Superhero Movies", publication: "Variety", url: "https://variety.com/2024/film/news/aaron-taylor-johnson-james-bond-superhero-movies-challenging-1235947114/" },
          { headline: "David Mackenzie & Aaron Taylor-Johnson on How 'Fuze' Is 'Pure Entertainment'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/david-mackenzie-aaron-taylor-johnson-fuze-interview-tiff-1236363387/" },
          { headline: "Jodie Comer, Aaron Taylor-Johnson at '28 Years Later' World Premiere", publication: "Variety", url: "https://variety.com/2025/film/news/jodie-comer-aaron-taylor-johnson-28-years-later-premiere-1236435645/" }
        ],
        currentEventsReason: "Serious allegations published by UK tabloids regarding his relationship with director Sam Taylor-Johnson have caused significant reputational damage; story widely covered and unresolved."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: ["Anna Scher Theatre"],
        actingEthos: "method",
        pastCollaborations: [
          { actorId: "vaneen-goth", sentiment: "negative", note: "Ex-spouses (married 2012, divorced 2022); tabloid coverage documents ongoing personal and professional friction during shared promotional circuits" }
        ],
        publicSentiment: -3,
        franchiseOverlap: ["MCU"],
        ageBracket: 35
      }
    },

    // ── Chancellor Aris Thorne ────────────────────────────────────────────
    {
      id: "thorne-yeoh",
      name: "Michelle Yeoh",
      role: "Chancellor Aris Thorne",
      stats: { rtScore: 96, cost: 20000000, divaRating: 2 },
      background: { ethnicity: "Asian", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Immediate gravitas. Everything Everywhere confirmed she can anchor a film's political and emotional weight simultaneously. The role was built for this tier of performer.",
        type: "Political Authority",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "May – September 2026",
        strengths: ["Gravitas", "Command", "Emotional Range"],
        genreExperience: ["Sci-Fi", "Action", "Drama", "Fantasy"],
        articles: [
          { headline: "Michelle Yeoh On 'Wicked' & Why Hollywood Needs To Back Diverse Stories", publication: "Deadline", url: "https://deadline.com/2024/12/michelle-yeoh-wicked-everything-everywhere-all-at-once-crouching-tiger-hidden-dragon-red-sea-1236196213/" },
          { headline: "Michelle Yeoh on 'Wicked' Oscars and 'The Wizard and I'", publication: "Variety", url: "https://variety.com/2024/film/global/michelle-yeoh-wicked-oscars-wizard-and-i-1236241490/" },
          { headline: "Michelle Yeoh Hopes She 'Made a Difference for Actors Who Look Like Me'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-features/michelle-yeoh-interview-berlin-2026-diversity-wicked-1236503486/" }
        ],
        currentEventsReason: "Sustained Oscar goodwill and global ambassador status for diverse storytelling; one of the most universally admired performers in the industry with zero controversy."
      },
      chemistryFactors: {
        originRegion: "Malaysia",
        trainingLineage: ["Royal Academy of Dance"],
        actingEthos: "technical",
        pastCollaborations: [
          { actorId: "t0-awkwafina", sentiment: "positive", note: "Co-starred in Shang-Chi and the Legend of the Ten Rings (2021); warm professional relationship documented in press and promotional appearances" }
        ],
        publicSentiment: 5,
        franchiseOverlap: ["MCU"],
        ageBracket: 63
      }
    },
    {
      id: "thorne-bassett",
      name: "Angela Bassett",
      role: "Chancellor Aris Thorne",
      stats: { rtScore: 91, cost: 18000000, divaRating: 3 },
      background: { ethnicity: "Black/African American", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Power, dignity, and a voice that commands every room. Wakanda Forever proved she can make political authority feel deeply human within an ensemble spectacle.",
        type: "Political Authority",
        agency: "CAA",
        availability: "Pinned",
        availabilityWindow: "April – August 2026",
        strengths: ["Power", "Dignity", "Voice Authority"],
        genreExperience: ["Drama", "Action", "Sci-Fi", "Historical"],
        articles: [
          { headline: "Angela Bassett On Feeling 'Disappointed' At Losing Oscar To Jamie Lee Curtis", publication: "Deadline", url: "https://deadline.com/2025/02/angela-bassett-feeling-disappointed-oscar-loss-jamie-lee-curtis-1236296534/" },
          { headline: "Angela Bassett On Narrating 'Queens' And What's Coming Next On '9-1-1'", publication: "Deadline", url: "https://deadline.com/2024/06/queens-national-geographic-documentary-series-narrator-angela-bassett-interview-1235969873/" },
          { headline: "Angela Bassett on Why She First Declined Narrating Nat Geo's 'Queens'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-features/angela-bassett-interview-nat-geo-queens-1235983735/" }
        ],
        currentEventsReason: "Respected industry veteran with Oscar nomination for Wakanda Forever; candid remarks about her loss were received with empathy rather than controversy — widely admired."
      },
      chemistryFactors: {
        originRegion: "US-Southeast",
        trainingLineage: ["Yale School of Drama"],
        actingEthos: "technical",
        pastCollaborations: [],
        publicSentiment: 5,
        franchiseOverlap: ["MCU"],
        ageBracket: 67
      }
    },
    {
      id: "thorne-swinton",
      name: "Tilda Swinton",
      role: "Chancellor Aris Thorne",
      stats: { rtScore: 93, cost: 10000000, divaRating: 5 },
      background: { ethnicity: "White", currentEvents: "Neutral" },
      metadata: {
        tapeNotes: "A more alien, detached political figure. Swinton makes bureaucracy feel cosmic. Requires creative latitude — Thorne becomes something stranger and more unsettling in her hands.",
        type: "Political Authority",
        agency: "ICM",
        availability: "Checking",
        availabilityWindow: "August – November 2026",
        strengths: ["Otherworldliness", "Detachment", "Transformation"],
        genreExperience: ["Fantasy", "Sci-Fi", "Drama", "Horror"],
        articles: [
          { headline: "'The Room Next Door': Julianne Moore, Tilda Swinton, Pedro Almodóvar Interview", publication: "Deadline", url: "https://deadline.com/2024/11/the-room-next-door-julianne-moore-pedro-almodovar-tilda-swinton-interview-1236178994/" },
          { headline: "Adrien Brody and Tilda Swinton on 'The Brutalist' and Mortality", publication: "Variety", url: "https://variety.com/2024/film/news/adrien-brody-tilda-swinton-interview-the-brutalist-mortality-1236237615/" },
          { headline: "Tilda Swinton on Film 'Heart of Light – eleven songs for Fiji'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/tilda-swinton-fiji-film-interview-heart-of-light-rotterdam-1236492808/" }
        ],
        currentEventsReason: "Critically revered but polarizing for general audiences; limited mainstream box office draw and an unconventional public image temper broader audience enthusiasm."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: ["Cambridge", "RSC"],
        actingEthos: "method",
        pastCollaborations: [],
        publicSentiment: 3,
        franchiseOverlap: ["MCU"],
        ageBracket: 65
      }
    },
    {
      id: "thorne-colman",
      name: "Olivia Colman",
      role: "Chancellor Aris Thorne",
      stats: { rtScore: 97, cost: 14000000, divaRating: 3 },
      background: { ethnicity: "White", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Can pivot from warmly approachable to ruthless in a single cut. The Favourite and The Crown prove it. Thorne's 'tired of Jedi nonsense' energy is native to her comedic-dramatic range.",
        type: "Political Authority",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "May – October 2026",
        strengths: ["Comedic-Dramatic Range", "Warmth into Ruthlessness", "Precision"],
        genreExperience: ["Drama", "Comedy", "Historical", "Thriller"],
        articles: [
          { headline: "Olivia Colman Talks Pay Disparity: 'If I Was Oliver Colman, I'd Earn a Lot More'", publication: "Rolling Stone", url: "https://www.rollingstone.com/tv-movies/tv-movie-news/olivia-colman-gender-pay-gap-hollywood-1234993701/" },
          { headline: "Olivia Colman on How 'Jimpa' Helped Her Rediscover Her Love of Acting", publication: "Variety", url: "https://variety.com/2026/film/markets-festivals/olivia-colman-jimpa-hollywood-fear-queer-stories-1236664498/" },
          { headline: "Olivia Colman On Pay Disparity In Hollywood", publication: "Deadline", url: "https://deadline.com/2024/03/olivia-colman-pay-disparity-hollywood-1235866877/" }
        ],
        currentEventsReason: "Pay equity advocacy has boosted public image; consistently praised by critics and peers with a warm, witty press persona that generates broadly positive coverage."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: ["Cambridge Footlights"],
        actingEthos: "technical",
        pastCollaborations: [],
        publicSentiment: 5,
        franchiseOverlap: [],
        ageBracket: 52
      }
    },
    {
      id: "thorne-aghdashloo",
      name: "Shohreh Aghdashloo",
      role: "Chancellor Aris Thorne",
      stats: { rtScore: 90, cost: 4000000, divaRating: 1 },
      background: { ethnicity: "Two or more races/Other", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "The Expanse is the definitive proof — no-nonsense galactic authority delivered with complete conviction. Lowest diva rating in the pool. Exceptional value. Hire her.",
        type: "Political Authority",
        agency: "Independent",
        availability: "Pinned",
        availabilityWindow: "March – September 2026",
        strengths: ["Authority", "No-Nonsense Presence", "Voice"],
        genreExperience: ["Sci-Fi", "Drama", "Thriller", "Action"],
        articles: [
          { headline: "'Wheel of Time' Season 3 Casts Shohreh Aghdashloo", publication: "Variety", url: "https://variety.com/2024/tv/news/wheel-of-time-season-3-cast-shohreh-aghdashloo-1236245090/" },
          { headline: "Shohreh Aghdashloo on 'The Penguin' Being Compared to 'The Sopranos'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/video/shohreh-aghdashloo-the-penguin-compared-the-sopranos/" },
          { headline: "The Exiles of Tehrangeles: Struggle and Reinvention in Hollywood", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/news/politics-news/exiles-of-tehrangeles-struggle-reinvention-hollywood-1236325732/" }
        ],
        currentEventsReason: "The Expanse fanbase loyalty remains strong; The Penguin press warmly received and her Wheel of Time casting keeps her visible — clean record, exceptional industry reputation."
      },
      chemistryFactors: {
        originRegion: "Iran",
        trainingLineage: [],
        actingEthos: "technical",
        pastCollaborations: [],
        publicSentiment: 4,
        franchiseOverlap: [],
        ageBracket: 73
      }
    },

    // ── T-0 ───────────────────────────────────────────────────────────────
    {
      id: "t0-awkwafina",
      name: "Awkwafina",
      role: "T-0",
      stats: { rtScore: 82, cost: 6000000, divaRating: 4 },
      background: { ethnicity: "Asian", currentEvents: "Negative" },
      metadata: {
        tapeNotes: "Fast-talking anxiety that could make T-0's hardware-vs-software conflict feel genuinely comedic and genuinely sad. Shang-Chi voicework was tight.",
        type: "Voice / Mo-cap",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "April – August 2026",
        strengths: ["Comic Timing", "Anxious Energy", "Voice Distinctiveness"],
        genreExperience: ["Comedy", "Action", "Sci-Fi", "Animation"],
        articles: [
          { headline: "Awkwafina & Paul Feig Talk Brand Shout-Outs in 'Jackpot!'", publication: "Variety", url: "https://variety.com/2024/film/news/awkwafina-paul-feig-jackpot-amazon-ads-immersion-day-1236108057/" },
          { headline: "Sandra Oh & Awkwafina on Working With Paul Reubens on 'Quiz Lady'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-features/sandra-oh-awkwafina-interview-paul-reubens-quiz-lady-1235974442/" },
          { headline: "'Black Mirror' Season 7 Cast Revealed for 2025", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-news/black-mirror-season-7-cast-1236006886/" }
        ],
        currentEventsReason: "Blaccent controversy from 2023 was never publicly addressed or apologized for; ongoing community backlash continues to suppress broader audience goodwill despite strong career output."
      },
      chemistryFactors: {
        originRegion: "US-Northeast",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [
          { actorId: "thorne-yeoh", sentiment: "positive", note: "Co-starred in Shang-Chi and the Legend of the Ten Rings (2021); warm professional relationship documented in press and promotional appearances" }
        ],
        publicSentiment: -1,
        franchiseOverlap: ["MCU"],
        ageBracket: 37
      }
    },
    {
      id: "t0-goldstein",
      name: "Brett Goldstein",
      role: "T-0",
      stats: { rtScore: 89, cost: 5000000, divaRating: 2 },
      background: { ethnicity: "White", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "Roy Kent energy in a librarian droid chassis. Dry, grumpy, secretly heartfelt — Ted Lasso proved he can sustain that contradiction across a long run. Would be the breakout voice of the film.",
        type: "Voice / Mo-cap",
        agency: "CAA",
        availability: "Pinned",
        availabilityWindow: "May – September 2026",
        strengths: ["Dry Wit", "Gruff Warmth", "Comedic Timing"],
        genreExperience: ["Comedy", "Drama", "Action"],
        articles: [
          { headline: "Brett Goldstein on More 'Shrinking,' 'Ted Lasso' and His Next Standup", publication: "Variety", url: "https://variety.com/2025/tv/awards/brett-goldstein-shrinking-ted-lasso-next-standup-1236433658/" },
          { headline: "Brett Goldstein on His Dark Turn on 'Shrinking' and 'Ted Lasso' Season 4", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-features/brett-goldstein-interview-shrinking-ted-lasso-1236026916/" },
          { headline: "Brett Goldstein Talks His Toronto Festival Romance 'All of You'", publication: "Variety", url: "https://variety.com/2024/film/news/brett-goldstein-toronto-1236130725/" }
        ],
        currentEventsReason: "Shrinking Season 2 praised; Ted Lasso legacy remains a cultural touchstone and he continues to generate warm, enthusiastic press with no controversy on record."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: [],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 5,
        franchiseOverlap: ["MCU"],
        ageBracket: 46
      }
    },
    {
      id: "t0-edebiri",
      name: "Ayo Edebiri",
      role: "T-0",
      stats: { rtScore: 93, cost: 6000000, divaRating: 1 },
      background: { ethnicity: "Black/African American", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "The Bear's Sydney energy — fast-talking, competent-but-panicking, deeply earnest underneath the chaos. T-0's anxiety about its own hardware would be devastating and funny in her hands.",
        type: "Voice / Mo-cap",
        agency: "UTA",
        availability: "Checking",
        availabilityWindow: "June – October 2026",
        strengths: ["Nervous Energy", "Earnestness", "Comic Depth"],
        genreExperience: ["Comedy", "Drama", "Animation"],
        articles: [
          { headline: "Ayo Edebiri Says #MeToo and Black Lives Matter Are Not Dead", publication: "Variety", url: "https://variety.com/2025/film/news/ayo-edebiri-me-too-black-lives-matter-not-dead-interview-1236511707/" },
          { headline: "Ayo Edebiri on Directing 'The Bear' Season 3, Episode 6", publication: "IndieWire", url: "https://www.indiewire.com/awards/consider-this/ayo-edebiri-the-bear-director-interview-1235079146/" },
          { headline: "Ayo Edebiri On 'The Bear' & Luca Guadagnino Film 'After The Hunt'", publication: "Deadline", url: "https://deadline.com/2025/02/ayo-edebiri-the-bear-after-the-hunt-interview-1236282883/" }
        ],
        currentEventsReason: "Cultural moment fully sustained — Emmy recognition, strong advocacy press, and broad Gen-Z appeal keep her at the center of the conversation with zero controversy."
      },
      chemistryFactors: {
        originRegion: "US-Northeast",
        trainingLineage: ["NYU"],
        actingEthos: "intuitive",
        pastCollaborations: [
          { actorId: "jaxen-white", sentiment: "positive", note: "Co-stars on The Bear (2022–present); well-documented creative partnership and mutual admiration across press circuits and award shows" }
        ],
        publicSentiment: 5,
        franchiseOverlap: [],
        ageBracket: 30
      }
    },
    {
      id: "t0-ayoade",
      name: "Richard Ayoade",
      role: "T-0",
      stats: { rtScore: 85, cost: 2000000, divaRating: 1 },
      background: { ethnicity: "Two or more races/Other", currentEvents: "Positive" },
      metadata: {
        tapeNotes: "The classic choice — sophisticated, awkward, mildly appalled by everything. IT Crowd and his own directorial voice confirm he can make intellectual anxiety feel warmly British and deeply strange.",
        type: "Voice / Mo-cap",
        agency: "Independent",
        availability: "Pinned",
        availabilityWindow: "April – November 2026",
        strengths: ["Intellectual Awkwardness", "Deadpan", "Warmth"],
        genreExperience: ["Comedy", "Drama", "Animation"],
        articles: [
          { headline: "Wes Anderson Teases Next Project With Richard Ayoade & Roman Coppola at Cannes", publication: "Deadline", url: "https://deadline.com/2025/05/wes-anderson-next-movie-richard-ayoade-roman-coppola-cannes-1236404089/" },
          { headline: "Wes Anderson Teases His Next Film in Cannes Starring Richard Ayoade", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/wes-anderson-next-film-richard-ayoade-roman-coppola-1236221174/" },
          { headline: "Ben Stiller, Jesse Eisenberg, Sally Hawkins Circling Ayoade's 'Semplica Girl Diaries'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/movies/movie-news/semplica-girl-diaries-ben-stiller-jesse-eisenberg-sally-hawkins-1235324096/" }
        ],
        currentEventsReason: "Wes Anderson collaboration generating positive critical buzz; clean press record throughout his career with strong industry admiration and no public controversy."
      },
      chemistryFactors: {
        originRegion: "UK",
        trainingLineage: ["Cambridge Footlights"],
        actingEthos: "technical",
        pastCollaborations: [],
        publicSentiment: 4,
        franchiseOverlap: [],
        ageBracket: 49
      }
    },
    {
      id: "t0-lyonne",
      name: "Natasha Lyonne",
      role: "T-0",
      stats: { rtScore: 88, cost: 6000000, divaRating: 4 },
      background: { ethnicity: "White", currentEvents: "Neutral" },
      metadata: {
        tapeNotes: "A raspier, seen-it-all T-0 who is deeply tired but keeps going. Poker Face shows she can sustain a signature voice across a long run. T-0 as a world-weary archivist — unexpected and excellent.",
        type: "Voice / Mo-cap",
        agency: "WME",
        availability: "Pinned",
        availabilityWindow: "May – September 2026",
        strengths: ["Distinctive Voice", "World-Weariness", "Wit"],
        genreExperience: ["Comedy", "Drama", "Thriller"],
        articles: [
          { headline: "Natasha Lyonne Explains Not Starring in 'Poker Face' Revival, More 'Russian Doll'", publication: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/tv/tv-features/natasha-lyonne-poker-face-russian-doll-ai-interview-1236457719/" },
          { headline: "Natasha Lyonne On 'Uncanny Valley' and 'Copyright-Clean AI'", publication: "Deadline", url: "https://deadline.com/2025/04/natasha-lyonne-uncanny-valley-directorial-debut-copyright-clean-ai-1236382007/" },
          { headline: "Natasha Lyonne Teases Working On Her First Feature Film as Director", publication: "Deadline", url: "https://deadline.com/2024/09/natasha-lyonne-first-feature-directing-1236096702/" }
        ],
        currentEventsReason: "Divisive public persona and Poker Face revival drew mixed reactions; strong cult following but limited mainstream appeal keeps broader audience sentiment lukewarm."
      },
      chemistryFactors: {
        originRegion: "US-Northeast",
        trainingLineage: ["NYU"],
        actingEthos: "intuitive",
        pastCollaborations: [],
        publicSentiment: 3,
        franchiseOverlap: [],
        ageBracket: 47
      }
    }

  ],

  analytics: {
    usCensusBaseline: {
      "White":                    0.59,
      "Hispanic/Latino":          0.19,
      "Black/African American":   0.13,
      "Asian":                    0.06,
      "Two or more races/Other":  0.03
    },
    diversityScore: 0,
    expectedRevenue: 850000000,
    clashAlerts: []
  }
};

export default castingData;
