import { create } from 'zustand'
import { useJournalStore } from './journalStore'

const rollDie = (sides) => {
    let total = 0
    let rolls = []
    let currentRoll = Math.floor(Math.random() * sides) + 1
    total += currentRoll
    rolls.push(currentRoll)

    // Exploding dice are NOT standard in 24XX SRD, but many derivatives use them.
    // The SRD says: "The higher the roll, the better."
    // It doesn't explicitly mention exploding dice. 
    // However, for 24XX, typically d6/d8/d10/d12 are single rolls. 
    // Let's REMOVE exploding dice for strict SRD compliance unless specified otherwise.
    // The previous implementation had exploding dice. I will remove it for strict compliance.

    return { total, rolls }
}

export const useGameStore = create((set, get) => ({
    rollHistory: [],
    currentRoll: null,

    /*
     * SRD Rolling Rules:
     * - Default: d6
     * - Skilled: d8 / d10 / d12
     * - Hindered: d4
     * - Helped by Circumstance: Add d6 (take highest)
     * - Helped by Ally: They roll their skill die (share risk) - Simplified here as adding a die.
     */
    rollDice: (skillResultV, isHindered = false, isHelping = false) => {
        // skillResultV is the skill die string (e.g. 'd8') or 'd6' (untrained).
        // If hindered, the main die becomes d4.

        let primaryDieSize = parseInt(skillResultV.replace('d', ''))
        if (isHindered) primaryDieSize = 4

        const primaryRoll = rollDie(primaryDieSize)

        let finalResult = primaryRoll
        let helpRoll = null

        if (isHelping) {
            helpRoll = rollDie(6) // Circumstance help adds a d6
            if (helpRoll.total > primaryRoll.total) {
                finalResult = helpRoll
            }
        }

        const { total } = finalResult

        // SRD Outcomes
        // 1-2: Disaster
        // 3-4: Setback
        // 5+: Success
        let outcome = 'Disaster'
        if (total >= 5) outcome = 'Success'
        else if (total >= 3) outcome = 'Setback'
        else outcome = 'Disaster'

        const rollData = {
            timestamp: Date.now(),
            skillDie: `d${primaryDieSize}`,
            isHindered,
            isHelping,
            helpRoll: helpRoll ? helpRoll.total : null,
            primaryRoll: primaryRoll.total,
            total,
            outcome,
            status: 'resolved' // Auto-resolved
        }

        // Auto-log to Journal
        useJournalStore.getState().addEntry({
            type: 'roll',
            content: rollData
        })

        set((state) => ({
            rollHistory: [rollData, ...state.rollHistory],
            currentRoll: rollData
        }))

        return rollData
    },

    clearHistory: () => set({ rollHistory: [], currentRoll: null })
}));
