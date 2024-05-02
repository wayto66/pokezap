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
exports.marketAccept = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const tsyringe_1 = require("tsyringe");
const marketAccept = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const [, , , offerIdString] = data.routeParams;
    if (!offerIdString)
        throw new AppErrors_1.MissingParameterError('id da offer');
    const offerId = Number(offerIdString);
    if (isNaN(offerId))
        throw new AppErrors_1.TypeMissmatchError(offerIdString, 'número');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const offer = yield prismaClient.marketOffer.findUnique({
        where: {
            id: offerId,
        },
        include: {
            pokemonDemand: {
                include: {
                    baseData: true,
                },
            },
            pokemonOffer: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    if (!offer)
        throw new AppErrors_1.OfferNotFoundError(offerId.toFixed(2));
    if (!offer.active)
        throw new AppErrors_1.OfferAlreadyFinishedError(offer.id);
    if (offer.demandPlayerId !== player.id)
        throw new AppErrors_1.OfferIsNotForPlayerError(offer.id);
    if (offer.pokemonDemand[0].ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(offer.pokemonDemand[0].id, player.name);
    yield prismaClient.$transaction([
        prismaClient.pokemon.update({
            where: {
                id: offer.pokemonDemand[0].id,
            },
            data: {
                owner: {
                    disconnect: true,
                },
                savage: true,
            },
        }),
        prismaClient.pokemon.update({
            where: {
                id: offer.pokemonOffer[0].id,
            },
            data: {
                ownerId: player.id,
                savage: false,
            },
        }),
        prismaClient.marketOffer.update({
            where: {
                id: offer.id,
            },
            data: {
                accepted: true,
                active: false,
            },
        }),
    ]);
    return {
        message: `#${offer.pokemonDemand[0].id} - ${offer.pokemonDemand[0].baseData.name} trocado por #${offer.pokemonOffer[0].id} - ${offer.pokemonOffer[0].baseData.name} `,
        status: 200,
        actions: [],
    };
});
exports.marketAccept = marketAccept;
//# sourceMappingURL=marketAccept.js.map