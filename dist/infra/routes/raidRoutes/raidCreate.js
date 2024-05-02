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
exports.raidCreate = exports.raidDifficultyDataMap = void 0;
const tsyringe_1 = require("tsyringe");
const raidsDataMap_1 = require("../../../server/constants/raidsDataMap");
const iGenRaidCreate_1 = require("../../../server/modules/imageGen/iGenRaidCreate");
const generateMegaPokemon_1 = require("../../../server/modules/pokemon/generate/generateMegaPokemon");
const generateRaidPokemon_1 = require("../../../server/modules/pokemon/generate/generateRaidPokemon");
const AppErrors_1 = require("../../errors/AppErrors");
exports.raidDifficultyDataMap = new Map([
    [
        'easy',
        {
            shinyChance: 0.05,
            bossLevel: 100,
            enemiesLevel: 50,
            cashReward: 750,
            dropRate: 0.5,
            roomCount: 4,
        },
    ],
    [
        'medium',
        {
            shinyChance: 0.08,
            bossLevel: 110,
            enemiesLevel: 65,
            cashReward: 1400,
            dropRate: 0.75,
            roomCount: 5,
        },
    ],
    [
        'hard',
        {
            shinyChance: 0.11,
            bossLevel: 175,
            enemiesLevel: 80,
            cashReward: 2300,
            dropRate: 1.25,
            roomCount: 6,
        },
    ],
    [
        'expert',
        {
            shinyChance: 0.15,
            bossLevel: 240,
            enemiesLevel: 90,
            cashReward: 4000,
            dropRate: 2.25,
            roomCount: 7,
        },
    ],
    [
        'insane',
        {
            shinyChance: 0.25,
            bossLevel: 320,
            enemiesLevel: 120,
            cashReward: 8000,
            dropRate: 3.5,
            roomCount: 8,
        },
    ],
]);
const raidCreate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , raidNameUppercase, difficultUppercase, confirm] = data.routeParams;
    if (!raidNameUppercase || !difficultUppercase)
        throw new AppErrors_1.MissingParameterError('Nome da raid à ser criada e dificuldade');
    const difficult = difficultUppercase.toLowerCase();
    if (!['easy', 'medium', 'hard', 'expert', 'insane'].includes(difficult))
        throw new AppErrors_1.InvalidDifficultError();
    const raidName = raidNameUppercase.toLowerCase();
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
        include: {
            upgrades: {
                include: {
                    base: true,
                },
            },
            raid: true,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (gameRoom.raid)
        throw new AppErrors_1.RouteAlreadyHasARaidRunningError(gameRoom.raid.name);
    if (!gameRoom.upgrades.map(upg => upg.base.name).includes('bikeshop'))
        throw new AppErrors_1.RouteDoesNotHaveUpgradeError('bikeshop');
    const checkRaid = yield prismaClient.raid.findFirst({
        where: {
            gameRoomId: gameRoom.id,
            statusTrashed: false,
        },
    });
    if (checkRaid)
        throw new AppErrors_1.RouteAlreadyHasARaidRunningError(checkRaid.name);
    const announcementText = `RAID: ${raidName}!`;
    const raidDifficultData = exports.raidDifficultyDataMap.get(difficult);
    if (!raidDifficultData)
        throw new AppErrors_1.UnexpectedError('cant find raiddata in map');
    if (confirm && confirm === 'CONFIRM') {
        const megaPokemon = yield (0, generateMegaPokemon_1.generateMegaPokemon)({
            name: raidName.toLowerCase(),
            shinyChance: raidDifficultData.shinyChance,
            level: raidDifficultData.bossLevel,
        });
        const raid = yield prismaClient.raid.create({
            data: {
                difficulty: difficult,
                announcementText,
                cashReward: raidDifficultData.cashReward,
                creatorId: player.id,
                forfeitCost: raidDifficultData.cashReward / 2,
                gameRoomId: gameRoom.id,
                mode: 'raid',
                name: `RAID : ${raidName}!`,
                requiredPlayers: 3,
                imageUrl: raidData.type,
            },
        });
        const enemiesDataPromises = [];
        for (const enemy of raidData.enemies) {
            enemiesDataPromises.push((0, generateRaidPokemon_1.generateRaidPokemon)({
                level: Math.round(Math.min(raidDifficultData.enemiesLevel * 0.9 + Math.random() * 0.2, 100)),
                name: enemy,
            }));
            enemiesDataPromises.push((0, generateRaidPokemon_1.generateRaidPokemon)({
                level: Math.round(Math.min(raidDifficultData.enemiesLevel * 0.9 + Math.random() * 0.2, 100)),
                name: enemy,
            }));
            enemiesDataPromises.push((0, generateRaidPokemon_1.generateRaidPokemon)({
                level: Math.round(Math.min(raidDifficultData.enemiesLevel * 0.9 + Math.random() * 0.2, 100)),
                name: enemy,
            }));
        }
        const enemiesData = yield Promise.all(enemiesDataPromises);
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
        for (let i = 0; i < raidData.rooms - 1; i++) {
            const enemyAmount = 4;
            const enemies = getRandomPokemons(enemiesData, enemyAmount);
            console.log(enemies);
            console.log(enemiesData);
            console.log(enemyAmount);
            createRoomsData.push({
                announcementText: `SALA ${i + 1}/${raidData.rooms} DA RAID ${raidName}.`,
                creatorId: player.id,
                gameRoomId: gameRoom.id,
                isFinalRoom: false,
                mode: 'raid-room',
                name: 'SALA ',
                requiredPlayers: raid.requiredPlayers,
                raidId: raid.id,
                enemiesIds: enemies.map(p => p.id),
                enemyPokemons: {
                    connect: enemies.map(p => {
                        return { id: p.id };
                    }),
                },
            });
        }
        createRoomsData.push({
            announcementText: `Prepare-se! *${raidName.toUpperCase()}* apareceu!.`,
            creatorId: player.id,
            gameRoomId: gameRoom.id,
            isFinalRoom: true,
            mode: 'raid-room',
            name: 'SALA FINAL',
            requiredPlayers: raid.requiredPlayers,
            raidId: raid.id,
            enemiesIds: [megaPokemon.id],
            enemyPokemons: {
                connect: {
                    id: megaPokemon.id,
                },
            },
        });
        console.log(createRoomsData);
        yield prismaClient
            .$transaction(createRoomsData.map(raidRoomCreateData => prismaClient.raidRoom.create({
            data: raidRoomCreateData,
        })))
            .catch(e => console.log(e));
        console.log('passed?');
        const raidReadAgain = yield prismaClient.raid.findUnique({
            where: {
                id: raid.id,
            },
            include: {
                raidRooms: true,
            },
        });
        if (!raidReadAgain)
            throw new AppErrors_1.RaidNotFoundError(raid.id);
        if (raidReadAgain.raidRooms.length === 0)
            throw new AppErrors_1.UnexpectedError('failed to create rooms in raid: ' + raidReadAgain.id);
        yield prismaClient.raid.update({
            where: {
                id: raid.id,
            },
            data: {
                currentRoomIndex: raidReadAgain.raidRooms[0].id,
            },
        });
        return {
            message: `*${player.name}* e inicou uma caravana para RAID: ${raidName} ${difficult}.
      👍 - Juntar-se`,
            status: 200,
            data: null,
            actions: [`pz. raid join ${raid.id}`],
        };
    }
    const bossBaseData = yield prismaClient.basePokemon.findFirst({
        where: {
            name: raidName,
        },
    });
    const enemiesBaseData = yield prismaClient.basePokemon.findMany({
        where: {
            name: {
                in: raidData.enemies,
            },
        },
    });
    const lootData = yield prismaClient.baseItem.findMany({
        where: {
            name: {
                in: raidData.loot.map(item => item.name),
            },
        },
    });
    console.log({ lootData });
    if (!bossBaseData)
        throw new AppErrors_1.UnexpectedError('No boss data found for: ' + raidName);
    if (!enemiesBaseData || enemiesBaseData.length === 0)
        throw new AppErrors_1.UnexpectedError('no enemies data found for: ' + raidData.enemies);
    const imageUrl = yield (0, iGenRaidCreate_1.iGenRaidCreate)({
        backgroundName: raidData.type,
        boss: bossBaseData,
        enemyPokemons: enemiesBaseData,
        possibleLoot: lootData,
    });
    return {
        message: `*${player.name}*, deseja iniciar uma equipe para RAID: ${raidName} ${difficult}?
    👍 - Confirmar`,
        imageUrl,
        status: 200,
        data: null,
        actions: [`pz. raid create ${raidName} ${difficult} confirm`],
    };
});
exports.raidCreate = raidCreate;
//# sourceMappingURL=raidCreate.js.map