import path from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

import { ConfigModule } from './modules/common/config'
import { PrismaModule } from './modules/common/prisma'
import { UserModule } from './modules/user'

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'schema.gql'),
      debug: false,
    }),

    UserModule,
  ],
})
export class AppModule {}
