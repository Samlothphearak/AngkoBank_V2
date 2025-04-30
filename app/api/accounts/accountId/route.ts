// /app/api/account/[accountId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { accountId: string } }) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: parseInt(params.accountId) },
    });

    if (!account) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching account' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { accountId: string } }) {
  try {
    const body = await req.json();

    const updatedAccount = await prisma.account.update({
      where: { id: parseInt(params.accountId) },
      data: body,
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating account' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { accountId: string } }) {
  try {
    await prisma.account.delete({
      where: { id: parseInt(params.accountId) },
    });

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting account' }, { status: 500 });
  }
}
