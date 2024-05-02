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
exports.duelX2 = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const logger_1 = require("../../../infra/logger");
const getBestSkillPairX2_1 = require("../../../server/helpers/getBestSkillPairX2");
const atkEffectivenessMap_1 = require("../../constants/atkEffectivenessMap");
const defEffectivenessMap_1 = require("../../constants/defEffectivenessMap");
const talentIdMap_1 = require("../../constants/talentIdMap");
const findKeyByValue_1 = require("../../helpers/findKeyByValue");
const iGenDuelX2Rounds_1 = require("../imageGen/iGenDuelX2Rounds");
const getTeamBonuses_1 = require("./getTeamBonuses");
const duelX2 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    /// apply team-bonuses to the pokemons
    const poke1 = yield (0, getTeamBonuses_1.getTeamBonuses)({
        poke: data.team1[0],
        team: undefined,
    });
    const poke2 = yield (0, getTeamBonuses_1.getTeamBonuses)({
        poke: data.team1[1],
        team: undefined,
    });
    const poke3 = yield (0, getTeamBonuses_1.getTeamBonuses)({
        poke: data.team2[0],
        team: undefined,
    });
    const poke4 = yield (0, getTeamBonuses_1.getTeamBonuses)({
        poke: data.team2[1],
        team: undefined,
    });
    /// will try to get the best possible skill ///
    const poke1Skill = yield getBestSkills({
        attacker: data.team1[0],
        defenderTeam: data.team2,
    });
    const poke2Skill = yield getBestSkills({
        attacker: data.team1[1],
        defenderTeam: data.team2,
    });
    const poke3Skill = yield getBestSkills({
        attacker: data.team2[0],
        defenderTeam: data.team1,
    });
    const poke4Skill = yield getBestSkills({
        attacker: data.team2[1],
        defenderTeam: data.team1,
    });
    const poke1Data = {
        name: poke1.baseData.name,
        id: poke1.id,
        ownerId: poke1.ownerId,
        spriteUrl: poke1.spriteUrl,
        type1: poke1.baseData.type1Name,
        type2: poke1.baseData.type2Name,
        level: poke1.level,
        maxHp: 4 * poke1.hp,
        hp: 4 * poke1.hp,
        speed: poke1.speed,
        skillPower0: poke1Skill[0] ? poke1Skill[0][0][0] : 2,
        skillPower1: poke1Skill[0] ? poke1Skill[0][0][1] : 2,
        skillName: poke1Skill[0] ? poke1Skill[0][1].name : 'basic-attack',
        skillType: poke1Skill[0] ? poke1Skill[0][1].typeName : 'normal',
        ultimatePower0: poke1Skill[1] ? poke1Skill[1][0][0] : 2,
        ultimatePower1: poke1Skill[1] ? poke1Skill[1][0][1] : 2,
        ultimateName: poke1Skill[1] ? poke1Skill[1][1].name : 'basic-attack',
        ultimateType: poke1Skill[1] ? poke1Skill[1][1].typeName : 'normal',
        currentSkillPower0: poke1Skill[0] ? poke1Skill[0][0][0] : 2,
        currentSkillPower1: poke1Skill[0] ? poke1Skill[0][0][1] : 2,
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
        spriteUrl: poke2.spriteUrl,
        type1: poke2.baseData.type1Name,
        type2: poke2.baseData.type2Name,
        level: poke2.level,
        maxHp: 4 * poke2.hp,
        hp: 4 * poke2.hp,
        speed: poke2.speed,
        skillPower0: poke2Skill[0] ? poke2Skill[0][0][0] : 2,
        skillPower1: poke2Skill[0] ? poke2Skill[0][0][1] : 2,
        skillName: poke2Skill[0] ? poke2Skill[0][1].name : 'basic-attack',
        skillType: poke2Skill[0] ? poke2Skill[0][1].typeName : 'normal',
        ultimatePower0: poke2Skill[1] ? poke2Skill[1][0][0] : 2,
        ultimatePower1: poke2Skill[1] ? poke2Skill[1][0][1] : 2,
        ultimateName: poke2Skill[1] ? poke2Skill[1][1].name : 'basic-attack',
        ultimateType: poke2Skill[1] ? poke2Skill[1][1].typeName : 'normal',
        currentSkillPower0: poke2Skill[0] ? poke2Skill[0][0][0] : 2,
        currentSkillPower1: poke2Skill[0] ? poke2Skill[0][0][1] : 2,
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
    const poke3Data = {
        name: poke3.baseData.name,
        id: poke3.id,
        ownerId: poke3.ownerId,
        spriteUrl: poke3.spriteUrl,
        type1: poke3.baseData.type1Name,
        type2: poke3.baseData.type2Name,
        level: poke3.level,
        maxHp: 4 * poke3.hp,
        hp: 4 * poke3.hp,
        speed: poke3.speed,
        skillPower0: poke3Skill[0] ? poke3Skill[0][0][0] : 2,
        skillPower1: poke3Skill[0] ? poke3Skill[0][0][1] : 2,
        skillName: poke3Skill[0] ? poke3Skill[0][1].name : 'basic-attack',
        skillType: poke3Skill[0] ? poke3Skill[0][1].typeName : 'normal',
        ultimatePower0: poke3Skill[1] ? poke3Skill[1][0][0] : 2,
        ultimatePower1: poke3Skill[1] ? poke3Skill[1][0][1] : 2,
        ultimateName: poke3Skill[1] ? poke3Skill[1][1].name : 'basic-attack',
        ultimateType: poke3Skill[1] ? poke3Skill[1][1].typeName : 'normal',
        currentSkillPower0: poke3Skill[0] ? poke3Skill[0][0][0] : 2,
        currentSkillPower1: poke3Skill[0] ? poke3Skill[0][0][1] : 2,
        currentSkillName: poke3Skill[0] ? poke3Skill[0][1].name : 'basic-attack',
        currentSkillType: poke3Skill[0] ? poke3Skill[0][1].typeName : 'normal',
        crit: false,
        block: false,
        mana: 0,
        hasUltimate: poke3Skill[0] !== poke3Skill[1],
        manaBonus: poke3.manaBonus || 0,
        lifeSteal: poke3.lifeSteal || 0,
        critChance: poke3.critChance || 0,
        blockChance: poke3.blockChance || 0,
    };
    const poke4Data = {
        name: poke4.baseData.name,
        id: poke4.id,
        ownerId: poke4.ownerId,
        spriteUrl: poke4.spriteUrl,
        type1: poke4.baseData.type1Name,
        type2: poke4.baseData.type2Name,
        level: poke4.level,
        maxHp: 4 * poke4.hp,
        hp: 4 * poke4.hp,
        speed: poke4.speed,
        skillPower0: poke4Skill[0] ? poke4Skill[0][0][0] : 2,
        skillPower1: poke4Skill[0] ? poke4Skill[0][0][1] : 2,
        skillName: poke4Skill[0] ? poke4Skill[0][1].name : 'basic-attack',
        skillType: poke4Skill[0] ? poke4Skill[0][1].typeName : 'normal',
        ultimatePower0: poke4Skill[1] ? poke4Skill[1][0][0] : 2,
        ultimatePower1: poke4Skill[1] ? poke4Skill[1][0][1] : 2,
        ultimateName: poke4Skill[1] ? poke4Skill[1][1].name : 'basic-attack',
        ultimateType: poke4Skill[1] ? poke4Skill[1][1].typeName : 'normal',
        currentSkillPower0: poke4Skill[0] ? poke4Skill[0][0][0] : 2,
        currentSkillPower1: poke4Skill[0] ? poke4Skill[0][0][1] : 2,
        currentSkillName: poke4Skill[0] ? poke4Skill[0][1].name : 'basic-attack',
        currentSkillType: poke4Skill[0] ? poke4Skill[0][1].typeName : 'normal',
        crit: false,
        block: false,
        mana: 0,
        hasUltimate: poke4Skill[0] !== poke4Skill[1],
        manaBonus: poke4.manaBonus || 0,
        lifeSteal: poke4.lifeSteal || 0,
        critChance: poke4.critChance || 0,
        blockChance: poke4.blockChance || 0,
    };
    poke1Data.target0 = poke3Data;
    poke1Data.target1 = poke4Data;
    poke2Data.target0 = poke3Data;
    poke2Data.target1 = poke4Data;
    poke3Data.target0 = poke1Data;
    poke3Data.target1 = poke2Data;
    poke4Data.target0 = poke1Data;
    poke4Data.target1 = poke2Data;
    const duelMap = new Map([]);
    let duelFinished = false;
    const isDraw = false;
    let roundCount = 1;
    let winnerTeam = null;
    let loserTeam = null;
    let winnerTeamIndex;
    let loserTeamIndex;
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
        poke3Data: Object.assign({}, poke3Data),
        poke4Data: Object.assign({}, poke4Data),
    });
    const pokemonArrayInDuelOrder = [poke1Data, poke2Data, poke3Data, poke4Data].sort((a, b) => b.speed - a.speed);
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
        roundStart(poke1Data);
        roundStart(poke2Data);
        roundStart(poke3Data);
        roundStart(poke4Data);
        const dealDamage = (poke, target0, target1) => {
            if (!target0.block) {
                target0.hp -= poke.currentSkillPower0 * (0.9 + Math.random() * 0.2);
                poke.hp += poke.currentSkillPower0 * poke.lifeSteal;
            }
            if (!target1.block) {
                target1.hp -= poke.currentSkillPower1 * (0.9 + Math.random() * 0.2);
                poke.hp += poke.currentSkillPower1 * poke.lifeSteal;
            }
            if (poke.crit) {
                if (!target0.block) {
                    target0.hp -= poke.currentSkillPower0 * (0.9 + Math.random() * 0.2) * 0.5;
                    poke.hp += poke.currentSkillPower0 * poke.lifeSteal * 0.5;
                }
                if (!target1.block) {
                    target1.hp -= poke.currentSkillPower1 * (0.9 + Math.random() * 0.2) * 0.5;
                    poke.hp += poke.currentSkillPower1 * poke.lifeSteal * 0.5;
                }
            }
        };
        for (const poke of pokemonArrayInDuelOrder) {
            if (poke.hp > 0)
                dealDamage(poke, poke.target0, poke.target1);
        }
        if (poke1Data.hp <= 0 && poke2Data.hp <= 0) {
            winnerTeam = [poke3Data, poke4Data];
            loserTeam = [poke1Data, poke2Data];
            winnerTeamIndex = 1;
            loserTeamIndex = 0;
            duelFinished = true;
        }
        if (poke3Data.hp <= 0 && poke4Data.hp <= 0) {
            winnerTeam = [poke1Data, poke2Data];
            loserTeam = [poke3Data, poke4Data];
            winnerTeamIndex = 0;
            loserTeamIndex = 1;
            duelFinished = true;
        }
        duelMap.set(roundCount, {
            poke1Data: Object.assign({}, poke1Data),
            poke2Data: Object.assign({}, poke2Data),
            poke3Data: Object.assign({}, poke3Data),
            poke4Data: Object.assign({}, poke4Data),
        });
        if (roundCount > 50) {
            duelFinished = true;
        }
    }
    if (!winnerTeam || !loserTeam)
        throw new AppErrors_1.UnexpectedError('Time vencedor/perdedor do duelo não foi determinado');
    if ((winnerTeamIndex !== 1 && winnerTeamIndex !== 0) || (loserTeamIndex !== 1 && loserTeamIndex !== 0)) {
        throw new AppErrors_1.UnexpectedError('Índice do time vencedor/perdedor do duelo não foi determinado');
    }
    const imageUrl = yield (0, iGenDuelX2Rounds_1.iGenDuelX2Rounds)({
        winnerTeam,
        loserTeam,
        roundCount,
        duelMap,
        winnerDataNames: winnerTeamIndex === 0 ? ['poke1Data', 'poke2Data'] : ['poke3Data', 'poke4Data'],
        loserDataNames: winnerTeamIndex === 1 ? ['poke1Data', 'poke2Data'] : ['poke3Data', 'poke4Data'],
    });
    return {
        message: `DUELO X2`,
        isDraw: isDraw,
        winnerTeam: winnerTeam,
        loserTeam: loserTeam,
        imageUrl,
    };
});
exports.duelX2 = duelX2;
const getBestTypes = (data) => {
    const { defender1Type1, defender2Type1, defender1Type2, defender2Type2 } = data;
    const efData1a = defEffectivenessMap_1.defEffectivenessMap.get(defender1Type1);
    const efData1b = defEffectivenessMap_1.defEffectivenessMap.get(defender1Type2 || defender1Type1);
    const efData2a = defEffectivenessMap_1.defEffectivenessMap.get(defender2Type1);
    const efData2b = defEffectivenessMap_1.defEffectivenessMap.get(defender2Type2 || defender2Type1);
    if (!efData1a || !efData1b || !efData2a || !efData2b) {
        throw new AppErrors_1.UnexpectedError('Não foi possível obter os dados sobre efetividade de golpes.');
    }
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
    const efDataTotal = {
        innefective: [...efData1a.innefective, ...efData1b.innefective, ...efData2a.innefective, ...efData2b.innefective],
        effective: [...efData1a.effective, ...efData1b.effective, ...efData2a.effective, ...efData2b.effective],
        noDamage: [...efData1a.noDamage, ...efData1b.noDamage, ...efData2a.noDamage, ...efData2b.noDamage],
    };
    const processTypeData = (typeData) => {
        if (!typeData)
            return;
        for (const type of typeData.effective) {
            efObj[type] += 1;
        }
        for (const type of typeData.innefective) {
            efObj[type] -= 1;
        }
        for (const type of typeData.noDamage) {
            efObj[type] -= 1000;
        }
    };
    processTypeData(efDataTotal);
    const entries = Object.entries(efObj);
    const entrymap2 = entries
        .filter(entry => {
        return entry[1] > 2 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymap1 = entries
        .filter(entry => {
        return entry[1] >= 0 || entry[1] <= 2 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymap0 = entries
        .filter(entry => {
        return entry[1] === -1 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymapBad = entries
        .filter(entry => {
        return entry[1] === -2 ? entry[0] : [];
    })
        .flat()
        .filter(entry => typeof entry === 'string');
    const entrymapWorse = entries
        .filter(entry => {
        return entry[1] < -2 ? entry[0] : [];
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
const getBestSkills = ({ attacker, defenderTeam }) => __awaiter(void 0, void 0, void 0, function* () {
    const efData = yield getBestTypes({
        defender1Type1: defenderTeam[0].baseData.type1Name,
        defender1Type2: defenderTeam[0].baseData.type2Name,
        defender2Type1: defenderTeam[1].baseData.type1Name,
        defender2Type2: defenderTeam[1].baseData.type2Name,
    });
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
        const adRatio = (defender) => {
            if (skill.isPhysical)
                return attacker.atk / defender.def;
            return attacker.spAtk / defender.spDef;
        };
        const talentBonus = 0.05 * talentCheck.count;
        let effectivenessDamageMultiplier = 10;
        if (efData.best.includes(skill.typeName) && learnedSkills.includes(skill.name))
            effectivenessDamageMultiplier = 2.5;
        if (efData.good.includes(skill.typeName) && learnedSkills.includes(skill.name))
            effectivenessDamageMultiplier = 1.75;
        if (efData.neutral.includes(skill.typeName) && learnedSkills.includes(skill.name))
            effectivenessDamageMultiplier = 1;
        if (efData.bad.includes(skill.typeName) && learnedSkills.includes(skill.name))
            effectivenessDamageMultiplier = 0.5;
        if (efData.worse.includes(skill.typeName) && learnedSkills.includes(skill.name))
            effectivenessDamageMultiplier = 0.25;
        if (effectivenessDamageMultiplier === 10)
            continue;
        const powerAgainstDefender0 = Number(((((attacker.level * 0.4 + 2) * skill.attackPower * adRatio(defenderTeam[0])) / 50 + 2) *
            2.5 *
            stab() *
            (1 + talentBonus)).toFixed(2));
        const powerAgainstDefender1 = Number(((((attacker.level * 0.4 + 2) * skill.attackPower * adRatio(defenderTeam[1])) / 50 + 2) *
            2.5 *
            stab() *
            (1 + talentBonus)).toFixed(2));
        finalSkillMap.set([powerAgainstDefender0, powerAgainstDefender1], skill);
    }
    return (0, getBestSkillPairX2_1.getBestSkillPairX2)(finalSkillMap);
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
//# sourceMappingURL=duelX2.js.map