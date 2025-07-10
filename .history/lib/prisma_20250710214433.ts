import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // facultatif : affiche les requêtes SQL dans la console
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
