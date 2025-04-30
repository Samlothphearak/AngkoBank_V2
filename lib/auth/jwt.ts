import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

export async function verifyToken(token: string): Promise<number> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!decoded || typeof decoded.userId !== 'number') {
      throw new Error('Invalid token payload');
    }
    return decoded.userId;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid or expired token');
  }
}
