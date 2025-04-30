import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';  // Assuming you have this utility in the mentioned path
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Extract JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];  // Extract the token from "Bearer <token>"
    const decoded = verifyJwtToken(token);   // Verify and decode the JWT token

    if (!decoded) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = decoded.userId;  // Get userId from the decoded token
    console.log('Fetching balance for userId:', userId);

    // Fetch user data from the database using the userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        accountNumber: true,
        accounts: {
          select: {
            accountType: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user's balance and account info
    return NextResponse.json({
      balance: user.balance,
      accountNumber: user.accountNumber,
      accountType: user.accounts[0]?.accountType ?? 'Unknown',
      currency: 'USD',
    });
  } catch (error) {
    console.error('[BALANCE_ERROR]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
