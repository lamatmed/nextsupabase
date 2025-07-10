/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { loginUser } from '../../../utils/actions';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) {
      return NextResponse.json({ error: 'Numéro et mot de passe requis' }, { status: 400 });
    }
    
    const user = await loginUser(phone, password);
    
    // Retourner les données utilisateur pour que le frontend puisse les stocker
    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isBlocked: user.isBlocked
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 