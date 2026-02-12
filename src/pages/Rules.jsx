import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, Book } from 'lucide-react'

const rulesData = [
    {
        title: "1. Character Creation",
        content: (
            <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-cyan-400">Concept:</strong> Brief description (e.g., "Gritty android bounty hunter").</p>
                <p><strong className="text-cyan-400">Tokens:</strong> Start with 2 Luck (Edge), 1 Tenacity (Limit). Cap at 5.</p>
                <p><strong className="text-cyan-400">Skills (Linear):</strong> Untrained (d4), Standard (d6), Expertise (d8 → d10 → d12).</p>
                <p><strong className="text-cyan-400">Build:</strong> Choose 2 skills at d8 OR 1 skill at d10.</p>
                <p><strong className="text-cyan-400">Traits:</strong> 1 Perk (Talent/Item), 1 Quirk (Flaw).</p>
            </div>
        )
    },
    {
        title: "2. Rules of Play",
        content: (
            <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-cyan-400">Core Roll:</strong> Skill Die vs TN.</p>
                <ul className="list-disc list-inside pl-2">
                    <li>TN 5 (Standard)</li>
                    <li>TN 4 (Easy)</li>
                    <li>TN 6 (Hard)</li>
                </ul>
                <p><strong className="text-cyan-400">Exploding Dice:</strong> If max roll, roll again and add.</p>
                <p><strong className="text-cyan-400">Luck Die:</strong> Spend 1 Luck to add a d6 (Keep Higher).</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-gray-800 p-2 rounded"><span className="text-red-400 font-bold">&lt; 3</span> Failure</div>
                    <div className="bg-gray-800 p-2 rounded"><span className="text-yellow-400 font-bold">3 - (TN-1)</span> Partial</div>
                    <div className="bg-gray-800 p-2 rounded"><span className="text-green-400 font-bold">TN+</span> Success</div>
                    <div className="bg-gray-800 p-2 rounded"><span className="text-purple-400 font-bold">TN+3</span> Critical</div>
                </div>
            </div>
        )
    },
    {
        title: "3. Economy of Survival",
        content: (
            <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-cyan-400">Spend Luck (Perks):</strong></p>
                <ul className="list-disc list-inside pl-2">
                    <li>Boost: Add d6 to roll.</li>
                    <li>Lucky Save: Ignore 1 damage.</li>
                    <li>Narrative Power: Perform feat automatically.</li>
                </ul>
                <p><strong className="text-cyan-400">Regain Luck (Quirks):</strong></p>
                <ul className="list-disc list-inside pl-2">
                    <li>Declare Quirk complicates things.</li>
                    <li>Penalize: +1 TN.</li>
                    <li>Resolve: Fail (Gain 1 Luck) vs Succeed (Gain 1 Luck OR Recover 1 Tenacity).</li>
                </ul>
            </div>
        )
    },
    {
        title: "4. Conflict & Harm",
        content: (
            <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-cyan-400">Armor:</strong> Break to take 0 damage.</p>
                <p><strong className="text-cyan-400">Tenacity:</strong> Lose 1 per hit. 0 = Defeated.</p>
                <p><strong className="text-cyan-400">Lucky Save:</strong> Spend 1 Luck to negate defeat at 0 Tenacity.</p>
            </div>
        )
    },
    {
        title: "5. GM Toolkit (Enemies)",
        content: (
            <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-cyan-400">Minion (Rank 1):</strong> 1 Hit KO. Deals 1 Tenacity.</p>
                <p><strong className="text-cyan-400">Elite (Rank 2):</strong> 2 Hits. Deals 1 Tenacity.</p>
                <p><strong className="text-cyan-400">Boss (Rank 3):</strong> 3 Hits. Deals 2 Tenacity / Breaks Armor. Acts twice.</p>
                <p><strong className="text-cyan-400">Titan (Rank 4):</strong> 4+ Hits. Deals 3 Tenacity. Fear check (TN 5 Resolve).</p>
            </div>
        )
    },
    {
        title: "6. Advancement",
        content: (
            <div className="space-y-2 text-sm text-gray-300">
                <p>After 1-3 sessions, choose one:</p>
                <ul className="list-disc list-inside pl-2">
                    <li>Skill Growth: Increase die size (max d12).</li>
                    <li>New Trait: Gain Perk or Quirk.</li>
                    <li>Heroic Growth: +1 Max Luck or Tenacity (max 5).</li>
                </ul>
            </div>
        )
    },
]

export function Rules() {
    const [searchTerm, setSearchTerm] = useState('')
    const [openSection, setOpenSection] = useState(null)

    const filteredRules = rulesData.filter(rule =>
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Simple content check - in real app might need better indexing
        true
    )

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index)
    }

    return (
        <div className="p-4 pb-24 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                <Book /> SRD REFERENCE
            </h1>

            {/* Search (Visual only for now, logic is basic) */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-10 text-white focus:border-cyan-500 focus:outline-none"
                />
                <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
            </div>

            <div className="space-y-4">
                {filteredRules.map((rule, idx) => (
                    <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleSection(idx)}
                            className="w-full flex justify-between items-center p-4 hover:bg-gray-800 transition-colors"
                        >
                            <h3 className="font-bold text-lg text-gray-200">{rule.title}</h3>
                            {openSection === idx ? <ChevronUp className="text-cyan-400" /> : <ChevronDown className="text-gray-500" />}
                        </button>
                        {openSection === idx && (
                            <div className="p-4 border-t border-gray-800 bg-gray-900/50 animate-in fade-in slide-in-from-top-1 duration-200">
                                {rule.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
