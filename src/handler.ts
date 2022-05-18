import { IncomingMessage, ServerResponse } from 'http'

import { createServer } from './server'

const handler = async (req: IncomingMessage, res: ServerResponse): Promise<any> => {
  const app = await createServer()
  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()

  return expressApp(req, res)
}

export default handler
