import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Seed roles first (make sure roles are created before user)
  
  // Create the Default role manually if needed
  const defaultRole = await prisma.role.upsert({
    where: { name: 'Default' },
    update: {},
    create: { name: 'Default' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  // Now proceed with user creation
  // Seed admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bank.com' },
    update: {},
    create: {
      email: 'admin@bank.com',
      password,
      balance: 10000,
      role: { connect: { id: adminRole.id } }, // Connect the role to user
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '010000001',
      address: {
        create: {
          city: 'PhnomPenh',
          district: 'Chamkarmon',
          commune: 'BoengKengKang',
          village: 'Village1',
        },
      },
    },
  });

  // Create account for admin user
  const adminAccount = await prisma.account.upsert({
    where: { accountNumber: 'ACC0000' },
    update: {},
    create: {
      userId: admin.id,
      accountType: 'checking',
      accountNumber: 'ACC0000',
      balance: 10000,
    },
  });

  // Seed regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@bank.com' },
    update: {},
    create: {
      email: 'user@bank.com',
      password,
      balance: 500,
      role: { connect: { id: userRole.id } }, // Connect the role to user
      firstName: 'Regular',
      lastName: 'User',
      phoneNumber: '010000002',
      address: {
        create: {
          city: 'PhnomPenh',
          district: 'Chamkarmon',
          commune: 'TonleBassac',
          village: 'Village2',
        },
      },
    },
  });

  // Create account for regular user
  const userAccount = await prisma.account.upsert({
    where: { accountNumber: 'ACC0001' },
    update: {},
    create: {
      userId: user.id,
      accountType: 'checking',
      accountNumber: 'ACC0001',
      balance: 500,
    },
  });

  // Seed transactions for regular user
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        type: 'deposit',
        amount: 300,
        senderAccountId: userAccount.id,
      },
      {
        userId: user.id,
        type: 'withdraw',
        amount: 100,
        senderAccountId: userAccount.id,
      },
    ],
  });

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
