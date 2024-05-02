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
exports.deleteSentMessage = void 0;
const logger_1 = require("../../infra/logger");
const deleteSentMessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    setTimeout(() => {
        try {
            msg.delete(true);
        }
        catch (e) {
            logger_1.logger.error(e);
        }
    }, 30 * 1000 * 60);
});
exports.deleteSentMessage = deleteSentMessage;
//# sourceMappingURL=deleteSentMessage.js.map