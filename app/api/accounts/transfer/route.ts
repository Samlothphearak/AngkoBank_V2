import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Ensure you import the Prisma client

export async function POST(req: Request) {
  try {
    // Parse the incoming request
    const { senderId, recipientId, amount } = await req.json();

    if (!senderId || !recipientId || !amount) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ message: 'Amount must be greater than zero.' }, { status: 400 });
    }

    // Fetch both the sender and recipient from the database
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!sender || !recipient) {
      return NextResponse.json({ message: 'Sender or recipient not found.' }, { status: 404 });
    }

    // Ensure sender has enough balance
    if (sender.balance < amount) {
      return NextResponse.json({ message: 'Insufficient balance.' }, { status: 400 });
    }

    // Update sender and recipient balances
    const updatedSender = await prisma.user.update({
      where: { id: senderId },
      data: { balance: sender.balance - amount },
    });

    const updatedRecipient = await prisma.user.update({
      where: { id: recipientId },
      data: { balance: recipient.balance + amount },
    });

    // Create a transaction record for both the sender and recipient
    await prisma.transaction.createMany({
      data: [
        {
          userId: senderId,
          type: 'withdraw',
          amount: amount,
        },
        {
          userId: recipientId,
          type: 'deposit',
          amount: amount,
        },
      ],
    });

    // Respond with success
    return NextResponse.json({ message: 'Transfer complete' });
  } catch (error) {
    console.error('Error processing transfer:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
