import { NextResponse } from 'next/server';
import { loginUser } from '../../../utils/actions';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'Numéro requis' }, { status: 400 });
    }
    const user = await loginUser(phone);
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 