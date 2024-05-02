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
exports.register1 = void 0;
const register1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        message: `Muito bom, você já entendeu uma das formas de interagir com o bot do PokeZap!

    Vamos criar seu personagem agora? Me diga se ele será menino ou menina:
    👍 - menino
    ❤ - menina
    `,
        status: 200,
        actions: ['pokezap. iniciar menino', 'pz. iniciar menina'],
        data: null,
    };
});
exports.register1 = register1;
//# sourceMappingURL=register1.js.map