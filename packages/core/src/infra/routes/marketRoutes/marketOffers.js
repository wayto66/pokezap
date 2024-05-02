"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketOffers = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const marketOffers = (data) => __awaiter(void 0, void 0, void 0, function* () {
    /* const [, , , pokemonIdString] = data.routeParams
    if (!pokemonIdString) throw new MissingParametersPokemonInformationError()
  
    let searchMode = 'string'
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
    if (!isNaN(pokemonId)) searchMode = 'number' */
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    /*  const pokemonRequestData = getPokemonRequestData({
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
        owner: true,
        heldItem: {
          include: {
            baseItem: true,
          },
        },
      },
    })
    if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
      throw new PokemonNotFoundError(pokemonRequestData.identifier) */
    const offers = yield prisma.marketOffer.findMany({
        where: {
            demandPlayerId: player.id,
            active: true,
        },
        include: {
            pokemonOffer: {
                include: {
                    baseData: true,
                },
            },
            pokemonDemand: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    const offersDisplay = offers.map(offer => {
        return `[${offer.id}] #${offer.pokemonOffer[0].id} - ${offer.pokemonOffer[0].baseData.name} por seu #${offer.pokemonDemand[0].id} - ${offer.pokemonDemand[0].baseData.name}`;
    });
    return {
        message: `Ofertas no mercado para *${player.name}*: \n\n ${offersDisplay.join('\n')} \n\n Para aceitar, utilize: market accept (ID-DA-OFFER)`,
        status: 200,
        actions: [],
    };
});
exports.marketOffers = marketOffers;
