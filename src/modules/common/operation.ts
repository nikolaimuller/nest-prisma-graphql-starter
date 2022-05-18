import { Field, ObjectType, createUnionType, registerEnumType } from '@nestjs/graphql'

export enum Status {
  Success = 'Success',
  Failed = 'Failed',
}

registerEnumType(Status, {
  name: 'Status',
  description: 'Operation status',
})

export enum ErrorCode {
  INPUT_ERROR = 'INPUT_ERROR',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  AUTH_ERROR = 'AUTH_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

registerEnumType(ErrorCode, {
  name: 'ErrorCode',
  description: 'Operation error codes',
})

export type IOperationError = {
  message: string
  code?: ErrorCode
}

@ObjectType()
export class OperationError implements IOperationError {
  @Field(() => String)
  message: string

  @Field(() => ErrorCode)
  code?: ErrorCode
}

export type OperationResult<T> =
  | { status: Status.Failed; error: IOperationError }
  | ({ status: Status.Success } & T)

type Constructor<T> = new (...args: any[]) => T

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function MutationResult<T extends Constructor<object>>(name: string, TItemClass: T) {
  @ObjectType(`${name}SuccessResult`)
  class SuccessResultWithPayload extends TItemClass {
    @Field(() => Status)
    status: Status.Success
  }

  @ObjectType(`${name}FailedResult`)
  class MutationFailedResult {
    @Field(() => OperationError)
    error: OperationError

    @Field(() => Status)
    status: Status.Failed
  }

  const ResultUnion = createUnionType({
    name: `${name}ResultUnion`,
    types: () => [SuccessResultWithPayload, MutationFailedResult] as const,
    resolveType: (value) => {
      if ('error' in value) {
        return MutationFailedResult
      }
      return SuccessResultWithPayload
    },
  })

  return ResultUnion
}

export const EmptyResult = MutationResult('MutationResult', class EmptyPayload {})
