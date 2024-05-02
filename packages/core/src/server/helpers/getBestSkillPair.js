"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestSkillPair = void 0;
function getBestSkillPair(map) {
    let ultimatePower;
    let ultimateSkill;
    let basicPower;
    let basicSkill;
    for (const [power, skills] of map) {
        const currentSkill = skills[0];
        if (currentSkill.attackPower > 100 && (!ultimatePower || power > ultimatePower)) {
            ultimatePower = power;
            ultimateSkill = [power, skills[0]];
        }
        if (currentSkill.attackPower < 100 && (!basicPower || power > basicPower)) {
            basicPower = power;
            basicSkill = [power, currentSkill];
        }
    }
    if (!ultimateSkill && !basicSkill)
        return [];
    if (!ultimateSkill) {
        ultimateSkill = basicSkill;
    }
    else if (basicSkill && ultimateSkill[0] < basicSkill[0]) {
        ultimateSkill = basicSkill;
    }
    return [basicSkill, ultimateSkill];
}
exports.getBestSkillPair = getBestSkillPair;
