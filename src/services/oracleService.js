// 24XX SRD CONTENT
// Text CC BY Jason Tocci

const SRD_NAMES = {
    first: ["Aeon", "Cygnus", "Kael", "Nyx", "Orion", "Pax", "Ria", "Sol", "Vea", "Zane"],
    last: ["Black", "Chrome", "Flux", "Gale", "Haze", "Iron", "Jolt", "Nova", "Pyre", "Void"],
    surnames: [
        "Acker", "Black", "Cruz", "Dallas", "Engel", "Fox", "Gee", "Haak", "Iyer", "Joshi",
        "Kask", "Lee", "Moss", "Nash", "Park", "Qadir", "Singh", "Tran", "Ueda", "Zheng"
    ],
    nicknames: [
        "Ace", "Bliss", "Crater", "Dart", "Edge", "Fuse", "Gray", "Huggy", "Ice", "Jinx",
        "Killer", "Lucky", "Mix", "Nine", "Prof", "Red", "Sunny", "Treble", "V8", "Zero"
    ],
    shipNames: [
        "Arion", "Blackjack", "Caleuche", "Canary", "Caprice", "Chance", "Darter", "Falkor",
        "Highway Star", "Moonshot", "Morgenstern", "Phoenix", "Peregrine", "Restless",
        "Silver Blaze", "Stardust", "Sunchaser", "Swift", "Thunder Road", "Wayfarer"
    ]
}

const SRD_TABLES = {
    // Specialties (formerly Roles/Concepts)
    specialty: ["Face", "Muscle", "Psychic", "Medic", "Sneak", "Tech"],

    // Origins / Alien Traits
    trait: ["Electric current", "Wings", "Natural camouflage", "Six-limbed", "Amphibious", "Night vision", "Hardened scales", "Telepathic"],

    // Details/Demeanor
    demeanor: [
        "Anxious", "Appraising", "Blunt", "Brooding", "Calming", "Casual", "Cold", "Curious",
        "Dramatic", "Dry", "Dull", "Earnest", "Formal", "Gentle", "Innocent", "Knowing",
        "Prickly", "Reckless", "Terse", "Weary"
    ],

    // Contacts
    contact: [
        "Arcimboldo, quirky tech dealer", "Aurora, wealthy collector", "Blackout, evidence cleaner",
        "Bleach, janitor android assassin", "Bron, security chief", "Bullet, android gun runner",
        "Carryout, courier", "Fisher, street kid", "Ginseng, drug dealer", "Hot Ticket, fence",
        "Kaiser, loan shark", "Osiris, sawbones", "Powder Blue, android fixer", "Reacher, merc leader",
        "Rhino, bodyguard", "Sam, journalist", "Shifter, chop-shop owner", "Walleye, info broker",
        "Whistler, getaway driver", "X, corporate broker"
    ],

    // Missions / Jobs
    job: [
        "Deal with an unusual threat", "Investigate something inexplicable", "Retrieve a thing from a location",
        "Escort a VIP", "Sabotage a facility", "Rescue a prisoner", "Survey a dangerous planet",
        "Negotiate a treaty", "Smuggle contraband", "Defend a settlement"
    ]
}

export const getRandomOption = (key) => {
    const list = SRD_TABLES[key] || []
    if (list.length === 0) return "Unknown"
    return list[Math.floor(Math.random() * list.length)]
}

export const OracleService = {
    // Accessors
    getSpecialties: () => SRD_TABLES.specialty,
    getTraits: () => SRD_TABLES.trait,
    getDemeanors: () => SRD_TABLES.demeanor,
    getContacts: () => SRD_TABLES.contact,
    getJobs: () => SRD_TABLES.job,
    getShipNames: () => SRD_NAMES.shipNames,

    // RNG Methods
    rollSpecialty: () => getRandomOption('specialty'),
    rollTrait: () => getRandomOption('trait'),
    rollDemeanor: () => getRandomOption('demeanor'),
    rollContact: () => getRandomOption('contact'),
    rollJob: () => getRandomOption('job'),

    // Name Generators
    generateName: () => {
        const first = Math.random() > 0.5 ?
            SRD_NAMES.first[Math.floor(Math.random() * SRD_NAMES.first.length)] :
            SRD_NAMES.nicknames[Math.floor(Math.random() * SRD_NAMES.nicknames.length)]

        const last = Math.random() > 0.5 ?
            SRD_NAMES.last[Math.floor(Math.random() * SRD_NAMES.last.length)] :
            SRD_NAMES.surnames[Math.floor(Math.random() * SRD_NAMES.surnames.length)]

        return `${first} ${last}`
    },

    generateShipName: () => {
        return SRD_NAMES.shipNames[Math.floor(Math.random() * SRD_NAMES.shipNames.length)]
    }
}
