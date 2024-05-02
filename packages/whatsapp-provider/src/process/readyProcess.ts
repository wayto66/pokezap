import axios from 'axios'
import { logger } from '../helpers/logger'


export const readyProcess = async () => {
  logger.info('client ready')

  const response = await axios.get('http://localhost:4001/ready-process')
}
