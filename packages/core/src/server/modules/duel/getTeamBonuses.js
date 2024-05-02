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
exports.getTeamBonuses = void 0;
const getTeamBonuses = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { poke, team } = data;
    const updatedPoke = Object.assign({}, poke);
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('flying') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('dragon'))) {
        updatedPoke.speed = poke.speed * 1.2;
        updatedPoke.crescentBonuses = {
            block: 0.02,
        };
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated wingeon buff.`);
        return updatedPoke;
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('fire') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('ground'))) {
        updatedPoke.critChance = 0.2;
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated volcanic buff.`);
        return updatedPoke;
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('psychic') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('ghost') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('dark'))) {
        updatedPoke.manaBonus = 20;
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated mastermind buff.`);
        return updatedPoke;
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('electric') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('rock') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('steel'))) {
        updatedPoke.def = updatedPoke.def * 1.2;
        updatedPoke.spDef = updatedPoke.def * 1.2;
        // provisory:
        updatedPoke.hp = updatedPoke.hp * 1.2;
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated thunderforge buff.`);
        return updatedPoke;
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('fairy') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('grass'))) {
        updatedPoke.def = updatedPoke.def * 1.2;
        updatedPoke.spDef = updatedPoke.def * 1.2;
        // provisory:
        updatedPoke.hp = updatedPoke.hp * 1.2;
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated wonderleaf buff.`);
        return updatedPoke;
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('poison') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('bug'))) {
        updatedPoke.lifeSteal = 0.2;
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated toxibug buff.`);
        return updatedPoke;
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('normal') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('fighting'))) {
        updatedPoke.lifeSteal = 0.2;
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated toxibug buff.`);
        return updatedPoke;
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('water') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('ice'))) {
        updatedPoke.hp = updatedPoke.hp * 1.2;
        console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated seavell buff.`);
        return updatedPoke;
    }
    return updatedPoke;
});
exports.getTeamBonuses = getTeamBonuses;
