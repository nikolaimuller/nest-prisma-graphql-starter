///<reference types="webpack-env" />
import { createServer } from './server'
import { API_PORT } from './constants'

async function bootstrap(): Promise<void> {
  const app = await createServer()

  await app.listen(API_PORT, () => {
    console.log(`Server listening on port ${API_PORT}`)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
