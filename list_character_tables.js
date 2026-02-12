import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };
const oracles = starforged.oracles.characters.oracles;
console.log(JSON.stringify(Object.keys(oracles), null, 2));
