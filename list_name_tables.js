import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };
const contents = starforged.oracles.characters.contents;
console.log(Object.keys(contents).join(', '));
