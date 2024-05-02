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
exports.duelX1 = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const logger_1 = require("../../../infra/logger");
const atkEffectivenessMap_1 = require("../../../server/constants/atkEffectivenessMap");
const talentIdMap_1 = require("../../../server/constants/talentIdMap");
const findKeyByValue_1 = require("../../../server/helpers/findKeyByValue");
const defEffectivenessMap_1 = require("../../constants/defEffectivenessMap");
const getBestSkillPair_1 = require("../../helpers/getBestSkillPair");
const iGenDuelRound_1 = require("../imageGen/iGenDuelRound");
const iGenWildPokemonBattle_1 = require("../imageGen/iGenWildPokemonBattle");
const getTeamBonuses_1 = require("./getTeamBonuses");
const duelX1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    /// apply team-bonuses to the pokemons
    const poke1 = yield (0, getTeamBonuses_1.getTeamBonuses)({
        poke: data.poke1,
        team: undefined,
    });
    const poke2 = yield (0, getTeamBonuses_1.getTeamBonuses)({
        poke: data.poke2,
        team: undefined,
    });
    /// will try to get the best possible skill ///
    const poke1Skill = yield getBestSkills({
        attacker: poke1,
        defender: poke2,
    });
    const poke2Skill = yield getBestSkills({
        attacker: poke2,
        defender: poke1,
    });
    const poke1Data = {
        name: poke1.baseData.name,
        id: poke1.id,
        ownerId: poke1.ownerId,
        type1: poke1.baseData.type1Name,
        type2: poke1.baseData.type2Name,
        level: poke1.level,
        maxHp: 4 * poke1.hp,
        hp: 4 * poke1.hp,
        speed: poke1.speed,
        skillPower: poke1Skill[0] ? poke1Skill[0][0] : 2,
        skillName: poke1Skill[0] ? poke1Skill[0][1].name : 'basic-attack',
        skillType: poke1Skill[0] ? poke1Skill[0][1].typeName : 'normal',
        ultimatePower: poke1Skill[1] ? poke1Skill[1][0] : 2,
        ultimateName: poke1Skill[1] ? poke1Skill[1][1].name : 'basic-attack',
        ultimateType: poke1Skill[1] ? poke1Skill[1][1].typeName : 'normal',
        currentSkillPower: poke1Skill[0] ? poke1Skill[0][0] : 2,
        currentSkillName: poke1Skill[0] ? poke1Skill[0][1].name : 'basic-attack',
        currentSkillType: poke1Skill[0] ? poke1Skill[0][1].typeName : 'normal',
        crit: false,
        block: false,
        mana: 0,
        hasUltimate: poke1Skill[0] !== poke1Skill[1],
        manaBonus: poke1.manaBonus || 0,
        lifeSteal: poke1.lifeSteal || 0,
        critChance: poke1.critChance || 0,
        blockChance: poke1.blockChance || 0,
    };
    const poke2Data = {
        name: poke2.baseData.name,
        id: poke2.id,
        ownerId: poke2.ownerId,
        type1: poke2.baseData.type1Name,
        type2: poke2.baseData.type2Name,
        level: poke2.level,
        maxHp: 4 * poke2.hp,
        hp: 4 * poke2.hp,
        speed: poke2.speed,
        skillPower: poke2Skill[0] ? poke2Skill[0][0] : 2,
        skillName: poke2Skill[0] ? poke2Skill[0][1].name : 'basic-attack',
        skillType: poke2Skill[0] ? poke2Skill[0][1].typeName : 'normal',
        ultimatePower: poke2Skill[1] ? poke2Skill[1][0] : 2,
        ultimateName: poke2Skill[1] ? poke2Skill[1][1].name : 'basic-attack',
        ultimateType: poke2Skill[1] ? poke2Skill[1][1].typeName : 'normal',
        currentSkillPower: poke2Skill[0] ? poke2Skill[0][0] : 2,
        currentSkillName: poke2Skill[0] ? poke2Skill[0][1].name : 'basic-attack',
        currentSkillType: poke2Skill[0] ? poke2Skill[0][1].typeName : 'normal',
        crit: false,
        block: false,
        mana: 0,
        hasUltimate: poke2Skill[0] !== poke2Skill[1],
        manaBonus: poke2.manaBonus || 0,
        lifeSteal: poke2.lifeSteal || 0,
        critChance: poke2.critChance || 0,
        blockChance: poke2.blockChance || 0,
    };
    const duelMap = new Map([]);
    let duelFinished = false;
    const isDraw = false;
    let roundCount = 1;
    let winner = null;
    let loser = null;
    const duelLogs = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if ((((_a = atkEffectivenessMap_1.typeEffectivenessMap.get(poke1Data.skillType)) === null || _a === void 0 ? void 0 : _a.effective.includes(poke2Data.type1)) &&
            poke1Data.skillType !== poke1Data.type1 &&
            poke1Data.skillType !== poke2Data.type2) ||
            (((_b = atkEffectivenessMap_1.typeEffectivenessMap.get(poke1Data.skillType)) === null || _b === void 0 ? void 0 : _b.effective.includes(poke2Data.type2 || 'null')) &&
                poke1Data.skillType !== poke1Data.type1 &&
                poke1Data.skillType !== poke2Data.type2)) {
            logger_1.logger.info(`PREPARAÇÃO: ${poke1Data.name} utiliza seus talentos do tipo ${poke1Data.skillType} para conseguir utilizar ${poke1Data.skillName}. Efetivo contra ${poke2Data.name}`);
        }
        if ((((_c = atkEffectivenessMap_1.typeEffectivenessMap.get(poke2Data.skillType)) === null || _c === void 0 ? void 0 : _c.effective.includes(poke1Data.type1)) &&
            poke2Data.skillType !== poke2Data.type1 &&
            poke2Data.skillType !== poke1Data.type2) ||
            (((_d = atkEffectivenessMap_1.typeEffectivenessMap.get(poke2Data.skillType)) === null || _d === void 0 ? void 0 : _d.effective.includes(poke1Data.type2 || 'null')) &&
                poke2Data.skillType !== poke2Data.type1 &&
                poke1Data.skillType !== poke1Data.type2)) {
            logger_1.logger.info(`PREPARAÇÃO: ${poke2Data.name} utiliza seus talentos do tipo ${poke2Data.skillType} para conseguir utilizar ${poke2Data.skillName}. Efetivo contra ${poke1Data.name}`);
        }
        if (((_e = atkEffectivenessMap_1.typeEffectivenessMap.get(poke1Data.skillType)) === null || _e === void 0 ? void 0 : _e.ineffective.includes(poke2Data.type1)) ||
            ((_f = atkEffectivenessMap_1.typeEffectivenessMap.get(poke1Data.skillType)) === null || _f === void 0 ? void 0 : _f.ineffective.includes(poke2Data.type2 || 'null'))) {
            logger_1.logger.info(`PREPARAÇÃO: ${poke1Data.name} entra em batalha com ${poke1Data.skillName} do tipo ${poke1Data.skillType}. Inefetivo contra ${poke2Data.name}`);
        }
        if (((_g = atkEffectivenessMap_1.typeEffectivenessMap.get(poke2Data.skillType)) === null || _g === void 0 ? void 0 : _g.ineffective.includes(poke1Data.type1)) ||
            ((_h = atkEffectivenessMap_1.typeEffectivenessMap.get(poke2Data.skillType)) === null || _h === void 0 ? void 0 : _h.ineffective.includes(poke1Data.type2 || 'null'))) {
            logger_1.logger.info(`PREPARAÇÃO: ${poke2Data.name} entra em batalha com ${poke2Data.skillName} do tipo ${poke2Data.skillType}. Inefetivo contra ${poke1Data.name}`);
        }
        logger_1.logger.info(`---- 
    ${poke1Data.name.toUpperCase()} com ${poke1Data.skillName} do tipo ${poke1Data.skillType} e ${poke1Data.skillPower} de poder
    *** VERSUS ***
    ${poke2Data.name.toUpperCase()} com ${poke2Data.skillName} do tipo ${poke2Data.skillType} e ${poke2Data.skillPower} de poder
    ----`);
        logger_1.logger.info(`---- INICIO DO DUELO ----`);
    };
    duelLogs();
    duelMap.set(1, {
        poke1Data: Object.assign({}, poke1Data),
        poke2Data: Object.assign({}, poke2Data),
    });
    while (duelFinished === false) {
        roundCount++;
        logger_1.logger.info(`Início do round ${roundCount}: ${poke1Data.name} com ${poke1Data.hp}hp VS ${poke2Data.name} com ${poke2Data.hp}hp`);
        poke1Data.crit = false;
        poke2Data.crit = false;
        poke1Data.block = false;
        poke2Data.block = false;
        poke1Data.mana += 23 * (0.7 + Math.random() * 0.6) + poke1Data.manaBonus;
        poke2Data.mana += 23 * (0.7 + Math.random() * 0.6) + poke2Data.manaBonus;
        if (poke1Data.mana >= 100) {
            poke1Data.mana = 0;
            poke1Data.currentSkillName = poke1Data.ultimateName;
            poke1Data.currentSkillPower = poke1Data.ultimatePower;
            poke1Data.currentSkillType = poke1Data.ultimateType;
        }
        else {
            poke1Data.currentSkillName = poke1Data.skillName;
            poke1Data.currentSkillPower = poke1Data.skillPower;
            poke1Data.currentSkillType = poke1Data.skillType;
        }
        if (poke2Data.mana >= 100) {
            poke2Data.mana = 0;
            poke2Data.currentSkillName = poke2Data.ultimateName;
            poke2Data.currentSkillPower = poke2Data.ultimatePower;
            poke2Data.currentSkillType = poke2Data.ultimateType;
        }
        else {
            poke2Data.currentSkillName = poke2Data.skillName;
            poke2Data.currentSkillPower = poke2Data.skillPower;
            poke2Data.currentSkillType = poke2Data.skillType;
        }
        const isCrit1 = Math.random() + poke1Data.critChance > 0.9;
        const isCrit2 = Math.random() + poke2Data.critChance > 0.9;
        const isBlock1 = Math.random() + poke1Data.blockChance > 0.9;
        const isBlock2 = Math.random() + poke1Data.blockChance > 0.9;
        if (isCrit1)
            poke1Data.crit = true;
        if (isCrit2)
            poke2Data.crit = true;
        if (isBlock1)
            poke1Data.block = true;
        if (isBlock2)
            poke2Data.block = true;
        if (poke1Data.speed < poke2Data.speed) {
            if (!isBlock1) {
                poke1Data.hp -= poke2Data.currentSkillPower * (0.9 + Math.random() * 0.2);
                poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal;
            }
            if (isCrit2) {
                if (!isBlock1) {
                    poke1Data.hp -= poke2Data.currentSkillPower * 0.5;
                    poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal * 0.5;
                }
            }
            if (poke1Data.hp <= 0) {
                winner = poke2Data;
                loser = poke1Data;
                duelFinished = true;
            }
            if (!isBlock2) {
                poke2Data.hp -= poke1Data.currentSkillPower * (0.9 + Math.random() * 0.2);
                poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal;
            }
            if (isCrit1) {
                if (!isBlock2) {
                    poke2Data.hp -= poke1Data.currentSkillPower * 0.5;
                    poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal * 0.5;
                }
            }
            if (poke2Data.hp <= 0) {
                winner = poke1Data;
                loser = poke2Data;
                duelFinished = true;
            }
            if (roundCount > 60) {
                throw new AppErrors_1.UnexpectedError('O duelo passou do limite de 60 rounds.');
            }
        }
        else {
            if (!isBlock2) {
                poke2Data.hp -= poke1Data.currentSkillPower * (0.9 + Math.random() * 0.2);
                poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal;
            }
            if (isCrit1) {
                if (!isBlock2) {
                    poke2Data.hp -= poke1Data.currentSkillPower * 0.5;
                    poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal * 0.5;
                }
            }
            if (poke2Data.hp <= 0) {
                winner = poke1Data;
                loser = poke2Data;
                duelFinished = true;
            }
            if (!isBlock1) {
                poke1Data.hp -= poke2Data.currentSkillPower * (0.9 + Math.random() * 0.2);
                poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal;
            }
            if (isCrit2) {
                if (!isBlock1) {
                    poke1Data.hp -= poke2Data.currentSkillPower * 0.5;
                    poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal;
                }
            }
            if (poke1Data.hp <= 0) {
                winner = poke2Data;
                loser = poke1Data;
                duelFinished = true;
            }
            if (roundCount > 60) {
                throw new AppErrors_1.UnexpectedError('Duelo passou do limite de 60 rounds.');
            }
        }
        duelMap.set(roundCount, {
            poke1Data: Object.assign({}, poke1Data),
            poke2Data: Object.assign({}, poke2Data),
        });
    }
    const winnerPokemon = poke1.id === winner.id
        ? Object.assign(Object.assign({}, poke1), { skillName: poke1Data.skillName, skillType: poke1Data.skillType, ultimateType: poke1Data.ultimateType }) : Object.assign(Object.assign({}, poke2), { skillName: poke2Data.skillName, skillType: poke2Data.skillType, ultimateType: poke2Data.ultimateType });
    const loserPokemon = poke1.id === loser.id
        ? Object.assign(Object.assign({}, poke1), { skillName: poke1Data.skillName, skillType: poke1Data.skillType, ultimateType: poke1Data.ultimateType }) : Object.assign(Object.assign({}, poke2), { skillName: poke2Data.skillName, skillType: poke2Data.skillType, ultimateType: poke2Data.ultimateType });
    const imageUrl = data.againstWildPokemon
        ? yield (0, iGenWildPokemonBattle_1.iGenWildPokemonBattle)({
            winnerPokemon,
            loserPokemon,
            roundCount,
            duelMap,
            winnerDataName: poke1.id === winner.id ? 'poke1Data' : 'poke2Data',
            loserDataName: poke1.id === loser.id ? 'poke1Data' : 'poke2Data',
        })
        : yield (0, iGenDuelRound_1.iGenDuelRound)({
            winnerPokemon,
            loserPokemon,
            roundCount,
            duelMap,
            winnerDataName: poke1.id === winner.id ? 'poke1Data' : 'poke2Data',
            loserDataName: poke1.id === loser.id ? 'poke1Data' : 'poke2Data',
        });
    return {
        message: `${winner.name} derrota ${loser.name} no round ${roundCount} utilizando ${winner.skillName}`,
        isDraw: isDraw,
        winner: winner,
        loser: winner === poke1Data ? poke2Data : poke1Data,
        imageUrl,
    };
});
exports.duelX1 = duelX1;
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
            efObj[type] -= 100 * modifier;
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
//# sourceMappingURL=duelX1.js.map