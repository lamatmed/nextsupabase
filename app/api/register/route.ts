/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { registerUser } from '../../../utils/actions';

export async function POST(req: Request) {
  try {
    const { fullName, phone, password } = await req.json();
    if (!fullName || !phone || !password) {
      return NextResponse.json({ error: 'Nom, numéro et mot de passe requis' }, { status: 400 });
    }
    const user = await registerUser(fullName, phone, password);
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 