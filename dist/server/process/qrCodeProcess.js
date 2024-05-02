"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrCodeProcess = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const logger_1 = require("../../infra/logger");
const qrCodeProcess = (qrCodeString, instanceName) => {
    logger_1.logger.info('starting qrCodeProcess');
    const name = `qrCodes/qrcode-${instanceName}.png`;
    qrcode_1.default.toFile(name, qrCodeString, err => {
        if (err) {
            logger_1.logger.error(err);
            return;
        }
        logger_1.logger.info('QR code image generated successfully. name: ' + name);
    });
};
exports.qrCodeProcess = qrCodeProcess;
//# sourceMappingURL=qrCodeProcess.js.map