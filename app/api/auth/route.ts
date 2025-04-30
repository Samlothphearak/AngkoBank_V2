import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email });

  return NextResponse.json({ token });
}
