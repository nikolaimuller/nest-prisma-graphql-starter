import { Field, InputType, registerEnumType } from '@nestjs/graphql'

export enum OrderDirection {
  // Specifies an ascending order for a given `orderBy` argument.
  ASC = 'asc',
  // Specifies a descending order for a given `orderBy` argument.
  DESC = 'desc',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  description:
    'Possible directions in which to order a list of items when provided an `orderBy` argument.',
})

@InputType({ isAbstract: true })
export abstract class Order {
  @Field(() => OrderDirection)
  direction: OrderDirection
}
