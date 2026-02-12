import { useState } from 'react'
import { X, ChevronRight, Zap, Book, Dices, AlertTriangle } from 'lucide-react'
import { useReferenceStore } from '../store/referenceStore'
import { OracleService } from '../services/oracleService'

export function LevelUpModal({ isOpen, onClose, character, onUpdate }) {
    const [step, setStep] = useState('menu') // menu, skill, trait
    const [choice, setChoice] = useState(null)

    if (!isOpen) return null

    const handleClose = () => {
        setStep('menu')
        setChoice(null)
        onClose()
    }

    const { skills } = character

    // --- Sub-Components ---

    const MenuOption = ({ icon: Icon, title, desc, onClick, color }) => (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 flex items-center gap-4 transition-all group hover:scale-[1.02] hover:border-${color}-500`}
        >
            <div className={`p-3 rounded-full bg-gray-900 text-${color}-400 group-hover:bg-${color}-900/20`}>
                <Icon size={24} />
            </div>
            <div className="text-left flex-1">
                <h3 className={`font-bold text-lg text-${color}-400 group-hover:text-${color}-300`}>{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-white" />
        </button>
    )

    // Skill Selection View
    const SkillView = () => {
        const { domains, skills: allSkills } = useReferenceStore()

        const handleSkillSelect = (skillName) => {
            const currentRank = skills[skillName]
            let newRank = 'd8' // Start at d8
            if (currentRank === 'd8') newRank = 'd10'
            if (currentRank === 'd10') newRank = 'd12'
            if (currentRank === 'd12') return // Maxed out

            onUpdate('skill', { name: skillName, rank: newRank })
            handleClose()
        }

        return (
            <div className="space-y-4">
                <p className="text-gray-300 mb-4">Choose a skill to improve or learn. Max rank is d12.</p>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {domains.map(domain => {
                        const domainSkills = allSkills.filter(s => s.domain === domain.id)
                        if (domainSkills.length === 0) return null

                        return (
                            <div key={domain.id}>
                                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${domain.color}`}>{domain.name}</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {domainSkills.map(skill => {
                                        const rank = skills[skill.name] || null
                                        const isMaxed = rank === 'd12'
                                        const nextRank = !rank ? 'd8 (New)' :
                                            rank === 'd8' ? 'd10' : 'd12'

                                        return (
                                            <button
                                                key={skill.name}
                                                disabled={isMaxed}
                                                onClick={() => handleSkillSelect(skill.name)}
                                                className={`flex justify-between items-center p-3 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left`}
                                            >
                                                <div>
                                                    <span className={`font-bold ${rank ? 'text-white' : 'text-gray-400'}`}>{skill.name}</span>
                                                    <p className="text-[10px] text-gray-500">{skill.desc}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {rank && <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{rank}</span>}
                                                    {!isMaxed && <ChevronRight size={14} className="text-gray-500" />}
                                                    {!isMaxed && <span className={`text-xs font-bold px-2 py-1 rounded ${domain.color} bg-${domain.id}-900/20`}>{nextRank}</span>}
                                                    {isMaxed && <span className="text-xs text-green-500 font-bold">MAX</span>}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    // Trait View
    const TraitView = () => {
        const [traitType, setTraitType] = useState(null) // 'perk' or 'quirk'
        const [options, setOptions] = useState([])

        const loadOptions = (type) => {
            const opts = type === 'perk' ? OracleService.getPerks() : OracleService.getQuirks()
            setOptions(opts)
            setTraitType(type)
        }

        const handleTraitSelect = (val) => {
            onUpdate('trait', { type: traitType, value: val })
            handleClose()
        }

        if (!traitType) {
            return (
                <div className="space-y-4">
                    <p className="text-gray-300">Choose a type of trait to add.</p>
                    <button onClick={() => loadOptions('perk')} className="w-full p-4 rounded-xl border border-green-500/30 bg-green-900/10 hover:bg-green-900/20 flex items-center gap-3 text-green-400 font-bold">
                        <Zap /> New Perk (Asset/Talent)
                    </button>
                    <button onClick={() => loadOptions('quirk')} className="w-full p-4 rounded-xl border border-red-500/30 bg-red-900/10 hover:bg-red-900/20 flex items-center gap-3 text-red-400 font-bold">
                        <AlertTriangle /> New Quirk (Flaw)
                    </button>
                </div>
            )
        }

        // Simple random roll or selection list for traits
        const randomTrait = () => {
            const rnd = options[Math.floor(Math.random() * options.length)]
            handleTraitSelect(rnd)
        }

        return (
            <div className="space-y-4 h-[50vh] flex flex-col">
                <div className="flex justify-between items-center">
                    <h3 className={`font-bold ${traitType === 'perk' ? 'text-green-400' : 'text-red-400'} uppercase`}>Select {traitType}</h3>
                    <button onClick={randomTrait} className="text-xs bg-cyan-600 px-3 py-1 rounded text-white flex items-center gap-1 hover:bg-cyan-500">
                        <Dices size={14} /> Random
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {options.map((opt, i) => (
                        <button key={i} onClick={() => handleTraitSelect(opt)} className="w-full text-left p-3 rounded bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition-colors">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-950">
                    <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                        {step === 'menu' && <><Book size={20} /> LEVEL UP</>}
                        {step === 'skill' && 'SKILL GROWTH'}
                        {step === 'trait' && 'NEW TRAIT'}
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto">
                    {step === 'menu' && (
                        <div className="space-y-3">
                            <MenuOption
                                icon={Book}
                                title="Skill Growth"
                                desc="Increase a skill die size or learn a new skill (d8)."
                                color="cyan"
                                onClick={() => setStep('skill')}
                            />
                        </div>
                    )}

                    {step === 'skill' && <SkillView />}
                </div>

                {/* Footer Back Button (if nested) */}
                {step !== 'menu' && (
                    <div className="p-4 border-t border-gray-800 bg-gray-950 flex justify-start">
                        <button onClick={() => setStep('menu')} className="text-sm text-gray-400 hover:text-white hover:underline">
                            &larr; Back to Options
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
