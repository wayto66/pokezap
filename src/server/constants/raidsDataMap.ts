export type RaidMapData = {
  enemies: string[]
  rooms: number
  difficult: 'easy' | 'medium' | 'hard' | 'expert' | 'insane'
  loot: { name: string; dropRate: number; amount: [number, number]; coreLoot?: true }[]
  type: string
}

export const raidsDataMap = new Map<string, RaidMapData>([
  [
    'venusaur-mega',
    {
      enemies: ['venusaur', 'victreebel', 'vileplume', 'parasect', 'tangela', 'exeggutor'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'toxic-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'venusaurite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'jungle-raid',
    },
  ],
  [
    'charizard-mega-x',
    {
      enemies: ['rapidash', 'charizard', 'arcanine', 'magmar', 'dragonite', 'dragonair'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'sora-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'magu-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'flame-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'sky-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'charizardite-x', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'mountain-raid',
    },
  ],
  [
    'charizard-mega-y',
    {
      enemies: ['magmar', 'charizard', 'arcanine', 'rapidash', 'pidgeot', 'fearow'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'sora-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'magu-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'flame-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'sky-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'charizardite-y', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'mountain-raid',
    },
  ],

  [
    'blastoise-mega',
    {
      enemies: ['dewgong', 'slowbro', 'blastoise', 'starmie', 'golduck', 'kingdra'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'net-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'splash-plate', dropRate: 0.1, amount: [1, 1] },
        { name: 'blastoisinite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'sea-cave-raid',
    },
  ],
  [
    'beedrill-mega',
    {
      enemies: ['beedrill', 'venomoth', 'parasect', 'pinsir', 'weezing', 'arbok'],
      rooms: 3,
      difficult: 'easy',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'net-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'insect-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'toxic-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'beedrillite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'swamp-raid',
    },
  ],
  [
    'ampharos-mega',
    {
      enemies: ['flygon', 'ampharos', 'raichu', 'electrode', 'dragonair', 'magneton'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tinker-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'zap-plate', dropRate: 0.1, amount: [1, 1] },
        { name: 'ampharosite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'plains-raid',
    },
  ],
  [
    'steelix-mega',
    {
      enemies: ['forretress', 'steelix', 'rhydon', 'donphan', 'sandslash', 'magneton'],
      rooms: 6,
      difficult: 'expert',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tinker-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'magu-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'earth-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'iron-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'steelixite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'stone-cave-raid',
    },
  ],
  [
    'scizor-mega',
    {
      enemies: ['heracross', 'pinsir', 'skarmory', 'scizor', 'forretress', 'scyther'],
      rooms: 6,
      difficult: 'expert',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tinker-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'net-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'insect-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'iron-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'scizorite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'swamp-raid',
    },
  ],
  [
    'heracross-mega',
    {
      enemies: ['heracross', 'pinsir', 'ariados', 'ledian', 'scyther', 'machamp'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'net-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'insect-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'heracrossite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'swamp-raid',
    },
  ],
  [
    'houndoom-mega',
    {
      enemies: ['houndoom', 'typhlosion', 'magcargo', 'magmar', 'mightyena', 'murkrow'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'magu-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'moon-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'flame-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'dread-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'houndoomite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'fire-cave-raid',
    },
  ],
  [
    'tyranitar-mega',
    {
      enemies: ['tyranitar', 'pupitar', 'golem', 'sudowoodo', 'rampardos', 'shuckle'],
      rooms: 6,
      difficult: 'expert',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'dusk-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'moon-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'stone-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'dread-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'tyranitarite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'stone-cave-raid',
    },
  ],
  [
    'sceptile-mega',
    {
      enemies: ['grovyle', 'sceptile', 'ludicolo', 'tropius', 'bellossom', 'shiftry'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'tale-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.1, amount: [1, 1] },
        { name: 'sceptilite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'stone-cave-raid',
    },
  ],
  [
    'blaziken-mega',
    {
      enemies: ['blaziken', 'magcargo', 'magmar', 'ninetales', 'torkoal', 'hariyama'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'magu-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'dusk-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'fist-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'flame-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'blazikenite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'mountain-raid',
    },
  ],
  [
    'swampert-mega',
    {
      enemies: ['swampert', 'whiscash', 'wailord', 'qwilfish', 'sharpedo', 'mantine'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'toxic-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'swampertite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'beach-raid',
    },
  ],
  [
    'gardevoir-mega',
    {
      enemies: ['gardevoir', 'granbull', 'sylveon', 'clefable', 'mawile', 'togekiss'],
      rooms: 3,
      difficult: 'hard',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tale-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'yume-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'mind-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'pixie-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'gardevoirite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'fairy-forest-raid',
    },
  ],
  [
    'sableye-mega',
    {
      enemies: ['sableye', 'banette', 'rotom', 'chandelure', 'drifblim', 'misdreavus'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'moon-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'spooky-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'dread-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'sablenite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dark-cave-raid',
    },
  ],
  [
    'mawile-mega',
    {
      enemies: ['mawile', 'wigglytuff', 'metang', 'whimsicott', 'bronzong', 'clefable'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tinker-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'tale-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'iron-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'pixie-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'mawilenite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dark-cave-raid',
    },
  ],
  [
    'aggron-mega',
    {
      enemies: ['lairon', 'aggron', 'sudowoodo', 'skarmory', 'lucario', 'bastiodon'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'dusk-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'tinker-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'stone-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'iron-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'aggronite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'steel-cave-raid',
    },
  ],
  [
    'medicham-mega',
    {
      enemies: ['medicham', 'machamp', 'blaziken', 'hariyama', 'grumpig', 'claydol'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'yume-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'dusk-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'fist-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'mind-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'medichamite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dojo-raid',
    },
  ],
  [
    'manectric-mega',
    {
      enemies: ['manectric', 'raichu', 'magnezone', 'electabuzz', 'luxray', 'rotom'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tinker-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'zap-plate', dropRate: 0.1, amount: [1, 1] },
        { name: 'manectite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'power-plant-raid',
    },
  ],
  [
    'sharpedo-mega',
    {
      enemies: ['sharpedo', 'whiscash', 'wailmer', 'crawdaunt'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'net-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'moon-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'dread-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'splash-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'sharpedonite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'underwater-raid',
    },
  ],
  [
    'camerupt-mega',
    {
      enemies: ['camerupt', 'magmar', 'donphan', 'donphan', 'magcargo', 'torkoal'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'magu-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'earth-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'flame-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'cameruptite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'fire-cave-raid',
    },
  ],
  [
    'altaria-mega',
    {
      enemies: ['altaria', 'dragonair', 'garchomp', 'kingdra'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tale-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'draco-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'pixie-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'altarianite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'fairy-forest-raid',
    },
  ],
  [
    'banette-mega',
    {
      enemies: ['sableye', 'banette', 'rotom', 'chandelure', 'drifblim', 'misdreavus'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'moon-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'spooky-plate', dropRate: 0.1, amount: [1, 1] },
        { name: 'bannetite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dark-cave-raid',
    },
  ],
  [
    'absol-mega',
    {
      enemies: ['absol', 'mightyena', 'umbreon', 'shiftry', 'houndoom'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'moon-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'dread-plate', dropRate: 0.1, amount: [1, 1] },
        { name: 'absolite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dark-cave-raid',
    },
  ],

  [
    'glalie-mega',
    {
      enemies: ['glalie', 'froslass', 'walrein', 'glaceon'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'sora-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'icicle-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'glalietite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'ice-cave-raid',
    },
  ],
  [
    'salamence-mega',
    {
      enemies: ['shelgon', 'dragonite', 'dragonair', 'altaria'],
      rooms: 6,
      difficult: 'insane',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'sora-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'tale-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'sky-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'draco-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'salamencite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'mountain-raid',
    },
  ],
  [
    'metagross-mega',
    {
      enemies: ['bronzong', 'metang', 'shieldon', 'metagross', 'grumpig', 'claydol'],
      rooms: 6,
      difficult: 'insane',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'tinker-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'yume-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'iron-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'mind-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'metagrossite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'steel-cave-raid',
    },
  ],
  [
    'lopunny-mega',
    {
      enemies: ['lopunny', 'zangoose', 'ursaring', 'machamp', 'ambipom'],
      rooms: 3,
      difficult: 'easy',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'toxic-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'lopunnite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dojo-raid',
    },
  ],
  [
    'garchomp-mega',
    {
      enemies: ['druddigon', 'flygon', 'fraxure', 'haxorus', 'claydol'],
      rooms: 4,
      difficult: 'hard',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'magu-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'tale-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'earth-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'draco-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'garchompite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'mountain-raid',
    },
  ],
  [
    'lucario-mega',
    {
      enemies: ['hariyama', 'conkeldurr', 'throh', 'sawk'],
      rooms: 4,
      difficult: 'hard',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'dusk-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'tinker-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'fist-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'iron-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'lucarionite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dojo-raid',
    },
  ],
  [
    'abomasnow-mega',
    {
      enemies: ['glaceon', 'jynx', 'walrein', 'beartic', 'leafeon', 'roselia'],
      rooms: 6,
      difficult: 'insane',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'janguru-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'sora-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'abomasite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'ice-cave-raid',
    },
  ],
  [
    'gallade-mega',
    {
      enemies: ['hariyama', 'machamp', 'throh', 'grumpig', 'girafarig', 'sawk'],
      rooms: 4,
      difficult: 'hard',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'dusk-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'yume-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'fist-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'mind-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'galladite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'dojo-raid',
    },
  ],
  [
    'audino-mega',
    {
      enemies: ['wiggyltuff', 'clefable', 'sylveon', 'miltank'],
      rooms: 4,
      difficult: 'hard',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'toxic-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'venusaurite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'fairy-forest-raid',
    },
  ],
  [
    'diancie-mega',
    {
      enemies: ['wiggyltuff', 'clefable', 'sylveon', 'carbink'],
      rooms: 4,
      difficult: 'hard',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'toxic-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'venusaurite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'fairy-forest-raid',
    },
  ],
  [
    'pidgeot-mega',
    {
      enemies: ['swellow', 'staraptor', 'fearow', 'noctowl', 'miltank', 'ursaring'],
      rooms: 4,
      difficult: 'medium',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'yume-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'sora-ball', dropRate: 0.05, amount: [1, 1] },
        { name: 'sky-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'sky-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'pidgeotite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'mountain-raid',
    },
  ],
  [
    'slowbro-mega',
    {
      enemies: ['starmie', 'golduck', 'slowbro', 'pelipper'],
      rooms: 3,
      difficult: 'easy',
      loot: [
        { name: 'ultra-ball', dropRate: 0.4, amount: [1, 3] },
        { name: 'janguru-ball', dropRate: 0.1, amount: [1, 1] },
        { name: 'meadow-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'toxic-plate', dropRate: 0.05, amount: [1, 1] },
        { name: 'venusaurite', dropRate: 0.025, amount: [1, 1] },
      ],
      type: 'beach-raid',
    },
  ],
])
