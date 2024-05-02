import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import {
  InvalidNicknameError,
  MissingParameterError,
  MissingParametersPokemonInformationError,
  NicknameAlreadyInUseError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonNickname = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, nickNameUppercase, remove] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()
  if (!nickNameUppercase) throw new MissingParameterError('Nome desejado')

  const nickname = nickNameUppercase.toLowerCase()

  const nicknameCheck = await prisma.basePokemon.findFirst({
    where: {
      name: nickname,
    },
  })

  if (nicknameCheck) throw new InvalidNicknameError(nickname)

  const nicknameCheck2 = await prisma.pokemon.findFirst({
    where: {
      nickName: nickname,
    },
  })

  if (nicknameCheck2) throw new NicknameAlreadyInUseError(nickname)

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prisma.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
      owner: true,
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })
  if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
    throw new PokemonNotFoundError(pokemonRequestData.identifier)

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      nickName: nickname,
    },
  })

  return {
    message: ``,
    react: '👌',
    status: 200,
  }
}
