import starforged from '@datasworn/starforged/json/starforged.json' with { type: 'json' };

const categories = ['core', 'characters', 'campaign_launch', 'misc', 'moves', 'planets', 'settlements', 'space', 'starships', 'vaults'];

categories.forEach(cat => {
  if (starforged.oracles[cat] && starforged.oracles[cat].oracles) {
      console.log(`${cat} oracles: ${Object.keys(starforged.oracles[cat].oracles).join(', ')}`);
  } else if (starforged.oracles[cat] && starforged.oracles[cat].contents) {
      console.log(`${cat} contents: ${Object.keys(starforged.oracles[cat].contents).join(', ')}`);
  }
});
