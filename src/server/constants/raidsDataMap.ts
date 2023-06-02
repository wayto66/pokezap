export type RaidMapData = {
  enemies: string[]
  rooms: number
  difficult: 'easy' | 'medium' | 'hard' | 'expert' | 'insane'
  type: string
}

export const raidsDataMap = new Map<string, RaidMapData>([
  [
    'venusaur-mega',
    {
      enemies: ['ivysaur', 'venusaur', 'victreebell', 'vileplume'],
      rooms: 3,
      difficult: 'medium',
      type: 'jungle-raid',
    },
  ],
  [
    'charizard-mega-x',
    {
      enemies: ['charmeleon', 'charizard', 'arcanine', 'magmar'],
      rooms: 3,
      difficult: 'medium',
      type: 'mountain-raid',
    },
  ],
  [
    'charizard-mega-y',
    {
      enemies: ['charmeleon', 'charizard', 'arcanine', 'magmar'],
      rooms: 3,
      difficult: 'medium',
      type: 'mountain-raid',
    },
  ],
  [
    'charizard-mega-y',
    {
      enemies: ['charmeleon', 'charizard', 'arcanine', 'magmar'],
      rooms: 3,
      difficult: 'medium',
      type: 'mountain-raid',
    },
  ],
  [
    'blastoise-mega',
    {
      enemies: ['wartortle', 'blastoise', 'starmie', 'golduck'],
      rooms: 3,
      difficult: 'medium',
      type: 'sea-cave-raid',
    },
  ],
  [
    'beedrill-mega',
    {
      enemies: ['beedrill', 'venomoth', 'butterfree', 'beautifly'],
      rooms: 2,
      difficult: 'easy',
      type: 'swamp-raid',
    },
  ],
  [
    'ampharos-mega',
    {
      enemies: ['flaffy', 'ampharos', 'raichu', 'electrode'],
      rooms: 3,
      difficult: 'medium',
      type: 'plains-raid',
    },
  ],
  [
    'steelix-mega',
    {
      enemies: ['onix', 'steelix', 'rhydon', 'donphan'],
      rooms: 5,
      difficult: 'expert',
      type: 'stone-cave-raid',
    },
  ],
  [
    'scizor-mega',
    {
      enemies: ['heracross', 'pinsir', 'parasect', 'scizor'],
      rooms: 5,
      difficult: 'expert',
      type: 'swamp-raid',
    },
  ],
  [
    'heracross-mega',
    {
      enemies: ['heracross', 'pinsir', 'parasect', 'beedrill'],
      rooms: 3,
      difficult: 'medium',
      type: 'swamp-raid',
    },
  ],
  [
    'houndoom-mega',
    {
      enemies: ['houndoom', 'houndour', 'arcanine', 'ninetales'],
      rooms: 3,
      difficult: 'medium',
      type: 'fire-cave-raid',
    },
  ],
  [
    'tyranitar-mega',
    {
      enemies: ['tyranitar', 'pupitar', 'golem', 'probopass'],
      rooms: 5,
      difficult: 'expert',
      type: 'stone-cave-raid',
    },
  ],
  [
    'sceptile-mega',
    {
      enemies: ['grovyle', 'sceptile', 'ludicolo', 'tropius'],
      rooms: 3,
      difficult: 'medium',
      type: 'stone-cave-raid',
    },
  ],
  [
    'blaziken-mega',
    {
      enemies: ['blaziken', 'combusken', 'magmar', 'ninetales'],
      rooms: 3,
      difficult: 'medium',
      type: 'mountain-raid',
    },
  ],
  [
    'swampert-mega',
    {
      enemies: ['swampert', 'marshtomp', 'wailord', 'golduck'],
      rooms: 3,
      difficult: 'medium',
      type: 'beach-raid',
    },
  ],
  [
    'gardevoir-mega',
    {
      enemies: ['gardevoir', 'kirlia', 'sylveon', 'clefable'],
      rooms: 3,
      difficult: 'hard',
      type: 'fairy-forest-raid',
    },
  ],
  [
    'sableye-mega',
    {
      enemies: ['sableye'],
      rooms: 3,
      difficult: 'medium',
      type: 'dark-cave-raid',
    },
  ],
  [
    'mawile-mega',
    {
      enemies: ['mawile', 'clefable', 'metang'],
      rooms: 3,
      difficult: 'medium',
      type: 'dark-cave-raid',
    },
  ],
  [
    'sableye-mega',
    {
      enemies: ['sableye'],
      rooms: 3,
      difficult: 'medium',
      type: 'dark-cave-raid',
    },
  ],
  [
    'aggron-mega',
    {
      enemies: ['lairon', 'aggron', 'sudowoodo'],
      rooms: 3,
      difficult: 'medium',
      type: 'steel-cave-raid',
    },
  ],
  [
    'medicham-mega',
    {
      enemies: ['medicham', 'machamp', 'machoke', 'hypno'],
      rooms: 3,
      difficult: 'medium',
      type: 'dojo-raid',
    },
  ],
  [
    'manectric-mega',
    {
      enemies: ['manectric', 'raichu', 'magnezone', 'electabuzz'],
      rooms: 3,
      difficult: 'medium',
      type: 'plains-raid',
    },
  ],
  [
    'sharpedo-mega',
    {
      enemies: ['sharpedo', 'whiscash', 'wailmer', 'carvanha'],
      rooms: 3,
      difficult: 'medium',
      type: 'underwater-raid',
    },
  ],
  [
    'camerupt-mega',
    {
      enemies: ['camerupt', 'magmar', 'donphan', 'donphan'],
      rooms: 3,
      difficult: 'medium',
      type: 'fire-cave-raid',
    },
  ],
  [
    'altaria-mega',
    {
      enemies: ['altaria', 'dragonair', 'swablu', 'kingdra'],
      rooms: 3,
      difficult: 'medium',
      type: 'fairy-forest-raid',
    },
  ],
  [
    'bannete-mega',
    {
      enemies: ['shuppet', 'bannet', 'dusclops'],
      rooms: 3,
      difficult: 'medium',
      type: 'dark-cave-raid',
    },
  ],
  [
    'absol-mega',
    {
      enemies: ['absol', 'mightyena', 'umbreon'],
      rooms: 3,
      difficult: 'medium',
      type: 'dark-cave-raid',
    },
  ],
  [
    'absol-mega',
    {
      enemies: ['absol', 'mightyena', 'umbreon'],
      rooms: 3,
      difficult: 'medium',
      type: 'underwater-raid',
    },
  ],
  [
    'glalie-mega',
    {
      enemies: ['glalie', 'snorunt', 'dewgong', 'cloyster'],
      rooms: 3,
      difficult: 'medium',
      type: 'ice-cave-raid',
    },
  ],
  [
    'salamence-mega',
    {
      enemies: ['shelgon', 'dragonite', 'dragonair', 'altaria'],
      rooms: 6,
      difficult: 'insane',
      type: 'mountain-raid',
    },
  ],
  [
    'metagross-mega',
    {
      enemies: ['bronzong', 'metang', 'steelix', ''],
      rooms: 6,
      difficult: 'insane',
      type: 'steel-cave-raid',
    },
  ],
  [
    'loppunny-mega',
    {
      enemies: ['loppunny', 'bunneary', 'ursaring', 'miltank'],
      rooms: 2,
      difficult: 'easy',
      type: 'plains-raid',
    },
  ],
  [
    'garchomp-mega',
    {
      enemies: ['gabite', 'flygon', 'fraxure', 'haxorus'],
      rooms: 4,
      difficult: 'hard',
      type: 'plains-raid',
    },
  ],
  [
    'lucario-mega',
    {
      enemies: ['gurdurr', 'conkeldurr', 'throh', 'sawk'],
      rooms: 4,
      difficult: 'hard',
      type: 'dojo-raid',
    },
  ],
  [
    'abomasnow-mega',
    {
      enemies: ['glaceon', 'jynx', 'walrein', 'beartic'],
      rooms: 6,
      difficult: 'insane',
      type: 'ice-cave-raid',
    },
  ],
  [
    'gallade-mega',
    {
      enemies: ['hariyama', 'machamp', 'throh', 'grumpig'],
      rooms: 4,
      difficult: 'hard',
      type: 'dojo-raid',
    },
  ],
  [
    'audino-mega',
    {
      enemies: ['wiggyltuff', 'clefable', 'sylveon', 'miltank'],
      rooms: 4,
      difficult: 'hard',
      type: 'fairy-forest-raid',
    },
  ],
  [
    'diancie-mega',
    {
      enemies: ['wiggyltuff', 'clefable', 'sylveon', 'carbink'],
      rooms: 4,
      difficult: 'hard',
      type: 'fairy-forest-raid',
    },
  ],
  [
    'pidgeot-mega',
    {
      enemies: ['swellow', 'staraptor', 'fearow', 'noctowl'],
      rooms: 3,
      difficult: 'medium',
      type: 'mountain-raid',
    },
  ],
  [
    'slowbro-mega',
    {
      enemies: ['starmie', 'golduck', 'slowbro', 'pelipper'],
      rooms: 2,
      difficult: 'easy',
      type: 'mountain-raid',
    },
  ],
])
