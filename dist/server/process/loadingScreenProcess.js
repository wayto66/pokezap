"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadingScreenProcess = void 0;
const logger_1 = require("../../infra/logger");
const loadingScreenProcess = (percent, message) => {
    logger_1.logger.info('LOADING SCREEN', percent, message);
};
exports.loadingScreenProcess = loadingScreenProcess;
//# sourceMappingURL=loadingScreenProcess.js.map