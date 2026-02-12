import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SKILL_DOMAINS } from '../data/skills'

// Initial Data Construction
const INITIAL_SKILLS = SKILL_DOMAINS.flatMap(d => d.skills.map(s => ({ ...s, domain: d.id })))

const INITIAL_GEAR = [
    // Armor
    "Vest (break once)", "Battle armor (2cr, bulky, break 3x)", "Hardsuit (3cr, bulky, break 3x, vacuum)",

    // Cybernetics
    "Cyber-eh? (echo/stress)", "Cyber-eye (IR/tele/x-ray)", "Cyber-limb (fast/strong/tool/weapon)",
    "Cranial jack (backup/skill)", "Healing nanobots", "Toxin filter", "Voice mimic",

    // Tools
    "Flamethrower (bulky)", "Low-G jetpack", "Med scanner", "Mini drone", "Repair tools",
    "Survey pack (climb/flare/tent, bulky)",

    // Weapons
    "Grenades (frag/flash/smoke/EMP)", "Pistol", "Rifle (bulky)", "Shotgun (bulky)", "Stun baton", "Tranq gun",

    // General
    "Comm (Smartphone)", "Data-pad"
].sort()

const INITIAL_TABLES = {
    nicknames: [
        "Bliss", "Crater", "Dart", "Edge", "Fuse", "Gray", "Huggy", "Ice", "Jinx",
        "Killer", "Lucky", "Mix", "Nine", "Prof", "Red", "Sunny", "Treble", "V8", "Zero"
    ],
    demeanor: [
        "Anxious", "Appraising", "Blunt", "Brooding", "Calming", "Casual", "Cold", "Curious",
        "Dramatic", "Dry", "Dull", "Earnest", "Formal", "Gentle", "Innocent", "Knowing",
        "Prickly", "Reckless", "Terse", "Weary"
    ],
    shipName: [
        "Arion", "Blackjack", "Caleuche", "Canary", "Caprice", "Chance", "Darter", "Falkor",
        "Highway Star", "Moonshot", "Morgenstern", "Phoenix", "Peregrine", "Restless",
        "Silver Blaze", "Stardust", "Sunchaser", "Swift", "Thunder Road", "Wayfarer"
    ],
    mission: [
        "Deal with an unusual threat", "Investigate something inexplicable", "Retrieve a thing from a location",
        "Escort a VIP", "Sabotage a facility", "Rescue a prisoner", "Survey a dangerous planet",
        "Negotiate a treaty", "Smuggle contraband", "Defend a settlement"
    ]
}

export const useReferenceStore = create(
    persist(
        (set, get) => ({
            skills: INITIAL_SKILLS,
            traits: [], // SRD Aliens only - to be populated later
            gear: INITIAL_GEAR,
            domains: SKILL_DOMAINS,
            specialties: ['Face', 'Muscle', 'Psychic', 'Medic', 'Sneak', 'Tech'], // SRD Specialties
            tables: INITIAL_TABLES,

            // Skills
            addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
            updateSkill: (id, data) => set((state) => ({
                skills: state.skills.map(s => s.id === id ? { ...s, ...data } : s)
            })),
            removeSkill: (id) => set((state) => ({
                skills: state.skills.filter(s => s.id !== id)
            })),

            // Domains
            addDomain: (domain) => set((state) => ({ domains: [...state.domains, domain] })),
            updateDomain: (id, data) => set((state) => ({
                domains: state.domains.map(d => d.id === id ? { ...d, ...data } : d)
            })),
            removeDomain: (id) => set((state) => ({
                domains: state.domains.filter(d => d.id !== id)
            })),

            // Specialties (was Concepts)
            addSpecialty: (spec) => set((state) => ({ specialties: [...state.specialties, spec].sort() })),
            removeSpecialty: (index) => set((state) => ({
                specialties: state.specialties.filter((_, i) => i !== index)
            })),

            // Traits
            addTrait: (trait) => set((state) => ({ traits: [...state.traits, trait].sort() })),
            removeTrait: (index) => set((state) => ({
                traits: state.traits.filter((_, i) => i !== index)
            })),

            // Gear
            addGear: (item) => set((state) => ({ gear: [...state.gear, item].sort() })),
            removeGear: (index) => set((state) => ({
                gear: state.gear.filter((_, i) => i !== index)
            })),

            // Tables (Dynamic Random Tables)
            addTableEntry: (tableName, entry) => set((state) => ({
                tables: {
                    ...state.tables,
                    [tableName]: [...(state.tables[tableName] || []), entry].sort()
                }
            })),
            removeTableEntry: (tableName, index) => set((state) => ({
                tables: {
                    ...state.tables,
                    [tableName]: (state.tables[tableName] || []).filter((_, i) => i !== index)
                }
            })),
            resetTable: (tableName) => set((state) => ({
                tables: {
                    ...state.tables,
                    [tableName]: INITIAL_TABLES[tableName] || []
                }
            })),

            // Import/Export
            importData: (data) => set(data),
            exportData: () => get(),

            // Reset
            resetDefaults: () => set({
                skills: INITIAL_SKILLS,
                traits: [], // Reset to empty or standard SRD list
                gear: INITIAL_GEAR,
                domains: SKILL_DOMAINS,
                specialties: ['Face', 'Muscle', 'Psychic', 'Medic', 'Sneak', 'Tech'],
                tables: INITIAL_TABLES
            })
        }),
        {
            name: '24xx-reference-storage',
            version: 3 // Bump version for schema change
        }
    )
)
