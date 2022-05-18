import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql'

import { Order } from '../common/order'
import { MutationResult } from '../common/operation'

import { User } from './user.model'

export enum UserOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  email = 'email',
}

registerEnumType(UserOrderField, {
  name: 'UserOrderField',
  description: 'Properties by which user connections can be ordered.',
})

@InputType()
export class UserFilter {
  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  name?: string
}

@InputType()
export class UserOrder extends Order {
  @Field(() => UserOrderField)
  field: UserOrderField
}

@InputType()
export class CreateUserInput extends PickType(User, ['name', 'email'] as const, InputType) {}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}

@ObjectType()
class UserPayload {
  @Field(() => User)
  user: User
}

export const CreateUserResult = MutationResult('CreateUser', UserPayload)
export const UpdateUserResult = MutationResult('UpdateUser', UserPayload)
export const DeleteUserResult = MutationResult('DeleteUser', UserPayload)
