import { Plus, X } from 'lucide-react'
import { useReferenceStore } from '../store/referenceStore'

export function SkillsModal({ isOpen, onClose, mode = 'view', skills = {}, onSelect, onUpdate }) {
    const { skills: allSkills, domains } = useReferenceStore()

    if (!isOpen) return null

    // Helper to check if a skill is trained
    const isTrained = (skillName) => skills[skillName] && skills[skillName] !== ''

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-lg max-h-[85vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className={`text-2xl font-bold mb-6 text-cyan-400`}>
                    {mode === 'manage' ? 'Manage Skills' : 'Select Skill'}
                </h2>

                <div className="space-y-6">
                    {domains.map(rawDomain => {
                        // Derive styles if missing (for user-defined domains)
                        const baseColor = rawDomain.color ? rawDomain.color.replace('text-', '').replace('-400', '') : 'gray'
                        const domain = {
                            ...rawDomain,
                            bg: rawDomain.bg || `bg-${baseColor}-900/10`,
                            borderColor: rawDomain.borderColor || `border-${baseColor}-500/50`
                        }

                        // Get dynamic skills for this domain
                        const domainSkills = allSkills.filter(s => s.domain === domain.id)

                        // Filter skills if in select mode
                        const displaySkills = mode === 'select'
                            ? domainSkills.filter(s => skills[s.name])
                            : domainSkills

                        if (displaySkills.length === 0) return null

                        return (
                            <div key={domain.id} className={`rounded-xl border border-gray-800 overflow-hidden ${domain.bg}`}>
                                {/* Domain Header */}
                                <div className={`px-4 py-2 border-b border-gray-800 bg-black/20 flex justify-between items-center`}>
                                    <span className={`font-bold text-sm uppercase tracking-wider ${domain.color}`}>{domain.name}</span>
                                </div>

                                {/* Skills in Domain */}
                                <div className="p-2 grid grid-cols-1 gap-2">
                                    {displaySkills.map(skill => {
                                        const rank = skills[skill.name] || ''
                                        const isExpert = rank === 'd10' || rank === 'd12'
                                        const trained = isTrained(skill.name)

                                        return (
                                            <div
                                                key={skill.id}
                                                className={`flex items-center justify-between p-2 rounded transition-colors group 
                                                ${mode === 'select' ? 'cursor-pointer hover:bg-white/5' : ''}
                                            `}
                                                onClick={() => {
                                                    if (mode === 'select') {
                                                        onSelect(skill.name)
                                                        onClose()
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`font-medium ${isExpert ? domain.color : 'text-gray-300'}`}>
                                                        {skill.name}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 block">
                                                        {skill.desc}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {mode === 'manage' ? (
                                                        <select
                                                            value={rank}
                                                            onChange={(e) => {
                                                                if (e.target.value === '') onUpdate(skill.name, null) // or handle remove logic
                                                                else onUpdate(skill.name, e.target.value)
                                                            }}
                                                            className={`bg-black/40 rounded px-2 py-1 text-xs focus:outline-none border ${isExpert ? domain.borderColor : 'border-transparent'} ${isExpert ? 'shadow-[0_0_10px_currentColor] ' + domain.color : 'text-gray-400'}`}
                                                        >
                                                            <option value="">-</option>
                                                            <option value="d8">d8</option>
                                                            <option value="d10">d10</option>
                                                            <option value="d12">d12</option>
                                                        </select>
                                                    ) : (
                                                        // Select Mode Display
                                                        <div className={`text-xs px-2 py-1 rounded bg-black/40 ${isExpert ? domain.color + ' border ' + domain.borderColor : 'text-gray-500'}`}>
                                                            {rank || ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={onClose}
                        className={`bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full shadow-lg font-bold transition-colors`}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
