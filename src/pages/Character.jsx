import { useCharacterStore } from '../store/characterStore'
import { useReferenceStore } from '../store/referenceStore'
import { Plus, Minus, Trash2, Shield, Zap, Dices, Cpu, Skull, User, AlertTriangle, ArrowUpCircle, Smile, Anchor } from 'lucide-react'
import { useState } from 'react'
import { WordCloud } from '../components/WordCloud'
import { OracleModal } from '../components/OracleModal'
import { LevelUpModal } from '../components/LevelUpModal'
import { Loadout } from '../components/Loadout'
import { OracleService } from '../services/oracleService'
import { getTheme, THEMES } from '../utils/theme'
import { SkillsModal } from '../components/SkillsModal'

export function Character() {
    const {
        name, setName,
        demeanor, setDemeanor,
        shipName, setShipName,
        specialty, toggleSpecialty,
        origin, setOrigin,
        skills, setSkill, removeSkill,
        traits, addTrait, removeTrait,
        credits, addCredits, armor
    } = useCharacterStore()

    const { gear: gearSuggestions, domains, skills: allSkills, specialties: storedSpecialties, traits: storedTraits } = useReferenceStore()

    // Get current theme styles
    const theme = getTheme(origin)

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        type: '', // 'skills', 'oracle', etc.
        title: '',
        options: [],
        onSelect: () => { }
    })

    const [activeTab, setActiveTab] = useState('identity') // identity, inventory, skills

    // Handlers
    const handleAddSpecialty = () => {
        // Specialty
        openModal('Select Specialty', storedSpecialties, (val) => toggleSpecialty(val))
    }

    const handleAddTrait = () => {
        openModal('Add Alien Trait', storedTraits, (val) => addTrait(val))
    }

    const openModal = (title, options, onSelect) => {
        setModal({ isOpen: true, title, options, onSelect })
    }

    const handleLevelUp = (type, data) => {
        if (type === 'skill') {
            setSkill(data.name, data.rank)
        }
    }

    return (
        <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
            <div className={`p-4 max-w-lg mx-auto pb-24 ${theme.text}`}>

                {/* Origin Selector (Chassis) */}
                {/* Origin Selector (Chassis) */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-cyan-400">CHARACTER</h1>
                    <button
                        onClick={() => setModal({ ...modal, type: 'levelup', isOpen: true })}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2 text-sm transition-all hover:scale-105"
                    >
                        <ArrowUpCircle size={18} /> LEVEL UP
                    </button>
                </div>

                {/* TABS */}
                <div className="flex bg-gray-900/50 p-1 rounded-xl mb-6 border border-gray-800 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('identity')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'identity' ? 'bg-gray-800 text-cyan-400 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        IDENTITY
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-gray-800 text-yellow-400 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        INVENTORY
                    </button>
                    <button
                        onClick={() => setActiveTab('skills')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'skills' ? 'bg-gray-800 text-purple-400 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        SKILLS
                    </button>
                </div>

                {/* IDENTITY TAB */}
                {activeTab === 'identity' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">

                        {/* Origin Selector (Chassis) */}
                        <div className="mb-8">
                            <div className="grid grid-cols-3 gap-2">
                                {Object.keys(THEMES).map((key) => {
                                    const isActive = origin === key
                                    const KeyIcon = { Human: User, Android: Cpu, Alien: Skull }[key]
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setOrigin(key)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${isActive
                                                ? `${theme.accent} ${theme.border} bg-white/10 scale-105 shadow-lg`
                                                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                                }`}
                                        >
                                            <KeyIcon size={24} className="mb-1" />
                                            <span className="text-xs font-bold uppercase tracking-wider">{key}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Name */}
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Name / Alias</label>
                            <div className="flex gap-2">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-black/40 border border-gray-700 text-gray-200 text-lg font-bold rounded-lg p-3 w-full focus:border-cyan-500 outline-none"
                                />
                                <button onClick={() => setName(OracleService.generateName())} className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg border border-gray-700" title="Roll Random">
                                    <Dices size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Look & Origin Details */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Demeanor */}
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 relative group">
                                <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Demeanor</label>
                                <div className="flex gap-2">
                                    <input
                                        value={demeanor}
                                        onChange={(e) => setDemeanor(e.target.value)}
                                        className="bg-black/40 border border-gray-700 text-gray-300 rounded-lg p-2 w-full focus:border-cyan-500 outline-none"
                                    />
                                    <button
                                        onClick={() => setDemeanor(OracleService.rollDemeanor())}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg border border-gray-700"
                                        title="Roll Random"
                                    >
                                        <Dices size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Ship Name */}
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 relative group">
                                <label className="text-xs text-gray-500 font-bold uppercase block mb-2">Ship Name</label>
                                <div className="flex gap-2">
                                    <input
                                        value={shipName}
                                        onChange={(e) => setShipName(e.target.value)}
                                        className="bg-black/40 border border-gray-700 text-gray-300 rounded-lg p-2 w-full focus:border-cyan-500 outline-none"
                                    />
                                    <button
                                        onClick={() => setShipName(OracleService.rollShipName())}
                                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg border border-gray-700"
                                        title="Roll Random"
                                    >
                                        <Dices size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Specialty (Roles) */}
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-xs text-gray-500 font-bold uppercase">Specialty</label>
                                <button
                                    onClick={handleAddSpecialty}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 text-cyan-400 px-2 py-1 rounded border border-gray-700"
                                >
                                    Edit
                                </button>
                            </div>
                            {specialty ? (
                                <div className="flex items-center gap-3">
                                    <div className="bg-cyan-900/20 p-2 rounded-lg text-cyan-400">
                                        <Zap size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-gray-200">{specialty}</span>
                                </div>
                            ) : (
                                <div className="text-gray-600 italic text-sm">No specialty selected</div>
                            )}
                        </div>

                        {/* Traits (Aliens Only) */}
                        {origin === 'Alien' && (
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-xs text-gray-500 font-bold uppercase">Alien Traits</label>
                                    <button
                                        onClick={handleAddTrait}
                                        className="text-xs bg-gray-800 hover:bg-gray-700 text-purple-400 px-2 py-1 rounded border border-gray-700"
                                    >
                                        Add
                                    </button>
                                </div>
                                {(traits && traits.length > 0) ? (
                                    <div className="flex flex-wrap gap-2">
                                        {traits.map((trait, i) => (
                                            <span key={i} className="px-2 py-1 bg-purple-900/20 border border-purple-500/30 text-purple-300 text-xs rounded">
                                                {trait}
                                                <button onClick={() => {
                                                    const idx = traits.indexOf(trait)
                                                    if (idx !== -1) removeTrait(idx)
                                                }} className="ml-1 text-purple-500 hover:text-purple-300">
                                                    <Trash2 size={10} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-600 italic text-sm">No alien traits.</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* INVENTORY TAB */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Credits */}
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center">
                                <span className="text-gray-500 text-xs uppercase font-bold mb-1">Credits</span>
                                <div className="flex items-center gap-1 text-yellow-400 text-3xl font-bold">
                                    <span>₡{credits}</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => addCredits(1)} className="bg-gray-800 p-1 rounded hover:text-white text-gray-500"><Plus size={14} /></button>
                                    <button onClick={() => addCredits(-1)} className="bg-gray-800 p-1 rounded hover:text-white text-gray-500"><Minus size={14} /></button>
                                </div>
                            </div>

                            {/* Defense / Armor */}
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center">
                                <span className="text-gray-500 text-xs uppercase font-bold mb-1">Defense</span>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Shield size={24} />
                                    <span className="text-2xl font-bold">{armor > 0 ? armor : 0}</span>
                                </div>
                                <div className="text-[10px] text-gray-600 mt-1">Armor Points</div>
                            </div>
                        </div>

                        {/* Loadout Component handled inventory management */}
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <Loadout suggestions={gearSuggestions} />
                        </div>
                    </div>
                )}

                {/* SKILLS TAB */}
                {activeTab === 'skills' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-400 text-xs uppercase font-bold">Skills</h3>
                                <button
                                    onClick={() => setModal({ isOpen: true, type: 'skills' })}
                                    className="text-xs bg-gray-800 hover:bg-gray-700 text-cyan-400 px-2 py-1 rounded border border-gray-700"
                                >
                                    Manage
                                </button>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(skills).map(([skillName, dieSize]) => {
                                    // Find skill definition to get domain ID
                                    const skillDef = allSkills.find(s => s.name === skillName)
                                    // Find domain for color
                                    const domain = skillDef ? domains.find(d => d.id === skillDef.domain) : null

                                    // Derive color if missing (for user-defined domains)
                                    let colorClass = 'text-gray-400'
                                    let bgColorClass = 'bg-gray-700'
                                    if (domain) {
                                        colorClass = domain.color || (['red', 'blue', 'green'].some(c => domain.id.includes(c)) ? `text-${domain.id}-400` : 'text-gray-400')
                                        bgColorClass = domain.color ? domain.color.replace('text-', 'bg-').replace('-400', '-500') : 'bg-gray-700'
                                    }

                                    return (
                                        <div key={skillName} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-gray-800">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${bgColorClass}`} />
                                                <span className={`font-bold ${colorClass}`}>{skillName}</span>
                                            </div>
                                            <span className="font-mono text-cyan-400 font-bold bg-cyan-900/20 px-2 py-1 rounded border border-cyan-900/50">
                                                {dieSize}
                                            </span>
                                        </div>
                                    )
                                })}
                                {Object.keys(skills).length === 0 && (
                                    <p className="text-gray-600 text-sm text-center py-4 italic">No skills learnt.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Oracle Modal (Standard) */}
                {modal.isOpen && modal.type !== 'skills' && modal.type !== 'levelup' && (
                    <OracleModal
                        isOpen={modal.isOpen}
                        onClose={() => setModal({ ...modal, isOpen: false })}
                        title={modal.title}
                        options={modal.options}
                        onSelect={modal.onSelect}
                    />
                )}

                {/* Level Up Modal */}
                <LevelUpModal
                    isOpen={modal.isOpen && modal.type === 'levelup'}
                    onClose={() => setModal({ ...modal, isOpen: false })}
                    character={{ skills }}
                    onUpdate={handleLevelUp}
                />

                {/* Skill Management Modal */}
                {modal.isOpen && modal.type === 'skills' && (
                    <SkillsModal
                        isOpen={modal.isOpen}
                        onClose={() => setModal({ ...modal, isOpen: false })}
                        mode="manage"
                        skills={skills}
                        onUpdate={(name, rank) => {
                            if (!rank) removeSkill(name)
                            else setSkill(name, rank)
                        }}
                    />
                )}
            </div>
        </div>
    )
}
