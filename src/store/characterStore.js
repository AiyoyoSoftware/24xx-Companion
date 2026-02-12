import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCharacterStore = create(
    persist(
        (set, get) => ({
            name: '',
            specialty: [], // Array of strings (SRD Specialties)
            origin: 'Human', // Default to Human
            credits: 2, // Default start: 2 credits
            skills: {},
            traits: [], // Array of strings (Descriptors/Alien traits)
            gear: [
                "Comm (Smartphone)"
            ],

            setName: (name) => set({ name }),
            setOrigin: (origin) => set({ origin }),

            // Specialties (formerly Concepts)
            toggleSpecialty: (val) => set((state) => {
                const exists = state.specialty.includes(val)
                return {
                    specialty: exists
                        ? state.specialty.filter(c => c !== val)
                        : [...state.specialty, val]
                }
            }),

            // Credits
            setCredits: (amount) => set({ credits: amount }),
            addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),

            // Skills (d8 start for learned skills)
            setSkill: (name, rank) => set((state) => ({
                skills: { ...state.skills, [name]: rank }
            })),
            removeSkill: (name) => set((state) => {
                const newSkills = { ...state.skills }
                delete newSkills[name]
                return { skills: newSkills }
            }),

            // Traits (Simple list)
            addTrait: (val) => set((state) => ({ traits: [...state.traits, val] })),
            removeTrait: (index) => set((state) => ({
                traits: state.traits.filter((_, i) => i !== index)
            })),

            // Gear (Simple list)
            addGear: (item) => set((state) => ({ gear: [...state.gear, item] })),
            removeGear: (index) => set((state) => ({
                gear: state.gear.filter((_, i) => i !== index)
            })),

            resetCharacter: () => set({
                name: '',
                specialty: [],
                origin: 'Human',
                credits: 2,
                skills: {},
                traits: [], // Reset to empty array
                gear: ["Comm (Smartphone)"]
            })
        }),
        {
            name: '24xx-character-storage',
            version: 7, // Bump version
            migrate: (persistedState, version) => {
                if (version < 7) {
                    return {
                        name: persistedState.name || '',
                        specialty: persistedState.concept || [], // Migrate concept to specialty
                        origin: persistedState.origin || 'Human',
                        credits: 2,
                        skills: {},
                        traits: [],
                        gear: ["Comm (Smartphone)"]
                    }
                }
                return persistedState
            }
        }
    )
)
