// app/api/accounts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = await verifyToken(token);
    
    const accounts = await prisma.account.findMany({
      where: {
        userId: Number(userId)
      },
      select: {
        id: true,
        balance: true,
        accountNumber: true,
        accountType: true,
        currency: true,
        status: true
      }
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}