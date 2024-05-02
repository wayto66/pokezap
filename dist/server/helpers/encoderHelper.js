"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEncoder = void 0;
const fs_1 = __importDefault(require("fs"));
const gifencoder_1 = __importDefault(require("gifencoder"));
const initEncoder = (filepath) => {
    const encoder = new gifencoder_1.default(500, 500);
    encoder.createReadStream().pipe(fs_1.default.createWriteStream(filepath));
    encoder.start();
    encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
    encoder.setDelay(200); // Delay between frames in milliseconds
    encoder.setQuality(10); // Image quality (lower is better)
    return encoder;
};
exports.initEncoder = initEncoder;
//# sourceMappingURL=encoderHelper.js.map