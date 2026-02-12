import { useState } from 'react'
import { useReferenceStore } from '../store/referenceStore'
import { Plus, Trash2, Save, RotateCcw, Box, Zap, Book, User, Table } from 'lucide-react'
import { getTheme, THEMES } from '../utils/theme'
import { useCharacterStore } from '../store/characterStore'

export function Editor() {
    const {
        skills, addSkill, removeSkill, updateSkill,
        domains, addDomain, removeDomain,
        specialties, addSpecialty, removeSpecialty,
        traits, addTrait, removeTrait,
        gear, addGear, removeGear,
        tables, addTableEntry, removeTableEntry, resetTable,
        resetDefaults, importData, exportData
    } = useReferenceStore()

    // Theme for consistent styling
    const origin = useCharacterStore(state => state.origin)
    const theme = getTheme(origin)

    const [activeTab, setActiveTab] = useState('skills') // skills, domains, specialties, traits, gear, tables
    const [confirmReset, setConfirmReset] = useState(false)

    // Skill Form State
    const [newSkill, setNewSkill] = useState({ name: '', desc: '', domain: 'red' })
    const [newDomain, setNewDomain] = useState({ id: '', name: '', color: 'text-gray-400' })
    const [newSpecialty, setNewSpecialty] = useState('')
    const [newTrait, setNewTrait] = useState('')
    const [newGear, setNewGear] = useState('')

    // Tables Form State
    const [activeTable, setActiveTable] = useState('nicknames')
    const [newTableEntry, setNewTableEntry] = useState('')

    const handleReset = () => {
        if (confirmReset) {
            resetDefaults()
            setConfirmReset(false)
        } else {
            setConfirmReset(true)
            setTimeout(() => setConfirmReset(false), 3000)
        }
    }

    const handleExport = () => {
        const data = exportData()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '24xx-reference-data.json'
        a.click()
    }

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result)
                importData(data)
                alert('Data imported successfully!')
            } catch (err) {
                alert('Failed to parse JSON.')
            }
        }
        reader.readAsText(file)
    }

    const handleAddSkill = () => {
        if (newSkill.name && newSkill.desc) {
            addSkill({
                id: newSkill.name.toLowerCase().replace(/\s+/g, '-'),
                ...newSkill
            })
            setNewSkill({ name: '', desc: '', domain: domains[0]?.id || 'red' })
        }
    }

    const handleAddDomain = () => {
        if (newDomain.id && newDomain.name) {
            const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone']
            const idLower = newDomain.id.toLowerCase()
            // If ID matches a color, use it. Otherwise default to gray.
            const color = colors.includes(idLower) ? `text-${idLower}-400` : 'text-gray-400'

            addDomain({ ...newDomain, color })
            setNewDomain({ id: '', name: '', color: 'text-gray-400' })
        }
    }

    const handleAddSpecialty = () => {
        if (newSpecialty.trim()) {
            addSpecialty(newSpecialty.trim())
            setNewSpecialty('')
        }
    }

    const handleAddTrait = () => {
        if (newTrait.trim()) {
            addTrait(newTrait.trim())
            setNewTrait('')
        }
    }

    const handleAddGear = () => {
        if (newGear.trim()) {
            addGear(newGear.trim())
            setNewGear('')
        }
    }

    const handleAddTableEntry = () => {
        if (newTableEntry.trim()) {
            addTableEntry(activeTable, newTableEntry.trim())
            setNewTableEntry('')
        }
    }

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 ${activeTab === id ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon size={18} />
            <span className="font-bold uppercase text-sm tracking-wider">{label}</span>
        </button>
    )

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 pb-24`}>
            <div className="max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-3xl font-bold drop-shadow-md ${theme.accent}`}>EDITOR</h1>

                    <div className="flex gap-2">
                        <label className="cursor-pointer text-xs px-3 py-1 rounded border border-gray-700 text-gray-500 hover:text-white flex items-center gap-1">
                            <span>Import</span>
                            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                        </label>
                        <button
                            onClick={handleExport}
                            className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-500 hover:text-white"
                        >
                            Export
                        </button>
                        <button
                            onClick={handleReset}
                            className={`text-xs px-3 py-1 rounded border ${confirmReset ? 'border-red-500 text-red-500' : 'border-gray-700 text-gray-500 hover:text-white'}`}
                        >
                            <RotateCcw size={14} className="inline mr-1" />
                            {confirmReset ? 'Confirm?' : 'Reset'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
                    <TabButton id="skills" label="Skills" icon={Book} />
                    <TabButton id="domains" label="Domains" icon={Box} />
                    <TabButton id="specialties" label="Specialties" icon={User} />
                    <TabButton id="traits" label="Traits" icon={Zap} />
                    <TabButton id="gear" label="Gear" icon={Box} />
                    <TabButton id="tables" label="Tables" icon={Table} />
                </div>

                {/* SKILLS EDITOR */}
                {activeTab === 'skills' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                            <h3 className="font-bold text-gray-400 text-sm">ADD NEW SKILL</h3>
                            <input
                                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                placeholder="Skill Name"
                                value={newSkill.name}
                                onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                            />
                            <textarea
                                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                placeholder="Description"
                                value={newSkill.desc}
                                onChange={e => setNewSkill({ ...newSkill, desc: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <select
                                    className="bg-black/40 border border-gray-700 rounded p-2 text-sm flex-1"
                                    value={newSkill.domain}
                                    onChange={e => setNewSkill({ ...newSkill, domain: e.target.value })}
                                >
                                    {domains.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAddSkill}
                                    className="bg-cyan-700 hover:bg-cyan-600 px-4 rounded text-white"
                                >
                                    <Plus />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {skills.map(skill => {
                                const domain = domains.find(d => d.id === skill.domain)
                                const color = domain ? domain.color.replace('text-', 'bg-').replace('-400', '-500') : 'bg-gray-500'

                                return (
                                    <div key={skill.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex justify-between items-start group">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${color}`} />
                                                <span className="font-bold text-gray-200">{skill.name}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{skill.desc}</p>
                                        </div>
                                        <button onClick={() => removeSkill(skill.id)} className="text-gray-600 hover:text-red-400">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* DOMAINS EDITOR */}
                {activeTab === 'domains' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                            <h3 className="font-bold text-gray-400 text-sm">ADD NEW DOMAIN</h3>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                    placeholder="Color (e.g. red)"
                                    value={newDomain.id}
                                    onChange={e => setNewDomain({ ...newDomain, id: e.target.value })}
                                />
                                <input
                                    className="flex-1 bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                    placeholder="Name"
                                    value={newDomain.name}
                                    onChange={e => setNewDomain({ ...newDomain, name: e.target.value })}
                                />
                            </div>
                            <button onClick={handleAddDomain} className="w-full bg-cyan-700 hover:bg-cyan-600 px-4 py-2 rounded text-white font-bold">
                                Add Domain
                            </button>
                        </div>

                        <div className="space-y-2">
                            {domains.map(d => (
                                <div key={d.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                                    <span className="font-bold text-gray-200">{d.name} <span className="text-gray-500 text-xs font-normal">({d.id})</span></span>
                                    <button onClick={() => removeDomain(d.id)} className="text-gray-600 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SPECIALTIES EDITOR */}
                {activeTab === 'specialties' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                placeholder="New Specialty..."
                                value={newSpecialty}
                                onChange={e => setNewSpecialty(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddSpecialty()}
                            />
                            <button onClick={handleAddSpecialty} className="bg-cyan-700 hover:bg-cyan-600 px-4 rounded text-white">
                                <Plus />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {specialties.map((spec, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-800/50 p-2 px-3 rounded border border-gray-700">
                                    <span className="text-gray-300">{spec}</span>
                                    <button onClick={() => removeSpecialty(i)} className="text-gray-600 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TRAITS EDITOR */}
                {activeTab === 'traits' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-yellow-900/20 p-3 rounded border border-yellow-700/50 text-xs text-yellow-200 mb-4">
                            Note: Traits are primarily for Aliens or distinctive features.
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                placeholder="New Trait..."
                                value={newTrait}
                                onChange={e => setNewTrait(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddTrait()}
                            />
                            <button onClick={handleAddTrait} className="bg-cyan-700 hover:bg-cyan-600 px-4 rounded text-white">
                                <Plus />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {traits.map((trait, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-800/50 p-2 px-3 rounded border border-gray-700">
                                    <span className="text-gray-300">{trait}</span>
                                    <button onClick={() => removeTrait(i)} className="text-gray-600 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GEAR EDITOR */}
                {activeTab === 'gear' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                placeholder="New Gear Item..."
                                value={newGear}
                                onChange={e => setNewGear(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddGear()}
                            />
                            <button onClick={handleAddGear} className="bg-cyan-700 hover:bg-cyan-600 px-4 rounded text-white">
                                <Plus />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {gear.map((item, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-800/50 p-2 px-3 rounded border border-gray-700">
                                    <span className="text-gray-300">{item}</span>
                                    <button onClick={() => removeGear(i)} className="text-gray-600 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TABLES EDITOR */}
                {activeTab === 'tables' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Table Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {Object.keys(tables).map(tableName => (
                                <button
                                    key={tableName}
                                    onClick={() => setActiveTable(tableName)}
                                    className={`px-3 py-1 rounded text-xs uppercase font-bold border transition-colors ${activeTable === tableName
                                            ? 'bg-cyan-900 border-cyan-500 text-cyan-100'
                                            : 'bg-gray-900 border-gray-700 text-gray-500'
                                        }`}
                                >
                                    {tableName}
                                </button>
                            ))}
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-1">
                            <h3 className="text-center text-xs font-bold text-gray-500 uppercase py-2">Editing: {activeTable}</h3>
                        </div>

                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-black/40 border border-gray-700 rounded p-2 text-sm"
                                placeholder={`New ${activeTable} entry...`}
                                value={newTableEntry}
                                onChange={e => setNewTableEntry(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddTableEntry()}
                            />
                            <button onClick={handleAddTableEntry} className="bg-cyan-700 hover:bg-cyan-600 px-4 rounded text-white">
                                <Plus />
                            </button>
                        </div>

                        <button
                            onClick={() => resetTable(activeTable)}
                            className="text-xs text-red-400 hover:text-red-300 underline"
                        >
                            Reset {activeTable} to defaults
                        </button>

                        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2">
                            {(tables[activeTable] || []).map((entry, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-800/50 p-2 px-3 rounded border border-gray-700 hover:border-gray-600">
                                    <span className="text-gray-300 text-sm">{entry}</span>
                                    <button onClick={() => removeTableEntry(activeTable, i)} className="text-gray-600 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
