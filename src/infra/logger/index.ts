import { Logger } from 'tslog'

export const logger = new Logger({
  prettyLogTemplate: '{{yyyy}}-{{mm}}-{{dd}} {{hh}}:{{MM}}:{{ss}}.{{ms}} [{{logLevelName}}] {{filePathWithLine}} - ',
})
