import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { type, amount, senderAccountId, receiverAccountId, userId } = await req.json();

  if (!type || !amount || !userId) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  let transaction;
  if (type === 'deposit') {
    transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        userId,
        description: 'Deposit to account',
      },
    });

    await prisma.account.update({
      where: { userId },
      data: {
        balance: { increment: amount },
      },
    });
  } else if (type === 'withdraw') {
    const account = await prisma.account.findUnique({
      where: { userId },
    });

    if (account.balance < amount) {
      return NextResponse.json({ message: 'Insufficient funds' }, { status: 400 });
    }

    transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        userId,
        description: 'Withdrawal from account',
      },
    });

    await prisma.account.update({
      where: { userId },
      data: {
        balance: { decrement: amount },
      },
    });
  } else if (type === 'transfer' && senderAccountId && receiverAccountId) {
    const senderAccount = await prisma.account.findUnique({
      where: { id: senderAccountId },
    });

    const receiverAccount = await prisma.account.findUnique({
      where: { id: receiverAccountId },
    });

    if (senderAccount.balance < amount) {
      return NextResponse.json({ message: 'Insufficient funds for transfer' }, { status: 400 });
    }

    transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        senderAccountId,
        receiverAccountId,
        userId,
        description: 'Transfer between accounts',
      },
    });

    await prisma.account.update({
      where: { id: senderAccountId },
      data: {
        balance: { decrement: amount },
      },
    });

    await prisma.account.update({
      where: { id: receiverAccountId },
      data: {
        balance: { increment: amount },
      },
    });
  }

  return NextResponse.json({ message: 'Transaction successful', transaction });
}
