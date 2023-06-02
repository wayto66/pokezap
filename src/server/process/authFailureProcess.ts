import { logger } from 'infra/logger'

export const authFailureProcess = (msg: string) => {
  logger.error('AUTHENTICATION FAILURE', msg)
}
