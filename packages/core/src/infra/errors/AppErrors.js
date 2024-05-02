"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAlreadyExists = exports.PlayerNotFoundError = exports.InvalidDifficultError = exports.XIsInCooldownError = exports.PlayerDoesNotResideOnTheRoute = exports.CatchFailedPokemonRanAwayError = exports.PokemonAlreadyBattledByPlayerError = exports.PokemonAlreadyRanAwayError = exports.InvalidPokeBallName = exports.MissingParametersBattleRouteError = exports.NoSubRouteForUseItemRouteError = exports.MissingParametersUseItemRouteError = exports.MissingParametersDuelRouteError = exports.MissingParameterLabRouteError = exports.MissingParameterSetRoleRouteError = exports.MissingTravelRegionError = exports.NicknameAlreadyInUseError = exports.InvalidNicknameError = exports.MissingParameterError = exports.MissingParametersTradeRouteError = exports.MissingParametersSendRouteError = exports.MissingParametersMarketAnnounceError = exports.MissingParametersPokemonInformationError = exports.MissingParametersRankRouteError = exports.MissingParametersBreedRouteError = exports.MissingParametersRouteRouteError = exports.MissingParametersPokemonRouteError = exports.MissingParametersHelpRouteError = exports.MissingParametersMarketRouteError = exports.MissingParametersInventoryRouteError = exports.MissingParametersInvasionRouteError = exports.MissingParametersBuyAmountError = exports.MissingParametersCatchRouteError = exports.SubRouteNotFoundError = exports.AlreadyTravelingError = exports.UpgradeNotFoundError = exports.RouteHasADifferentIncenseActiveError = exports.ItemNotEligibleForBazarError = exports.DaycareIsFullError = exports.RouteDoesNotHaveUpgradeError = exports.NoRaidRunningError = exports.RouteAlreadyHasARaidRunningError = exports.RouteForbiddenForDuelRaidError = exports.RouteNotFoundError = exports.InvalidRouteError = exports.RouteAlreadyRegisteredError = exports.GenderDoesNotExistError = exports.InvalidSpriteError = exports.RouteNotProvidedError = exports.AppError = void 0;
exports.RaidAlreadyFinishedError = exports.InvasionAlreadyFinishedError = exports.SendEmptyMessageError = exports.InsufficientShardsError = exports.InsufficientFundsError = exports.RequestedShopItemDoesNotExists = exports.PlayerDoesNotHaveThePokemonInTheTeamError = exports.SessionIdNotFoundError = exports.TypeMissmatchError = exports.WrongRegionToEvolveError = exports.InvalidChildrenAmountError = exports.PlayerDoesNotHaveItemError = exports.CantBreedShiniesError = exports.PokemonAlreadyHasChildrenError = exports.PokemonDoesNotHaveOwnerError = exports.PokemonDoesNotBelongsToTheUserError = exports.PokemonAlreadyHasOwnerError = exports.PlayersPokemonNotFoundError = exports.SessionNotFoundError = exports.NoItemsFoundError = exports.CantSellPokemonInTeamError = exports.CantSellAllPokemonsError = exports.PlayerOnlyHasOnePokemonError = exports.CantDuelItselfError = exports.PokemonAboveDaycareLevelLimit = exports.PokemonInDaycareRemainingTime = exports.OfferAlreadyFinishedError = exports.OfferIsNotForPlayerError = exports.CantProceedWithPokemonInTeamError = exports.PokemonIsNotInRaidTeamError = exports.PokemonNotInDaycareError = exports.PokemonDoesNotHasMegaEvolutionError = exports.PokemonExceededRanchTimeLimit = exports.PlayerDoestNotOwnThePokemonError = exports.RaidNotFoundError = exports.InvasionNotFoundError = exports.InsufficientItemAmountError = exports.RequiredItemNotFoundError = exports.ItemNotFoundError = exports.RaidDataNotFoundError = exports.PokemonIsNotMegaError = exports.PokemonCantMegaEvolveError = exports.PokemonIsNotHoldingItemError = exports.PokemonMustBeShinyError = exports.ZeroPokemonsFoundError = exports.PokemonNotFoundError = exports.PlayerInRaidIsLockedError = exports.PokeTeamNotFoundError = exports.OfferNotFoundError = exports.SkillNotFoundError = void 0;
exports.UnexpectedError = exports.FailedToFindXinYError = exports.PokemonAlreadyOnLastEvolution = exports.UnknownEvolutionMethodError = exports.InsufficientLevelToEvolveError = exports.EggIsNotReadyToBeHatch = exports.PokemonHasNotBornYetError = exports.NoEnergyError = exports.CouldNotUpdatePlayerError = exports.NoDuelLoserFoundError = exports.NoDuelWinnerFoundError = exports.PlayerDidNotDefeatPokemonError = exports.InsufficentPlayersForInvasionError = exports.PlayerDoesNotHaveReviveForPokemonInRaidError = exports.RoomAlreadyFinishedError = exports.RoomDoesNotExistsInRaidError = exports.RaidAlreadyInProgressError = exports.PlayerDoesNotBelongToRaidTeamError = void 0;
class AppError {
    constructor(message, statusCode = 300, react, actions, data = null) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.actions = actions;
        this.react = react;
    }
}
exports.AppError = AppError;
class RouteNotProvidedError extends AppError {
    constructor() {
        const message = `Por favor especifique uma rota. Exemplos:
    - jogador
    - pokemon
    - inventario
    - rota
    - breed
    - loja`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RouteNotProvidedError = RouteNotProvidedError;
class InvalidSpriteError extends AppError {
    constructor() {
        const message = 'ERRO: número de sprite inválido.';
        super(message);
    }
}
exports.InvalidSpriteError = InvalidSpriteError;
class GenderDoesNotExistError extends AppError {
    constructor(gender) {
        const message = `ERRO: Gênero "${gender}" não encontrado. Utilize: 'menino' ou 'menina'.`;
        super(message);
    }
}
exports.GenderDoesNotExistError = GenderDoesNotExistError;
class RouteAlreadyRegisteredError extends AppError {
    constructor() {
        const message = 'O grupo atual já está registrado como uma rota no jogo.';
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RouteAlreadyRegisteredError = RouteAlreadyRegisteredError;
class InvalidRouteError extends AppError {
    constructor() {
        const message = `ERRO: não foi possível detectar a rota atual.`;
        super(message);
    }
}
exports.InvalidRouteError = InvalidRouteError;
class RouteNotFoundError extends AppError {
    constructor(playerName, routeName) {
        const message = `No route found for ${playerName} with ${routeName}`;
        super(message);
    }
}
exports.RouteNotFoundError = RouteNotFoundError;
class RouteForbiddenForDuelRaidError extends AppError {
    constructor() {
        const message = `Na rota atual, não é permitido duelos.`;
        super(message);
    }
}
exports.RouteForbiddenForDuelRaidError = RouteForbiddenForDuelRaidError;
class RouteAlreadyHasARaidRunningError extends AppError {
    constructor(raidName) {
        const message = `A raid: "${raidName}" está ativa na rota. Para cancelar, utilize o comando "raid cancel".`;
        super(message);
    }
}
exports.RouteAlreadyHasARaidRunningError = RouteAlreadyHasARaidRunningError;
class NoRaidRunningError extends AppError {
    constructor() {
        const message = `Não há nenhuma raid ativa no momento.`;
        super(message);
    }
}
exports.NoRaidRunningError = NoRaidRunningError;
class RouteDoesNotHaveUpgradeError extends AppError {
    constructor(upgradeName) {
        const message = `Esta ação não é possível pois a rota atual não possui: ${upgradeName}`;
        super(message);
    }
}
exports.RouteDoesNotHaveUpgradeError = RouteDoesNotHaveUpgradeError;
class DaycareIsFullError extends AppError {
    constructor() {
        const message = `Sinto muito, o daycare está lotado.`;
        super(message);
    }
}
exports.DaycareIsFullError = DaycareIsFullError;
class ItemNotEligibleForBazarError extends AppError {
    constructor() {
        const message = `Sinto muito, este item não é aceito no Bazar.`;
        super(message);
    }
}
exports.ItemNotEligibleForBazarError = ItemNotEligibleForBazarError;
class RouteHasADifferentIncenseActiveError extends AppError {
    constructor(incenseName) {
        const message = `Esta ação não é possível pois a rota atual possui um incenso diferente ativo: ${incenseName}`;
        super(message);
    }
}
exports.RouteHasADifferentIncenseActiveError = RouteHasADifferentIncenseActiveError;
class UpgradeNotFoundError extends AppError {
    constructor(name) {
        const message = `Nenhum upgrade encontrado com o nome: ${name}`;
        super(message);
    }
}
exports.UpgradeNotFoundError = UpgradeNotFoundError;
class AlreadyTravelingError extends AppError {
    constructor(routeId) {
        const message = `Treinadores da rota ${routeId} já estão em viagem.`;
        super(message);
    }
}
exports.AlreadyTravelingError = AlreadyTravelingError;
class SubRouteNotFoundError extends AppError {
    constructor(subrouteName) {
        const message = `ERROR: Nenhuma rota encontrada para ${subrouteName}, verifique a ortografia e a sintáxe do comando.`;
        super(message);
    }
}
exports.SubRouteNotFoundError = SubRouteNotFoundError;
class MissingParametersCatchRouteError extends AppError {
    constructor() {
        const message = `Por favor, informe o nome da pokebola utilizada e o ID do pokemon à ser capturado. Exemplo: poke**p. catch pokebola 25`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersCatchRouteError = MissingParametersCatchRouteError;
class MissingParametersBuyAmountError extends AppError {
    constructor() {
        const message = 'Por favor, especifique a quantidade que deseja comprar ao enviar o comando de compra.';
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersBuyAmountError = MissingParametersBuyAmountError;
class MissingParametersInvasionRouteError extends AppError {
    constructor() {
        const message = `Informe a categoria da invasão:
👍 - Defend`;
        const statusCode = 300;
        const actions = ['pz. invasion defend'];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingParametersInvasionRouteError = MissingParametersInvasionRouteError;
class MissingParametersInventoryRouteError extends AppError {
    constructor() {
        const message = `Informe a categoria do inventário: \n👍 - Pokemons \n❤ - Items`;
        const statusCode = 300;
        const actions = ['pz. inventory poke', 'pz. inventory items'];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingParametersInventoryRouteError = MissingParametersInventoryRouteError;
class MissingParametersMarketRouteError extends AppError {
    constructor() {
        const message = `Bem vindo(a) ao Mercado! Aqui você pode anunciar seus pokemons para receber ofertas de trocas, ou fazer ofertas nos que já estão anunciados! \n\n 👍 - Ver Ofertas em seus anúncios \n\n Para anunciar: pz market announce id-do-pokemon \n Para remover: pz market announce idpoke remove \n `;
        const statusCode = 300;
        const actions = ['pz. market offers'];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingParametersMarketRouteError = MissingParametersMarketRouteError;
class MissingParametersHelpRouteError extends AppError {
    constructor() {
        const message = `[d] Informe a categoria que deseja ajuda:
👍 - Comandos disponíveis
❤ - Clans
😂 - Pokeballs
😮 - Plates

Tente tambem utilizar: pz. help (nome do tópico, item, etc.)`;
        const statusCode = 404;
        const actions = ['pz. help commands', 'pz. help clans', 'pz. help pokeballs', 'pz. help plates'];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingParametersHelpRouteError = MissingParametersHelpRouteError;
class MissingParametersPokemonRouteError extends AppError {
    constructor() {
        const message = `Por favor, especifique uma ação após o comando "pokemon":
- _info_
- _team_
- _evolve_ 
- _mega-evolve_ 
- _skills_
- _give-item_
- _drop-item_`;
        const statusCode = 404;
        super(message, statusCode);
    }
}
exports.MissingParametersPokemonRouteError = MissingParametersPokemonRouteError;
class MissingParametersRouteRouteError extends AppError {
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
    `;
        const statusCode = 404;
        super(message, statusCode);
    }
}
exports.MissingParametersRouteRouteError = MissingParametersRouteRouteError;
class MissingParametersBreedRouteError extends AppError {
    constructor() {
        const message = `Você deve fornecer o id dos pokemons à serem cruzados. (Ex. poke**p. breed 25 24)`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersBreedRouteError = MissingParametersBreedRouteError;
class MissingParametersRankRouteError extends AppError {
    constructor() {
        const message = `Informe a categoria do ranking:
👍 - elo
❤ - catch
    `;
        const statusCode = 300;
        const actions = ['pz. rank elo', 'pz. rank catch'];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingParametersRankRouteError = MissingParametersRankRouteError;
class MissingParametersPokemonInformationError extends AppError {
    constructor() {
        const message = `Forneca o id ou nome do pokemon. `;
        super(message);
    }
}
exports.MissingParametersPokemonInformationError = MissingParametersPokemonInformationError;
class MissingParametersMarketAnnounceError extends AppError {
    constructor() {
        const message = `[dsb] Para anunciar um pokémon no mercado siga o exemplo: \n\n pz. market announce 25077 600  (anunciando o pokemon #25077 por $600) \n\n pz. mercado anunciar charmander 1000 (anunciando charmander por $1000)`;
        super(message);
    }
}
exports.MissingParametersMarketAnnounceError = MissingParametersMarketAnnounceError;
class MissingParametersSendRouteError extends AppError {
    constructor() {
        const message = `Por favor, especifique após o comando "send":
- _items_
- _poke_
- _cash_`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersSendRouteError = MissingParametersSendRouteError;
class MissingParametersTradeRouteError extends AppError {
    constructor() {
        const message = `Por favor, especifique após o comando "trade":
- _items_
- _poke_`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersTradeRouteError = MissingParametersTradeRouteError;
class MissingParameterError extends AppError {
    constructor(parameterName) {
        const message = `Por favor, informe o(a): ${parameterName}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParameterError = MissingParameterError;
class InvalidNicknameError extends AppError {
    constructor(nickname) {
        const message = `Apelido "${nickname}" não é válido.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InvalidNicknameError = InvalidNicknameError;
class NicknameAlreadyInUseError extends AppError {
    constructor(nickname) {
        const message = `Apelido "${nickname}" já está sendo utilizado.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.NicknameAlreadyInUseError = NicknameAlreadyInUseError;
class MissingTravelRegionError extends AppError {
    constructor() {
        const message = `Para onde iremos viajar?
👍 - Alola 
❤ - Galar
😂 - Voltar`;
        const statusCode = 300;
        const actions = ['pz. rota travel alola', 'pz. rota travel galar', 'pz. rota travel return'];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingTravelRegionError = MissingTravelRegionError;
class MissingParameterSetRoleRouteError extends AppError {
    constructor(pokemonName) {
        const message = `Qual função deseja atribuir à ${pokemonName}? \n👍 - Causador de dano (damage) \n❤ - Defensor (tanker) \n😂 - Suporte (support)`;
        const statusCode = 300;
        const actions = [
            `pz. p setrole ${pokemonName} damage`,
            `pz. p setrole ${pokemonName} tanker`,
            `pz. p setrole ${pokemonName} support`,
        ];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingParameterSetRoleRouteError = MissingParameterSetRoleRouteError;
class MissingParameterLabRouteError extends AppError {
    constructor() {
        const message = `Bem vindo(a) ao Laboratório! Aqui você pode re-ensinar os talentos de seu pokemon *shiny* ou `;
        const statusCode = 300;
        const actions = ['pz. rota travel alola', 'pz. rota travel galar', 'pz. rota travel return'];
        super(message, statusCode, undefined, actions);
    }
}
exports.MissingParameterLabRouteError = MissingParameterLabRouteError;
class MissingParametersDuelRouteError extends AppError {
    constructor() {
        const message = 'Por favor, especifique o tipo de duelo e o ID do player à ser enfrentado. [dsb] \n\n Exemplo: pz. duel x1 105 ';
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersDuelRouteError = MissingParametersDuelRouteError;
class MissingParametersUseItemRouteError extends AppError {
    constructor() {
        const message = 'Por favor, especifique o item que deseja usar.';
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersUseItemRouteError = MissingParametersUseItemRouteError;
class NoSubRouteForUseItemRouteError extends AppError {
    constructor(itemName) {
        const message = `Parece que não há como usar ${itemName} desta forma.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.NoSubRouteForUseItemRouteError = NoSubRouteForUseItemRouteError;
class MissingParametersBattleRouteError extends AppError {
    constructor() {
        const message = 'Por favor, especifique o ID do pokemon selvagem à ser enfrentado. (Ex. poke**p battle 25)';
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.MissingParametersBattleRouteError = MissingParametersBattleRouteError;
class InvalidPokeBallName extends AppError {
    constructor(ballName) {
        const message = `*${ballName}* não é um nome válido de pokebola.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InvalidPokeBallName = InvalidPokeBallName;
class PokemonAlreadyRanAwayError extends AppError {
    constructor(id, playerName) {
        const message = `*${playerName}* já enfrentou o Pokemon ${id} e este fugiu.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonAlreadyRanAwayError = PokemonAlreadyRanAwayError;
class PokemonAlreadyBattledByPlayerError extends AppError {
    constructor(id, playerName) {
        const message = `*${playerName}* já enfrentou o Pokemon ${id}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonAlreadyBattledByPlayerError = PokemonAlreadyBattledByPlayerError;
class CatchFailedPokemonRanAwayError extends AppError {
    constructor(id, playerName) {
        const message = `*${playerName}* já tentou capturar o Pokemon ${id} e este fugiu.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.CatchFailedPokemonRanAwayError = CatchFailedPokemonRanAwayError;
class PlayerDoesNotResideOnTheRoute extends AppError {
    constructor(gameRoomId, playerName) {
        const message = `*${playerName}* não reside na rota ${gameRoomId}, portanto não pode enfrentar os pokemons da rota.
    👍 - Entrar na rota`;
        const statusCode = 300;
        const actions = ['pz. rota entrar'];
        super(message, statusCode, undefined, actions);
    }
}
exports.PlayerDoesNotResideOnTheRoute = PlayerDoesNotResideOnTheRoute;
class XIsInCooldownError extends AppError {
    constructor(xName, hoursCooldown) {
        const message = `Desculpe, o ${xName} não está disponível no momento. Estará disponível daqui ${hoursCooldown} horas.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.XIsInCooldownError = XIsInCooldownError;
class InvalidDifficultError extends AppError {
    constructor() {
        const message = `Dificuldade inválida. Disponíveis: easy, medium, hard, expert, insane.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InvalidDifficultError = InvalidDifficultError;
class PlayerNotFoundError extends AppError {
    constructor(playerPhone) {
        const message = `ERRO: Jogador não encontrado com o código ${playerPhone}`;
        super(message);
    }
}
exports.PlayerNotFoundError = PlayerNotFoundError;
class PlayerAlreadyExists extends AppError {
    constructor(name) {
        const message = `${name}, parece que você já tem um personagem cadastrado.`;
        super(message);
    }
}
exports.PlayerAlreadyExists = PlayerAlreadyExists;
class SkillNotFoundError extends AppError {
    constructor(skillName) {
        const message = `ERRO: Não existe uma skill com o nome: "${skillName}"`;
        super(message);
    }
}
exports.SkillNotFoundError = SkillNotFoundError;
class OfferNotFoundError extends AppError {
    constructor(id) {
        const message = `ERRO: Oferta não encontrado com o código ${id}`;
        super(message);
    }
}
exports.OfferNotFoundError = OfferNotFoundError;
class PokeTeamNotFoundError extends AppError {
    constructor(teamName) {
        const message = `Não foi encontrado nenhum time salvo com o nome: "${teamName}".`;
        super(message);
    }
}
exports.PokeTeamNotFoundError = PokeTeamNotFoundError;
class PlayerInRaidIsLockedError extends AppError {
    constructor(playerName) {
        const message = `${playerName} está em uma raid. Não é possível realizar operações. Se for necessário, utilize "raid cancel" para cancelar a raid.`;
        super(message);
    }
}
exports.PlayerInRaidIsLockedError = PlayerInRaidIsLockedError;
class PokemonNotFoundError extends AppError {
    constructor(pokemonId) {
        const message = `ERRO: Pokemon não encontrado com o id ${pokemonId}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonNotFoundError = PokemonNotFoundError;
class ZeroPokemonsFoundError extends AppError {
    constructor() {
        const message = `Não foi possível localizar os pokemons.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.ZeroPokemonsFoundError = ZeroPokemonsFoundError;
class PokemonMustBeShinyError extends AppError {
    constructor() {
        const message = `Só é permitido pokemon shiny.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonMustBeShinyError = PokemonMustBeShinyError;
class PokemonIsNotHoldingItemError extends AppError {
    constructor(pokemonId) {
        const message = `Pokemon ${pokemonId} não está segurando um item.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonIsNotHoldingItemError = PokemonIsNotHoldingItemError;
class PokemonCantMegaEvolveError extends AppError {
    constructor(pokemonId) {
        const message = `Pokemon ${pokemonId} não pode mega-evoluir.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonCantMegaEvolveError = PokemonCantMegaEvolveError;
class PokemonIsNotMegaError extends AppError {
    constructor(pokemonId) {
        const message = `Pokemon ${pokemonId} não pode mega-reverter.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonIsNotMegaError = PokemonIsNotMegaError;
class RaidDataNotFoundError extends AppError {
    constructor(raidName) {
        const message = `Não existe nenhuma raid com o nome ${raidName}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RaidDataNotFoundError = RaidDataNotFoundError;
class ItemNotFoundError extends AppError {
    constructor(itemName) {
        const message = `Item não encontrado com o nome ${itemName}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.ItemNotFoundError = ItemNotFoundError;
class RequiredItemNotFoundError extends AppError {
    constructor() {
        const message = `Você não possui um item necessário para realizar esta ação.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RequiredItemNotFoundError = RequiredItemNotFoundError;
class InsufficientItemAmountError extends AppError {
    constructor(itemName, currentAmount, requestedAmount) {
        const message = `Não foi possível enviar ${requestedAmount} ${itemName}. Você possui apenas ${currentAmount}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InsufficientItemAmountError = InsufficientItemAmountError;
class InvasionNotFoundError extends AppError {
    constructor(invasionId) {
        const message = `ERRO: Invasão não encontrada com o id ${invasionId}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InvasionNotFoundError = InvasionNotFoundError;
class RaidNotFoundError extends AppError {
    constructor(raidId) {
        const message = `ERRO: Raid não encontrada com o id ${raidId}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RaidNotFoundError = RaidNotFoundError;
class PlayerDoestNotOwnThePokemonError extends AppError {
    constructor(id, playerName) {
        const message = `O pokemon #${id} não pertence à ${playerName}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayerDoestNotOwnThePokemonError = PlayerDoestNotOwnThePokemonError;
class PokemonExceededRanchTimeLimit extends AppError {
    constructor(id, pokemonName) {
        const message = `O pokemon #${id} ${pokemonName} excedeu o tempo limite de 12 horas para o uso do poke-ranch.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonExceededRanchTimeLimit = PokemonExceededRanchTimeLimit;
class PokemonDoesNotHasMegaEvolutionError extends AppError {
    constructor(id, pokemonName) {
        const message = `O pokemon #${id} ${pokemonName} não é capaz de mega-evoluir.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonDoesNotHasMegaEvolutionError = PokemonDoesNotHasMegaEvolutionError;
class PokemonNotInDaycareError extends AppError {
    constructor(pokemonId, pokemonName) {
        const message = `#${pokemonId} ${pokemonName} não está no daycare.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonNotInDaycareError = PokemonNotInDaycareError;
class PokemonIsNotInRaidTeamError extends AppError {
    constructor(playerName, pokemonId, pokemonName) {
        const message = `O pokemon #${pokemonId} ${pokemonName} não está registrado no time de raid de ${playerName}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonIsNotInRaidTeamError = PokemonIsNotInRaidTeamError;
class CantProceedWithPokemonInTeamError extends AppError {
    constructor(pokemonId, pokemonName) {
        const message = `#${pokemonId} ${pokemonName} está no seu time. Para poder realizar esta ação, remova-o do seu time.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.CantProceedWithPokemonInTeamError = CantProceedWithPokemonInTeamError;
class OfferIsNotForPlayerError extends AppError {
    constructor(id) {
        const message = `ERRO: O anúncio com o código "${id}" não é destinado à você.`;
        super(message);
    }
}
exports.OfferIsNotForPlayerError = OfferIsNotForPlayerError;
class OfferAlreadyFinishedError extends AppError {
    constructor(id) {
        const message = `ERRO: O anúncio com o código "${id}" já se encerrou.`;
        super(message);
    }
}
exports.OfferAlreadyFinishedError = OfferAlreadyFinishedError;
class PokemonInDaycareRemainingTime extends AppError {
    constructor(pokemonId, pokemonName, remainingTime) {
        const message = `#${pokemonId} ${pokemonName} está no daycare. Faltam ainda: ${remainingTime} horas.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonInDaycareRemainingTime = PokemonInDaycareRemainingTime;
class PokemonAboveDaycareLevelLimit extends AppError {
    constructor(pokemonId, pokemonName, levelLimit) {
        const message = `#${pokemonId} ${pokemonName} está acima do nivel máximo do daycare. O nível é determinado pelo nível atual da rota: ${levelLimit}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonAboveDaycareLevelLimit = PokemonAboveDaycareLevelLimit;
class CantDuelItselfError extends AppError {
    constructor() {
        const message = 'Você deve informar o id jogador a ser desafiado no duelo, não o seu.';
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.CantDuelItselfError = CantDuelItselfError;
class PlayerOnlyHasOnePokemonError extends AppError {
    constructor(playerName) {
        const message = `${playerName} não pode vender seu único pokemon.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayerOnlyHasOnePokemonError = PlayerOnlyHasOnePokemonError;
class CantSellAllPokemonsError extends AppError {
    constructor(playerName) {
        const message = `${playerName} não pode vender todos os seus pokemons.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.CantSellAllPokemonsError = CantSellAllPokemonsError;
class CantSellPokemonInTeamError extends AppError {
    constructor(id) {
        const message = `O pokemon #${id} faz parte do seu time e não pode ser vendido. Retire-o do seu time primeiro.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.CantSellPokemonInTeamError = CantSellPokemonInTeamError;
class NoItemsFoundError extends AppError {
    constructor() {
        const message = `ERRO: Nenhum item encontrado.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.NoItemsFoundError = NoItemsFoundError;
class SessionNotFoundError extends AppError {
    constructor(sessionId) {
        const message = `ERRO: Nenhuma sessão de troca encontrada com codigo: "${sessionId}"`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.SessionNotFoundError = SessionNotFoundError;
class PlayersPokemonNotFoundError extends AppError {
    constructor(pokemonId, playerName) {
        const message = `ERRO: Pokemon não encontrado com o id "${pokemonId}" para o player ${playerName}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayersPokemonNotFoundError = PlayersPokemonNotFoundError;
class PokemonAlreadyHasOwnerError extends AppError {
    constructor(pokemonId, pokemonName) {
        const message = `ERRO: Pokemon: #${pokemonId} - ${pokemonName} já foi capturado por outro jogador.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonAlreadyHasOwnerError = PokemonAlreadyHasOwnerError;
class PokemonDoesNotBelongsToTheUserError extends AppError {
    constructor(pokemonId, pokemonName, playerName) {
        const message = `ERRO: Pokemon #${pokemonId} ${pokemonName} não pertence à ${playerName}. `;
        super(message);
    }
}
exports.PokemonDoesNotBelongsToTheUserError = PokemonDoesNotBelongsToTheUserError;
class PokemonDoesNotHaveOwnerError extends AppError {
    constructor(pokemonId, pokemonName) {
        const message = `Pokemon #${pokemonId} ${pokemonName} não possui dono.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonDoesNotHaveOwnerError = PokemonDoesNotHaveOwnerError;
class PokemonAlreadyHasChildrenError extends AppError {
    constructor(pokemonId, pokemonName, amount) {
        const message = `Pokemon: #${pokemonId} ${pokemonName} já possui ${amount} filhotes.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonAlreadyHasChildrenError = PokemonAlreadyHasChildrenError;
class CantBreedShiniesError extends AppError {
    constructor() {
        const message = `Sinto muito, não é possivel cruzar pokemon shiny.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.CantBreedShiniesError = CantBreedShiniesError;
class PlayerDoesNotHaveItemError extends AppError {
    constructor(playerName, itemName) {
        const message = `${playerName} não possui nenhuma ${itemName}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayerDoesNotHaveItemError = PlayerDoesNotHaveItemError;
class InvalidChildrenAmountError extends AppError {
    constructor() {
        const message = `ERROR: invalid children amount.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InvalidChildrenAmountError = InvalidChildrenAmountError;
class WrongRegionToEvolveError extends AppError {
    constructor(pokemonName) {
        const message = `${pokemonName} parece evoluir apenas em uma certa região.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.WrongRegionToEvolveError = WrongRegionToEvolveError;
class TypeMissmatchError extends AppError {
    constructor(value, typeName) {
        const message = `ERRO: "${value}" não é do tipo ${typeName}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.TypeMissmatchError = TypeMissmatchError;
class SessionIdNotFoundError extends AppError {
    constructor(sessionId) {
        const message = `ERRO: não foi possível encontrar uma sessão de duelo com o id: ${sessionId}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.SessionIdNotFoundError = SessionIdNotFoundError;
class PlayerDoesNotHaveThePokemonInTheTeamError extends AppError {
    constructor(playerName) {
        const message = `${playerName} não possui um pokemon no seu time.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayerDoesNotHaveThePokemonInTheTeamError = PlayerDoesNotHaveThePokemonInTheTeamError;
class RequestedShopItemDoesNotExists extends AppError {
    constructor(itemId) {
        const message = `Não há um item com id: "${itemId}" disponível na loja.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RequestedShopItemDoesNotExists = RequestedShopItemDoesNotExists;
class InsufficientFundsError extends AppError {
    constructor(playerName, playerFunds, requiredFunds) {
        const message = `${playerName} não possui POKECOINS suficientes. São necessários ${requiredFunds}, ainda falta ${requiredFunds - playerFunds} `;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InsufficientFundsError = InsufficientFundsError;
class InsufficientShardsError extends AppError {
    constructor(playerName, playerFunds, requiredFunds) {
        const message = `${playerName} não possui POKESHARDS suficientes. São necessários ${requiredFunds}, ainda faltam ${requiredFunds - playerFunds} `;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InsufficientShardsError = InsufficientShardsError;
class SendEmptyMessageError extends AppError {
    constructor() {
        const message = '';
        const react = '❌';
        const statusCode = 300;
        super(message, statusCode, react);
    }
}
exports.SendEmptyMessageError = SendEmptyMessageError;
class InvasionAlreadyFinishedError extends AppError {
    constructor() {
        const message = `A invasão já se encerrou.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InvasionAlreadyFinishedError = InvasionAlreadyFinishedError;
class RaidAlreadyFinishedError extends AppError {
    constructor() {
        const message = `A raid já se encerrou.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RaidAlreadyFinishedError = RaidAlreadyFinishedError;
class PlayerDoesNotBelongToRaidTeamError extends AppError {
    constructor(playerName) {
        const message = `${playerName} não está na equipe da raid.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayerDoesNotBelongToRaidTeamError = PlayerDoesNotBelongToRaidTeamError;
class RaidAlreadyInProgressError extends AppError {
    constructor(playerName) {
        const message = `${playerName}: A raid já se iniciou, não é possível entrar mais.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RaidAlreadyInProgressError = RaidAlreadyInProgressError;
class RoomDoesNotExistsInRaidError extends AppError {
    constructor(roomIndex, raidName) {
        const message = `A sala ${roomIndex} não existe na raid ${raidName}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RoomDoesNotExistsInRaidError = RoomDoesNotExistsInRaidError;
class RoomAlreadyFinishedError extends AppError {
    constructor(roomIndex) {
        const message = `A sala ${roomIndex} já foi finalizada.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.RoomAlreadyFinishedError = RoomAlreadyFinishedError;
class PlayerDoesNotHaveReviveForPokemonInRaidError extends AppError {
    constructor(playerName, pokemonName) {
        const message = `${playerName} não possui um revive para usar em ${pokemonName}. Troque de pokemon.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayerDoesNotHaveReviveForPokemonInRaidError = PlayerDoesNotHaveReviveForPokemonInRaidError;
class InsufficentPlayersForInvasionError extends AppError {
    constructor(amount, requiredAmount) {
        const message = `É necessário ${requiredAmount} jogadores para esta missão. No momento há apenas ${amount}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InsufficentPlayersForInvasionError = InsufficentPlayersForInvasionError;
class PlayerDidNotDefeatPokemonError extends AppError {
    constructor(playerName) {
        const message = `*${playerName}* não derrotou o pokemon.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PlayerDidNotDefeatPokemonError = PlayerDidNotDefeatPokemonError;
class NoDuelWinnerFoundError extends AppError {
    constructor() {
        const message = `ERRO: não houve um vencedor registrado do duelo.'`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.NoDuelWinnerFoundError = NoDuelWinnerFoundError;
class NoDuelLoserFoundError extends AppError {
    constructor() {
        const message = `ERRO: não houve um perdedor registrado do duelo.'`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.NoDuelLoserFoundError = NoDuelLoserFoundError;
class CouldNotUpdatePlayerError extends AppError {
    constructor(parameter, value) {
        const message = `ERRO: não foi possivel atualizar o jogador com ${parameter}: ${value}`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.CouldNotUpdatePlayerError = CouldNotUpdatePlayerError;
class NoEnergyError extends AppError {
    constructor(playerName) {
        const message = `*${playerName}* não possui energia suficiente.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.NoEnergyError = NoEnergyError;
class PokemonHasNotBornYetError extends AppError {
    constructor(id) {
        const message = `Pokemon #${id} ainda não nasceu.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonHasNotBornYetError = PokemonHasNotBornYetError;
class EggIsNotReadyToBeHatch extends AppError {
    constructor(id, hoursLeft) {
        const message = `O ovo #${id} ainda não está pronto para ser chocado. Faltam ${hoursLeft.toFixed(2)} horas ainda.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.EggIsNotReadyToBeHatch = EggIsNotReadyToBeHatch;
class InsufficientLevelToEvolveError extends AppError {
    constructor(pokemonId, pokemonName, neededLevel) {
        const message = `#${pokemonId} ${pokemonName} precisa estar no mínimo nível ${neededLevel} para evoluir.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.InsufficientLevelToEvolveError = InsufficientLevelToEvolveError;
class UnknownEvolutionMethodError extends AppError {
    constructor(pokemonId, pokemonName) {
        const message = `#${pokemonId} ${pokemonName} parece evoluir apenas sob certas condições especiais...`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.UnknownEvolutionMethodError = UnknownEvolutionMethodError;
class PokemonAlreadyOnLastEvolution extends AppError {
    constructor(pokemonId, pokemonName) {
        const message = `#${pokemonId} ${pokemonName} já está na última evolução.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.PokemonAlreadyOnLastEvolution = PokemonAlreadyOnLastEvolution;
class FailedToFindXinYError extends AppError {
    constructor(x, y) {
        const message = `ERRO: houve uma falha ao encontrar ${x} em ${y}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.FailedToFindXinYError = FailedToFindXinYError;
class UnexpectedError extends AppError {
    constructor(routeName) {
        const message = `ERRO: houve um erro inesperado: ${routeName}.`;
        const statusCode = 300;
        super(message, statusCode);
    }
}
exports.UnexpectedError = UnexpectedError;
