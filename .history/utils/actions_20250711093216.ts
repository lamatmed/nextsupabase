'use server'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Inscription d'un nouvel utilisateur
export async function registerUser(fullName: string, phone: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw new Error('Utilisateur déjà existant');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { 
      fullName, 
      phone, 
      password: hashedPassword,
      isAdmin: false,
      isBlocked: false
    },
  });
  
  return { 
    id: user.id, 
    fullName: user.fullName, 
    phone: user.phone, 
    isAdmin: user.isAdmin, 
    isBlocked: user.isBlocked 
  };
}

// Connexion utilisateur (par téléphone et mot de passe)
export async function loginUser(phone: string, password: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  if (user.isBlocked) {
    throw new Error('Compte bloqué');
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Mot de passe incorrect');
  }
  
  return { 
    id: user.id, 
    fullName: user.fullName, 
    phone: user.phone, 
    isAdmin: user.isAdmin, 
    isBlocked: user.isBlocked 
  };
}

// Récupérer un utilisateur par ID
export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  return { 
    id: user.id, 
    fullName: user.fullName, 
    phone: user.phone, 
    isAdmin: user.isAdmin, 
    isBlocked: user.isBlocked 
  };
}

// Récupérer tous les utilisateurs (pour l'admin)
export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      phone: true,
      isAdmin: true,
      isBlocked: true
    }
  });
  
  return users;
}

// Mettre à jour un utilisateur
export async function updateUser(userId: string, data: { fullName?: string; phone?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.phone && { phone: data.phone })
    },
  });
  
  return { 
    id: user.id, 
    fullName: user.fullName, 
    phone: user.phone, 
    isAdmin: user.isAdmin, 
    isBlocked: user.isBlocked 
  };
}
