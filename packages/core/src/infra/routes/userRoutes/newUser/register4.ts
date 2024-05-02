import prisma from '../../../../../../prisma-provider/src'
import { IResponse } from '../../../../server/models/IResponse'
import { spawnTutorialPokemon } from '../../../../server/modules/pokemon/spawnTutorialPokemon'
import { PlayerNotFoundError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const register4 = async (data: TRouteParams): Promise<IResponse> => {
  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  const gameRoom = await prisma.gameRoom.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player || !gameRoom) throw new PlayerNotFoundError(data.playerPhone)
  const { pokemon, imageUrl } = await spawnTutorialPokemon({ gameRoom, player })

  return {
    message: `Você encontrou um ${pokemon.baseData.name} selvagem!

    👍 - Batalhar
    `,
    status: 200,
    imageUrl: imageUrl,
    data: null,
    actions: [`pz. start 5 ${pokemon.id}`],
  }
}
