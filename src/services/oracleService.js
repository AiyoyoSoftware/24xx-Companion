// 24XX SRD CONTENT
// Text CC BY Jason Tocci
import { useReferenceStore } from '../store/referenceStore'

const SRD_NAMES = {
    first: ["Aeon", "Cygnus", "Kael", "Nyx", "Orion", "Pax", "Ria", "Sol", "Vea", "Zane"],
    last: ["Black", "Chrome", "Flux", "Gale", "Haze", "Iron", "Jolt", "Nova", "Pyre", "Void"],
    surnames: [
        "Acker", "Black", "Cruz", "Dallas", "Engel", "Fox", "Gee", "Haak", "Iyer", "Joshi",
        "Kask", "Lee", "Moss", "Nash", "Park", "Qadir", "Singh", "Tran", "Ueda", "Zheng"
    ]
}

export const getRandomOption = (key) => {
    // Access the store directly to get the current state
    const tables = useReferenceStore.getState().tables || {}
    const list = tables[key] || []

    if (list.length === 0) return "Unknown"
    return list[Math.floor(Math.random() * list.length)]
}

export const OracleService = {
    // Accessors - Now pulling from store
    getSpecialties: () => useReferenceStore.getState().specialties, // Specialties are separate from tables
    getTraits: () => useReferenceStore.getState().traits, // Traits are separate

    // Dynamic Tables
    getDemeanors: () => useReferenceStore.getState().tables?.demeanor || [],
    getContacts: () => useReferenceStore.getState().tables?.contacts || [],
    getJobs: () => useReferenceStore.getState().tables?.mission || [],
    getShipNames: () => useReferenceStore.getState().tables?.shipName || [],
    getNicknames: () => useReferenceStore.getState().tables?.nicknames || [],
    getJobOracles: () => useReferenceStore.getState().tables?.job_search || [],

    // RNG Methods
    rollSpecialty: () => {
        const list = useReferenceStore.getState().specialties
        if (!list || list.length === 0) return "Unknown"
        return list[Math.floor(Math.random() * list.length)]
    },
    rollTrait: () => {
        // Traits might be empty initially for Aliens, handled in UI usually. 
        // But for RNG:
        const list = useReferenceStore.getState().traits
        return list.length > 0 ? list[Math.floor(Math.random() * list.length)] : "Unknown"
    },
    rollDemeanor: () => getRandomOption('demeanor'),
    rollJob: () => getRandomOption('mission'), // This generates a Mission description
    rollJobSearch: () => getRandomOption('job_search'), // This generates the result of Looking for Work
    rollContact: () => getRandomOption('contacts'),
    rollShipName: () => getRandomOption('shipName'),
    rollNickname: () => getRandomOption('nicknames'),

    // Name Generators
    generateName: () => {
        const nicknames = useReferenceStore.getState().tables?.nicknames || []

        // 50% chance of First Last, 50% chance of Nickname (as Call Sign)
        // User request emphasized the "Bliss...Zero" list. Let's weigh it heavily or just use it?
        // "ensure users can roll for these fields too during character creation: ... 2 Bliss ... 20 Zero"
        // I will make it a pure choice in the UI, but for a generic "generateName", I'll mix them.

        const mode = Math.random()

        if (mode > 0.5 && nicknames.length > 0) {
            return nicknames[Math.floor(Math.random() * nicknames.length)]
        }

        const first = SRD_NAMES.first[Math.floor(Math.random() * SRD_NAMES.first.length)]
        const last = Math.random() > 0.5 ?
            SRD_NAMES.last[Math.floor(Math.random() * SRD_NAMES.last.length)] :
            SRD_NAMES.surnames[Math.floor(Math.random() * SRD_NAMES.surnames.length)]

        return `${first} ${last}`
    },

    generateShipName: () => getRandomOption('shipName')
}
