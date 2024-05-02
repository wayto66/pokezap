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
exports.messageReactionProcess = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const moment_1 = __importDefault(require("moment"));
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const logger_1 = require("../../infra/logger");
const router_1 = require("../../infra/routes/router");
const reactions_1 = require("../../server/constants/reactions");
const verifyTargetChat_1 = require("../../server/helpers/verifyTargetChat");
const UserDemandHandler_1 = require("../constants/UserDemandHandler");
const deleteSentMessage_1 = require("../helpers/deleteSentMessage");
const userDemand = new UserDemandHandler_1.UserDemandHandler();
const messageReactionProcess = (msg, instanceName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const permit = yield (0, verifyTargetChat_1.verifyTargetChat)(msg.msgId.remote);
        if (!permit)
            return;
        const prismaClient = tsyringe_1.container.resolve('PrismaClient');
        const zapClient = tsyringe_1.container.resolve(instanceName);
        const message = yield prismaClient.message.findFirst({
            where: {
                msgId: msg.msgId.id,
            },
        });
        if (!message)
            return;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const difference = moment_1.default
            .duration(currentTimestamp - Math.floor(new Date(message.createdAt).getTime() / 1000), 'seconds')
            .asMinutes();
        if (difference >= 60) {
            logger_1.logger.info('ignoring old msg. difference: ' + difference.toFixed(2) + 'minutes');
            return;
        }
        const player = yield prismaClient.player.findFirst({
            where: {
                phone: msg.senderId,
            },
        });
        const getRequestedAction = () => {
            var _a;
            for (let i = 0; i < message.actions.length; i++) {
                if (reactions_1.reactions[i].includes(msg.reaction)) {
                    return (_a = message === null || message === void 0 ? void 0 : message.actions[i]) === null || _a === void 0 ? void 0 : _a.toUpperCase().split(' ');
                }
            }
        };
        const routeParams = getRequestedAction();
        if (!routeParams)
            return;
        const startCheck = routeParams[1];
        if (!player) {
            if (startCheck !== 'START' && startCheck !== 'INICIAR' && startCheck !== 'INICIO')
                return;
        }
        if (player) {
            const demand = (_a = userDemand.get(player.phone)) !== null && _a !== void 0 ? _a : 0;
            if (demand >= 4) {
                return;
            }
            userDemand.add(player.phone, 1);
            setTimeout(() => userDemand.reduce(player.phone, 1), 2000);
        }
        const response = yield (0, router_1.router)({
            playerPhone: msg.senderId,
            routeParams: routeParams,
            playerName: (player === null || player === void 0 ? void 0 : player.name) || '',
            groupCode: msg.msgId.remote,
            fromReact: true,
        });
        if (!response)
            return;
        if (!response.imageUrl) {
            const result = yield zapClient.sendMessage(msg.id.remote, response.message);
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
            return;
        }
        const filePath = response.isAnimated
            ? yield new Promise(resolve => {
                if (!response.isAnimated)
                    resolve(response.imageUrl);
                const outputPath = `./src/server/modules/imageGen/images/video-${Math.random().toFixed(5)}.mp4`;
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
            const afterActions = response.afterMessageActions;
            const chatId = msg.id.remote;
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield zapClient.sendMessage(chatId, msgBody);
                if (msg.id.remote.includes('@g.us'))
                    (0, deleteSentMessage_1.deleteSentMessage)(result);
                if (afterActions) {
                    yield prismaClient.message.create({
                        data: {
                            msgId: result.id.id,
                            type: 'default',
                            body: result.body,
                            actions: afterActions,
                        },
                    });
                }
            }), response.afterMessageDelay || 5000);
        }
    }
    catch (e) {
        console.log(e);
        logger_1.logger.error(e);
    }
});
exports.messageReactionProcess = messageReactionProcess;
//# sourceMappingURL=messageReactionProcess.js.map