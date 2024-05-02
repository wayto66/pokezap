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
exports.raidCreate = void 0;
const tsyringe_1 = require("tsyringe");
const raidsDataMap_1 = require("../../../server/constants/raidsDataMap");
const generateRaidPokemon_1 = require("../../../server/modules/pokemon/generate/generateRaidPokemon");
const AppErrors_1 = require("../../errors/AppErrors");
const raidCreate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , raidName, confirm] = data.routeParams;
    if (!raidName)
        throw new AppErrors_1.MissingParameterError('Nome da raid à ser criada');
    const raidData = raidsDataMap_1.raidsDataMap.get(raidName.toLowerCase());
    if (!raidData)
        throw new AppErrors_1.RaidDataNotFoundError(raidName);
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            teamPoke1: true,
            gameRooms: true,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player.name);
    const gameRoom = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (confirm && confirm === 'CONFIRM') {
        const announcementText = `RAID: ${raidName}!`;
        // TODO: MEGA
        // const boss = await generateMegaPokemon({})
        const raid = yield prismaClient.raid.create({
            data: {
                announcementText,
                cashReward: 100,
                creatorId: player.id,
                forfeitCost: 300,
                gameRoomId: gameRoom.id,
                mode: 'raid',
                name: `RAID : ${raidName}!`,
                requiredPlayers: 3,
            },
        });
        const enemiesData = [];
        for (const enemy of raidData.enemies) {
            enemiesData.push((0, generateRaidPokemon_1.generateRaidPokemon)({
                isAdult: true,
                level: Math.round(gameRoom.level * 1.5),
                name: enemy,
                savage: false,
                shinyChance: 0.1,
                fromIncense: false,
                gameRoomId: gameRoom.id,
            }));
            enemiesData.push((0, generateRaidPokemon_1.generateRaidPokemon)({
                isAdult: true,
                level: Math.round(gameRoom.level * 1.5),
                name: enemy,
                savage: false,
                shinyChance: 0.1,
                fromIncense: false,
                gameRoomId: gameRoom.id,
            }));
        }
        yield Promise.all(enemiesData);
        const getRandomPokemons = (array, amount) => {
            const shuffledArray = array.slice(); // Create a copy of the array
            let currentIndex = shuffledArray.length;
            // While there are elements remaining to shuffle
            while (currentIndex > 0) {
                // Pick a random index from the remaining elements
                const randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                // Swap the current element with the randomly selected element
                const temporaryValue = shuffledArray[currentIndex];
                shuffledArray[currentIndex] = shuffledArray[randomIndex];
                shuffledArray[randomIndex] = temporaryValue;
            }
            // Return the desired number of elements from the shuffled array
            return shuffledArray.slice(0, amount);
        };
        const createRoomsData = [];
        for (let i = 0; i < raidData.rooms; i++) {
            const enemyAmount = Math.floor(Math.random() * 3 + 1);
            const enemies = getRandomPokemons(enemiesData, enemyAmount);
            createRoomsData.push({
                announcementText: `SALA DA RAID ${raidName}.`,
                creatorId: player.id,
                gameRoomId: gameRoom.id,
                isFinalRoom: false,
                mode: 'raid-room',
                name: 'SALA ',
                requiredPlayers: raid.requiredPlayers,
                raidId: raid.id,
                enemiesIds: enemies.map(p => p.id),
            });
        }
        yield prismaClient.raidRoom.createMany({
            data: createRoomsData,
        });
        return {
            message: `*${player.name}* inicou uma caravana para RAID ${raidName} por $${200}.
    👍 - Juntar-se`,
            status: 200,
            data: null,
            actions: [`pz. raid join ${raid.id}`],
        };
    }
    return {
        message: `Deseja criar uma caravana para RAID ${raidName} por $${200}?
    👍 - Confirmar`,
        status: 200,
        data: null,
        actions: [`pz. raid create ${raidName} confirm`],
    };
});
exports.raidCreate = raidCreate;
//# sourceMappingURL=raidCreate.js.map