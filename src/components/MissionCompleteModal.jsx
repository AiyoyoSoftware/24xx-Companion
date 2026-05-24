import { useEffect, useState } from 'react'
import { CheckCircle2, Dices, X, Zap } from 'lucide-react'
import { useCharacterStore } from '../store/characterStore'
import { useJournalStore } from '../store/journalStore'

const rollD6 = () => Math.floor(Math.random() * 6) + 1

export function MissionCompleteModal({ isOpen, onClose, characterName = 'Operator' }) {
    const addCredits = useCharacterStore(state => state.addCredits)
    const addEntry = useJournalStore(state => state.addEntry)
    const [payout, setPayout] = useState(null)

    useEffect(() => {
        if (isOpen) {
            setPayout(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleRoll = () => {
        if (payout !== null) return

        const result = rollD6()
        addCredits(result)
        addEntry({
            type: 'note',
            content: `Mission complete: ${characterName} earned ₡${result}.`
        })
        setPayout(result)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-950">
                    <h2 className="text-lg font-bold text-gray-200">MISSION COMPLETE</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close mission complete modal">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 text-center space-y-8">
                    <div>
                        <h3 className="text-xl font-bold text-yellow-400 flex items-center justify-center gap-2 mb-3">
                            <Zap size={20} />
                            {characterName}: Earnings
                        </h3>
                        <p className="text-gray-400">Roll d6 to determine your share of the take.</p>
                    </div>

                    {payout === null ? (
                        <button
                            onClick={handleRoll}
                            className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex flex-col items-center justify-center shadow-lg shadow-yellow-900/50 hover:scale-105 active:scale-95 transition-transform"
                        >
                            <Dices size={40} className="text-white mb-2" />
                            <span className="font-bold text-white">ROLL d6</span>
                        </button>
                    ) : (
                        <div className="animate-in zoom-in duration-300">
                            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-green-900/30 border border-green-500/40 text-green-400 flex items-center justify-center">
                                <CheckCircle2 size={42} />
                            </div>
                            <div className="text-6xl font-black text-yellow-400 mb-2">+{payout}</div>
                            <div className="text-sm text-gray-500 uppercase font-bold mb-6">Credits Added</div>
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl border border-gray-600 transition-colors"
                            >
                                Close & Return
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
