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
exports.newUser2 = void 0;
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const iGenAvatarChoose_1 = require("../../../../server/modules/imageGen/iGenAvatarChoose");
const newUser3_1 = require("./newUser3");
const newUser2 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , gender, spriteNumber] = data.routeParams;
    if (spriteNumber) {
        if (Number(spriteNumber) <= 16) {
            return yield (0, newUser3_1.newUser3)(data);
        }
        throw new AppErrors_1.InvalidSpriteError();
    }
    if (gender === 'MENINO') {
        return {
            message: `Certo! Agora escolha seu avatar! [dsb]
      
      (diga: pz. start menino numero-do-avatar)`,
            status: 200,
            imageUrl: yield (0, iGenAvatarChoose_1.iGenAvatarChoose)({ genre: 'male' }),
            data: null,
        };
    }
    if (gender === 'MENINA') {
        return {
            message: `Certo! Agora escolha seu avatar! [dsb]
      
      (diga: pz. start menina numero-do-avatar)`,
            status: 200,
            imageUrl: yield (0, iGenAvatarChoose_1.iGenAvatarChoose)({ genre: 'female' }),
            data: null,
        };
    }
    return {
        message: `ERRO: Gênero "${gender}" não encontrado. Utilize: 'menino' ou 'menina'.`,
        status: 400,
        imageUrl: yield (0, iGenAvatarChoose_1.iGenAvatarChoose)({ genre: 'female' }),
        data: null,
    };
});
exports.newUser2 = newUser2;
//# sourceMappingURL=newUser2.js.map