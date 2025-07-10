import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

// Données utilisateur simulées
const users = [
  {
    id: "1",
    fullName: "Marie Dupont",
    phone: "+33123456789",
    password: "password123",
    isAdmin: false,
    isBlocked: false
  },
  {
    id: "2", 
    fullName: "Pierre Martin",
    phone: "+33987654321",
    password: "password123",
    isAdmin: true,
    isBlocked: false
  },
  {
    id: "3",
    fullName: "Sophie Bernard",
    phone: "+33555666777",
    password: "password123",
    isAdmin: false,
    isBlocked: false
  },
  {
    id: "4",
    fullName: "Lucas Moreau",
    phone: "+33444555666",
    password: "password123",
    isAdmin: false,
    isBlocked: true
  }
];

// Inscription d'un nouvel utilisateur
export async function registerUser(fullName: string, phone: string, password: string) {
  const existing = users.find(u => u.phone === phone);
  if (existing) {
    throw new Error('Utilisateur déjà existant');
  }
  
  const newUser = {
    id: (users.length + 1).toString(),
    fullName,
    phone,
    password: await bcrypt.hash(password, 10),
    isAdmin: false,
    isBlocked: false
  };
  
  users.push(newUser);
  return { id: newUser.id, fullName: newUser.fullName, phone: newUser.phone, isAdmin: newUser.isAdmin, isBlocked: newUser.isBlocked };
}

// Connexion utilisateur (par téléphone et mot de passe)
export async function loginUser(phone: string, password: string) {
  const user = users.find(u => u.phone === phone);
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
  
  return { id: user.id, fullName: user.fullName, phone: user.phone, isAdmin: user.isAdmin, isBlocked: user.isBlocked };
}

// Récupérer un utilisateur par ID
export async function getUser(userId: string) {
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  return { id: user.id, fullName: user.fullName, phone: user.phone, isAdmin: user.isAdmin, isBlocked: user.isBlocked };
}

// Récupérer tous les utilisateurs (pour l'admin)
export async function getAllUsers() {
  return users.map(user => ({ 
    id: user.id, 
    fullName: user.fullName, 
    phone: user.phone, 
    isAdmin: user.isAdmin, 
    isBlocked: user.isBlocked 
  }));
}

// Mettre à jour un utilisateur
export async function updateUser(userId: string, data: { fullName?: string; phone?: string }) {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('Utilisateur non trouvé');
  }
  
  if (data.fullName) users[userIndex].fullName = data.fullName;
  if (data.phone) users[userIndex].phone = data.phone;
  
  return { 
    id: users[userIndex].id, 
    fullName: users[userIndex].fullName, 
    phone: users[userIndex].phone, 
    isAdmin: users[userIndex].isAdmin, 
    isBlocked: users[userIndex].isBlocked 
  };
}
