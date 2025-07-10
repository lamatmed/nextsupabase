import { NextResponse } from 'next/server';
import { updateUser } from '../../../utils/actions';

export async function PUT(req: Request) {
  try {
    const { userId, fullName, phone } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }
    
    const updatedUser = await updateUser(userId, { fullName, phone });
    return NextResponse.json({ user: updatedUser });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
} 