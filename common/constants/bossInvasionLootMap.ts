export type LootData = {
  itemName: string
  dropChance: number
  dropAmount?: [number, number]
}

export const bossInvasionLootMap = new Map<string, LootData[]>([
  [
    'magmortar',
    [
      { itemName: 'fire-stone', dropChance: 0.15 },
      { itemName: 'magmarizer', dropChance: 0.05 },
      { itemName: 'flame-plate', dropChance: 0.1 },
      { itemName: 'magu-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'electivire',
    [
      { itemName: 'thunder-stone', dropChance: 0.15 },
      { itemName: 'electirizer', dropChance: 0.05 },
      { itemName: 'zap-plate', dropChance: 0.1 },
      { itemName: 'tinker-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'milotic',
    [
      { itemName: 'water-stone', dropChance: 0.15 },
      { itemName: 'prism-scale', dropChance: 0.05 },
      { itemName: 'splash-plate', dropChance: 0.1 },
      { itemName: 'net-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'kingdra',
    [
      { itemName: 'water-stone', dropChance: 0.15 },
      { itemName: 'dragon-scale', dropChance: 0.05 },
      { itemName: 'splash-plate', dropChance: 0.1 },
      { itemName: 'draco-plate', dropChance: 0.1 },
      { itemName: 'net-ball', dropChance: 0.1, dropAmount: [1, 2] },
      { itemName: 'tale-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'steelix',
    [
      { itemName: 'oval-stone', dropChance: 0.15 },
      { itemName: 'metal-coat', dropChance: 0.05 },
      { itemName: 'iron-plate', dropChance: 0.1 },
      { itemName: 'earth-plate', dropChance: 0.1 },
      { itemName: 'tinker-ball', dropChance: 0.1, dropAmount: [1, 2] },
      { itemName: 'magu-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'scizor',
    [
      { itemName: 'oval-stone', dropChance: 0.15 },
      { itemName: 'metal-coat', dropChance: 0.05 },
      { itemName: 'iron-plate', dropChance: 0.1 },
      { itemName: 'insect-plate', dropChance: 0.1 },
      { itemName: 'tinker-ball', dropChance: 0.1, dropAmount: [1, 2] },
      { itemName: 'net-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'dusknoir',
    [
      { itemName: 'dusk-stone', dropChance: 0.15 },
      { itemName: 'reaper-cloth', dropChance: 0.05 },
      { itemName: 'spooky-plate', dropChance: 0.1 },
      { itemName: 'moon-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'slowking',
    [
      { itemName: 'water-stone', dropChance: 0.15 },
      { itemName: 'kings-rock', dropChance: 0.05 },
      { itemName: 'splash-plate', dropChance: 0.1 },
      { itemName: 'mind-plate', dropChance: 0.1 },
      { itemName: 'yume-ball', dropChance: 0.1, dropAmount: [1, 2] },
      { itemName: 'net-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'rhyperior',
    [
      { itemName: 'oval-stone', dropChance: 0.15 },
      { itemName: 'protector', dropChance: 0.05 },
      { itemName: 'earth-plate', dropChance: 0.1 },
      { itemName: 'stone-plate', dropChance: 0.1 },
      { itemName: 'dusk-ball', dropChance: 0.1, dropAmount: [1, 2] },
      { itemName: 'magu-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'tangrowth',
    [
      { itemName: 'leaf-stone', dropChance: 0.15 },
      { itemName: 'massive-vines', dropChance: 0.05 },
      { itemName: 'meadow-plate', dropChance: 0.1 },
      { itemName: 'janguru-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
  [
    'mamoswine',
    [
      { itemName: 'ice-stone', dropChance: 0.15 },
      { itemName: 'massive-tusk', dropChance: 0.05 },
      { itemName: 'icicle-plate', dropChance: 0.1 },
      { itemName: 'sora-ball', dropChance: 0.1, dropAmount: [1, 2] },
      { itemName: 'magu-ball', dropChance: 0.1, dropAmount: [1, 2] },
    ],
  ],
])
