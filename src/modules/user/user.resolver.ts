import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PaginationArgs } from '../common/pagination'

import { User, UserConnection } from './user.model'
import {
  CreateUserInput,
  CreateUserResult,
  DeleteUserResult,
  UpdateUserInput,
  UpdateUserResult,
  UserFilter,
  UserOrder,
} from './user.dto'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user', nullable: true })
  async getUserById(@Args('userId') userId: string): Promise<User | null> {
    return this.userService.getUserById(userId)
  }

  @Query(() => UserConnection, { name: 'users' })
  async users(
    @Args()
    pagination: PaginationArgs,

    @Args('orderBy', {
      type: () => UserOrder,
      nullable: true,
    })
    orderBy: UserOrder,

    @Args('filter', {
      type: () => UserFilter,
      nullable: true,
    })
    filter?: UserFilter,
  ): Promise<UserConnection> {
    return this.userService.getUsers({ pagination, orderBy, filter })
  }

  @Mutation(() => CreateUserResult, { name: 'createUser' })
  async createUser(@Args('data') input: CreateUserInput): Promise<typeof CreateUserResult> {
    return this.userService.createUser(input)
  }

  @Mutation(() => UpdateUserResult, { name: 'updateUser' })
  async updateUser(
    @Args('userId') userId: string,
    @Args('data') input: UpdateUserInput,
  ): Promise<typeof UpdateUserResult> {
    return this.userService.updateUser(userId, input)
  }

  @Mutation(() => DeleteUserResult, { name: 'deleteUser' })
  async deleteUser(@Args('userId') userId: string): Promise<typeof DeleteUserResult> {
    return this.userService.deleteUser(userId)
  }
}
