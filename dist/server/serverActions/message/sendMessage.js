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
exports.sendMessage = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const logger_1 = require("../../../infra/logger");
const sendMessage = (response, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const zapClient = tsyringe_1.container.resolve('ZapClientInstance1');
    if (!response.imageUrl) {
        const result = yield zapClient.sendMessage(chatId, response.message);
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
                yield zapClient.sendMessage(chatId, msgBody);
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
    const result = yield zapClient.sendMessage(chatId, response.message, {
        media: media,
    });
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
            yield zapClient.sendMessage(chatId, msgBody);
        }), response.afterMessageDelay || 5000);
    }
});
exports.sendMessage = sendMessage;
//# sourceMappingURL=sendMessage.js.map