import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };
const contents = starforged.oracles.characters.oracles;
// or check keys if it's an object map
if (contents) {
    console.log(JSON.stringify(Object.keys(contents), null, 2));
} else {
    // maybe it's under 'oracles' property inside the characters object?
    // In my previous step, 'oracles' wasn't listed in keys of 'characters'. 
    // It listed 'contents' and 'collections'.
    console.log(JSON.stringify(starforged.oracles.characters.contents, null, 2));
}
