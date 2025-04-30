// app/api/accounts/open/route.ts
export async function POST(req: Request) {
    try {
      const { userId, accountType, currency } = await req.json();
      
      // Validate account type and currency combination
      if (accountType === 'Wallet' && !['KHR', 'USD'].includes(currency)) {
        return NextResponse.json(
          { error: 'Wallet accounts must be either KHR or USD' },
          { status: 400 }
        );
      }
  
      const newAccount = await prisma.account.create({
        data: {
          userId,
          accountType,
          currency,
          accountNumber: generateAccountNumber(),
          balance: 0
        }
      });
  
      return NextResponse.json(newAccount);
    } catch (error) {
      // ... error handling
    }
  }