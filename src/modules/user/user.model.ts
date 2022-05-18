import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { User as UserModel, UserRole } from '@prisma/client'

import { PaginatedType } from '../common/pagination'

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role',
})

@ObjectType()
export class User implements Omit<UserModel, 'password'> {
  @Field(() => String)
  id: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => String)
  email: string

  @Field(() => String)
  name: string

  @Field(() => UserRole)
  role: UserRole
}

@ObjectType()
export class UserConnection extends PaginatedType(User) {}
