'use server'

import pool from '../../lib/db';
import { hashPassword } from '../../lib/auth/password';
import { createSession } from '../../lib/auth/session';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const displayName = formData.get('displayName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!displayName || !email || !password) {
    console.error('Missing fields');
    return;
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      console.error('User already exists');
      return; 
    }

    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (display_name, email, pass_hashed, role) VALUES ($1, $2, $3, $4) RETURNING id, role',
      [displayName, email, passwordHash, 'user']
    );

    const user = result.rows[0];
    await createSession(user.id, user.role);

  } catch (error) {
    console.error('Signup error:', error);
    return;
  }

  redirect('/');
}