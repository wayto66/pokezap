import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'
import fetch from 'node-fetch'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { logger } from '../infra/logger'
import { pokemonData } from './data'
import { itemsData } from './items'
import { skillsData } from './moves'
import { specialPokemons } from './specialPokemons'

export async function thiefTime() {
  const baseUrl = 'https://pokeapi.co/api/v2'
  const endpoint = '/pokemon/'

  // Fetch data for the first 151 Pokemon
  const limit = 500
  const url = `${baseUrl}${endpoint}?limit=${limit}&offset=1030`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Map each Pokemon to a new object with name and types properties
      const pokemonData = data.results.map((pokemon: any) => ({
        name: pokemon.name,
        types: [],
        sprites: [],
      }))

      // Fetch additional data for each Pokemon and add types to the objects
      Promise.all(
        pokemonData.map((pokemon: any) => {
          const url = `${baseUrl}${endpoint}${pokemon.name}`
          return fetch(url)
            .then(response => response.json())
            .then(async data => {
              pokemon.id = data.id
              pokemon.baseExperience = data.base_experience
              pokemon.height = data.height
              pokemon.stats = {
                hp: data.stats[0].base_stat,
                atk: data.stats[1].base_stat,
                def: data.stats[2].base_stat,
                spAtk: data.stats[3].base_stat,
                spDef: data.stats[4].base_stat,
                speed: data.stats[5].base_stat,
              }

              const moves = data.moves.filter((move: any) => {
                return move.version_group_details.some((detail: any) => {
                  return !detail.move_learn_method.name.includes('egg')
                })
              })

              pokemon.moves = moves.map((move: any) => {
                const getLevelLearned = move.version_group_details.find((detail: any) => {
                  return detail.level_learned_at !== 0
                })

                const levelLearned = getLevelLearned ? getLevelLearned.level_learned_at : 0

                return {
                  name: move.move.name,
                  level: levelLearned,
                }
              })

              pokemon.types = data.types.map((type: any) => type.type.name)
              pokemon.isDualType = pokemon.types.length !== 1
              pokemon.sprites = {
                normal: data.sprites.front_default,
                shiny: data.sprites.front_shiny,
              }

              const speciesResponse = await fetch(data.species.url)
              const speciesData = await speciesResponse.json()

              const evolutionChainResponse = await fetch(speciesData.evolution_chain.url)
              const evolutionData = await evolutionChainResponse.json()

              pokemon.evolutionData = {}

              pokemon.evolutionData.isFirstEvolution = evolutionData.chain.species.name === pokemon.name
              const evoto = evolutionData.chain.evolves_to
              pokemon.evolutionData.evolutionChain = evoto

              return pokemon
            })
        })
      ).then(data => {
        const dataString = `export const pokemonData = ${JSON.stringify(data)};`

        // Write data to file
        const filename = 'mega-alola-galar_data.ts'
        writeFileSync(filename, dataString)

        logger.info(`Data written to ${filename}`)
      })
    })
    .catch(error => logger.error(error))
}

export async function thiefTimeMoves() {
  const baseUrl = 'https://pokeapi.co/api/v2'
  const endpoint = '/move/'

  // Fetch data for the first 151 Pokemon
  const limit = 920
  const url = `${baseUrl}${endpoint}?limit=${limit}`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Map each Pokemon to a new object with name and types properties
      const moveData = data.results.map((move: any) => ({
        name: move.name,
      }))

      // Fetch additional data for each Pokemon and add types to the objects
      Promise.all(
        moveData.map((move: any) => {
          const url = `${baseUrl}${endpoint}${move.name}`
          return fetch(url)
            .then(response => response.json())
            .then(data => {
              move.id = data.id
              move.type = data.type.name
              move.target = data.target.name
              move.pp = data.pp
              move.class = data.damage_class.name
              move.power = data.power
              move.statChanges = data.stat_changes.map((data: any) => {
                return {
                  change: data.change,
                  stat: data.stat.name,
                }
              })

              return move
            })
        })
      ).then(data => {
        const dataString = `export const pokemonData = ${JSON.stringify(data)};`

        // Write data to file
        const filename = 'moves.ts'
        writeFileSync(filename, dataString)

        logger.info(`Data written to ${filename}`)
      })
    })
    .catch(error => logger.error(error))
}

export async function stealItems() {
  const baseUrl = 'https://pokeapi.co/api/v2'
  const endpoint = '/item/'

  // Fetch data for the first 151 Pokemon
  const limit = 709
  const url = `${baseUrl}${endpoint}?limit=${limit}`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Map each Pokemon to a new object with name and types properties
      const itemData = data.results.map((item: any) => ({
        name: item.name,
      }))

      // Fetch additional data for each Pokemon and add types to the objects
      Promise.all(
        itemData.map((item: any) => {
          const url = `${baseUrl}${endpoint}${item.name}`
          return fetch(url)
            .then(response => response.json())
            .then(data => {
              item.id = data.id
              item.category = data.category.name
              item.sprite = data.sprites.default
              item.cost = data.cost

              return item
            })
        })
      ).then(data => {
        const dataString = `export const pokemonData = ${JSON.stringify(data)};`

        // Write data to file
        const filename = 'items.ts'
        writeFileSync(filename, dataString)

        logger.info(`Data written to ${filename}`)
      })
    })
    .catch(error => logger.error(error))
}

export async function populate() {
  const client = container.resolve<PrismaClient>('PrismaClient')
  await client.basePokemon.deleteMany()
  await client.type.deleteMany()
  await client.talent.deleteMany()
  await client.skill.deleteMany({
    where: {
      statusTrashed: false,
    },
  })

  const pokeTypes = [
    'normal',
    'fighting',
    'flying',
    'poison',
    'ground',
    'rock',
    'bug',
    'ghost',
    'steel',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'ice',
    'dragon',
    'dark',
    'fairy',
  ]

  for (let i = 0; i < pokeTypes.length; i++) {
    await client.type.create({
      data: {
        name: pokeTypes[i],
      },
    })
    await client.talent.create({
      data: {
        typeName: pokeTypes[i],
      },
    })
  }

  const skills: any = skillsData
  for (const skill of skills) {
    try {
      await client.skill.create({
        data: {
          attackPower: skill.power ? skill.power : 0,
          name: skill.name,
          isPhysical: skill.class === 'physical',
          isSpecial: skill.class === 'special',
          typeName: skill.type,
        },
      })
    } catch (e: any) {
      logger.error(e.message)
    }
  }

  const moveLevelForMachineMoves = 50

  const pokemons: any = pokemonData
  for (let i = 0; i < pokemons.length; i++) {
    const skillTable: string[] = []
    for (const move of pokemons[i].moves) {
      if (move.level > 0) {
        skillTable.push(`${move.name}%${move.level}`)
        continue
      }
      skillTable.push(`${move.name}%${moveLevelForMachineMoves}`)
    }
    await client.basePokemon.create({
      data: {
        BaseAtk: pokemons[i].stats.atk,
        BaseDef: pokemons[i].stats.def,
        BaseHp: pokemons[i].stats.hp,
        BaseSpAtk: pokemons[i].stats.spAtk,
        BaseSpDef: pokemons[i].stats.spDef,
        BaseSpeed: pokemons[i].stats.speed,
        BaseAllStats:
          pokemons[i].stats.atk +
          pokemons[i].stats.def +
          pokemons[i].stats.hp +
          pokemons[i].stats.spAtk +
          pokemons[i].stats.spDef +
          pokemons[i].stats.speed,
        BaseExperience: pokemons[i].baseExperience,
        defaultSpriteUrl: pokemons[i].sprites.normal,
        shinySpriteUrl: pokemons[i].sprites.shiny,
        type1Name: pokemons[i].types[0],
        type2Name: pokemons[i].types[1],
        name: pokemons[i].name,
        height: pokemons[i].height,
        pokedexId: pokemons[i].id,
        skills: {
          connect: pokemons[i].moves.map((m: any) => {
            return {
              name: m.name,
            }
          }),
        },
        skillTable: skillTable,
        isFirstEvolution: pokemons[i].evolutionData.isFirstEvolution,
        evolutionData: pokemons[i].evolutionData,
      },
    })
  }

  const items: any[] = itemsData
  for (const item of items) {
    await client.baseItem.create({
      data: {
        name: item.name,
        type: item.category,
        spriteUrl: item.sprite,
        npcPrice: item.cost,
      },
    })
  }
}

export async function populateMegas() {
  const moveLevelForMachineMoves = 50

  const client = container.resolve<PrismaClient>('PrismaClient')
  const pokemons: any = specialPokemons
  for (let i = 0; i < pokemons.length; i++) {
    const skillTable: string[] = []
    for (const move of pokemons[i].moves) {
      if (move.level > 0) {
        skillTable.push(`${move.name}%${move.level}`)
        continue
      }
      skillTable.push(`${move.name}%${moveLevelForMachineMoves}`)
    }
    const isRegional = pokemons[i].name.includes(['alola', 'galar'])
    const isMega = pokemons[i].name.includes('mega')
    await client.basePokemon.create({
      data: {
        isRegional,
        isMega,
        BaseAtk: pokemons[i].stats.atk,
        BaseDef: pokemons[i].stats.def,
        BaseHp: pokemons[i].stats.hp,
        BaseSpAtk: pokemons[i].stats.spAtk,
        BaseSpDef: pokemons[i].stats.spDef,
        BaseSpeed: pokemons[i].stats.speed,
        BaseAllStats:
          pokemons[i].stats.atk +
          pokemons[i].stats.def +
          pokemons[i].stats.hp +
          pokemons[i].stats.spAtk +
          pokemons[i].stats.spDef +
          pokemons[i].stats.speed,
        BaseExperience: pokemons[i].baseExperience,
        defaultSpriteUrl: pokemons[i].sprites.normal,
        shinySpriteUrl: pokemons[i].sprites.shiny,
        type1Name: pokemons[i].types[0],
        type2Name: pokemons[i].types[1],
        name: pokemons[i].name,
        height: pokemons[i].height,
        pokedexId: pokemons[i].id,
        skills: {
          connect: pokemons[i].moves.map((m: any) => {
            return {
              name: m.name,
            }
          }),
        },
        skillTable: skillTable,
        isFirstEvolution: pokemons[i].evolutionData.isFirstEvolution,
        evolutionData: pokemons[i].evolutionData,
      },
    })
  }
}
