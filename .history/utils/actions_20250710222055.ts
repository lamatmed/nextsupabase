import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Inscription d'un nouvel utilisateur
export async function registerUser(fullName: string, phone: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { phone } })
  if (existing) {
    throw new Error('Utilisateur déjà existant')
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { fullName, phone, password: hashedPassword },
  })
  return user
}

// Connexion utilisateur (par téléphone et mot de passe)
export async function loginUser(phone: string, password: string) {
  const user = await prisma.user.findUnique({ where: { phone } })
  if (!user) {
    throw new Error('Utilisateur non trouvé')
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Mot de passe incorrect')
  }
  return user
}
