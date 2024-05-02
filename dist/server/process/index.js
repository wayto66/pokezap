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
exports.handleAllProcess = void 0;
const authFailureProcess_1 = require("./authFailureProcess");
const loadingScreenProcess_1 = require("./loadingScreenProcess");
const messageCreateProcess_1 = require("./messageCreateProcess");
const messageReactionProcess_1 = require("./messageReactionProcess");
const qrCodeProcess_1 = require("./qrCodeProcess");
const readyProcess_1 = require("./readyProcess");
const handleAllProcess = (client, instanceName) => {
    client.initialize();
    client.on('loading_screen', loadingScreenProcess_1.loadingScreenProcess);
    client.on('qr', qr => (0, qrCodeProcess_1.qrCodeProcess)(qr, instanceName));
    client.on('auth_failure', authFailureProcess_1.authFailureProcess);
    client.on('ready', () => (0, readyProcess_1.readyProcess)(instanceName));
    client.on('message_reaction', (msg) => __awaiter(void 0, void 0, void 0, function* () { return (0, messageReactionProcess_1.messageReactionProcess)(msg, instanceName); }));
    client.on('message_create', (msg) => __awaiter(void 0, void 0, void 0, function* () { return (0, messageCreateProcess_1.messageCreateProcess)(msg, instanceName); }));
};
exports.handleAllProcess = handleAllProcess;
//# sourceMappingURL=index.js.map