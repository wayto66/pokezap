import { Logger } from 'tslog'

export const logger = new Logger({
  prettyLogTemplate: '{{hh}}:{{MM}}:{{ss}}.{{ms}} [{{logLevelName}}] {{filePathWithLine}} - ',
})
