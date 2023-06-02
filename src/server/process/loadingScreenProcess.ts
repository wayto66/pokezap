import { logger } from '../../infra/logger'

export const loadingScreenProcess = (percent: string, message: string) => {
  logger.info('LOADING SCREEN', percent, message)
}
