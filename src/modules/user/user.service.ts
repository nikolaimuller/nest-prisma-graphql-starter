import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection'

import { PaginationArgs } from '../common/pagination'
import { OrderDirection } from '../common/order'
import { ErrorCode, OperationResult, Status } from '../common/operation'
import { PrismaService } from '../common/prisma'

import { User, UserConnection } from './user.model'
import { UserFilter, UserOrder, UserOrderField } from './user.dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        email: true,
        role: true,
      },
    })
  }

  async getUsers({
    filter = {},
    orderBy = {
      field: UserOrderField.updatedAt,
      direction: OrderDirection.ASC,
    },
    pagination,
  }: {
    filter?: UserFilter
    orderBy?: UserOrder
    pagination: PaginationArgs
  }): Promise<UserConnection> {
    const where: Prisma.UserWhereInput = {
      ...filter,
    }

    const result = await findManyCursorConnection(
      (args) =>
        this.prisma.user.findMany({
          where,
          orderBy: { [orderBy.field]: orderBy.direction },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            name: true,
            email: true,
            role: true,
          },
          ...args,
        }),
      () =>
        this.prisma.user.count({
          where,
        }),
      pagination,
    )

    return result
  }

  async createUser(data: Prisma.UserCreateInput): Promise<OperationResult<{ user: User }>> {
    try {
      const user = await this.prisma.user.create({
        data,
      })

      return {
        status: Status.Success,
        user,
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log('This user already exists')

          return {
            status: Status.Failed,
            error: {
              code: ErrorCode.ALREADY_EXISTS,
              message: 'This user already exists',
            },
          }
        }
      }

      throw error
    }
  }

  async updateUser(
    userId: string,
    data: Prisma.UserUpdateInput,
  ): Promise<OperationResult<{ user: User }>> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data,
      })

      return {
        status: Status.Success,
        user,
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          console.log('User to update not found')

          return {
            status: Status.Failed,
            error: {
              code: ErrorCode.NOT_FOUND,
              message: 'User to update not found',
            },
          }
        }
      }

      throw error
    }
  }

  async deleteUser(userId: string): Promise<OperationResult<{ user: User }>> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: userId,
        },
      })

      return {
        status: Status.Success,
        user,
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          console.log('User to delete not found')

          return {
            status: Status.Failed,
            error: {
              code: ErrorCode.NOT_FOUND,
              message: 'User to delete not found',
            },
          }
        }
      }

      throw error
    }
  }
}
