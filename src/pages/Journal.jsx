import { useState } from 'react'
import { useJournalStore } from '../store/journalStore'
import { useCharacterStore } from '../store/characterStore'
import { getTheme } from '../utils/theme'
import { Send, Trash2, Dices, Edit3 } from 'lucide-react'

export function Journal() {
    const { entries, addEntry, deleteEntry } = useJournalStore()
    const origin = useCharacterStore(state => state.origin)
    const theme = getTheme(origin)
    const [note, setNote] = useState('')

    const handleAddNote = () => {
        if (!note.trim()) return
        addEntry({
            type: 'note',
            content: note
        })
        setNote('')
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const getOutcomeColor = (outcome) => {
        switch (outcome) {
            case 'Critical Success': return 'text-purple-400'
            case 'Success': return 'text-green-400'
            case 'Partial Success': return 'text-yellow-400'
            case 'Failure': return 'text-red-400'
            default: return 'text-white'
        }
    }

    return (
        <div className={`p-4 max-w-lg mx-auto pb-24`}>
            <h1 className={`text-3xl font-bold mb-6 drop-shadow-md ${theme.accent}`}>JOURNAL</h1>

            {/* Note Input */}
            <div className={`mb-8 ${theme.card} p-4 rounded-xl border ${theme.border} flex gap-2`}>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Log an event..."
                    className="flex-1 bg-transparent resize-none focus:outline-none min-h-[40px]"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleAddNote()
                        }
                    }}
                />
                <button
                    onClick={handleAddNote}
                    disabled={!note.trim()}
                    className={`${theme.button} p-2 rounded-lg self-end disabled:opacity-50 transition-colors hover:bg-white/10`}
                >
                    <Send size={20} />
                </button>
            </div>

            {/* Entries Feed */}
            <div className="space-y-4">
                {entries.length === 0 && (
                    <div className="text-center text-gray-500 italic py-8">
                        No entries yet. Roll dice or write a note!
                    </div>
                )}

                {entries.map(entry => (
                    <div key={entry.id} className={`group relative p-4 rounded-xl border ${theme.border} bg-black/20 hover:bg-black/30 transition-colors`}>
                        {/* Delete Button (visible on hover/focus) */}
                        <button
                            onClick={() => deleteEntry(entry.id)}
                            className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="flex gap-3">
                            {/* Icon */}
                            <div className="mt-1">
                                {entry.type === 'roll' ? (
                                    <div className={`p-2 rounded-full bg-cyan-900/30 text-cyan-400`}>
                                        <Dices size={18} />
                                    </div>
                                ) : (
                                    <div className={`p-2 rounded-full bg-gray-800 text-gray-400`}>
                                        <Edit3 size={18} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-xs text-gray-500 font-mono">{formatTime(entry.timestamp)}</span>
                                </div>

                                {entry.type === 'note' && (
                                    <p className="whitespace-pre-wrap text-gray-300">{entry.content}</p>
                                )}

                                {entry.type === 'roll' && (
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm text-cyan-200">
                                                {entry.content.skillDie} <span className="text-gray-400 font-normal">({entry.content.primaryRoll})</span>
                                                {entry.content.isHelping && (
                                                    <span className="text-green-400"> + Help ({entry.content.helpRoll})</span>
                                                )}
                                                {entry.content.isHindered && (
                                                    <span className="text-red-400"> (Hindered)</span>
                                                )}
                                            </span>
                                            <span className={`font-bold ${getOutcomeColor(entry.content.outcome)}`}>
                                                {entry.content.outcome}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>
                                                {entry.content.isHindered ? 'Roll d4' : 'Standard'}
                                            </span>
                                            <span className="text-xl font-bold text-white">{entry.content.total}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
