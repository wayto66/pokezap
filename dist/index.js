'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const client_1 = require('@prisma/client')
const console_1 = __importDefault(require('console'))
const express_1 = __importDefault(require('express'))
const ffmpeg_static_1 = __importDefault(require('ffmpeg-static'))
require('reflect-metadata')
const tsyringe_1 = require('tsyringe')
const whatsapp_web_js_1 = require('whatsapp-web.js')
const logger_1 = require('./infra/logger')
const router_1 = require('./infra/routes/router')
const registerFonts_1 = require('./server/helpers/registerFonts')
const process_1 = require('./server/process')
process.on('uncaughtException', error => {
  console_1.default.log(error)
  logger_1.logger.error(error)
})
;(0, registerFonts_1.registerFonts)()
const prismaClient = new client_1.PrismaClient()
tsyringe_1.container.registerInstance('PrismaClient', prismaClient)
const app = (0, express_1.default)()
app.get('/', () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, router_1.router)({
      routeParams: ['PZ.', 'DUEL', 'ACCEPTX2', '147'],
      groupCode: '120363158210566822@g.us',
      playerName: 'test',
      fromReact: true,
      playerPhone: '5516988675837@c.us',
    })
    logger_1.logger.info(response)
  })
)
app.listen(4000, () =>
  __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('pokezap is online!')
  })
)
const enableZap = true
if (enableZap) {
  const client = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth({ clientId: 'ZapClientInstance1' }),
    puppeteer: {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    },
    ffmpegPath: ffmpeg_static_1.default !== null && ffmpeg_static_1.default !== void 0 ? ffmpeg_static_1.default : '',
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    },
  })
  tsyringe_1.container.registerInstance('ZapClientInstance1', client)
  ;(0, process_1.handleAllProcess)(client, 'ZapClientInstance1')
  logger_1.logger.info('client1 is online!')
}
//# sourceMappingURL=index.js.map
