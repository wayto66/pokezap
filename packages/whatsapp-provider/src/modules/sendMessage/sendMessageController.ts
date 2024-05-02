import { Request, Response } from 'express'
import { sendMessageUseCase } from './sendMessageUseCase'

export const sendMessageController = async (request: Request, response: Response): Promise<Response> => {
  try {
    const data = request.body
    if (!data) throw new Error('Invalid request')
    const createClientResponse = await sendMessageUseCase(data)

    return response.status(201).json(createClientResponse)
  } catch (error: any) {
    return response.status(400).send(error.message)
  }
}
