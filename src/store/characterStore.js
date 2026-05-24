import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_CHARACTER = {
    name: '',
    specialty: [],
    origin: 'Human',
    credits: 2,
    demeanor: '',
    shipName: '',
    skills: {},
    traits: [],
    gear: ["Comm (Smartphone)"],
    archivedCharacters: null,
    activeCharacterId: null
}

const ensureArray = (value) => {
    if (Array.isArray(value)) return value
    if (value) return [value]
    return []
}

const selectPersistedCharacter = (state = {}) => {
    if (!state.characters || typeof state.characters !== 'object') return state

    const characters = Object.values(state.characters)
    return state.characters[state.activeCharacterId] || characters[0] || {}
}

const normalizePersistedCharacter = (state = {}) => {
    const character = selectPersistedCharacter(state)

    return {
        ...state,
        name: character.name ?? state.name ?? DEFAULT_CHARACTER.name,
        specialty: ensureArray(character.specialty ?? character.concept ?? state.specialty ?? state.concept),
        origin: character.origin ?? state.origin ?? DEFAULT_CHARACTER.origin,
        credits: character.credits ?? state.credits ?? DEFAULT_CHARACTER.credits,
        demeanor: character.demeanor ?? state.demeanor ?? DEFAULT_CHARACTER.demeanor,
        shipName: character.shipName ?? state.shipName ?? DEFAULT_CHARACTER.shipName,
        skills: character.skills ?? state.skills ?? DEFAULT_CHARACTER.skills,
        traits: character.traits ?? state.traits ?? DEFAULT_CHARACTER.traits,
        gear: character.gear ?? state.gear ?? DEFAULT_CHARACTER.gear,
        archivedCharacters: state.archivedCharacters ?? state.characters ?? DEFAULT_CHARACTER.archivedCharacters,
        activeCharacterId: state.activeCharacterId ?? DEFAULT_CHARACTER.activeCharacterId
    }
}

export const useCharacterStore = create(
    persist(
        (set, get) => ({
            ...DEFAULT_CHARACTER,

            setName: (name) => set({ name }),
            setDemeanor: (demeanor) => set({ demeanor }),
            setShipName: (shipName) => set({ shipName }),
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
                ...DEFAULT_CHARACTER,
                archivedCharacters: get().archivedCharacters,
                activeCharacterId: get().activeCharacterId
            })
        }),
        {
            name: '24xx-character-storage',
            version: 9,
            partialize: (state) => ({
                name: state.name,
                specialty: state.specialty,
                origin: state.origin,
                credits: state.credits,
                demeanor: state.demeanor,
                shipName: state.shipName,
                skills: state.skills,
                traits: state.traits,
                gear: state.gear,
                archivedCharacters: state.archivedCharacters,
                activeCharacterId: state.activeCharacterId
            }),
            merge: (persistedState, currentState) => ({
                ...currentState,
                ...normalizePersistedCharacter(persistedState)
            }),
            migrate: (persistedState, version) => {
                if (version < 9) return normalizePersistedCharacter(persistedState)
                return normalizePersistedCharacter(persistedState)
            }
        }
    )
)
