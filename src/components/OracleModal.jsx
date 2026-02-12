import { X, Search, Dices } from 'lucide-react'
import { useState, useMemo } from 'react'
import { getRandomOption } from '../services/oracleService'

export function OracleModal({ isOpen, onClose, title, options, onSelect }) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options
        return options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [options, searchTerm])

    const handleRandom = () => {
        if (options.length > 0) {
            const random = options[Math.floor(Math.random() * options.length)]
            onSelect(random)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (filteredOptions.length > 0) {
                                        onSelect(filteredOptions[0])
                                        onClose()
                                    } else if (searchTerm.trim()) {
                                        onSelect(searchTerm.trim())
                                        onClose()
                                    }
                                }
                            }}
                        />
                    </div>
                    <button
                        onClick={handleRandom}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-bold"
                    >
                        <Dices size={18} />
                        Roll
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="grid grid-cols-1 gap-1">
                        {filteredOptions.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => { onSelect(opt); onClose(); }}
                                className="text-left px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors border border-transparent hover:border-gray-700"
                            >
                                {opt}
                            </button>
                        ))}
                        {filteredOptions.length === 0 && searchTerm.trim() && (
                            <button
                                onClick={() => { onSelect(searchTerm.trim()); onClose(); }}
                                className="text-left px-4 py-3 rounded-lg bg-cyan-900/40 text-cyan-200 border border-cyan-700 hover:bg-cyan-900/60 transition-colors flex flex-col"
                            >
                                <span className="font-bold font-mono">"{searchTerm}"</span>
                                <span className="text-xs opacity-70">Add custom entry</span>
                            </button>
                        )}
                        {filteredOptions.length === 0 && !searchTerm.trim() && (
                            <div className="text-center text-gray-500 py-8 italic">No matches found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
