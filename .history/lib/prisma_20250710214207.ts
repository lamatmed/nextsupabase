import { PrismaClient } from '@prisma/client'

export const prisma =  globalThis.prisma || new PrismaClient()
if(process)