import { useCharacterStore } from '../store/characterStore'
import { useGameStore } from '../store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Dices, AlertTriangle, Shield, Zap, Skull, HelpingHand, MousePointerClick, User } from 'lucide-react'
import { SkillsModal } from '../components/SkillsModal'
import { OracleService } from '../services/oracleService'

export function Home() {
    const { skills, credits, gear } = useCharacterStore()
    const { rollDice, rollHistory, currentRoll } = useGameStore()

    const [selectedSkill, setSelectedSkill] = useState(null) // null = Untrained (d6)
    const [isHindered, setIsHindered] = useState(false)
    const [isHelping, setIsHelping] = useState(false)
    const [oracleResult, setOracleResult] = useState({ contact: null, job: null })

    const [modal, setModal] = useState({
        isOpen: false,
        type: 'skills',
        onSelect: () => { }
    })

    const handleRoll = () => {
        const dieSize = selectedSkill ? skills[selectedSkill] : 'd6'
        rollDice(dieSize, isHindered, isHelping)
        // Reset toggles after roll? SRD doesn't specify, but UX wise it's often better to reset.
        setIsHindered(false)
        setIsHelping(false)
    }

    const getOutcomeColor = (outcome) => {
        switch (outcome) {
            case 'Success': return 'text-green-400'
            case 'Setback': return 'text-yellow-400'
            case 'Disaster': return 'text-red-400'
            default: return 'text-white'
        }
    }

    const [activeTab, setActiveTab] = useState('actions') // 'actions', 'oracles'

    return (
        <div className="p-4 max-w-lg mx-auto pb-24">
            {/* New Character Prompt */}
            {!useCharacterStore(state => state.name) && (
                <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 animate-in slide-in-from-top duration-500">
                    <h2 className="text-xl font-bold text-cyan-400 mb-2">Welcome to 24XX</h2>
                    <p className="text-sm text-gray-300 mb-4">You have no character data. Create a new character to get started.</p>
                    <a href="/create" className="block w-full text-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg transition-colors">
                        Create Character
                    </a>
                </div>
            )}

            {/* Header / Current Status */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-cyan-400">24xx</h1>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <span className="font-bold text-lg">₡{credits}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase">Credits</span>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="flex bg-gray-900/50 p-1 rounded-xl mb-6 border border-gray-800">
                <button
                    onClick={() => setActiveTab('actions')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'actions' ? 'bg-gray-800 text-cyan-400 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    ACTIONS
                </button>
                <button
                    onClick={() => setActiveTab('oracles')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'oracles' ? 'bg-gray-800 text-purple-400 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    ORACLES
                </button>
            </div>

            {/* Main Roller */}
            {activeTab === 'actions' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl mb-8 relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <h2 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-4">Action Roll</h2>

                        {/* Skill Selection */}
                        <div className="mb-6">
                            <label className="block text-gray-500 text-xs mb-2">Select Skill</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedSkill(null)}
                                    className={`px-3 py-2 rounded-lg border text-sm transition-all ${selectedSkill === null ? 'bg-cyan-900 border-cyan-500 text-cyan-100' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                >
                                    Untrained (d6)
                                </button>

                                <button
                                    onClick={() => setModal({ isOpen: true, type: 'skills' })}
                                    className={`px-3 py-2 rounded-lg border text-sm transition-all flex items-center gap-2 ${selectedSkill ? 'bg-cyan-900 border-cyan-500 text-cyan-100' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                >
                                    {selectedSkill ? (
                                        <>
                                            <span>{selectedSkill}</span>
                                            <span className="text-xs opacity-60 bg-black/30 px-1 rounded">{skills[selectedSkill]}</span>
                                        </>
                                    ) : (
                                        <span>Select Skill...</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Modifiers: Hindered vs Help */}
                        <div className="mb-6">
                            <label className="block text-gray-500 text-xs mb-2">Circumstances</label>
                            <div className="flex gap-2">
                                {/* HINDERED */}
                                <button
                                    onClick={() => setIsHindered(!isHindered)}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all flex-1
                                        ${isHindered
                                            ? 'bg-red-900/30 border-red-500 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]'
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                        }
                                    `}
                                >
                                    <AlertTriangle size={20} fill={isHindered ? "currentColor" : "none"} />
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-bold uppercase">Hindered</span>
                                        <span className="text-[8px] opacity-70">(Roll d4)</span>
                                    </div>
                                </button>

                                {/* HELP */}
                                <button
                                    onClick={() => setIsHelping(!isHelping)}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all flex-1
                                        ${isHelping
                                            ? 'bg-green-900/30 border-green-500 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                                        }
                                    `}
                                >
                                    <HelpingHand size={20} fill={isHelping ? "currentColor" : "none"} />
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-bold uppercase">Help / Setup</span>
                                        <span className="text-[8px] opacity-70">(Add d6)</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 text-center">
                            <div className="flex justify-center items-center gap-2 text-cyan-300 font-bold">
                                <span className="text-sm text-gray-500 uppercase tracking-widest">Rolling:</span>
                                <span className="text-xl">
                                    {isHindered ? 'd4' : (selectedSkill ? skills[selectedSkill] : 'd6')}
                                </span>
                                {isHelping && <span className="text-green-400 text-xl"> + d6</span>}
                            </div>
                        </div>

                        <button
                            onClick={handleRoll}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <Dices size={24} />
                            <div className="flex flex-col items-start leading-none">
                                <span>ROLL</span>
                            </div>
                        </button>
                    </div>

                    {/* Result Display (Animate Presence) */}
                    <AnimatePresence mode='wait'>
                        {currentRoll && (
                            <motion.div
                                key={currentRoll.timestamp}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 mb-8 text-center"
                            >
                                <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Result</div>
                                <div className={`text-6xl font-black mb-2 ${getOutcomeColor(currentRoll.outcome)}`}>
                                    {currentRoll.total}
                                </div>
                                <div className={`text-2xl font-bold mb-4 ${getOutcomeColor(currentRoll.outcome)}`}>
                                    {currentRoll.outcome}
                                </div>

                                <div className="flex justify-center gap-2 text-sm text-gray-400 mb-6">
                                    <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">
                                        {currentRoll.skillDie}: <span className="text-white font-bold">{currentRoll.primaryRoll}</span>
                                    </span>
                                    {currentRoll.isHelping && (
                                        <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-900/50">
                                            Help (d6): <span className="font-bold">{currentRoll.helpRoll}</span>
                                        </span>
                                    )}
                                    {currentRoll.isHindered && (
                                        <span className="bg-red-900/20 text-red-400 px-2 py-1 rounded border border-red-900/50">
                                            Hindered
                                        </span>
                                    )}
                                </div>

                                {/* OUTCOME EXPLANATION */}
                                <div className="text-sm text-gray-300 mb-6 bg-black/20 p-3 rounded-lg">
                                    {currentRoll.outcome === 'Success' && "Success. You do it. The higher the roll, the better."}
                                    {currentRoll.outcome === 'Setback' && "Setback. You do it, but there's a cost, partial success, or lesser effect."}
                                    {currentRoll.outcome === 'Disaster' && "Disaster. Suffer the risk. GM decides if you succeed at all."}
                                </div>


                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* History */}
                    <div>
                        <h3 className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-4">Recent History</h3>

                        <div className="space-y-3">
                            {rollHistory.map((roll) => (
                                <div key={roll.timestamp} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-800/50">
                                    <div>
                                        <div className={`font-bold ${getOutcomeColor(roll.outcome)}`}>{roll.outcome}</div>
                                        <div className="text-xs text-gray-500">
                                            {roll.skillDie} {roll.isHelping ? '+ Help' : ''} {roll.isHindered ? '(Hindered)' : ''}
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-300">{roll.total}</div>
                                </div>
                            )).slice(0, 5)}
                            {rollHistory.length === 0 && <p className="text-center text-gray-600 text-sm py-4">No rolls yet.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* ORACLE / TABLES */}
            {activeTab === 'oracles' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                    <h2 className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-4 relative z-10">Tables & Oracles</h2>

                    <div className="space-y-6 relative z-10">
                        {/* LOOKING FOR WORK */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-500 text-xs text-yellow-500 font-bold uppercase">Looking for Work</label>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOracleResult(prev => ({ ...prev, job: OracleService.rollJobSearch() }))}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg border border-gray-700 text-sm font-bold"
                                >
                                    Find Job (Free)
                                </button>
                                <button
                                    disabled={credits < 1}
                                    onClick={() => {
                                        if (credits >= 1) {
                                            useCharacterStore.getState().addCredits(-1)
                                            setOracleResult(prev => ({ ...prev, job: OracleService.rollJobSearch() }))
                                        }
                                    }}
                                    className="flex-1 bg-yellow-900/20 hover:bg-yellow-900/40 border border-yellow-700/50 text-yellow-500 px-3 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Re-roll (Cost 1 CR)
                                </button>
                            </div>
                            {oracleResult.job && (
                                <div className="mt-3 p-3 bg-black/30 rounded border border-yellow-500/30 text-yellow-100 text-sm animate-in slide-in-from-top-2">
                                    <span className="font-bold text-yellow-500">Result:</span> {oracleResult.job}
                                </div>
                            )}
                        </div>
                        {/* CONTACTS */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-gray-500 text-xs text-purple-400 font-bold uppercase">Contacts</label>
                                {oracleResult.contact && <span className="text-xs text-gray-500 animate-in fade-in">Rolled just now</span>}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOracleResult(prev => ({ ...prev, contact: OracleService.rollContact() }))}
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 text-sm font-bold flex items-center gap-2"
                                >
                                    <User size={16} /> Roll Contact
                                </button>
                            </div>
                            {oracleResult.contact && (
                                <div className="mt-3 p-3 bg-black/30 rounded border border-purple-500/30 text-purple-200 text-sm animate-in slide-in-from-top-2">
                                    <span className="font-bold text-purple-400">Result:</span> {oracleResult.contact}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
