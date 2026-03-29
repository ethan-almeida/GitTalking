'use server'

import pool from '../../lib/db';
import { verifyPassword } from '../../lib/auth/password';
import { createSession } from '../../lib/auth/session';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    console.error('Missing fields');
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.error('User not found');
      return;
    }

    const isValid = await verifyPassword(password, user.pass_hashed);
    
    if (!isValid) {
      console.error('Invalid password');
      return;
    }

    await createSession(user.id, user.role);

  } catch (error) {
    console.error('Login error:', error);
    return;
  }

  redirect('/');
}