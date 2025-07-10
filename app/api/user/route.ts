/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';

export async function GET() {
  // Cette API peut être utilisée pour vérifier l'état de connexion côté serveur
  // Pour l'instant, elle retourne simplement un message
  return NextResponse.json({ 
    message: "API utilisateur disponible",
    note: "Les données utilisateur sont gérées côté client via localStorage"
  });
} 