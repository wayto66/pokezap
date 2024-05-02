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
exports.newUser3 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const iGenPlayerAnalysis_1 = require("../../../../server/modules/imageGen/iGenPlayerAnalysis");
const generateGeneralStats_1 = require("../../../../server/modules/pokemon/generateGeneralStats");
const generateHpStat_1 = require("../../../../server/modules/pokemon/generateHpStat");
const newUser3 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , genderPre, spriteId] = data.routeParams;
    const gender = genderPre.toUpperCase();
    if (gender !== 'MENINO' && gender !== 'MENINA')
        throw new AppErrors_1.GenderDoesNotExistError(gender);
    const playerSprite = () => {
        if (gender === 'MENINO')
            return 'male/' + spriteId + '.png';
        if (gender === 'MENINA')
            return 'female/' + spriteId + '.png';
        return '';
    };
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const newPlayer = yield prismaClient.player.create({
        data: {
            name: data.playerName,
            phone: data.playerPhone,
            spriteUrl: playerSprite(),
            cash: 3000,
        },
    });
    const basePokes = yield prismaClient.basePokemon.findMany({
        where: {
            BaseExperience: {
                lt: 65,
            },
            isMega: false,
            isRegional: false,
        },
    });
    const basePoke = basePokes[Math.floor(Math.random() * basePokes.length)];
    const newPokemon = yield prismaClient.pokemon.create({
        data: {
            basePokemonId: basePoke.id,
            isAdult: true,
            isMale: Math.random() > 0.5,
            ownerId: newPlayer.id,
            spriteUrl: basePoke.defaultSpriteUrl,
            isShiny: false,
            level: 1,
            hp: (0, generateHpStat_1.generateHpStat)(basePoke.BaseHp, 1),
            atk: (0, generateGeneralStats_1.generateGeneralStats)(basePoke.BaseAtk, 1),
            def: (0, generateGeneralStats_1.generateGeneralStats)(basePoke.BaseDef, 1),
            spAtk: (0, generateGeneralStats_1.generateGeneralStats)(basePoke.BaseSpAtk, 1),
            spDef: (0, generateGeneralStats_1.generateGeneralStats)(basePoke.BaseSpDef, 1),
            speed: (0, generateGeneralStats_1.generateGeneralStats)(basePoke.BaseSpeed, 1),
            savage: false,
            talentId1: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId2: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId3: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId4: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId5: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId6: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId7: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId8: Math.max(Math.ceil(Math.random() * 18), 1),
            talentId9: Math.max(Math.ceil(Math.random() * 18), 1),
        },
        include: {
            baseData: true,
            talent1: true,
            talent2: true,
            talent3: true,
            talent4: true,
            talent5: true,
            talent6: true,
            talent7: true,
            talent8: true,
            talent9: true,
        },
    });
    const player = yield prismaClient.player.update({
        where: {
            id: newPlayer.id,
        },
        data: {
            teamPokeId1: newPokemon.id,
        },
        include: {
            ownedItems: {
                include: {
                    baseItem: true,
                },
            },
            ownedPokemons: {
                include: {
                    baseData: true,
                },
            },
            teamPoke1: {
                include: {
                    baseData: true,
                },
            },
            teamPoke2: {
                include: {
                    baseData: true,
                },
            },
            teamPoke3: {
                include: {
                    baseData: true,
                },
            },
            teamPoke4: {
                include: {
                    baseData: true,
                },
            },
            teamPoke5: {
                include: {
                    baseData: true,
                },
            },
            teamPoke6: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    const imageUrl = yield (0, iGenPlayerAnalysis_1.iGenPlayerAnalysis)({
        playerData: player,
    });
    return {
        message: `[dsb] Usuário ${newPlayer.name} criado com o código #${newPlayer.id}. Seu primeiro pokemon é um ${newPokemon.baseData.name}! \n\n Voce pode utilizar o comando "pz. help" para obter ajuda, mas aqui vai uma lista com alguns comandos: \n\n 
    - pz. inventory (ou pz. i) = acessa seu inventario de itens ou pokemons
    - pz. team | visualizar seu time pokemon atual
    - pz. team 1515 4441 | monta o time com os pokemons 1515 e 4441
    - pz. team charmander pikachu | monta o time com seu charmander e pikachu
    - pz. loja | acessa a loja
    - pz. help | acessa ajuda com mais comandos 
    
    ATENÇÃO: este chat é utilizado para voce acessar seu inventario e afins.
    Para encontrar pokemons, treinadores e etc, voce deverá entrar em uma rota, que é um grupo de whatsapp que será disponibilizado abaixo:    
    `,
        status: 200,
        imageUrl: imageUrl,
        data: null,
    };
});
exports.newUser3 = newUser3;
//# sourceMappingURL=newUser3.js.map