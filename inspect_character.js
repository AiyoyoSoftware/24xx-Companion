import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };
const character = starforged.oracles.character;
console.log(JSON.stringify(Object.keys(character.oracles), null, 2));

// Check specifically for traits/roles/descriptor
// Maybe under 'character.oracles.descriptor' or similar?
