import axios from 'axios'

type Params = {
  chatId: string
  content?: any
  options?: any
  imageUrl?: string
}

type Message = {
  id: {
    id: string
  }
}

export const sendMessage = async (inputData: Params): Promise<Message | undefined> => {
  try {
    const res = await axios.post('http://localhost:4002/send-message', inputData)

    return await res.data
  } catch (e: any) {
    return e.response?.data
  }
}
