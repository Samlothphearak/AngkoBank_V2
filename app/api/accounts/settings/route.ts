// /app/api/settings/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    profileImage,
    currentPassword,
    newPassword,
  } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (currentPassword && newPassword) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email: session.user.email },
        data: { password: hashedPassword },
      });
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        profileImage,
      },
    });

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
