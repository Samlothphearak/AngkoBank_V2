// /app/api/settings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
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
    const userId = 1;  // Assuming the logged-in user ID is available via session or token
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Handle password change
    if (currentPassword && newPassword) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    }

    // Update other profile fields
    await prisma.user.update({
      where: { id: userId },
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
    return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
  }
}
