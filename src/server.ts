import { NestFactory } from '@nestjs/core'
import { INestApplication } from '@nestjs/common'

import { AppModule } from './app.module'

export const createServer = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule)

  return app
}
