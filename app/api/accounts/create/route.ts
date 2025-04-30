// /app/api/account/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Find the default role (assume it exists in the 'roles' table)
    const defaultRole = await prisma.role.findFirst({
      where: { name: 'Default' }, // Adjust the role name if needed
    });

    if (!defaultRole) {
      return NextResponse.json(
        { message: 'Default role not found. Please seed roles first.' },
        { status: 500 }
      );
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        address: {
          create: {
            city: body.city,
            district: body.district,
            commune: body.commune,
            village: body.village,
          },
        },
        accounts: {
          create: {
            accountType: 'Standard',
            balance: 0,
            accountNumber: generateAccountNumber(),
          },
        },
        role: {
          connect: {
            id: defaultRole.id, // Connect the user to the default role
          },
        },
      },
      include: {
        accounts: true,
        address: true,
        role: true, // Including role data in response
      },
    });

    return NextResponse.json(
      { 
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role.name, // Returning the user's role
        },
        account: newUser.accounts[0],
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Error during registration' },
      { status: 500 }
    );
  }
}

function generateAccountNumber() {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}