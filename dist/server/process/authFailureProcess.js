"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authFailureProcess = void 0;
const logger_1 = require("../../infra/logger");
const authFailureProcess = (msg) => {
    logger_1.logger.error('AUTHENTICATION FAILURE', msg);
};
exports.authFailureProcess = authFailureProcess;
//# sourceMappingURL=authFailureProcess.js.map