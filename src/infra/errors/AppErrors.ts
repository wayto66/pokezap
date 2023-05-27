export class AppError {
  readonly message: string
  readonly data: string | null
  readonly statusCode: number
  readonly actions?: string[]

  constructor(message: string, statusCode = 400, data = null, actions?: string[]) {
    this.message = message
    this.statusCode = statusCode
    this.data = data
    this.actions = actions
  }
}

export class RouteNotProvidedError extends AppError {
  constructor() {
    const message = 'Please specify a route.'
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
    const message = `ERROR: It seems that you are not on a valid route.`

    super(message)
  }
}

export class RouteNotFoundError extends AppError {
  constructor(playerName: string, routeName: string) {
    const message = `No route found for ${playerName} with ${routeName}`

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
    const message = `Por favor, forneca o nome da pokebola utilizada e o ID do pokemon à ser capturado. Exemplo:
        poke**p. catch pokebola 25`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersDuelRouteError extends AppError {
  constructor() {
    const message = 'DUMMY: This is the duel route, specify a sub route.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersBattleRouteError extends AppError {
  constructor() {
    const message = 'Por favor, especifique o ID do pokemon selvagem à ser enfrentado.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PokemonAlreadyDefeated extends AppError {
  constructor(id: number, playerName: string) {
    const message = `O Pokemon com id: ${id} já foi derrotado por ${playerName}.`
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

export class PlayerDoesNotResideOnTheRoute extends AppError {
  constructor(gameRoomId: number, playerName: string) {
    const message = `*${playerName}* não reside na rota ${gameRoomId}, portanto não pode enfrentar os pokemons da rota.`
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

export class MissingParametersInventoryRouteError extends AppError {
  constructor() {
    const message = 'DUMMY: This is the inventory route, specify a sub route.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersPokemonRouteError extends AppError {
  constructor() {
    const message = 'DUMMY: This is the pokemon route, specify a sub route.'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersRouteRouteError extends AppError {
  constructor() {
    const message = 'DUMMY: This is the routes route. Please specify a sub route'
    const statusCode = 300

    super(message, statusCode)
  }
}

export class MissingParametersBreedRouteError extends AppError {
  constructor() {
    const message = `ERROR: you must provide the ids for the pokemon pair to be breeded. The correct syntax would be something like:
      pokemon breed 123 456`
    const statusCode = 400

    super(message, statusCode)
  }
}

export class MissingParametersRankRouteError extends AppError {
  constructor() {
    const message = `Esta é a rota de ranking. Você deve especificar qual ranking deseja ver.
    `
    const statusCode = 300
    const actions = ['pz. rank elo', 'pz. rank catch']

    super(message, statusCode)
  }
}

export class MissingParametersPokemonInformationError extends AppError {
  constructor() {
    const message = `ERROR: you must provide a pokemon id. `

    super(message)
  }
}

export class MissingParametersTradeRouteError extends AppError {
  constructor() {
    const message = `DUMMY: 'Esta é a rota de trade/trocas. Especifique se deseja trocar Pokemon ou item.'`
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

export class PokemonNotFoundError extends AppError {
  constructor(pokemonId: number) {
    const message = `ERRO: Pokemon não encontrado com o id ${pokemonId}`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class NoItemsFoundError extends AppError {
  constructor() {
    const message = `ERRO: Nenhum item encontrado.`
    const statusCode = 400

    super(message, statusCode)
  }
}

export class SessionNotFoundError extends AppError {
  constructor(sessionId: number) {
    const message = `ERRO: Nenhuma sessão de troca encontrada com codigo: "${sessionId}"`
    const statusCode = 400

    super(message, statusCode)
  }
}

export class PlayersPokemonNotFoundError extends AppError {
  constructor(pokemonId: number, playerName: string) {
    const message = `ERRO: Pokemon não encontrado com o id ${pokemonId} para o player ${playerName}`
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
  constructor(pokemonId: number, pokemonName: string, amount = '4') {
    const message = `Pokemon: #${pokemonId} ${pokemonName} já possui ${amount} filhotes.`
    const statusCode = 300

    super(message, statusCode)
  }
}

export class PlayerDoesNotHavePokeballsError extends AppError {
  constructor(pokemonId: number, pokemonName: string) {
    const message = `Pokemon: #${pokemonId} - ${pokemonName} já foi capturado por outro jogador.`
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
    const statusCode = 400

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
    const message = `Não há um item com id: ${itemId} disponível na loja.`
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

export class SendEmptyMessageError extends AppError {
  constructor() {
    const message = ''
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
    const statusCode = 400

    super(message, statusCode)
  }
}

export class NoDuelLoserFoundError extends AppError {
  constructor() {
    const message = `ERRO: não houve um perdedor registrado do duelo.'`
    const statusCode = 400

    super(message, statusCode)
  }
}

export class CouldNotUpdatePlayerError extends AppError {
  constructor(parameter: string, value: string | number) {
    const message = `ERRO: não foi possivel atualizar o jogador com ${parameter}: ${value}`
    const statusCode = 400

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

export class UnexpectedError extends AppError {
  constructor(routeName: string) {
    const message = `ERRO: ouve um erro inesperado no ${routeName}.`
    const statusCode = 300

    super(message, statusCode)
  }
}
