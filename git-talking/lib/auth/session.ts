import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import pool from '../db';

const SECRET_KEY = new TextEncoder().encode(process.env.SESSION_SECRET || 'super-secret-key-change-in-prod');

interface SessionPayload {
  userId: string;
  role: string;
}

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expires)
    .sign(SECRET_KEY);

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookie = (await cookies()).get('session')?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function logout() {
  (await cookies()).delete('session');
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const result = await pool.query('SELECT id, display_name, email, role, pass_hashed FROM users WHERE id = $1', [session.userId]);
  return result.rows[0] || null;
}