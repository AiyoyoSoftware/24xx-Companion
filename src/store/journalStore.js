import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useJournalStore = create(
    persist(
        (set, get) => ({
            entries: [],

            addEntry: (entry) => set((state) => ({
                entries: [{
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                    timestamp: Date.now(),
                    ...entry
                }, ...state.entries]
            })),

            deleteEntry: (id) => set((state) => ({
                entries: state.entries.filter(e => e.id !== id)
            })),

            clearJournal: () => set({ entries: [] })
        }),
        {
            name: '24xx-journal-storage',
            version: 1,
        }
    )
)
