export const SKILL_DOMAINS = [
    {
        id: 'red',
        name: 'Combat & Tactical',
        color: 'text-red-400',
        borderColor: 'border-red-500',
        bg: 'bg-red-950/30',
        skills: [
            { id: 'brawl', name: 'Brawl', desc: 'Unarmed combat, grappling, and using the environment as a weapon.' },
            { id: 'marksmanship', name: 'Marksmanship', desc: 'Precision with pistols, rifles, and mounted turrets.' },
            { id: 'melee', name: 'Melee', desc: 'Proficiency with blades, clubs, and energy weapons.' },
            { id: 'tactics', name: 'Tactics', desc: 'Evaluating battlefield threats, finding cover, and coordinating team strikes.' }
        ]
    },
    {
        id: 'green',
        name: 'Physical & Survival',
        color: 'text-green-400',
        borderColor: 'border-green-500',
        bg: 'bg-green-950/30',
        skills: [
            { id: 'agility', name: 'Agility', desc: 'Acrobatics, dodging, and maintaining balance in zero-G or precarious heights.' },
            { id: 'endurance', name: 'Endurance', desc: 'Resisting toxins, extreme temperatures, and pushing past exhaustion.' },
            { id: 'infiltrate', name: 'Infiltrate', desc: 'Picking locks, bypassing physical sensors, and silent movement.' },
            { id: 'survival', name: 'Survival', desc: 'Tracking, foraging, and navigating hostile alien wilderness.' }
        ]
    },
    {
        id: 'blue',
        name: 'Technical & Engineering',
        color: 'text-blue-400',
        borderColor: 'border-blue-500',
        bg: 'bg-blue-950/30',
        skills: [
            { id: 'cybernetics', name: 'Cybernetics', desc: 'Modifying androids, installing neural links, and "healing" machines.' },
            { id: 'electronics', name: 'Electronics', desc: 'Hacking terminals, rewiring circuits, and signal interception.' },
            { id: 'mechanics', name: 'Mechanics', desc: 'Repairing engines, structural engineering, and heavy machinery operation.' },
            { id: 'pilot', name: 'Pilot', desc: 'Handling atmospheric craft, starships, and land-speeders.' }
        ]
    },
    {
        id: 'purple',
        name: 'Cognitive & Scientific',
        color: 'text-purple-400',
        borderColor: 'border-purple-500',
        bg: 'bg-purple-950/30',
        skills: [
            { id: 'analysis', name: 'Analysis', desc: 'Scanning data-slugs, identifying substances, and forensic investigation.' },
            { id: 'medicine', name: 'Medicine', desc: 'Treating biological wounds, pharmacology, and emergency surgery.' },
            { id: 'resolve', name: 'Resolve', desc: 'Maintaining focus under pressure and resisting the Fear of Titans.' },
            { id: 'scholar', name: 'Scholar', desc: 'Knowledge of history, alien cultures, and corporate law.' }
        ]
    },
    {
        id: 'gold',
        name: 'Social & Influence',
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500',
        bg: 'bg-yellow-950/30',
        skills: [
            { id: 'command', name: 'Command', desc: 'Leadership, boosting ally morale, and intimidating enemies.' },
            { id: 'deception', name: 'Deception', desc: 'Disguise, forgery, and lying to authorities or AI.' },
            { id: 'negotiation', name: 'Negotiation', desc: 'Trading, bartering, and finding common ground with hostiles.' },
            { id: 'vibe', name: 'Vibe', desc: 'Reading a room, detecting lies, and "streetwise" intuition.' }
        ]
    }
]

export const ALL_SKILLS = SKILL_DOMAINS.flatMap(d => d.skills)
