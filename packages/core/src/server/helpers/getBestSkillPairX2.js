"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestSkillPairX2 = void 0;
function getBestSkillPairX2(map) {
    let ultimatePower0 = 0;
    let ultimatePower1 = 0;
    let ultimateSkill;
    let basicPower0 = 0;
    let basicPower1 = 0;
    let basicSkill;
    for (const [[power0, power1], skill] of map) {
        if (skill.attackPower > 100 && power0 + power1 > ultimatePower0 + ultimatePower1) {
            ultimatePower0 = power0;
            ultimatePower1 = power1;
            ultimateSkill = [[power0, power1], skill];
        }
        if (skill.attackPower < 100 && power0 + power1 > basicPower0 + basicPower1) {
            basicPower0 = power0;
            basicPower1 = power1;
            basicSkill = [[power0, power1], skill];
        }
    }
    if (!ultimateSkill && !basicSkill)
        return [];
    if (!ultimateSkill) {
        ultimateSkill = basicSkill;
    }
    else if (basicSkill && ultimatePower0 + ultimatePower1 < basicPower0 + basicPower1) {
        ultimateSkill = basicSkill;
    }
    return [basicSkill, ultimateSkill];
}
exports.getBestSkillPairX2 = getBestSkillPairX2;
