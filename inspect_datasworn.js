import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };
console.log(JSON.stringify(Object.keys(starforged), null, 2));
console.log(JSON.stringify(Object.keys(starforged.oracles), null, 2));
// Check a specific oracle structure
// e.g. 'character' category
