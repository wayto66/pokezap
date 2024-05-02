import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import {
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokeTeamNotFoundError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const teamLoad = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , teamNameUppercase] = data.routeParams

  if (!teamNameUppercase) throw new MissingParameterError('Nome do time')

  const teamName = teamNameUppercase.toLowerCase()

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerName)

  const pokeTeam = await prisma.pokeTeam.findUnique({
    where: {
      name_ownerId: {
        name: teamName,
        ownerId: player.id,
      },
    },
  })

  if (!pokeTeam) throw new PokeTeamNotFoundError(teamName)

  const pokemonsInTeam = await prisma.pokemon.findMany({
    where: {
      id: {
        in: pokeTeam.pokeIds,
      },
    },
  })

  for (const pokemon of pokemonsInTeam) {
    if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)
  }

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      teamPokeId1: pokeTeam.slot1Id,
      teamPokeId2: pokeTeam.slot2Id,
      teamPokeId3: pokeTeam.slot3Id,
      teamPokeId4: pokeTeam.slot4Id,
      teamPokeId5: pokeTeam.slot5Id,
      teamPokeId6: pokeTeam.slot6Id,
    },
  })

  return {
    message: '',
    react: '👌',
    status: 200,
  }
}
