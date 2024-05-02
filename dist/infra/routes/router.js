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
exports.router = void 0;
const AppErrors_1 = require("../../infra/errors/AppErrors");
const logger_1 = require("../logger");
const admRoutes_1 = require("./admRoutes");
const battleRoutes_1 = require("./battleRoutes");
const pokemonBreed1_1 = require("./breedRoutes/pokemonBreed1");
const pokemonHatch_1 = require("./breedRoutes/pokemonHatch");
const casinoRoutes_1 = require("./casinoRoutes");
const catchRoutes_1 = require("./catchRoutes");
const duelRoutes_1 = require("./duelRoutes");
const helpRoutes_1 = require("./helpRoutes");
const invasionRoutes_1 = require("./invasionRoutes");
const inventoryRoutes_1 = require("./inventoryRoutes");
const marketRoutes_1 = require("./marketRoutes");
const megaRoutes_1 = require("./megaRoutes");
const pokemonRoutes_1 = require("./pokemonRoutes");
const pokemonEvolve_1 = require("./pokemonRoutes/evolve/pokemonEvolve");
const pokemonSetRole_1 = require("./pokemonRoutes/setRole/pokemonSetRole");
const raidRoutes_1 = require("./raidRoutes");
const rankingRoutes_1 = require("./rankingRoutes");
const routeRoutes_1 = require("./routeRoutes");
const daycare_1 = require("./routeRoutes/daycare");
const pokeranchRoute_1 = require("./routeRoutes/pokeranch/pokeranchRoute");
const sellRoutes_1 = require("./sellRoutes");
const sendRoutes_1 = require("./sendRoutes");
const shopRoutes_1 = require("./shopRoutes");
const teamRoutes_1 = require("./teamRoutes");
const tournamentRoutes_1 = require("./tournamentRoutes");
const tradeRoutes_1 = require("./tradeRoutes");
const useItemRoutes_1 = require("./useItemRoutes");
const userRoutes_1 = require("./userRoutes");
const newUser_1 = require("./userRoutes/newUser");
const playerCash_1 = require("./userRoutes/playerCash");
const playerEnergy_1 = require("./userRoutes/playerEnergy");
const routeMap = new Map([
    // NEW USER ROUTES
    ['INICIAR', newUser_1.register],
    ['INICIO', newUser_1.register],
    ['START', newUser_1.register],
    ['INÍCIO', newUser_1.register],
    // PLAYER INFO ROUTES
    ['JOGADOR', userRoutes_1.playerRoutes],
    ['PLAYER', userRoutes_1.playerRoutes],
    // POKEMON ROUTES
    ['POKE', pokemonRoutes_1.pokemonRoutes],
    ['POKÉMON', pokemonRoutes_1.pokemonRoutes],
    ['POKEMON', pokemonRoutes_1.pokemonRoutes],
    // ROUTE ROUTES
    ['ROUTE', routeRoutes_1.routeRoutes],
    ['ROTA', routeRoutes_1.routeRoutes],
    ['ROTAS', routeRoutes_1.routeRoutes],
    ['ROUTES', routeRoutes_1.routeRoutes],
    // CATCH ROUTES
    ['CATCH', catchRoutes_1.catchRoutes],
    ['CAPTURAR', catchRoutes_1.catchRoutes],
    ['CAPTURA', catchRoutes_1.catchRoutes],
    // INVENTORY ROUTES
    ['INVENTARIO', inventoryRoutes_1.inventoryRoutes],
    ['INVENTORY', inventoryRoutes_1.inventoryRoutes],
    ['BAG', inventoryRoutes_1.inventoryRoutes],
    // DUEL ROUTES
    ['DUEL', duelRoutes_1.duelRoutes],
    ['DUELAR', duelRoutes_1.duelRoutes],
    ['DUELO', duelRoutes_1.duelRoutes],
    // TRADE ROUTES
    ['TRADE', tradeRoutes_1.tradeRoutes],
    ['TROCA', tradeRoutes_1.tradeRoutes],
    ['TROCAR', tradeRoutes_1.tradeRoutes],
    // TOURNAMENT ROUTES
    ['TORNEIO', tournamentRoutes_1.tournamentRoutes],
    ['TOURNAMENT', tournamentRoutes_1.tournamentRoutes],
    // SHOP ROUTES
    ['SHOP', shopRoutes_1.shopRoutes],
    ['STORE', shopRoutes_1.shopRoutes],
    ['LOJA', shopRoutes_1.shopRoutes],
    ['MART', shopRoutes_1.shopRoutes],
    ['POKEMART', shopRoutes_1.shopRoutes],
    ['COMPRAR', shopRoutes_1.shopRoutes],
    ['BUY', shopRoutes_1.shopRoutes],
    // BATTLE ROUTES
    ['BATTLE', battleRoutes_1.battleRoutes],
    // RANK ROUTES
    ['RANK', rankingRoutes_1.rankRoutes],
    ['RANKING', rankingRoutes_1.rankRoutes],
    // BREED ROUTES
    ['BREED', pokemonBreed1_1.pokemonBreed1],
    ['COMBINAR', pokemonBreed1_1.pokemonBreed1],
    ['HATCH', pokemonHatch_1.pokemonHatch],
    ['CHOCAR', pokemonHatch_1.pokemonHatch],
    // HELP ROUTES
    ['HELP', helpRoutes_1.helpRoutes],
    ['WIKI', helpRoutes_1.helpRoutes],
    ['AJUDA', helpRoutes_1.helpRoutes],
    ['INFO', helpRoutes_1.helpRoutes],
    // SEND ROUTES
    ['SEND', sendRoutes_1.sendRoutes],
    ['ENVIAR', sendRoutes_1.sendRoutes],
    // INVASION ROUTES
    ['INVASION', invasionRoutes_1.invasionRoutes],
    // RAID ROUTES
    ['RAID', raidRoutes_1.raidRoutes],
    // SELL ROUTES
    ['SELL', sellRoutes_1.sellRoutes],
    ['VENDER', sellRoutes_1.sellRoutes],
    // TEAM ROUTES
    ['TEAM', teamRoutes_1.teamRoutes],
    ['TIME', teamRoutes_1.teamRoutes],
    ['POKETEAM', teamRoutes_1.teamRoutes],
    ['POKE-TIME', teamRoutes_1.teamRoutes],
    // BAZAR ROUTES
    ['CASINO', casinoRoutes_1.casinoRoutes],
    ['CASSINO', casinoRoutes_1.casinoRoutes],
    // MEGA ROUTES
    ['MEGA', megaRoutes_1.megaRoutes],
    // ADM ROUTES
    ['ADM', admRoutes_1.admRoutes],
    // MARKET ROUTES
    ['MARKET', marketRoutes_1.marketRoutes],
    ['MERCADO', marketRoutes_1.marketRoutes],
    // USEITEM ROUTES
    ['USEITEM', useItemRoutes_1.useItemRoutes],
    ['USE-ITEM', useItemRoutes_1.useItemRoutes],
    ['USEITEN', useItemRoutes_1.useItemRoutes],
    ['USE-ITEN', useItemRoutes_1.useItemRoutes],
    ['USE', useItemRoutes_1.useItemRoutes],
    /// //////////// EXPRESS ROUTES ////////////////////
    ['P', pokemonRoutes_1.pokemonRoutes],
    ['I', inventoryRoutes_1.inventoryRoutes],
    ['T', tradeRoutes_1.tradeRoutes],
    ['L', shopRoutes_1.shopRoutes],
    ['B', shopRoutes_1.shopRoutes],
    ['CASH', (data) => (0, playerCash_1.playerCash)(Object.assign(Object.assign({}, data), { routeParams: ['pz', 'player', 'cash'] }))],
    ['MONEY', playerCash_1.playerCash],
    ['ENERGY', playerEnergy_1.playerEnergy],
    ['ENERGIA', playerEnergy_1.playerEnergy],
    [
        'EVOLVE',
        (data) => {
            const routeParams = [...data.routeParams];
            routeParams.unshift('shift');
            return (0, pokemonEvolve_1.pokemonEvolve)(Object.assign(Object.assign({}, data), { routeParams }));
        },
    ],
    [
        'DAYCARE',
        (data) => {
            const routeParams = [...data.routeParams];
            routeParams.unshift('shift');
            return (0, daycare_1.daycareRoutes)(Object.assign(Object.assign({}, data), { routeParams }));
        },
    ],
    [
        'DAY-CARE',
        (data) => {
            const routeParams = [...data.routeParams];
            routeParams.unshift('shift');
            return (0, daycare_1.daycareRoutes)(Object.assign(Object.assign({}, data), { routeParams }));
        },
    ],
    [
        'POKERANCH',
        (data) => {
            const routeParams = [...data.routeParams];
            routeParams.unshift('shift');
            return (0, pokeranchRoute_1.pokeranchRoute)(Object.assign(Object.assign({}, data), { routeParams }));
        },
    ],
    [
        'POKE-RANCH',
        (data) => {
            const routeParams = [...data.routeParams];
            routeParams.unshift('shift');
            return (0, pokeranchRoute_1.pokeranchRoute)(Object.assign(Object.assign({}, data), { routeParams }));
        },
    ],
    [
        'SETROLE',
        (data) => {
            const routeParams = [...data.routeParams];
            routeParams.unshift('shift');
            return (0, pokemonSetRole_1.pokemonSetRole)(Object.assign(Object.assign({}, data), { routeParams }));
        },
    ],
    [
        'SET-ROLE',
        (data) => {
            const routeParams = [...data.routeParams];
            routeParams.unshift('shift');
            return (0, pokemonSetRole_1.pokemonSetRole)(Object.assign(Object.assign({}, data), { routeParams }));
        },
    ],
]);
const router = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [, routeName] = data.routeParams;
        if (!routeName)
            throw new AppErrors_1.RouteNotProvidedError();
        const route = routeMap.get(routeName.toUpperCase().trim());
        if (!route)
            throw new AppErrors_1.RouteNotFoundError(data.playerName, routeName);
        return yield route(data);
    }
    catch (error) {
        if (!(error instanceof AppErrors_1.AppError)) {
            logger_1.logger.error(error);
            return {
                message: `Houve um erro inesperado na solicitação de ${data.playerName}`,
                status: 400,
            };
        }
        return {
            data: error.data,
            message: error.message,
            status: error.statusCode,
            actions: error.actions,
        };
    }
});
exports.router = router;
//# sourceMappingURL=router.js.map