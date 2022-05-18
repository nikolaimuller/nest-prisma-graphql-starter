import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql'
import { Type } from '@nestjs/common'
import {
  ConnectionArguments,
  Edge as IEdge,
  PageInfo as IPageInfo,
} from '@devoxa/prisma-relay-cursor-connection'

type ConnectionCursor = string

@ArgsType()
export class PaginationArgs implements ConnectionArguments {
  @Field(() => String, {
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  before?: ConnectionCursor

  @Field(() => String, {
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  after?: ConnectionCursor

  @Field(() => Number, { nullable: true, description: 'Paginate first' })
  first?: number

  @Field(() => Number, { nullable: true, description: 'Paginate last' })
  last?: number
}

@ObjectType()
class PageInfo implements IPageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean

  @Field(() => Boolean)
  hasPreviousPage: boolean

  @Field(() => String, { nullable: true })
  startCursor?: ConnectionCursor

  @Field(() => String, { nullable: true })
  endCursor?: ConnectionCursor
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function PaginatedType<TItem>(TItemClass: Type<TItem>) {
  @ObjectType(`${TItemClass.name}Edge`)
  abstract class EdgeType implements IEdge<TItem> {
    @Field(() => String)
    cursor: string

    @Field(() => TItemClass)
    node: TItem
  }

  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [EdgeType])
    edges: Array<EdgeType>

    @Field(() => PageInfo)
    pageInfo: PageInfo

    @Field(() => Int)
    totalCount: number
  }

  return PaginatedType
}
