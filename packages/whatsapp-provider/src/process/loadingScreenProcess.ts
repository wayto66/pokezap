import { logger } from "../helpers/logger"


export const loadingScreenProcess = (percent: string, message: string) => {
  logger.info('LOADING SCREEN', percent, message)
}
