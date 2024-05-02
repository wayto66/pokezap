import express from 'express'
import 'reflect-metadata'
import { registerFonts } from '../../image-generator/src/helpers/registerFonts'
import { logger } from './infra/logger'
import router from './infra/router'
import { initProcess } from './server/modules/init'

process.on('uncaughtException', error => {
  console.log(error)
  logger.error(error)
})

registerFonts()

const app = express()
app.use(express.json())
app.use(router)

initProcess()

app.listen(4000, async () => {
  logger.info('PokeZap is online!')
})
