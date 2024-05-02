import { logger } from "../helpers/logger"


export const authFailureProcess = (msg: string) => {
  logger.error('AUTHENTICATION FAILURE', msg)
}
