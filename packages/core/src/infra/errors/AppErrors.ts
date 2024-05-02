export class AppError {
  readonly message: string
  readonly data: string | null
  readonly statusCode: number
  readonly actions?: string[]
  readonly react?: string

  constructor(message: string, statusCode = 300, react?: string, actions?: string[], data = null) {
    this.message = message
    this.statusCode = statusCode
    this.data = data
    this.actions = actions
    this.react = react
  }
}

export class RouteNotProvidedError extends AppError {
  constructor() {
    const message = `Por favor especifique uma rota. Exemplos:
    - jogador
    - pokemon
    - inventario
    - rota
    - breed
    - loja`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InvalidSpriteError extends AppError {
  constructor() {
    const message = 'ERRO: número de sprite inválido.'

    super(message)
  }
}

export class GenderDoesNotExistError extends AppError {
  constructor(gender: string) {
    const message = `ERRO: Gênero "${gender}" não encontrado. Utilize: 'menino' ou 'menina'.`

    super(message)
  }
}

export class RouteAlreadyRegisteredError extends AppError {
  constructor() {
    const message = 'O grupo atual já está registrado como uma rota no jogo.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InvalidRouteError extends AppError {
  constructor() {
    const message = `ERRO: não foi possível detectar a rota atual.`

    super(message)
  }
}

export class RouteNotFoundError extends AppError {
  constructor(playerName: string, routeName: string) {
    const message = `No route found for ${playerName} with ${routeName}`

    super(message)
  }
}

export class RouteForbiddenForDuelRaidError extends AppError {
  constructor() {
    const message = `Na rota atual, não é permitido duelos.`

    super(message)
  }
}

export class RouteAlreadyHasARaidRunningError extends AppError {
  constructor(raidName: string) {
    const message = `A raid: "${raidName}" está ativa na rota. Para cancelar, utilize o comando "raid cancel".`

    super(message)
  }
}

export class NoRaidRunningError extends AppError {
  constructor() {
    const message = `Não há nenhuma raid ativa no momento.`

    super(message)
  }
}

export class RouteDoesNotHaveUpgradeError extends AppError {
  constructor(upgradeName: string) {
    const message = `Esta ação não é possível pois a rota atual não possui: ${upgradeName}`

    super(message)
  }
}

export class DaycareIsFullError extends AppError {
  constructor() {
    const message = `Sinto muito, o daycare está lotado.`

    super(message)
  }
}

export class ItemNotEligibleForBazarError extends AppError {
  constructor() {
    const message = `Sinto muito, este item não é aceito no Bazar.`

    super(message)
  }
}

export class RouteHasADifferentIncenseActiveError extends AppError {
  constructor(incenseName: string) {
    const message = `Esta ação não é possível pois a rota atual possui um incenso diferente ativo: ${incenseName}`

    super(message)
  }
}

export class UpgradeNotFoundError extends AppError {
  constructor(name: string) {
    const message = `Nenhum upgrade encontrado com o nome: ${name}`

    super(message)
  }
}

export class AlreadyTravelingError extends AppError {
  constructor(routeId: number | string) {
    const message = `Treinadores da rota ${routeId} já estão em viagem.`

    super(message)
  }
}

export class SubRouteNotFoundError extends AppError {
  constructor(subrouteName: string) {
    const message = `ERROR: Nenhuma rota encontrada para ${subrouteName}, verifique a ortografia e a sintáxe do comando.`

    super(message)
  }
}

export class MissingParametersCatchRouteError extends AppError {
  constructor() {
    const message = `Por favor, informe o nome da pokebola utilizada e o ID do pokemon à ser capturado. Exemplo: poke**p. catch pokebola 25`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersBuyAmountError extends AppError {
  constructor() {
    const message = 'Por favor, especifique a quantidade que deseja comprar ao enviar o comando de compra.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersInvasionRouteError extends AppError {
  constructor() {
    const message = `Informe a categoria da invasão:
👍 - Defend`
    const statusCode = 300
    const actions = ['pz. invasion defend']

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParametersInventoryRouteError extends AppError {
  constructor() {
    const message = `Informe a categoria do inventário: \n👍 - Pokemons \n❤ - Items`
    const statusCode = 300
    const actions = ['pz. inventory poke', 'pz. inventory items']

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParametersMarketRouteError extends AppError {
  constructor() {
    const message = `Bem vindo(a) ao Mercado! Aqui você pode anunciar seus pokemons para receber ofertas de trocas, ou fazer ofertas nos que já estão anunciados! \n\n 👍 - Ver Ofertas em seus anúncios \n\n Para anunciar: pz market announce id-do-pokemon \n Para remover: pz market announce idpoke remove \n `
    const statusCode = 300
    const actions = ['pz. market offers']

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParametersHelpRouteError extends AppError {
  constructor() {
    const message = `[d] Informe a categoria que deseja ajuda:
👍 - Comandos disponíveis
❤ - Clans
😂 - Pokeballs
😮 - Plates

Tente tambem utilizar: pz. help (nome do tópico, item, etc.)`
    const statusCode = 404
    const actions = ['pz. help commands', 'pz. help clans', 'pz. help pokeballs', 'pz. help plates']

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParametersPokemonRouteError extends AppError {
  constructor() {
    const message = `Por favor, especifique uma ação após o comando "pokemon":
- _info_
- _team_
- _evolve_ 
- _mega-evolve_ 
- _skills_
- _give-item_
- _drop-item_`
    const statusCode = 404

    super(message, statusCode)
  }
}

export class MissingParametersRouteRouteError extends AppError {
  constructor() {
    const message = `Por favor, especifique uma ação após o comando "route":
- _start_
- _enter_
- _leave_ 
- _info_ 
- _upgrade_
- _incense_
- _lock_
- _verify_ 
- _forfeit_
- _poke-ranch_ 
- _day-care_
- _travel_
    `
    const statusCode = 404

    super(message, statusCode)
  }
}

export class MissingParametersBreedRouteError extends AppError {
  constructor() {
    const message = `Você deve fornecer o id dos pokemons à serem cruzados. (Ex. poke**p. breed 25 24)`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersRankRouteError extends AppError {
  constructor() {
    const message = `Informe a categoria do ranking:
👍 - elo
❤ - catch
    `
    const statusCode = 300
    const actions = ['pz. rank elo', 'pz. rank catch']

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParametersPokemonInformationError extends AppError {
  constructor() {
    const message = `Forneca o id ou nome do pokemon. `

    super(message)
  }
}

export class MissingParametersMarketAnnounceError extends AppError {
  constructor() {
    const message = `[dsb] Para anunciar um pokémon no mercado siga o exemplo: \n\n pz. market announce 25077 600  (anunciando o pokemon #25077 por $600) \n\n pz. mercado anunciar charmander 1000 (anunciando charmander por $1000)`

    super(message)
  }
}

export class MissingParametersSendRouteError extends AppError {
  constructor() {
    const message = `Por favor, especifique após o comando "send":
- _items_
- _poke_
- _cash_`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersTradeRouteError extends AppError {
  constructor() {
    const message = `Por favor, especifique após o comando "trade":
- _items_
- _poke_`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParameterError extends AppError {
  constructor(parameterName: string) {
    const message = `Por favor, informe o(a): ${parameterName}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InvalidNicknameError extends AppError {
  constructor(nickname: string) {
    const message = `Apelido "${nickname}" não é válido.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class NicknameAlreadyInUseError extends AppError {
  constructor(nickname: string) {
    const message = `Apelido "${nickname}" já está sendo utilizado.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingTravelRegionError extends AppError {
  constructor() {
    const message = `Para onde iremos viajar?
👍 - Alola 
❤ - Galar
😂 - Voltar`
    const statusCode = 300
    const actions = ['pz. rota travel alola', 'pz. rota travel galar', 'pz. rota travel return']

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParameterSetRoleRouteError extends AppError {
  constructor(pokemonName: string) {
    const message = `Qual função deseja atribuir à ${pokemonName}? \n👍 - Causador de dano (damage) \n❤ - Defensor (tanker) \n😂 - Suporte (support)`
    const statusCode = 300
    const actions = [
      `pz. p setrole ${pokemonName} damage`,
      `pz. p setrole ${pokemonName} tanker`,
      `pz. p setrole ${pokemonName} support`,
    ]

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParameterLabRouteError extends AppError {
  constructor() {
    const message = `Bem vindo(a) ao Laboratório! Aqui você pode re-ensinar os talentos de seu pokemon *shiny* ou `
    const statusCode = 300
    const actions = ['pz. rota travel alola', 'pz. rota travel galar', 'pz. rota travel return']

    super(message, statusCode, undefined, actions)
  }
}

export class MissingParametersDuelRouteError extends AppError {
  constructor() {
    const message =
      'Por favor, especifique o tipo de duelo e o ID do player à ser enfrentado. [dsb] \n\n Exemplo: pz. duel x1 105 '
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersUseItemRouteError extends AppError {
  constructor() {
    const message = 'Por favor, especifique o item que deseja usar.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class NoSubRouteForUseItemRouteError extends AppError {
  constructor(itemName: string) {
    const message = `Parece que não há como usar ${itemName} desta forma.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersBattleRouteError extends AppError {
  constructor() {
    const message = 'Por favor, especifique o ID do pokemon selvagem à ser enfrentado. (Ex. poke**p battle 25)'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InvalidPokeBallName extends AppError {
  constructor(ballName: string) {
    const message = `*${ballName}* não é um nome válido de pokebola.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonAlreadyRanAwayError extends AppError {
  constructor(id: number, playerName: string) {
    const message = `*${playerName}* já enfrentou o Pokemon ${id} e este fugiu.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonAlreadyBattledByPlayerError extends AppError {
  constructor(id: number, playerName: string) {
    const message = `*${playerName}* já enfrentou o Pokemon ${id}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class CatchFailedPokemonRanAwayError extends AppError {
  constructor(id: number, playerName: string) {
    const message = `*${playerName}* já tentou capturar o Pokemon ${id} e este fugiu.`
    const statusCode = 300
    super(message, statusCode)
  }
}

export class PlayerDoesNotResideOnTheRoute extends AppError {
  constructor(gameRoomId: number, playerName: string) {
    const message = `*${playerName}* não reside na rota ${gameRoomId}, portanto não pode enfrentar os pokemons da rota.
    👍 - Entrar na rota`
    const statusCode = 300
    const actions = ['pz. rota entrar']

    super(message, statusCode, undefined, actions)
  }
}
export class XIsInCooldownError extends AppError {
  constructor(xName: string, hoursCooldown: string) {
    const message = `Desculpe, o ${xName} não está disponível no momento. Estará disponível daqui ${hoursCooldown} horas.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InvalidDifficultError extends AppError {
  constructor() {
    const message = `Dificuldade inválida. Disponíveis: easy, medium, hard, expert, insane.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerNotFoundError extends AppError {
  constructor(playerPhone: string) {
    const message = `ERRO: Jogador não encontrado com o código ${playerPhone}`

    super(message)
  }
}

export class PlayerAlreadyExists extends AppError {
  constructor(name: string) {
    const message = `${name}, parece que você já tem um personagem cadastrado.`

    super(message)
  }
}

export class SkillNotFoundError extends AppError {
  constructor(skillName: string) {
    const message = `ERRO: Não existe uma skill com o nome: "${skillName}"`

    super(message)
  }
}

export class OfferNotFoundError extends AppError {
  constructor(id: string) {
    const message = `ERRO: Oferta não encontrado com o código ${id}`

    super(message)
  }
}

export class PokeTeamNotFoundError extends AppError {
  constructor(teamName: string) {
    const message = `Não foi encontrado nenhum time salvo com o nome: "${teamName}".`

    super(message)
  }
}

export class PlayerInRaidIsLockedError extends AppError {
  constructor(playerName: string) {
    const message = `${playerName} está em uma raid. Não é possível realizar operações. Se for necessário, utilize "raid cancel" para cancelar a raid.`

    super(message)
  }
}

export class PokemonNotFoundError extends AppError {
  constructor(pokemonId: number | string) {
    const message = `ERRO: Pokemon não encontrado com o id ${pokemonId}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class ZeroPokemonsFoundError extends AppError {
  constructor() {
    const message = `Não foi possível localizar os pokemons.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonMustBeShinyError extends AppError {
  constructor() {
    const message = `Só é permitido pokemon shiny.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonIsNotHoldingItemError extends AppError {
  constructor(pokemonId: number | string) {
    const message = `Pokemon ${pokemonId} não está segurando um item.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonCantMegaEvolveError extends AppError {
  constructor(pokemonId: number | string) {
    const message = `Pokemon ${pokemonId} não pode mega-evoluir.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonIsNotMegaError extends AppError {
  constructor(pokemonId: number | string) {
    const message = `Pokemon ${pokemonId} não pode mega-reverter.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RaidDataNotFoundError extends AppError {
  constructor(raidName: string) {
    const message = `Não existe nenhuma raid com o nome ${raidName}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class ItemNotFoundError extends AppError {
  constructor(itemName: string) {
    const message = `Item não encontrado com o nome ${itemName}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RequiredItemNotFoundError extends AppError {
  constructor() {
    const message = `Você não possui um item necessário para realizar esta ação.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InsufficientItemAmountError extends AppError {
  constructor(itemName: string, currentAmount: number, requestedAmount: number) {
    const message = `Não foi possível enviar ${requestedAmount} ${itemName}. Você possui apenas ${currentAmount}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InvasionNotFoundError extends AppError {
  constructor(invasionId: number | string) {
    const message = `ERRO: Invasão não encontrada com o id ${invasionId}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RaidNotFoundError extends AppError {
  constructor(raidId: number | string) {
    const message = `ERRO: Raid não encontrada com o id ${raidId}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerDoestNotOwnThePokemonError extends AppError {
  constructor(id: number | string, playerName: string) {
    const message = `O pokemon #${id} não pertence à ${playerName}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonExceededRanchTimeLimit extends AppError {
  constructor(id: number | string, pokemonName: string) {
    const message = `O pokemon #${id} ${pokemonName} excedeu o tempo limite de 12 horas para o uso do poke-ranch.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonDoesNotHasMegaEvolutionError extends AppError {
  constructor(id: number | string, pokemonName: string) {
    const message = `O pokemon #${id} ${pokemonName} não é capaz de mega-evoluir.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonNotInDaycareError extends AppError {
  constructor(pokemonId: number, pokemonName: string) {
    const message = `#${pokemonId} ${pokemonName} não está no daycare.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonIsNotInRaidTeamError extends AppError {
  constructor(playerName: string, pokemonId: number, pokemonName: string) {
    const message = `O pokemon #${pokemonId} ${pokemonName} não está registrado no time de raid de ${playerName}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class CantProceedWithPokemonInTeamError extends AppError {
  constructor(pokemonId: number, pokemonName: string) {
    const message = `#${pokemonId} ${pokemonName} está no seu time. Para poder realizar esta ação, remova-o do seu time.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class OfferIsNotForPlayerError extends AppError {
  constructor(id: string | number) {
    const message = `ERRO: O anúncio com o código "${id}" não é destinado à você.`

    super(message)
  }
}

export class OfferAlreadyFinishedError extends AppError {
  constructor(id: string | number) {
    const message = `ERRO: O anúncio com o código "${id}" já se encerrou.`

    super(message)
  }
}

export class PokemonInDaycareRemainingTime extends AppError {
  constructor(pokemonId: number, pokemonName: string, remainingTime: string) {
    const message = `#${pokemonId} ${pokemonName} está no daycare. Faltam ainda: ${remainingTime} horas.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonAboveDaycareLevelLimit extends AppError {
  constructor(pokemonId: number, pokemonName: string, levelLimit: number) {
    const message = `#${pokemonId} ${pokemonName} está acima do nivel máximo do daycare. O nível é determinado pelo nível atual da rota: ${levelLimit}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class CantDuelItselfError extends AppError {
  constructor() {
    const message = 'Você deve informar o id jogador a ser desafiado no duelo, não o seu.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerOnlyHasOnePokemonError extends AppError {
  constructor(playerName: string) {
    const message = `${playerName} não pode vender seu único pokemon.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class CantSellAllPokemonsError extends AppError {
  constructor(playerName: string) {
    const message = `${playerName} não pode vender todos os seus pokemons.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class CantSellPokemonInTeamError extends AppError {
  constructor(id: number) {
    const message = `O pokemon #${id} faz parte do seu time e não pode ser vendido. Retire-o do seu time primeiro.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class NoItemsFoundError extends AppError {
  constructor() {
    const message = `ERRO: Nenhum item encontrado.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class SessionNotFoundError extends AppError {
  constructor(sessionId: number) {
    const message = `ERRO: Nenhuma sessão de troca encontrada com codigo: "${sessionId}"`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayersPokemonNotFoundError extends AppError {
  constructor(pokemonId: number, playerName: string) {
    const message = `ERRO: Pokemon não encontrado com o id "${pokemonId}" para o player ${playerName}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonAlreadyHasOwnerError extends AppError {
  constructor(pokemonId: number, pokemonName: string) {
    const message = `ERRO: Pokemon: #${pokemonId} - ${pokemonName} já foi capturado por outro jogador.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonDoesNotBelongsToTheUserError extends AppError {
  constructor(pokemonId: number, pokemonName: string, playerName: string) {
    const message = `ERRO: Pokemon #${pokemonId} ${pokemonName} não pertence à ${playerName}. `

    super(message)
  }
}

export class PokemonDoesNotHaveOwnerError extends AppError {
  constructor(pokemonId: number, pokemonName: string) {
    const message = `Pokemon #${pokemonId} ${pokemonName} não possui dono.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonAlreadyHasChildrenError extends AppError {
  constructor(pokemonId: number, pokemonName: string, amount: number) {
    const message = `Pokemon: #${pokemonId} ${pokemonName} já possui ${amount} filhotes.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class CantBreedShiniesError extends AppError {
  constructor() {
    const message = `Sinto muito, não é possivel cruzar pokemon shiny.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerDoesNotHaveItemError extends AppError {
  constructor(playerName: string, itemName: string) {
    const message = `${playerName} não possui nenhuma ${itemName}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InvalidChildrenAmountError extends AppError {
  constructor() {
    const message = `ERROR: invalid children amount.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class WrongRegionToEvolveError extends AppError {
  constructor(pokemonName: string) {
    const message = `${pokemonName} parece evoluir apenas em uma certa região.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class TypeMissmatchError extends AppError {
  constructor(value: string, typeName: string) {
    const message = `ERRO: "${value}" não é do tipo ${typeName}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class SessionIdNotFoundError extends AppError {
  constructor(sessionId: number) {
    const message = `ERRO: não foi possível encontrar uma sessão de duelo com o id: ${sessionId}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerDoesNotHaveThePokemonInTheTeamError extends AppError {
  constructor(playerName: string) {
    const message = `${playerName} não possui um pokemon no seu time.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RequestedShopItemDoesNotExists extends AppError {
  constructor(itemId: number | string) {
    const message = `Não há um item com id: "${itemId}" disponível na loja.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InsufficientFundsError extends AppError {
  constructor(playerName: string, playerFunds: number, requiredFunds: number) {
    const message = `${playerName} não possui POKECOINS suficientes. São necessários ${requiredFunds}, ainda falta ${
      requiredFunds - playerFunds
    } `
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InsufficientShardsError extends AppError {
  constructor(playerName: string, playerFunds: number, requiredFunds: number) {
    const message = `${playerName} não possui POKESHARDS suficientes. São necessários ${requiredFunds}, ainda faltam ${
      requiredFunds - playerFunds
    } `
    const statusCode = 300

    super(message, statusCode)
  }
}

export class SendEmptyMessageError extends AppError {
  constructor() {
    const message = ''
    const react = '❌'
    const statusCode = 300

    super(message, statusCode, react)
  }
}

export class InvasionAlreadyFinishedError extends AppError {
  constructor() {
    const message = `A invasão já se encerrou.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RaidAlreadyFinishedError extends AppError {
  constructor() {
    const message = `A raid já se encerrou.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerDoesNotBelongToRaidTeamError extends AppError {
  constructor(playerName: string) {
    const message = `${playerName} não está na equipe da raid.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RaidAlreadyInProgressError extends AppError {
  constructor(playerName: string) {
    const message = `${playerName}: A raid já se iniciou, não é possível entrar mais.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RoomDoesNotExistsInRaidError extends AppError {
  constructor(roomIndex: number, raidName: string) {
    const message = `A sala ${roomIndex} não existe na raid ${raidName}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class RoomAlreadyFinishedError extends AppError {
  constructor(roomIndex: number) {
    const message = `A sala ${roomIndex} já foi finalizada.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerDoesNotHaveReviveForPokemonInRaidError extends AppError {
  constructor(playerName: string, pokemonName: string) {
    const message = `${playerName} não possui um revive para usar em ${pokemonName}. Troque de pokemon.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InsufficentPlayersForInvasionError extends AppError {
  constructor(amount: number, requiredAmount: number) {
    const message = `É necessário ${requiredAmount} jogadores para esta missão. No momento há apenas ${amount}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerDidNotDefeatPokemonError extends AppError {
  constructor(playerName: string) {
    const message = `*${playerName}* não derrotou o pokemon.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class NoDuelWinnerFoundError extends AppError {
  constructor() {
    const message = `ERRO: não houve um vencedor registrado do duelo.'`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class NoDuelLoserFoundError extends AppError {
  constructor() {
    const message = `ERRO: não houve um perdedor registrado do duelo.'`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class CouldNotUpdatePlayerError extends AppError {
  constructor(parameter: string, value: string | number) {
    const message = `ERRO: não foi possivel atualizar o jogador com ${parameter}: ${value}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class NoEnergyError extends AppError {
  constructor(playerName: string) {
    const message = `*${playerName}* não possui energia suficiente.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonHasNotBornYetError extends AppError {
  constructor(id: number) {
    const message = `Pokemon #${id} ainda não nasceu.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class EggIsNotReadyToBeHatch extends AppError {
  constructor(id: number, hoursLeft: number) {
    const message = `O ovo #${id} ainda não está pronto para ser chocado. Faltam ${hoursLeft.toFixed(2)} horas ainda.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class InsufficientLevelToEvolveError extends AppError {
  constructor(pokemonId: number, pokemonName: string, neededLevel: number) {
    const message = `#${pokemonId} ${pokemonName} precisa estar no mínimo nível ${neededLevel} para evoluir.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class UnknownEvolutionMethodError extends AppError {
  constructor(pokemonId: number, pokemonName: string) {
    const message = `#${pokemonId} ${pokemonName} parece evoluir apenas sob certas condições especiais...`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonAlreadyOnLastEvolution extends AppError {
  constructor(pokemonId: number, pokemonName: string) {
    const message = `#${pokemonId} ${pokemonName} já está na última evolução.`
    const statusCode = 300
    super(message, statusCode)
  }
}

export class FailedToFindXinYError extends AppError {
  constructor(x: string, y: string) {
    const message = `ERRO: houve uma falha ao encontrar ${x} em ${y}.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class UnexpectedError extends AppError {
  constructor(routeName: string) {
    const message = `ERRO: houve um erro inesperado: ${routeName}.`
    const statusCode = 300

    super(message, statusCode)
  }
}
