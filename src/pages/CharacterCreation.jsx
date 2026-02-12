import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../store/characterStore'
import { useReferenceStore } from '../store/referenceStore'
import { getTheme, THEMES } from '../utils/theme'
import { User, Cpu, Skull, ArrowRight, ArrowLeft, Check, Dices, Smile, Anchor } from 'lucide-react'
import { OracleService } from '../services/oracleService'

export function CharacterCreation() {
    const navigate = useNavigate()
    const { resetCharacter, setOrigin, setSkill, addTrait, setName, toggleSpecialty, setDemeanor, setShipName } = useCharacterStore()
    const { domains, skills: allSkills, specialties: storedSpecialties } = useReferenceStore()

    const [step, setStep] = useState(1) // 1: Origin, 2: Customization, 3: Identity
    const [selection, setSelection] = useState({
        origin: 'Human',
        skills: {}, // { skillName: rank }
        traits: [], // For Alien/Android
        name: '',
        specialty: '',
        demeanor: '',
        shipName: ''
    })

    const theme = getTheme(selection.origin)

    // Helper to calc current rank of a selection
    const getRank = (name) => selection.skills[name] || ''

    // Helper to increment skill rank
    const incrementSkill = (name) => {
        const current = getRank(name)
        let next = 'd8'
        if (current === 'd8') next = 'd10'
        if (current === 'd10') next = 'd12'
        if (current === 'd12') return // Maxed

        setSelection(prev => ({
            ...prev,
            skills: { ...prev.skills, [name]: next }
        }))
    }

    const decrementSkill = (name) => {
        const current = getRank(name)
        if (!current) return

        const next = current === 'd12' ? 'd10' : current === 'd10' ? 'd8' : undefined

        setSelection(prev => {
            const newSkills = { ...prev.skills }
            if (next) newSkills[name] = next
            else delete newSkills[name]
            return { ...prev, skills: newSkills }
        })
    }

    const getTotalIncreases = () => {
        let count = 0
        Object.values(selection.skills).forEach(rank => {
            if (rank === 'd8') count += 1
            if (rank === 'd10') count += 2
            if (rank === 'd12') count += 3
        })
        return count
    }

    const getMaxIncreases = () => {
        if (selection.origin === 'Human') return 3
        if (selection.origin === 'Android') return 1
        return 0 // Alien gets traits instead
    }

    const handleNext = () => {
        if (step === 1) {
            // Reset implementation details for next step?
            setSelection(prev => ({ ...prev, skills: {}, traits: [] }))
            setStep(2)
        } else if (step === 2) {
            setSelection(prev => ({
                ...prev,
                name: OracleService.generateName(),
                demeanor: OracleService.rollDemeanor(),
                shipName: OracleService.generateShipName()
            }))
            setStep(3)
        } else {
            // Finalize
            resetCharacter()
            setOrigin(selection.origin)
            setName(selection.name)
            if (selection.specialty) toggleSpecialty(selection.specialty)

            // New fields
            if (setDemeanor) setDemeanor(selection.demeanor)
            if (setShipName) setShipName(selection.shipName)

            Object.entries(selection.skills).forEach(([name, rank]) => {
                setSkill(name, rank)
            })

            selection.traits.forEach(trait => {
                addTrait(trait)
            })

            navigate('/character')
        }
    }

    // Step 1: Origin
    const StepOrigin = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold text-center text-cyan-400 mb-6">CHOOSE IDENTITY</h2>
            <div className="grid grid-cols-1 gap-4">
                {[
                    { id: 'Human', icon: User, desc: 'Versatile. Start with more skills.' },
                    { id: 'Android', icon: Cpu, desc: 'Upgrade-ready. Cyber-body features.' },
                    { id: 'Alien', icon: Skull, desc: 'Unique biology. Special traits.' }
                ].map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setSelection({ ...selection, origin: opt.id })}
                        className={`p-6 rounded-xl border-2 text-left transition-all ${selection.origin === opt.id
                            ? `border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]`
                            : 'border-gray-800 hover:border-gray-600 bg-gray-900/50'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${selection.origin === opt.id ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                                <opt.icon size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${selection.origin === opt.id ? 'text-white' : 'text-gray-300'}`}>{opt.id}</h3>
                                <p className="text-sm text-gray-500">{opt.desc}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )

    // Step 2: Customization
    const StepDetails = () => {
        const remaining = getMaxIncreases() - getTotalIncreases()

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <h2 className="text-xl font-bold text-center text-cyan-400 mb-2">CUSTOMIZE</h2>

                {/* HUMAN & ANDROID SKILLS */}
                {(selection.origin === 'Human' || selection.origin === 'Android') && (
                    <div className="space-y-4">
                        <div className="bg-black/40 p-4 rounded-lg border border-gray-700 text-center sticky top-0 z-10 backdrop-blur">
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Skill Increases Remaining</p>
                            <p className={`text-4xl font-bold ${remaining === 0 ? 'text-green-400' : 'text-white'}`}>{remaining}</p>
                        </div>

                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                            {domains.map(domain => {
                                const domainSkills = allSkills.filter(s => s.domain === domain.id)
                                if (domainSkills.length === 0) return null
                                const baseColor = domain.color ? domain.color.replace('text-', '').replace('-400', '') : 'gray'
                                const borderColor = `border-${baseColor}-500/30`
                                const titleColor = domain.color || 'text-gray-400'

                                return (
                                    <div key={domain.id} className={`p-3 rounded-lg border ${borderColor} bg-gray-900/30`}>
                                        <h4 className={`text-xs font-bold uppercase mb-2 ${titleColor}`}>{domain.name}</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {domainSkills.map(skill => {
                                                const rank = getRank(skill.name)
                                                return (
                                                    <div key={skill.name} className="flex justify-between items-center bg-black/20 p-2 rounded">
                                                        <span>{skill.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            {rank && <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">{rank}</span>}
                                                            <div className="flex gap-1">
                                                                {rank && (
                                                                    <button onClick={() => decrementSkill(skill.name)} className="px-2 bg-gray-800 rounded hover:bg-red-900/50 text-red-400">-</button>
                                                                )}
                                                                <button
                                                                    disabled={remaining <= 0 && rank !== 'd12'}
                                                                    onClick={() => incrementSkill(skill.name)}
                                                                    className="px-2 bg-gray-800 rounded hover:bg-green-900/50 text-green-400 disabled:opacity-30"
                                                                >+</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ANDROID TRAIT CHOICE */}
                {selection.origin === 'Android' && (
                    <div className="space-y-4 border-t border-gray-700 pt-4">
                        <h3 className="font-bold text-center text-gray-300">Choose Body Upgrade</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {['Synth Skin', 'Case (Breakable)'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setSelection(prev => ({ ...prev, traits: [opt] }))}
                                    className={`p-3 rounded border text-sm transition-all ${selection.traits.includes(opt)
                                        ? 'bg-green-900/30 border-green-500 text-green-400'
                                        : 'bg-gray-800 border-gray-700 text-gray-500'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ALIEN TRAITS */}
                {selection.origin === 'Alien' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 text-center">Invent 2 traits (e.g. Wings, Electric Current).</p>
                        <input
                            className="w-full bg-black/40 border border-purple-500/50 rounded p-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Trait 1"
                            value={selection.traits[0] || ''}
                            onChange={e => {
                                const newTraits = [...selection.traits]
                                newTraits[0] = e.target.value
                                setSelection({ ...selection, traits: newTraits })
                            }}
                        />
                        <input
                            className="w-full bg-black/40 border border-purple-500/50 rounded p-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Trait 2"
                            value={selection.traits[1] || ''}
                            onChange={e => {
                                const newTraits = [...selection.traits]
                                newTraits[1] = e.target.value
                                setSelection({ ...selection, traits: newTraits })
                            }}
                        />
                    </div>
                )}
            </div>
        )
    }

    // Step 3: Identity
    const StepIdentity = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold text-center text-cyan-400 mb-6">FINALIZE</h2>

            <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold flex items-center gap-1"><User size={12} /> Name</label>
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-black/40 border border-gray-700 rounded p-3 text-lg font-bold"
                        value={selection.name}
                        onChange={e => setSelection({ ...selection, name: e.target.value })}
                        placeholder="Character Name"
                    />
                    <button onClick={() => setSelection({ ...selection, name: OracleService.generateName() })} className="bg-gray-800 p-3 rounded border border-gray-700 hover:bg-cyan-900/30 hover:text-cyan-400">
                        <Dices />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold flex items-center gap-1"><Smile size={12} /> Demeanor</label>
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-black/40 border border-gray-700 rounded p-3 font-bold"
                        value={selection.demeanor}
                        onChange={e => setSelection({ ...selection, demeanor: e.target.value })}
                        placeholder="e.g. Grumpy, Cheerful"
                    />
                    <button onClick={() => setSelection({ ...selection, demeanor: OracleService.rollDemeanor() })} className="bg-gray-800 p-3 rounded border border-gray-700 hover:bg-cyan-900/30 hover:text-cyan-400">
                        <Dices />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold flex items-center gap-1"><Anchor size={12} /> Ship Name</label>
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-black/40 border border-gray-700 rounded p-3 font-bold"
                        value={selection.shipName}
                        onChange={e => setSelection({ ...selection, shipName: e.target.value })}
                        placeholder="e.g. Serenity"
                    />
                    <button onClick={() => setSelection({ ...selection, shipName: OracleService.rollShipName() })} className="bg-gray-800 p-3 rounded border border-gray-700 hover:bg-cyan-900/30 hover:text-cyan-400">
                        <Dices />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500 font-bold">Specialty</label>
                <div className="flex flex-wrap gap-2">
                    {storedSpecialties.map(spec => (
                        <button
                            key={spec}
                            onClick={() => setSelection(prev => ({ ...prev, specialty: spec }))}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${selection.specialty === spec
                                ? 'bg-cyan-600 border-cyan-400 text-white'
                                : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500'
                                }`}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    // Footer Navigation
    const remaining = getMaxIncreases() - getTotalIncreases()
    const isValid = () => {
        if (step === 1) return true
        if (step === 2) {
            if (selection.origin === 'Human') return remaining === 0
            if (selection.origin === 'Android') return remaining === 0 && selection.traits.length > 0
            if (selection.origin === 'Alien') return selection.traits.filter(t => t && t.trim()).length >= 2
        }
        return selection.name && selection.specialty && selection.demeanor && selection.shipName
    }

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 flex flex-col`}>
            <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
                {/* Progress */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-cyan-500' : 'bg-gray-800'}`} />
                    ))}
                </div>

                <div className="flex-1">
                    {step === 1 && <StepOrigin />}
                    {step === 2 && <StepDetails />}
                    {step === 3 && <StepIdentity />}
                </div>

                <div className="mt-8 flex gap-4">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="flex-1 py-4 bg-gray-800 rounded-xl font-bold text-gray-400">
                            Back
                        </button>
                    )}
                    <button
                        disabled={!isValid()}
                        onClick={handleNext}
                        className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {step === 3 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    )
}
