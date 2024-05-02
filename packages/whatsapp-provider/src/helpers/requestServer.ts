import axios from 'axios'
import { ServerResponse } from '../../../../common/types/ServerResponse'

type RequestServerParams = {
  playerPhone: string
  routeParams: string[]
  playerName: string
  groupCode: string
  fromReact?: true
}

export const requestServer = async (inputData: RequestServerParams): Promise<ServerResponse> => {
  const response = await axios.post('http://localhost:4000/', inputData)

  if (!response) throw new Error('Sem resposta do servidor.')

  const data = await response.data
  console.log({ data })
  return data as ServerResponse
}
