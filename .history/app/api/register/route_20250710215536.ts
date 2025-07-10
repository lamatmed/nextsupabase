/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { registerUser } from '../../../utils/actions';

export async function POST(req: Request) {
  try {
    const { fullName, phone } = await req.json();
    if (!fullName || !phone) {
      return NextResponse.json({ error: 'Nom et numéro requis' }, { status: 400 });
    }
    const user = await registerUser(fullName, phone);
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 