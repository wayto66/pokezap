import { Request, Response, Router } from 'express'
import { initProcess } from '../../server/modules/init'
import { router } from '../routes/router'

const expressRouter = Router() as any

expressRouter.post('/', async (req: Request, res: Response) => {
  const data = req.body
  const gameResponse = await router(data)
  res.status(200).send(gameResponse)
})

expressRouter.get('/ready-process', initProcess)

export default expressRouter
