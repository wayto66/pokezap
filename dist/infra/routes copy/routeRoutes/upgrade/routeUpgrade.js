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
exports.routeUpgrade = void 0;
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const iGenRouteInfo_1 = require("../../../../server/modules/imageGen/iGenRouteInfo");
const AppErrors_1 = require("../../../errors/AppErrors");
const routeUpgrade = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const [, , , upgradeNameUppercase, confirm] = data.routeParams;
    if (!upgradeNameUppercase) {
        return {
            message: `Upgrades para rota:
      - ponte-de-pesca : $5000
      - poke-ranch: $5000
      - minivan : $7000
      - daycare : $5000
      - cassino : $5000
      - lab : $10000
      - bikeshop : $5000
      - barco : $12000
      - pokemon-center: $5000
      `,
            status: 200,
            data: null,
        };
    }
    const baseUpgrade = yield prismaClient.baseRoomUpgrades.findFirst({
        where: {
            name: upgradeNameUppercase.toLowerCase(),
        },
    });
    if (!baseUpgrade)
        throw new AppErrors_1.UpgradeNotFoundError(upgradeNameUppercase);
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (player.cash < baseUpgrade.price)
        throw new AppErrors_1.InsufficientFundsError(player.name, player.cash, baseUpgrade.price);
    const route = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            upgrades: {
                include: {
                    base: true,
                },
            },
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(data.playerName, data.groupCode);
    if (route.upgrades.map(upgrade => upgrade.base.name).includes(baseUpgrade.name)) {
        const upgrade = route.upgrades.find(upgrade => upgrade.base.name === baseUpgrade.name);
        if (!upgrade)
            throw new AppErrors_1.UnexpectedError('Não foi possível encontrar upgrade.base.name');
        const upgradeLevelUpPrice = baseUpgrade.price + Math.pow(upgrade.level, 2);
        if (confirm === 'CONFIRM') {
            if (player.cash < upgradeLevelUpPrice)
                throw new AppErrors_1.InsufficientFundsError(player.name, player.cash, upgradeLevelUpPrice);
            yield prismaClient.$transaction([
                prismaClient.player.update({
                    where: {
                        id: player.id,
                    },
                    data: {
                        cash: {
                            decrement: Math.round(upgradeLevelUpPrice),
                        },
                    },
                }),
                prismaClient.roomUpgrades.update({
                    where: {
                        id: upgrade.id,
                    },
                    data: {
                        level: {
                            increment: 1,
                        },
                    },
                }),
            ]);
            return {
                message: `${player.name} evoluiu ${upgrade === null || upgrade === void 0 ? void 0 : upgrade.base.name} para o nível ${upgrade.level + 1}.`,
                status: 200,
            };
        }
        return {
            message: `Deseja evoluir o ${upgrade === null || upgrade === void 0 ? void 0 : upgrade.base.name} para o nível ${upgrade.level + 1} por ${upgradeLevelUpPrice}? \n \n  No nível ${upgrade.level + 1},  👍 - Confirmar`,
            status: 200,
        };
    }
    const updateRoute = yield prismaClient.gameRoom.update({
        where: {
            id: route === null || route === void 0 ? void 0 : route.id,
        },
        data: {
            upgrades: {
                create: {
                    baseId: baseUpgrade.id,
                },
            },
        },
        include: {
            upgrades: {
                include: {
                    base: true,
                },
            },
        },
    });
    yield prismaClient.player.update({
        where: {
            id: player.id,
        },
        data: {
            cash: {
                decrement: baseUpgrade.price,
            },
        },
    });
    const imageUrl = yield (0, iGenRouteInfo_1.iGenRouteInfo)({
        route: updateRoute,
    });
    whatsapp_web_js_1.MessageMedia.fromFilePath(imageUrl);
    return {
        message: `*${player.name}* comprou ${baseUpgrade.name} para rota ${route.id}!`,
        status: 200,
        data: null,
        imageUrl,
    };
});
exports.routeUpgrade = routeUpgrade;
//# sourceMappingURL=routeUpgrade.js.map