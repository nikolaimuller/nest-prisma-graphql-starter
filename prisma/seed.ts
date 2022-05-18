import util from 'util'
import { Prisma, PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import faker from 'faker'

function iterate<T>(iterations: number, iterable: (iteration: number) => T): T[] {
  return [...Array(iterations).keys()].map((_, idx) => iterable(idx + 1))
}

function randomDate(min: Date, max: Date): Date {
  return new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()))
}

const prisma = new PrismaClient()

const randomUser = (): Prisma.UserCreateInput => {
  return {
    createdAt: randomDate(new Date(2021, 0, 1), new Date()),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: bcrypt.hashSync('12345', 10),
  }
}

const users: Array<Prisma.UserCreateInput> = [
  {
    name: 'Envato',
    email: 'envato@test.com',
    password: bcrypt.hashSync('12345', 10),
    createdAt: randomDate(new Date(2021, 0, 1), new Date()),
  },
  ...iterate<Prisma.UserCreateInput>(8, randomUser),
]

const seedUsers = async (): Promise<Array<User>> => {
  return Promise.all(
    users.map(async (user) => {
      const result = await prisma.user.create({
        data: user,
      })
      console.log(
        '\n🌱  Create user:',
        util.inspect(result, { showHidden: false, depth: null, colors: true }),
      )

      return result
    }),
  )
}

async function main(): Promise<void> {
  await seedUsers()
}

main()
