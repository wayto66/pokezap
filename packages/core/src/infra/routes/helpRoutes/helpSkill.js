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
exports.helpSkill = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../errors/AppErrors");
const helpSkill = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , skillNameUppercase] = data.routeParams;
    if (!skillNameUppercase)
        throw new AppErrors_1.MissingParameterError('Nome da skill');
    const skillName = skillNameUppercase.toLowerCase();
    const skill = yield src_1.default.skill.findFirst({
        where: {
            name: skillName,
        },
    });
    if (!skill)
        throw new AppErrors_1.SkillNotFoundError(skillName);
    return {
        message: `Informações da skill: *${skill.name.toUpperCase()}*: \n\nPOWER: ${skill.attackPower} -------- ACURACCY: ${skill.accuracy} \nPP: ${skill.pp} -------- TIPO: ${skill.typeName}\nCLASSE: ${skill.class} -------- CATEGORIA: ${skill.category} \n\n ${skill.description}`,
        status: 200,
        data: null,
    };
});
exports.helpSkill = helpSkill;
