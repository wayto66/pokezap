import { iGenTradePokemon } from '../../../../../../image-generator/src/iGenTradePokemon'
import prisma from '../../../../../../prisma-provider/src'
import {
  PlayerInRaidIsLockedError,
  PlayerNotFoundError,
  PokemonDoesNotBelongsToTheUserError,
  PokemonDoesNotHaveOwnerError,
  PokemonNotFoundError,
  SendEmptyMessageError,
  SessionIdNotFoundError,
  SessionNotFoundError,
  TypeMissmatchError,
} from '../../../../infra/errors/AppErrors'
import { IResponse } from '../../../../server/models/IResponse'
import { ISession } from '../../../../server/models/ISession'
import { TRouteParams } from '../../router'
import { tradePoke2 } from './tradePoke2'

export const tradePoke1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , creatorPokemonIdString, invitedPokemonIdString, confirm, sessionIdString] = data.routeParams
  const creatorPokemonId = Number(creatorPokemonIdString)
  const invitedPokemonId = Number(invitedPokemonIdString)
  const sessionId = Number(sessionIdString)
  if (typeof creatorPokemonId !== 'number' || isNaN(creatorPokemonId))
    throw new TypeMissmatchError(creatorPokemonIdString, 'number')

  if (typeof invitedPokemonId !== 'number' || isNaN(invitedPokemonId))
    throw new TypeMissmatchError(invitedPokemonIdString, 'number')

  const requesterPlayer = await prisma.player.findUnique({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!requesterPlayer) throw new PlayerNotFoundError(data.playerPhone)

  if (data.fromReact && (typeof sessionId !== 'number' || isNaN(sessionId)))
    throw new TypeMissmatchError(sessionIdString, 'number')

  let session: ISession | undefined | null

  if (confirm === 'CONFIRM' && data.fromReact) {
    session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    })

    if (!session) throw new SessionNotFoundError(sessionId)
    if (session.invitedId !== requesterPlayer.id || session.isFinished) throw new SendEmptyMessageError()
  }

  const pokemons = await prisma.pokemon.findMany({
    where: {
      OR: [
        {
          id: creatorPokemonId,
        },
        {
          id: invitedPokemonId,
        },
      ],
    },
    include: {
      baseData: true,
      owner: true,
      teamSlot1: true,
      teamSlot2: true,
      teamSlot3: true,
      teamSlot4: true,
      teamSlot5: true,
      teamSlot6: true,
    },
  })

  const creatorPokemon = pokemons.find(pokemon => pokemon.id === creatorPokemonId)
  if (!creatorPokemon) throw new PokemonNotFoundError(creatorPokemonId)

  const invitedPokemon = pokemons.find(poke => poke.id === invitedPokemonId)
  if (!invitedPokemon) throw new PokemonNotFoundError(invitedPokemonId)

  if (creatorPokemon.ownerId !== requesterPlayer.id && !data.fromReact)
    throw new PokemonDoesNotBelongsToTheUserError(creatorPokemon.id, creatorPokemon.baseData.name, requesterPlayer.name)

  if (!invitedPokemon.ownerId) throw new PokemonDoesNotHaveOwnerError(invitedPokemon.id, invitedPokemon.baseData.name)
  if (invitedPokemon.owner?.isInRaid) throw new PlayerInRaidIsLockedError(invitedPokemon.owner.name)

  const invitedPlayer = await prisma.player.findUnique({
    where: {
      id: invitedPokemon.ownerId,
    },
  })

  if (!invitedPlayer) throw new PlayerNotFoundError(String(invitedPokemon.ownerId))

  if (confirm === 'CONFIRM' && data.fromReact) {
    if (!session) throw new SessionIdNotFoundError(sessionId)

    return await tradePoke2({
      creatorPokemon,
      invitedPokemon,
      session,
    })
  }

  const newSession = await prisma.session.create({
    data: {
      mode: 'poke-trade',
      creatorId: requesterPlayer.id,
      invitedId: invitedPlayer.id,
    },
  })

  const imageUrl = await iGenTradePokemon({
    pokemon1: creatorPokemon,
    pokemon2: invitedPokemon,
  })

  const creatorPokemonDisplayName = creatorPokemon.isAdult ? creatorPokemon.baseData.name : ''
  const invitedPokemonDisplayName = invitedPokemon.isAdult ? invitedPokemon.baseData.name : ''

  return {
    message: `${requesterPlayer.name} deseja trocar seu #${creatorPokemon.id} ${creatorPokemonDisplayName} com o #${invitedPokemon.id} ${invitedPokemonDisplayName} de ${invitedPlayer.name}.
    👍 - Aceitar`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pz. trade poke ${creatorPokemon.id} ${invitedPokemon.id} confirm ${newSession.id}`],
  }
}
