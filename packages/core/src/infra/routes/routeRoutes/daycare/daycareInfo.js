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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.daycareInfo = void 0;
const iGenDaycareInfo_1 = require("../../../../../../image-generator/src/iGenDaycareInfo");
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const getHoursDifference_1 = require("../../../../server/helpers/getHoursDifference");
const AppErrors_1 = require("../../../errors/AppErrors");
const daycareInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            teamPoke1: true,
            teamPoke2: true,
            teamPoke3: true,
            teamPoke4: true,
            teamPoke5: true,
            teamPoke6: true,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const route = yield src_1.default.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            upgrades: {
                include: {
                    base: true,
                },
            },
            players: {
                include: {
                    ownedPokemons: {
                        include: {
                            baseData: true,
                            owner: true,
                        },
                    },
                },
            },
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (!route.upgrades.map(upg => upg.base.name).includes('daycare'))
        throw new AppErrors_1.RouteDoesNotHaveUpgradeError('daycare');
    const playersPokemons = route.players.map(player => player.ownedPokemons).flat();
    const pokemonsInDaycare = playersPokemons.filter(pokemon => pokemon.isInDaycare === true);
    const displayMessage = pokemonsInDaycare.map(pokemon => {
        var _a;
        return `${(_a = pokemon.owner) === null || _a === void 0 ? void 0 : _a.name} - #${pokemon.id} ${pokemon.baseData.name}  \n`;
    });
    const remainingHoursMap = new Map([]);
    for (const poke of pokemonsInDaycare) {
        if (!poke.daycareEntry)
            throw new AppErrors_1.UnexpectedError('poke in daycare without daycarentry. id: ' + poke.id);
        remainingHoursMap.set(poke.id, 24 - (0, getHoursDifference_1.getHoursDifference)(poke.daycareEntry, new Date()));
    }
    const imageUrl = yield (0, iGenDaycareInfo_1.iGenDaycareInfo)({
        pokemons: pokemonsInDaycare,
        remainingHoursMap,
    });
    return {
        message: `Pokemons no daycare da rota ${route.id}
    ${displayMessage}`,
        imageUrl,
        status: 200,
    };
});
exports.daycareInfo = daycareInfo;
