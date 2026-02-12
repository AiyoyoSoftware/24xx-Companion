import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };
const characters = starforged.oracles.characters; // Note plural
console.log(JSON.stringify(Object.keys(characters), null, 2));
// Also inspect what fields are inside one, e.g. 'role'
// console.log(JSON.stringify(characters.role, null, 2));
