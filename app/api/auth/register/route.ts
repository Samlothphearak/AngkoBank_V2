import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Get or create the 'user' role
    let userRole = await prisma.role.findUnique({
      where: { name: 'user' },
    });

    if (!userRole) {
      userRole = await prisma.role.create({
        data: { name: 'user' },
      });
    }

    // Generate account numbers for default accounts
    const generateAccountNumber = () => {
      return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    };

    // Create the user with default accounts and address
    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: userRole.id,
        address: {
          create: {
            city: body.city,
            district: body.district,
            commune: body.commune,
            village: body.village,
          },
        },
        accounts: {
          create: [
            {
              accountType: 'Wallet',
              currency: 'KHR',
              accountNumber: generateAccountNumber(),
              balance: 0,
              status: 'active'
            },
            {
              accountType: 'Wallet',
              currency: 'USD',
              accountNumber: generateAccountNumber(),
              balance: 0,
              status: 'active'
            }
          ]
        }
      },
      include: {
        address: true,
        accounts: true,
        role: true
      }
    });

    // Remove sensitive data before returning
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Registration successful'
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