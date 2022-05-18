import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { isDev } from '../../../constants'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger()

  constructor() {
    super()

    if (isDev) {
      this.$on<any>('query', (event) => {
        this.logger.verbose(
          `Query: ${(event as Prisma.QueryEvent).query} - ${
            (event as Prisma.QueryEvent).duration
          }ms`,
        )
      })
    }
  }

  async onModuleInit(): Promise<void> {
    // this.$on<any>('error', (event) => {
    //   this.logger.verbose((event as Prisma.QueryEvent).target)
    // })

    await this.$connect()
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
  }
}
