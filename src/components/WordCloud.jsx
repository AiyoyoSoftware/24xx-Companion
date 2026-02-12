import { Plus, X } from 'lucide-react'

export function WordCloud({ title, items, onRemove, onAdd, color = "cyan" }) {
    const colorClasses = {
        cyan: "bg-cyan-900/40 text-cyan-200 border-cyan-800",
        pink: "bg-pink-900/40 text-pink-200 border-pink-800",
        purple: "bg-purple-900/40 text-purple-200 border-purple-800",
        green: "bg-green-900/40 text-green-200 border-green-800",
        yellow: "bg-yellow-900/40 text-yellow-200 border-yellow-800",
    }

    const btnColorClasses = {
        cyan: "bg-cyan-800 hover:bg-cyan-700 text-cyan-100",
        pink: "bg-pink-800 hover:bg-pink-700 text-pink-100",
        purple: "bg-purple-800 hover:bg-purple-700 text-purple-100",
        green: "bg-green-800 hover:bg-green-700 text-green-100",
        yellow: "bg-yellow-800 hover:bg-yellow-700 text-yellow-100",
    }

    // Dynamic classes for buttons
    const addBtnClass = `p-1 rounded-full transition-colors ${btnColorClasses[color]} bg-opacity-50`
    const itemClass = (c) => `px-3 py-1 rounded-full text-sm border flex items-center gap-2 animate-in zoom-in-50 duration-200 ${colorClasses[c]}`

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-xs uppercase tracking-wider font-bold">{title}</label>
                <button
                    onClick={onAdd}
                    className={addBtnClass}
                    title="Add new"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className={`flex flex-wrap gap-2 min-h-[3rem] p-3 bg-gray-900/50 rounded-xl border border-gray-800`}>
                {(!Array.isArray(items) || items.length === 0) && (
                    <div className="w-full text-center text-gray-600 text-sm italic py-2 cursor-pointer" onClick={onAdd}>
                        Tap + to add {title}...
                    </div>
                )}
                {Array.isArray(items) && items.map((item, idx) => (
                    <span
                        key={idx}
                        className={itemClass(color)}
                    >
                        {typeof item === 'object' ? (item.name || item.text || JSON.stringify(item)) : item}
                        <button
                            onClick={() => onRemove(item)}
                            className="hover:text-white opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    )
}
