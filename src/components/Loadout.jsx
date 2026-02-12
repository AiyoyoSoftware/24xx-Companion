import { useCharacterStore } from '../store/characterStore'
import { Shield, Sword, Box, Trash2, Plus } from 'lucide-react'
import { getTheme } from '../utils/theme'
import { useState } from 'react'

export function Loadout({
    title = "INVENTORY",
    items,
    onAdd,
    onRemove,
    placeholder = "Add item...",
    suggestions = [],
    showCredits
}) {
    const { gear, addGear, removeGear, origin, credits } = useCharacterStore()
    const theme = getTheme(origin)
    const [newItem, setNewItem] = useState('')
    const listId = `loadout-list-${title.replace(/\s+/g, '-').toLowerCase()}`

    // Determine mode: Custom (Props) vs Default (Store/Inventory)
    const isCustom = !!items
    const displayItems = items || gear
    const handleAddItem = onAdd || addGear
    const handleRemoveItem = onRemove || removeGear

    // Default showCredits to true only if we are in default Inventory mode
    const shouldShowCredits = showCredits !== undefined ? showCredits : !isCustom

    const [showModal, setShowModal] = useState(false)

    const handleAdd = () => {
        if (newItem.trim()) {
            handleAddItem(newItem.trim())
            setNewItem('')
        } else if (suggestions.length > 0) {
            setShowModal(true)
        }
    }

    const selectItem = (item) => {
        handleAddItem(item)
        setShowModal(false)
    }

    return (
        <div className="mb-8 p-4">
            <h2 className={`text-2xl font-bold mb-6 drop-shadow-md text-center ${theme.accent}`}>{title}</h2>

            <div className={`relative max-w-sm mx-auto bg-black/20 rounded-3xl border border-white/5 p-6 flex flex-col gap-4`}>

                {/* Credits Display - Conditional */}
                {shouldShowCredits && (
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-yellow-900/30">
                        <span className="text-yellow-500 font-bold flex items-center gap-2">
                            <span className="text-xl">₡</span> Credits
                        </span>
                        <span className="text-2xl font-mono text-yellow-400">{credits}</span>
                    </div>
                )}

                {/* Gear/Trait List */}
                <div className="space-y-2">
                    {displayItems.map((item, idx) => (
                        <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border ${theme.border} bg-gray-800/50`}>
                            <div className="flex items-center gap-3">
                                <Box size={16} className="text-gray-500" />
                                <span className="text-gray-300">{item}</span>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(idx)}
                                className="text-gray-600 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    {displayItems.length === 0 && (
                        <div className="text-center text-gray-600 py-4 italic">Empty.</div>
                    )}
                </div>

                {/* Add Item */}
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        value={newItem}
                        list={listId}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <datalist id={listId}>
                        {suggestions.map((s, i) => <option key={i} value={s} />)}
                    </datalist>
                    <button
                        onClick={handleAdd}
                        className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors border border-gray-700"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Selection Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm max-h-[70vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4 text-cyan-400">Select {title}</h3>
                        <div className="space-y-2">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => selectItem(s)}
                                    className="w-full text-left p-3 rounded bg-gray-800/50 hover:bg-gray-700 transition-colors border border-gray-700/50"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full py-2 bg-gray-800 rounded text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
