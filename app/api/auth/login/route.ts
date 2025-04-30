import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If no user is found
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: 'Internal server error: JWT secret is missing.' },
        { status: 500 }
      );
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token to be stored in cookie (for example)
    const response = NextResponse.json({ message: 'Login successful', token });

    // Set cookie with JWT (if needed)
    response.cookies.set('auth_token', token, {
      httpOnly: true,  // Ensures cookie is only accessible via HTTP requests
      secure: process.env.NODE_ENV === 'production', // Ensures cookie is only sent over HTTPS in production
      maxAge: 60 * 60, // 1 hour
      path: '/', // Accessible across the entire site
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    );
  }
}