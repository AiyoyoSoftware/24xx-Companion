import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SKILL_DOMAINS } from '../data/skills'

// Initial Data Construction
const INITIAL_SKILLS = SKILL_DOMAINS.flatMap(d => d.skills.map(s => ({ ...s, domain: d.id })))
const INITIAL_GEAR = [
    "Mag-Boots", "Flashlight", "Comms Link", "Medkit", "O2 Mask", "Rations",
    "Pistol", "Rifle", "Stun Baton", "Knife", "Crowbar", "Data-Pad",
    "Repair Kit", "Sample Container", "Analysis Unit", "Environment Suit"
].sort()

export const useReferenceStore = create(
    persist(
        (set, get) => ({
            skills: INITIAL_SKILLS,
            traits: [], // SRD Aliens only - to be populated later
            gear: INITIAL_GEAR,
            domains: SKILL_DOMAINS,
            specialties: ['Face', 'Muscle', 'Psychic', 'Medic', 'Sneak', 'Tech'], // SRD Specialties

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

            // Import/Export
            importData: (data) => set(data),
            exportData: () => get(),

            // Reset
            resetDefaults: () => set({
                skills: INITIAL_SKILLS,
                traits: [], // Reset to empty or standard SRD list
                gear: INITIAL_GEAR,
                domains: SKILL_DOMAINS,
                specialties: ['Face', 'Muscle', 'Psychic', 'Medic', 'Sneak', 'Tech']
            })
        }),
        {
            name: '24xx-reference-storage',
            version: 2 // Bump version for schema change
        }
    )
)
