import { useCharacterStore } from '../store/characterStore'
import { useReferenceStore } from '../store/referenceStore'
import { Plus, Trash2, Shield, Zap, Dices, Cpu, Skull, User, AlertTriangle, ArrowUpCircle } from 'lucide-react'
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
        specialty, toggleSpecialty,
        origin, setOrigin,
        skills, setSkill, removeSkill,
        traits, addTrait, removeTrait
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

    const generateName = () => {
        setName(OracleService.generateName())
    }

    // Icon for Origin
    const OriginIcon = {
        Human: User,
        Android: Cpu,
        Alien: Skull
    }[origin] || User

    return (
        <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
            <div className={`p-4 max-w-lg mx-auto pb-24 ${theme.text}`}>

                {/* Origin Selector (Chassis) */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className={`text-3xl font-bold drop-shadow-md ${theme.accent}`}>IDENTITY</h1>
                    <button
                        onClick={() => setModal({ ...modal, type: 'levelup', isOpen: true })}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2 text-sm transition-all hover:scale-105"
                    >
                        <ArrowUpCircle size={18} /> LEVEL UP
                    </button>
                </div>
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

                {/* Name Input */}
                <div className="mb-6 space-y-2">
                    <label className="text-xs uppercase tracking-wider opacity-60">Name</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`flex-1 ${theme.card} border ${theme.border} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                            placeholder="Character Name"
                        />
                        <button onClick={generateName} className={`${theme.card} border ${theme.border} p-3 rounded-lg hover:bg-white/10 ${theme.accent}`}>
                            <Dices size={24} />
                        </button>
                    </div>
                </div>

                {/* Loadout (Gear Layer) */}
                <Loadout suggestions={gearSuggestions} />

                {/* Traits (Aliens Only) */}
                {origin === 'Alien' && (
                    <WordCloud
                        title="Alien Traits"
                        items={traits}
                        onAdd={handleAddTrait}
                        onRemove={(item) => {
                            const idx = traits.indexOf(item)
                            if (idx !== -1) removeTrait(idx)
                        }}
                        color="purple"
                    />
                )}

                {/* Specialty (Roles) */}
                <WordCloud
                    title="Specialty"
                    items={specialty}
                    onAdd={handleAddSpecialty}
                    onRemove={toggleSpecialty}
                    color={origin === 'Android' ? 'green' : origin === 'Alien' ? 'purple' : 'cyan'}
                />

                <div className="flex justify-between items-center mb-4 mt-8">
                    <h2 className={`text-2xl font-bold drop-shadow-md ${theme.accent}`}>SKILLS</h2>
                    <button
                        onClick={() => setModal({ isOpen: true, type: 'skills' })}
                        className={`${theme.button} px-3 py-1 rounded-lg text-xs uppercase font-bold tracking-wider border ${theme.border} hover:bg-white/10 transition-colors`}
                    >
                        Manage Skills
                    </button>
                </div>

                {/* Skills List */}
                <div className="space-y-2 mb-8">
                    {Object.keys(skills).length === 0 && (
                        <div className="text-center p-6 border border-dashed border-gray-700 rounded-xl opacity-50">
                            <p>No learned skills. All rolls are d6.</p>
                            <button onClick={() => setModal({ isOpen: true, type: 'skills' })} className="mt-2 text-cyan-400 hover:underline">Customize</button>
                        </div>
                    )}

                    {Object.entries(skills)
                        .map(([name, rank]) => {
                            // Find skill definition to get domain ID
                            const skillDef = allSkills.find(s => s.name === name)
                            // Find domain for color
                            const domain = skillDef ? domains.find(d => d.id === skillDef.domain) : null

                            // Derive color if missing (for user-defined domains)
                            let color = 'text-gray-300'
                            if (domain) {
                                color = domain.color || (['red', 'blue', 'green'].some(c => domain.id.includes(c)) ? `text-${domain.id}-400` : 'text-gray-300')
                            }
                            return (
                                <div key={name} className={`flex justify-between items-center bg-black/20 p-2 rounded border border-white/5`}>
                                    <span className={`font-bold ${color}`}>{name}</span>
                                    <span className="text-sm font-mono bg-white/10 px-2 rounded">{rank}</span>
                                </div>
                            )
                        })}
                </div>

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
