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
exports.messageCreateProcess = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const logger_1 = require("../../infra/logger");
const router_1 = require("../../infra/routes/router");
const verifyTargetChat_1 = require("../../server/helpers/verifyTargetChat");
const UserDemandHandler_1 = require("../constants/UserDemandHandler");
const deleteSentMessage_1 = require("../helpers/deleteSentMessage");
const userDemand = new UserDemandHandler_1.UserDemandHandler();
const messageCreateProcess = (msg, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prismaClient = tsyringe_1.container.resolve('PrismaClient');
        const zapClient = tsyringe_1.container.resolve(instanceName);
        const permit = yield (0, verifyTargetChat_1.verifyTargetChat)(msg.to);
        if (!permit)
            return;
        if (msg.body.toUpperCase().includes('POKEZAP.') || msg.body.toUpperCase().includes('PZ.')) {
            const contact = yield msg.getContact();
            if (msg.body.includes('[dsb]'))
                return;
            if (msg.body.includes('[d]'))
                return;
            const getPlayerPhone = () => {
                if (!msg.author)
                    return msg.from;
                const match = msg.author.match(/^(\d+):(\d+)@c\.us$/);
                if (match) {
                    return `${match[1]}@c.us`;
                }
                return msg.author;
            };
            const playerPhone = getPlayerPhone();
            const demand = userDemand.get(playerPhone);
            if (demand && demand >= 3) {
                msg.react('💤');
                return;
            }
            userDemand.add(playerPhone, 1);
            setTimeout(() => userDemand.reduce(playerPhone, 1), 2000);
            const response = yield (0, router_1.router)({
                playerPhone,
                routeParams: msg.body.toUpperCase().split(' '),
                playerName: contact.pushname ? contact.pushname : 'Nome indefinido',
                groupCode: msg.id.remote,
            });
            if (response.react) {
                msg.react(response.react);
                return;
            }
            if (!response.imageUrl) {
                const result = yield msg.reply(response.message);
                if (msg.id.remote.includes('@g.us'))
                    (0, deleteSentMessage_1.deleteSentMessage)(result);
                if (response.actions) {
                    yield prismaClient.message.create({
                        data: {
                            msgId: result.id.id,
                            type: 'default',
                            body: result.body,
                            actions: response.actions,
                        },
                    });
                }
                if (response.afterMessage) {
                    const msgBody = response.afterMessage;
                    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield zapClient.sendMessage(msg.id.remote, msgBody);
                        if (msg.id.remote.includes('@g.us'))
                            (0, deleteSentMessage_1.deleteSentMessage)(result);
                    }), response.afterMessageDelay || 5000);
                }
                return;
            }
            const filePath = response.isAnimated
                ? yield new Promise(resolve => {
                    if (!response.isAnimated)
                        resolve(response.imageUrl);
                    const outputPath = `./src/server/modules/imageGen/images/video-${Math.random().toFixed(5)}`;
                    if (!response.imageUrl)
                        return;
                    (0, fluent_ffmpeg_1.default)(response.imageUrl)
                        .output(outputPath)
                        .noAudio()
                        .on('end', () => {
                        console.log('Conversão concluída!');
                        resolve(outputPath);
                    })
                        .on('error', err => {
                        console.log('Ocorreu um erro durante a conversão:', err);
                    })
                        .run();
                }).catch(err => {
                    logger_1.logger.error(err);
                    return '';
                })
                : response.imageUrl;
            const media = whatsapp_web_js_1.MessageMedia.fromFilePath(filePath);
            const result = yield zapClient.sendMessage(msg.id.remote, response.message, {
                media: media,
            });
            if (msg.id.remote.includes('@g.us'))
                (0, deleteSentMessage_1.deleteSentMessage)(result);
            if (response.actions) {
                yield prismaClient.message.create({
                    data: {
                        msgId: result.id.id,
                        type: 'default',
                        body: result.body,
                        actions: response.actions,
                    },
                });
            }
            if (response.afterMessage) {
                const msgBody = response.afterMessage;
                const chatId = msg.id.remote;
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    const msg = yield zapClient.sendMessage(chatId, msgBody);
                    if (chatId.includes('@g.us'))
                        (0, deleteSentMessage_1.deleteSentMessage)(msg);
                }), response.afterMessageDelay || 5000);
            }
            return;
        }
    }
    catch (e) {
        console.log(e);
        logger_1.logger.error(e);
    }
});
exports.messageCreateProcess = messageCreateProcess;
//# sourceMappingURL=messageCreateProcess.js.map