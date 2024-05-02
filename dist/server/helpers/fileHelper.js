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
exports.removeFileFromDisk = exports.saveFileOnDisk = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../infra/logger");
const saveFileOnDisk = (canvas2d) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = yield new Promise(resolve => {
        const filename = `../modules/imageGen/images/image-${Math.random()}.png`;
        const filepath = path_1.default.join(__dirname, filename);
        const out = fs_1.default.createWriteStream(filepath);
        const stream = canvas2d.createStream();
        stream.pipe(out);
        out.on('finish', () => {
            logger_1.logger.info('The PNG file was created.');
            resolve(filepath);
        });
    });
    return filepath;
});
exports.saveFileOnDisk = saveFileOnDisk;
const removeFileFromDisk = (filepath, timestamp = 15000) => {
    setTimeout(() => {
        fs_1.default.unlink(filepath, error => {
            if (error) {
                logger_1.logger.error(`Failed to delete file: ${error}`);
            }
            else {
                logger_1.logger.info('File deleted successfully.');
            }
        });
    }, timestamp);
};
exports.removeFileFromDisk = removeFileFromDisk;
//# sourceMappingURL=fileHelper.js.map