export declare class AppError {
    readonly message: string;
    readonly data: string | null;
    readonly statusCode: number;
    readonly actions?: string[];
    readonly react?: string;
    constructor(message: string, statusCode?: number, react?: string, actions?: string[], data?: null);
}
export declare class RouteNotProvidedError extends AppError {
    constructor();
}
export declare class InvalidSpriteError extends AppError {
    constructor();
}
export declare class GenderDoesNotExistError extends AppError {
    constructor(gender: string);
}
export declare class RouteAlreadyRegisteredError extends AppError {
    constructor();
}
export declare class InvalidRouteError extends AppError {
    constructor();
}
export declare class RouteNotFoundError extends AppError {
    constructor(playerName: string, routeName: string);
}
export declare class RouteForbiddenForDuelRaidError extends AppError {
    constructor();
}
export declare class RouteAlreadyHasARaidRunningError extends AppError {
    constructor(raidName: string);
}
export declare class NoRaidRunningError extends AppError {
    constructor();
}
export declare class RouteDoesNotHaveUpgradeError extends AppError {
    constructor(upgradeName: string);
}
export declare class DaycareIsFullError extends AppError {
    constructor();
}
export declare class ItemNotEligibleForBazarError extends AppError {
    constructor();
}
export declare class RouteHasADifferentIncenseActiveError extends AppError {
    constructor(incenseName: string);
}
export declare class UpgradeNotFoundError extends AppError {
    constructor(name: string);
}
export declare class AlreadyTravelingError extends AppError {
    constructor(routeId: number | string);
}
export declare class SubRouteNotFoundError extends AppError {
    constructor(subrouteName: string);
}
export declare class MissingParametersCatchRouteError extends AppError {
    constructor();
}
export declare class MissingParametersBuyAmountError extends AppError {
    constructor();
}
export declare class MissingParametersInvasionRouteError extends AppError {
    constructor();
}
export declare class MissingParametersInventoryRouteError extends AppError {
    constructor();
}
export declare class MissingParametersMarketRouteError extends AppError {
    constructor();
}
export declare class MissingParametersHelpRouteError extends AppError {
    constructor();
}
export declare class MissingParametersPokemonRouteError extends AppError {
    constructor();
}
export declare class MissingParametersRouteRouteError extends AppError {
    constructor();
}
export declare class MissingParametersBreedRouteError extends AppError {
    constructor();
}
export declare class MissingParametersRankRouteError extends AppError {
    constructor();
}
export declare class MissingParametersPokemonInformationError extends AppError {
    constructor();
}
export declare class MissingParametersMarketAnnounceError extends AppError {
    constructor();
}
export declare class MissingParametersSendRouteError extends AppError {
    constructor();
}
export declare class MissingParametersTradeRouteError extends AppError {
    constructor();
}
export declare class MissingParameterError extends AppError {
    constructor(parameterName: string);
}
export declare class InvalidNicknameError extends AppError {
    constructor(nickname: string);
}
export declare class NicknameAlreadyInUseError extends AppError {
    constructor(nickname: string);
}
export declare class MissingTravelRegionError extends AppError {
    constructor();
}
export declare class MissingParameterSetRoleRouteError extends AppError {
    constructor(pokemonName: string);
}
export declare class MissingParameterLabRouteError extends AppError {
    constructor();
}
export declare class MissingParametersDuelRouteError extends AppError {
    constructor();
}
export declare class MissingParametersUseItemRouteError extends AppError {
    constructor();
}
export declare class NoSubRouteForUseItemRouteError extends AppError {
    constructor(itemName: string);
}
export declare class MissingParametersBattleRouteError extends AppError {
    constructor();
}
export declare class InvalidPokeBallName extends AppError {
    constructor(ballName: string);
}
export declare class PokemonAlreadyRanAwayError extends AppError {
    constructor(id: number, playerName: string);
}
export declare class PokemonAlreadyBattledByPlayerError extends AppError {
    constructor(id: number, playerName: string);
}
export declare class CatchFailedPokemonRanAwayError extends AppError {
    constructor(id: number, playerName: string);
}
export declare class PlayerDoesNotResideOnTheRoute extends AppError {
    constructor(gameRoomId: number, playerName: string);
}
export declare class XIsInCooldownError extends AppError {
    constructor(xName: string, hoursCooldown: string);
}
export declare class InvalidDifficultError extends AppError {
    constructor();
}
export declare class PlayerNotFoundError extends AppError {
    constructor(playerPhone: string);
}
export declare class PlayerAlreadyExists extends AppError {
    constructor(name: string);
}
export declare class SkillNotFoundError extends AppError {
    constructor(skillName: string);
}
export declare class OfferNotFoundError extends AppError {
    constructor(id: string);
}
export declare class PokeTeamNotFoundError extends AppError {
    constructor(teamName: string);
}
export declare class PlayerInRaidIsLockedError extends AppError {
    constructor(playerName: string);
}
export declare class PokemonNotFoundError extends AppError {
    constructor(pokemonId: number | string);
}
export declare class ZeroPokemonsFoundError extends AppError {
    constructor();
}
export declare class PokemonMustBeShinyError extends AppError {
    constructor();
}
export declare class PokemonIsNotHoldingItemError extends AppError {
    constructor(pokemonId: number | string);
}
export declare class PokemonCantMegaEvolveError extends AppError {
    constructor(pokemonId: number | string);
}
export declare class PokemonIsNotMegaError extends AppError {
    constructor(pokemonId: number | string);
}
export declare class RaidDataNotFoundError extends AppError {
    constructor(raidName: string);
}
export declare class ItemNotFoundError extends AppError {
    constructor(itemName: string);
}
export declare class RequiredItemNotFoundError extends AppError {
    constructor();
}
export declare class InsufficientItemAmountError extends AppError {
    constructor(itemName: string, currentAmount: number, requestedAmount: number);
}
export declare class InvasionNotFoundError extends AppError {
    constructor(invasionId: number | string);
}
export declare class RaidNotFoundError extends AppError {
    constructor(raidId: number | string);
}
export declare class PlayerDoestNotOwnThePokemonError extends AppError {
    constructor(id: number | string, playerName: string);
}
export declare class PokemonExceededRanchTimeLimit extends AppError {
    constructor(id: number | string, pokemonName: string);
}
export declare class PokemonDoesNotHasMegaEvolutionError extends AppError {
    constructor(id: number | string, pokemonName: string);
}
export declare class PokemonNotInDaycareError extends AppError {
    constructor(pokemonId: number, pokemonName: string);
}
export declare class PokemonIsNotInRaidTeamError extends AppError {
    constructor(playerName: string, pokemonId: number, pokemonName: string);
}
export declare class CantProceedWithPokemonInTeamError extends AppError {
    constructor(pokemonId: number, pokemonName: string);
}
export declare class OfferIsNotForPlayerError extends AppError {
    constructor(id: string | number);
}
export declare class OfferAlreadyFinishedError extends AppError {
    constructor(id: string | number);
}
export declare class PokemonInDaycareRemainingTime extends AppError {
    constructor(pokemonId: number, pokemonName: string, remainingTime: string);
}
export declare class PokemonAboveDaycareLevelLimit extends AppError {
    constructor(pokemonId: number, pokemonName: string, levelLimit: number);
}
export declare class CantDuelItselfError extends AppError {
    constructor();
}
export declare class PlayerOnlyHasOnePokemonError extends AppError {
    constructor(playerName: string);
}
export declare class CantSellAllPokemonsError extends AppError {
    constructor(playerName: string);
}
export declare class CantSellPokemonInTeamError extends AppError {
    constructor(id: number);
}
export declare class NoItemsFoundError extends AppError {
    constructor();
}
export declare class SessionNotFoundError extends AppError {
    constructor(sessionId: number);
}
export declare class PlayersPokemonNotFoundError extends AppError {
    constructor(pokemonId: number, playerName: string);
}
export declare class PokemonAlreadyHasOwnerError extends AppError {
    constructor(pokemonId: number, pokemonName: string);
}
export declare class PokemonDoesNotBelongsToTheUserError extends AppError {
    constructor(pokemonId: number, pokemonName: string, playerName: string);
}
export declare class PokemonDoesNotHaveOwnerError extends AppError {
    constructor(pokemonId: number, pokemonName: string);
}
export declare class PokemonAlreadyHasChildrenError extends AppError {
    constructor(pokemonId: number, pokemonName: string, amount: number);
}
export declare class CantBreedShiniesError extends AppError {
    constructor();
}
export declare class PlayerDoesNotHaveItemError extends AppError {
    constructor(playerName: string, itemName: string);
}
export declare class InvalidChildrenAmountError extends AppError {
    constructor();
}
export declare class WrongRegionToEvolveError extends AppError {
    constructor(pokemonName: string);
}
export declare class TypeMissmatchError extends AppError {
    constructor(value: string, typeName: string);
}
export declare class SessionIdNotFoundError extends AppError {
    constructor(sessionId: number);
}
export declare class PlayerDoesNotHaveThePokemonInTheTeamError extends AppError {
    constructor(playerName: string);
}
export declare class RequestedShopItemDoesNotExists extends AppError {
    constructor(itemId: number | string);
}
export declare class InsufficientFundsError extends AppError {
    constructor(playerName: string, playerFunds: number, requiredFunds: number);
}
export declare class InsufficientShardsError extends AppError {
    constructor(playerName: string, playerFunds: number, requiredFunds: number);
}
export declare class SendEmptyMessageError extends AppError {
    constructor();
}
export declare class InvasionAlreadyFinishedError extends AppError {
    constructor();
}
export declare class RaidAlreadyFinishedError extends AppError {
    constructor();
}
export declare class PlayerDoesNotBelongToRaidTeamError extends AppError {
    constructor(playerName: string);
}
export declare class RaidAlreadyInProgressError extends AppError {
    constructor(playerName: string);
}
export declare class RoomDoesNotExistsInRaidError extends AppError {
    constructor(roomIndex: number, raidName: string);
}
export declare class RoomAlreadyFinishedError extends AppError {
    constructor(roomIndex: number);
}
export declare class PlayerDoesNotHaveReviveForPokemonInRaidError extends AppError {
    constructor(playerName: string, pokemonName: string);
}
export declare class InsufficentPlayersForInvasionError extends AppError {
    constructor(amount: number, requiredAmount: number);
}
export declare class PlayerDidNotDefeatPokemonError extends AppError {
    constructor(playerName: string);
}
export declare class NoDuelWinnerFoundError extends AppError {
    constructor();
}
export declare class NoDuelLoserFoundError extends AppError {
    constructor();
}
export declare class CouldNotUpdatePlayerError extends AppError {
    constructor(parameter: string, value: string | number);
}
export declare class NoEnergyError extends AppError {
    constructor(playerName: string);
}
export declare class PokemonHasNotBornYetError extends AppError {
    constructor(id: number);
}
export declare class EggIsNotReadyToBeHatch extends AppError {
    constructor(id: number, hoursLeft: number);
}
export declare class InsufficientLevelToEvolveError extends AppError {
    constructor(pokemonId: number, pokemonName: string, neededLevel: number);
}
export declare class UnknownEvolutionMethodError extends AppError {
    constructor(pokemonId: number, pokemonName: string);
}
export declare class PokemonAlreadyOnLastEvolution extends AppError {
    constructor(pokemonId: number, pokemonName: string);
}
export declare class FailedToFindXinYError extends AppError {
    constructor(x: string, y: string);
}
export declare class UnexpectedError extends AppError {
    constructor(routeName: string);
}
