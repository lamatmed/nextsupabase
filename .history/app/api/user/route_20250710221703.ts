import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Pour l'instant, retourner des données simulées
    // Plus tard, tu pourrais récupérer l'utilisateur depuis Prisma
    // en utilisant un token ou session
    const user = {
      id: "1",
      fullName: "John Doe",
      phone: "+1234567890",
      isAdmin: false,
      isBlocked: false
    };
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des données utilisateur" }, { status: 500 });
  }
} 