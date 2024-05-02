"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfSkillIsSupportSkill = exports.checkIfSkillIsTankerSkill = exports.getBestSkillSet = void 0;
const atkEffectivenessMap_1 = require("../constants/atkEffectivenessMap");
function getBestSkillSet(pokemonSkillMap, attacker, defenderTeam) {
    const damageSkillsFinalMap = new Map([]);
    for (const [power, skill] of pokemonSkillMap) {
        if (power <= 0)
            continue;
        const defenderNameXSkillPowerMap = new Map([]);
        for (const defender of defenderTeam) {
            const skillPower = calculateDamageAgainstPokemonX(attacker, defender, Object.assign(Object.assign({}, skill), { preProcessedPower: power }));
            defenderNameXSkillPowerMap.set(defender.baseData.name, skillPower);
        }
        damageSkillsFinalMap.set(skill, defenderNameXSkillPowerMap);
    }
    const tankerSkills = [];
    for (const [power, skill] of pokemonSkillMap) {
        if (!(0, exports.checkIfSkillIsTankerSkill)(skill))
            continue;
        tankerSkills.push(skill);
    }
    const supportSkills = [];
    for (const [power, skill] of pokemonSkillMap) {
        if (!(0, exports.checkIfSkillIsSupportSkill)(skill))
            continue;
        supportSkills.push(skill);
    }
    return {
        damageSkills: damageSkillsFinalMap,
        supportSkills,
        tankerSkills,
    };
}
exports.getBestSkillSet = getBestSkillSet;
const calculateDamageAgainstPokemonX = (attacker, defender, skill) => {
    const efMultiplier = getAttackEffectivenessMultiplier(skill.typeName, defender.baseData.type1Name, defender.baseData.type2Name);
    const processedAttackPower = (((attacker.level * 0.4 + 2) * skill.preProcessedPower) / 50 + 2) * efMultiplier;
    return processedAttackPower;
};
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
const checkIfSkillIsTankerSkill = (skill) => {
    if (['defense', 'special-defense'].includes(skill.statChangeName))
        return true;
    if (skill.category === 'net-good-stats' && skill.target === 'user' && skill.statChangeName === 'evasion')
        return true;
    if (['damage+heal'].includes(skill.category))
        return true;
    return false;
};
exports.checkIfSkillIsTankerSkill = checkIfSkillIsTankerSkill;
const checkIfSkillIsSupportSkill = (skill) => {
    if (skill.category === 'net-good-stats' && ['selected-pokemon', 'user-and-allies', 'ally'].includes(skill.target))
        return true;
    if (['heal'].includes(skill.category))
        return true;
    return false;
};
exports.checkIfSkillIsSupportSkill = checkIfSkillIsSupportSkill;
