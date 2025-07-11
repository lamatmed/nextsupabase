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

// Récupérer tous les utilisateurs (pour l'admin) avec pagination
export async function getAllUsers(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: pageSize,
      select: {
        id: true,
        fullName: true,
        phone: true,
        isAdmin: true,
        isBlocked: true
      }
    }),
    prisma.user.count()
  ]);
  return { users, total };
}

// Mettre à jour un utilisateur
export async function updateUser(userId: string | undefined, data: { fullName?: string; phone?: string }) {
  if (!userId) throw new Error('ID utilisateur requis');
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

// Supprimer un utilisateur
export async function deleteUser(userId: string) {
  if (!userId) throw new Error('ID utilisateur requis');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Utilisateur non trouvé');

  if (user.isAdmin) {
    const adminCount = await prisma.user.count({ where: { isAdmin: true } });
    if (adminCount <= 1) {
      throw new Error('Impossible de supprimer le dernier administrateur.');
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  return { success: true };
}

// Changer le rôle d'un utilisateur (admin <-> user)
export async function toggleAdmin(userId: string) {
  if (!userId) throw new Error('ID utilisateur requis');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Utilisateur non trouvé');
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isAdmin: !user.isAdmin },
  });
  return { id: updated.id, isAdmin: updated.isAdmin };
}

// Bloquer/débloquer un utilisateur
export async function toggleBlocked(userId: string) {
  if (!userId) throw new Error('ID utilisateur requis');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Utilisateur non trouvé');
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: !user.isBlocked },
  });
  return { id: updated.id, isBlocked: updated.isBlocked };
}

// Récupérer tous les projets d'un utilisateur
export async function getUserProjects(userId: string) {
  if (!userId) throw new Error('ID utilisateur requis');
  return await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

// Créer un projet pour un utilisateur
export async function createProject(userId: string, data: { name: string; description?: string }) {
  if (!userId) throw new Error('ID utilisateur requis');
  if (!data.name) throw new Error('Nom du projet requis');
  return await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      userId,
    },
  });
}

// Mettre à jour un projet (seulement si propriétaire)
export async function updateProject(userId: string, projectId: string, data: { name?: string; description?: string }) {
  if (!userId) throw new Error('ID utilisateur requis');
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== userId) throw new Error('Projet non trouvé ou accès refusé');
  return await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
    },
  });
}

// Supprimer un projet (seulement si propriétaire)
export async function deleteProject(userId: string, projectId: string) {
  if (!userId) throw new Error('ID utilisateur requis');
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== userId) throw new Error('Projet non trouvé ou accès refusé');
  await prisma.project.delete({ where: { id: projectId } });
  return { success: true };
}
