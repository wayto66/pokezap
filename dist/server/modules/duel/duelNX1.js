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
exports.duelNX1 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const atkEffectivenessMap_1 = require("../../../server/constants/atkEffectivenessMap");
const getBestSkillPair_1 = require("../../../server/helpers/getBestSkillPair");
const defEffectivenessMap_1 = require("../../constants/defEffectivenessMap");
const talentIdMap_1 = require("../../constants/talentIdMap");
const findKeyByValue_1 = require("../../helpers/findKeyByValue");
const iGenDuel2X1Rounds_1 = require("../imageGen/iGenDuel2X1Rounds");
const iGenDuel3X1Rounds_1 = require("../imageGen/iGenDuel3X1Rounds");
const getTeamBonuses_1 = require("./getTeamBonuses");
const duelNX1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const { boss } = data;
    const playerIds = data.playerTeam.map(poke => {
        if (!poke.ownerId)
            throw new AppErrors_1.UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`);
        return poke.ownerId;
    });
    const playersPokeTeamsData = yield prisma.player.findMany({
        where: {
            id: {
                in: playerIds,
            },
        },
        include: {
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
    const pokesBonusesMap = new Map([]);
    for (const poke of data.playerTeam) {
        const player = playersPokeTeamsData.find(player => player.id === poke.ownerId);
        if (!player)
            throw new AppErrors_1.UnexpectedError('player not found in duelNX1');
        pokesBonusesMap.set(poke.id, yield (0, getTeamBonuses_1.getTeamBonuses)({
            poke,
            team: [
                player.teamPoke1,
                player.teamPoke2,
                player.teamPoke3,
                player.teamPoke4,
                player.teamPoke5,
                player.teamPoke6,
            ],
        }));
    }
    const pokeSkillMap = new Map([]);
    for (const poke of data.playerTeam) {
        pokeSkillMap.set(poke.id, yield getBestSkills({
            attacker: poke,
            defender: boss,
        }));
    }
    const alliesTeamData = [];
    for (const poke of data.playerTeam) {
        if (!poke.ownerId)
            throw new AppErrors_1.UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`);
        const pokeSkill = pokeSkillMap.get(poke.id);
        const pokeBonusData = pokesBonusesMap.get(poke.id);
        alliesTeamData.push({
            name: poke.baseData.name,
            id: poke.id,
            ownerId: poke.ownerId,
            spriteUrl: poke.spriteUrl,
            type1: poke.baseData.type1Name,
            type2: poke.baseData.type2Name,
            level: poke.level,
            maxHp: 4 * poke.hp,
            hp: 4 * poke.hp,
            speed: poke.speed,
            skillPower: pokeSkill[0] ? pokeSkill[0][0] : 2,
            skillName: pokeSkill[0] ? pokeSkill[0][1].name : 'basic-attack',
            skillType: pokeSkill[0] ? pokeSkill[0][1].typeName : 'normal',
            ultimatePower: pokeSkill[1] ? pokeSkill[1][0] : 2,
            ultimateName: pokeSkill[1] ? pokeSkill[1][1].name : 'basic-attack',
            ultimateType: pokeSkill[1] ? pokeSkill[1][1].typeName : 'normal',
            currentSkillPower: pokeSkill[0] ? pokeSkill[0][0] : 2,
            currentSkillName: pokeSkill[0] ? pokeSkill[0][1].name : 'basic-attack',
            currentSkillType: pokeSkill[0] ? pokeSkill[0][1].typeName : 'normal',
            crit: false,
            block: false,
            mana: 0,
            hasUltimate: pokeSkill[0] !== pokeSkill[1],
            manaBonus: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.manaBonus) || 0,
            lifeSteal: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.lifeSteal) || 0,
            critChance: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.critChance) || 0,
            blockChance: (pokeBonusData === null || pokeBonusData === void 0 ? void 0 : pokeBonusData.blockChance) || 0,
        });
    }
    const bossSkills = yield prisma.skill.findMany({
        where: {
            pokemonsLearn: {
                some: {
                    name: boss.baseData.name,
                },
            },
            typeName: {
                in: [boss.baseData.type1Name, boss.baseData.type2Name || boss.baseData.type1Name],
            },
        },
    });
    const bossSkill = bossSkills.reduce((maxSkill, currentSkill) => {
        return currentSkill.attackPower > maxSkill.attackPower ? currentSkill : maxSkill;
    });
    const bossDamageNerf = 0.23 / (7 - alliesTeamData.length);
    const basePower = (((boss.level * 0.4 + 2) * bossSkill.attackPower) / 50 + 2) * 2.5 * 1.1 * 1.5 * bossDamageNerf;
    const bossData = {
        name: boss.baseData.name,
        id: boss.id,
        spriteUrl: boss.spriteUrl,
        type1: boss.baseData.type1Name,
        type2: boss.baseData.type2Name,
        level: boss.level,
        maxHp: 3.2 * alliesTeamData.length * boss.hp,
        hp: 3.2 * alliesTeamData.length * boss.hp,
        speed: boss.speed,
        skillPower: basePower,
        skillName: bossSkill.name,
        skillType: bossSkill.typeName,
        ultimatePower: basePower * 2,
        ultimateName: 'SUPER ' + bossSkill.name,
        ultimateType: bossSkill.typeName,
        currentSkillPower: basePower,
        currentSkillName: bossSkill.name,
        currentSkillType: bossSkill.typeName,
        crit: false,
        block: false,
        mana: 0,
        hasUltimate: true,
        manaBonus: 0,
        lifeSteal: 0,
        critChance: 0,
        blockChance: 0,
    };
    const duelMap = new Map([]);
    let duelFinished = false;
    const isDraw = false;
    let roundCount = 1;
    let winnerTeam = null;
    let loserTeam = null;
    let winnerTeamIndex;
    let loserTeamIndex;
    duelMap.set(1, {
        alliesTeamData,
        bossData,
    });
    const alliesArrayInDuelOrder = alliesTeamData.sort((a, b) => b.speed - a.speed);
    const getAttackEffectivenessMultiplier = (atkType, defType1, defType2) => {
        const effectivenessData = atkEffectivenessMap_1.typeEffectivenessMap.get(atkType);
        const getFactor = (type, efData) => {
            if (efData.effective.includes(type))
                return 2;
            if (efData.ineffective.includes(type))
                return 0.5;
            if (efData.noDamage.includes(type))
                return 'no-damage';
            return 1;
        };
        const factor1 = getFactor(defType1, effectivenessData);
        const factor2 = getFactor(defType2 || 'notype', effectivenessData);
        if (factor1 === 'no-damage' || factor2 === 'no-damage')
            return 0.25;
        return factor1 * factor2;
    };
    const bossAttackPowerMap = new Map([]);
    for (const ally of alliesArrayInDuelOrder) {
        bossAttackPowerMap.set(ally.id, bossData.skillPower * getAttackEffectivenessMultiplier(bossData.skillType, ally.type1, ally.type2));
    }
    while (duelFinished === false) {
        roundCount++;
        const roundStart = (poke) => {
            poke.crit = false;
            poke.block = false;
            poke.mana += 23 * (0.7 + Math.random() * 0.6) + poke.manaBonus;
            if (poke.mana >= 100) {
                poke.mana = 0;
                poke.currentSkillName = poke.ultimateName;
                poke.currentSkillPower = poke.ultimatePower;
                poke.currentSkillType = poke.ultimateType;
            }
            else {
                poke.currentSkillName = poke.skillName;
                poke.currentSkillPower = poke.skillPower;
                poke.currentSkillType = poke.skillType;
            }
            poke.crit = Math.random() + poke.critChance > 0.9;
            poke.block = Math.random() + poke.blockChance > 0.9;
        };
        for (const poke of alliesArrayInDuelOrder)
            roundStart(poke);
        roundStart(bossData);
        const bossDealDamage = () => {
            const target = alliesArrayInDuelOrder[Math.floor(Math.random() * alliesArrayInDuelOrder.length)];
            bossAttackPowerMap.get(target.id);
            if (!target.block) {
                target.hp -= bossData.currentSkillPower * (0.9 + Math.random() * 0.2);
                if (bossData.crit) {
                    target.hp -= bossData.currentSkillPower * (0.9 + Math.random() * 0.2) * 0.5;
                }
            }
            else {
                target.hp -= bossData.currentSkillPower * (0.9 + Math.random() * 0.2) * 0.5;
                if (bossData.crit) {
                    target.hp -= bossData.currentSkillPower * (0.9 + Math.random() * 0.2) * 0.25;
                }
            }
        };
        bossDealDamage();
        const allyDealDamage = (poke, target) => {
            if (!target.block) {
                target.hp -= poke.currentSkillPower * (0.9 + Math.random() * 0.2);
                poke.hp += poke.currentSkillPower * poke.lifeSteal;
            }
            if (poke.crit) {
                if (!target.block) {
                    target.hp -= poke.currentSkillPower * (0.9 + Math.random() * 0.2) * 0.5;
                    poke.hp += poke.currentSkillPower * poke.lifeSteal * 0.5;
                }
            }
        };
        for (const poke of alliesArrayInDuelOrder) {
            if (poke.hp > 0)
                allyDealDamage(poke, bossData);
        }
        if (alliesArrayInDuelOrder.map(poke => poke.hp).every(value => value <= 0)) {
            winnerTeam = [bossData];
            loserTeam = alliesArrayInDuelOrder;
            winnerTeamIndex = 1;
            loserTeamIndex = 0;
            duelFinished = true;
        }
        if (bossData.hp <= 0) {
            winnerTeam = alliesArrayInDuelOrder;
            loserTeam = [bossData];
            winnerTeamIndex = 0;
            loserTeamIndex = 1;
            duelFinished = true;
        }
        const alliesRoundData = [];
        for (const ally of alliesTeamData) {
            alliesRoundData.push(Object.assign({}, ally));
        }
        duelMap.set(roundCount, {
            alliesTeamData: [...alliesRoundData],
            bossData: Object.assign({}, bossData),
        });
        if (roundCount > 120) {
            throw new AppErrors_1.UnexpectedError('Boss battle exceeded 120 rounds.');
        }
    }
    if (!winnerTeam || !loserTeam)
        throw new AppErrors_1.UnexpectedError('Time vencedor/perdedor do duelo não foi determinado');
    if ((winnerTeamIndex !== 1 && winnerTeamIndex !== 0) || (loserTeamIndex !== 1 && loserTeamIndex !== 0)) {
        throw new AppErrors_1.UnexpectedError('Índice do time vencedor/perdedor do duelo não foi determinado');
    }
    const imageGenFunctionMap = new Map([
        [3, iGenDuel3X1Rounds_1.iGenDuel3X1Rounds],
        [2, iGenDuel2X1Rounds_1.iGenDuel2X1Rounds],
    ]);
    const imageGen = imageGenFunctionMap.get(alliesTeamData.length);
    if (!imageGen)
        throw new AppErrors_1.UnexpectedError('Could not get imageGen function for ally count: ' + alliesTeamData.length);
    const imageUrl = yield imageGen({
        duelMap: duelMap,
        roundCount,
        alliesTeam: alliesTeamData,
        boss: bossData,
    });
    return {
        message: `DUELO X2`,
        isDraw: isDraw,
        winnerTeam: winnerTeam,
        loserTeam: loserTeam,
        imageUrl,
    };
});
exports.duelNX1 = duelNX1;
const getBestTypes = (type1, type2) => {
    const efData1 = defEffectivenessMap_1.defEffectivenessMap.get(type1);
    const efData2 = defEffectivenessMap_1.defEffectivenessMap.get(type2 || type1);
    if (!efData1 || !efData2)
        return null;
    const efObj = {
        normal: 0,
        fire: 0,
        water: 0,
        electric: 0,
        grass: 0,
        ice: 0,
        fighting: 0,
        poison: 0,
        ground: 0,
        flying: 0,
        psychic: 0,
        bug: 0,
        rock: 0,
        ghost: 0,
        dragon: 0,
        dark: 0,
        steel: 0,
        fairy: 0,
    };
    const processTypeData = (typeData, modifier) => {
        if (!typeData)
            return;
        for (const type of typeData.effective) {
            efObj[type] += modifier;
        }
        for (const type of typeData.innefective) {
            efObj[type] -= modifier;
        }
        for (const type of typeData.noDamage) {
            efObj[type] -= 100;
        }
    };
    processTypeData(efData1, 1);
    processTypeData(efData2, 1);
    const entries = Object.entries(efObj);
    const entrymap2 = entries
        .filter(entry => {
        return entry[1] === 2 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymap1 = entries
        .filter(entry => {
        return entry[1] === 1 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymap0 = entries
        .filter(entry => {
        return entry[1] === 0 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymapBad = entries
        .filter(entry => {
        return entry[1] === -1 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymapWorse = entries
        .filter(entry => {
        return entry[1] === -2 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    return {
        best: entrymap2,
        good: entrymap1,
        neutral: entrymap0,
        bad: entrymapBad,
        worse: entrymapWorse,
    };
};
const getBestSkills = ({ attacker, defender }) => __awaiter(void 0, void 0, void 0, function* () {
    const efData = yield getBestTypes(defender.baseData.type1Name, defender.baseData.type2Name);
    const skills = attacker.baseData.skills;
    const skillTable = attacker.baseData.skillTable;
    const learnedSkills = [];
    for (const skill of skillTable) {
        const split = skill.split('%');
        if (Number(split[1]) <= attacker.level) {
            learnedSkills.push(split[0]);
        }
    }
    const finalSkillMap = new Map([]);
    for (const skill of skills) {
        const talentCheck = yield verifyTalentPermission(attacker, skill);
        if (!talentCheck.permit) {
            continue;
        }
        const stab = () => {
            if (attacker.type1Name === skill.typeName)
                return 1.1;
            if (attacker.type2Name === skill.typeName)
                return 1.1;
            return 1;
        };
        const adRatio = () => {
            if (skill.isPhysical)
                return attacker.atk / defender.def;
            return attacker.spAtk / defender.spDef;
        };
        const talentBonus = 0.05 * talentCheck.count;
        if (efData.best.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
            const power = (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 2.5 * stab() * (1 + talentBonus);
            finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill]);
            continue;
        }
        if (efData.good.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
            const power = (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 1.75 * stab() * (1 + talentBonus);
            finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill]);
            continue;
        }
        if (efData.neutral.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
            const power = (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 1 * stab() * (1 + talentBonus);
            finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill]);
        }
        if (efData.bad.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
            const power = (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 0.5 * stab() * (1 + talentBonus);
            finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill]);
        }
        if (efData.worse.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
            const power = (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 0.25 * stab() * (1 + talentBonus);
            finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill]);
        }
    }
    return (0, getBestSkillPair_1.getBestSkillPair)(finalSkillMap);
});
const verifyTalentPermission = (poke, skill) => __awaiter(void 0, void 0, void 0, function* () {
    const talents = [
        poke.talentId1,
        poke.talentId2,
        poke.talentId3,
        poke.talentId4,
        poke.talentId5,
        poke.talentId6,
        poke.talentId7,
        poke.talentId8,
        poke.talentId9,
    ];
    const typeId = (0, findKeyByValue_1.findKeyByValue)(talentIdMap_1.talentIdMap, skill.typeName);
    const count = talents.reduce((count, current) => count + (current === typeId ? 1 : 0), 0);
    if (count >= 3 ||
        (count >= 2 && skill.attackPower <= 75) ||
        (count === 1 && skill.attackPower <= 40) ||
        (skill.typeName === 'normal' && skill.attackPower <= 50) ||
        poke.baseData.type1Name === skill.typeName ||
        poke.baseData.type2Name === skill.typeName)
        return {
            permit: true,
            count,
        };
    return {
        permit: false,
        count,
    };
});
//# sourceMappingURL=duelNX1.js.map