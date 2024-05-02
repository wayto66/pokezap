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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillEnhanceSeed = void 0;
const tsyringe_1 = require("tsyringe");
const node_fetch_1 = __importDefault(require("node-fetch"));
function skillEnhanceSeed() {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = tsyringe_1.container.resolve('PrismaClient');
        const baseUrl = 'https://pokeapi.co/api/v2';
        const endpoint = '/move/';
        // Fetch data for the first 151 Pokemon
        const limit = 920;
        const url = `${baseUrl}${endpoint}?limit=${limit}`;
        (0, node_fetch_1.default)(url)
            .then(response => response.json())
            .then((data) => __awaiter(this, void 0, void 0, function* () {
            // Map each Pokemon to a new object with name and types properties
            const moveData = data.results.map((move) => ({
                name: move.name,
            }));
            // Fetch additional data for each Pokemon and add types to the objects
            const skillsData = yield Promise.all(moveData.map((move) => {
                console.log('fetching: ' + move.name);
                const url = `${baseUrl}${endpoint}${move.name}`;
                return (0, node_fetch_1.default)(url)
                    .then(response => response.json())
                    .then(data => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                    move.id = data.id;
                    move.type = data.type.name;
                    move.target = data.target.name;
                    move.pp = (_a = data.pp) !== null && _a !== void 0 ? _a : 10;
                    move.class = data.damage_class.name;
                    move.power = data.power;
                    move.accuracy = (_b = data.accuracy) !== null && _b !== void 0 ? _b : 100;
                    move.statChangeName = (_e = (_d = (_c = data.stat_changes[0]) === null || _c === void 0 ? void 0 : _c.stat) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : 'none';
                    move.statChangeAmount = (_g = (_f = data.stat_changes[0]) === null || _f === void 0 ? void 0 : _f.change) !== null && _g !== void 0 ? _g : 0;
                    move.ailment = (_k = (_j = (_h = data.meta) === null || _h === void 0 ? void 0 : _h.ailment) === null || _j === void 0 ? void 0 : _j.name) !== null && _k !== void 0 ? _k : 'none';
                    move.ailmentChance = (_l = data.meta) === null || _l === void 0 ? void 0 : _l.ailment_chance;
                    move.drain = (_m = data.meta) === null || _m === void 0 ? void 0 : _m.drain;
                    move.healing = (_o = data.meta) === null || _o === void 0 ? void 0 : _o.healing;
                    move.category = (_p = data.meta) === null || _p === void 0 ? void 0 : _p.category.name;
                    move.description = (_r = (_q = data.effect_entries[0]) === null || _q === void 0 ? void 0 : _q.short_effect) !== null && _r !== void 0 ? _r : 'description not available';
                    return move;
                });
            }));
            const prismaOperations = [];
            console.log('fetch done');
            skillsData.map(skill => {
                const operation = prisma.skill.update({
                    where: {
                        name: skill.name,
                    },
                    data: {
                        target: skill.target,
                        pp: skill.pp,
                        accuracy: skill.accuracy,
                        statChangeAmount: skill.statChangeAmount,
                        statChangeName: skill.statChangeName,
                        drain: skill.drain,
                        healing: skill.healing,
                        ailment: skill.ailment,
                        ailmentChance: skill.ailmentChance,
                        category: skill.category,
                        description: skill.description,
                        class: skill.class,
                    },
                });
                prismaOperations.push(operation);
            });
            yield Promise.all(prismaOperations);
            console.log('done');
        }));
    });
}
exports.skillEnhanceSeed = skillEnhanceSeed;
