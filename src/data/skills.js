export const SKILL_DOMAINS = [
    {
        id: 'red',
        name: 'Combat & Tactical',
        color: 'text-red-400',
        borderColor: 'border-red-500',
        bg: 'bg-red-950/30',
        skills: [
            { id: 'hand-to-hand', name: 'Hand-to-hand', desc: 'Unarmed combat, grappling, and melee weapons.' },
            { id: 'shooting', name: 'Shooting', desc: 'Precision with pistols, rifles, and mounted turrets.' },
            { id: 'explosives', name: 'Explosives', desc: 'Demolitions, grenade handling, and bomb disposal.' }
        ]
    },
    {
        id: 'green',
        name: 'Physical & Survival',
        color: 'text-green-400',
        borderColor: 'border-green-500',
        bg: 'bg-green-950/30',
        skills: [
            { id: 'climbing', name: 'Climbing', desc: 'Scaling walls, cliffs, and navigating vertical terrain.' },
            { id: 'running', name: 'Running', desc: 'Sprinting, endurance, and parkour-like movement.' },
            { id: 'stealth', name: 'Stealth', desc: 'Silent movement, hiding, and remaining undetected.' },
            { id: 'labor', name: 'Labor', desc: 'Heavy lifting, hauling, and physical toil.' }
        ]
    },
    {
        id: 'blue',
        name: 'Technical & Engineering',
        color: 'text-blue-400',
        borderColor: 'border-blue-500',
        bg: 'bg-blue-950/30',
        skills: [
            { id: 'electronics', name: 'Electronics', desc: 'Hacking, rewiring circuits, and signal interception.' },
            { id: 'engines', name: 'Engines', desc: 'Repairing and maintaining vehicle and starship engines.' },
            { id: 'hacking', name: 'Hacking', desc: 'Breaching digital security and accessing restricted data.' },
            { id: 'piloting', name: 'Piloting', desc: 'Handling atmospheric craft, starships, and land-speeders.' },
            { id: 'spacewalking', name: 'Spacewalking', desc: 'Operating effectively in zero-G and vacuum environments.' }
        ]
    },
    {
        id: 'purple',
        name: 'Cognitive & Scientific',
        color: 'text-purple-400',
        borderColor: 'border-purple-500',
        bg: 'bg-purple-950/30',
        skills: [
            { id: 'tracking', name: 'Tracking', desc: 'Following trails, locating targets, and forensic analysis.' }
        ]
    },
    {
        id: 'gold',
        name: 'Social & Influence',
        color: 'text-yellow-400',
        borderColor: 'border-yellow-500',
        bg: 'bg-yellow-950/30',
        skills: [
            { id: 'connections', name: 'Connections', desc: 'Finding contacts, sourcing gear, and knowing people.' },
            { id: 'deception', name: 'Deception', desc: 'Lying, disguising, and misleading others.' },
            { id: 'intimidation', name: 'Intimidation', desc: 'Coercing others through fear or threats.' },
            { id: 'persuasion', name: 'Persuasion', desc: 'Convincing others through reason, charm, or diplomacy.' }
        ]
    }
]

export const ALL_SKILLS = SKILL_DOMAINS.flatMap(d => d.skills)
