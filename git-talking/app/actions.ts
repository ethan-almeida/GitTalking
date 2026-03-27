'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import pool from '../lib/db';
import { revalidatePath } from 'next/cache';

// --- Logout Action ---
export async function logout() {
  (await cookies()).delete('session');
  redirect('/login');
}

// --- Create Channel Action ---
export async function createChannel(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name || name.trim() === '') {
        console.error('Channel name is required');
        return;
    }

    try {
        const userResult = await pool.query('SELECT id FROM users LIMIT 1');
        const userId = userResult.rows[0]?.id;

        if (!userId) {
            console.error('No users found to assign as creator');
            return;
        }

        await pool.query(
            'INSERT INTO channels (name, description, created_by) VALUES ($1, $2, $3)',
            [name, description || null, userId]
        );

        revalidatePath('/');
        
    } catch (error) {
        console.error('Failed to create channel:', error);
    }
}

// --- Vote Action ---
export async function vote(targetType: 'post' | 'reply', targetId: string, value: 1 | -1, currentPath: string) {
  // 1. Get a mock user (we use the first user for now)
  const userResult = await pool.query('SELECT id FROM users LIMIT 1');
  const userId = userResult.rows[0]?.id;

  if (!userId) {
    console.error('No user found');
    return;
  }

  try {
    // 2. Check if user already voted
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [userId, targetType, targetId]
    );

    if (existingVote.rows.length > 0) {
      const currentVote = existingVote.rows[0];
      
      // If clicking the same vote, remove it (neutral)
      if (currentVote.value === value) {
        await pool.query('DELETE FROM votes WHERE id = $1', [currentVote.id]);
      } else {
        // If clicking different vote, update it
        await pool.query('UPDATE votes SET value = $1 WHERE id = $2', [value, currentVote.id]);
      }
    } else {
      // No existing vote, insert new one
      await pool.query(
        'INSERT INTO votes (user_id, target_type, target_id, value) VALUES ($1, $2, $3, $4)',
        [userId, targetType, targetId, value]
      );
    }

    // Refresh the page to show new counts
    revalidatePath(currentPath);
    
  } catch (error) {
    console.error('Voting failed:', error);
  }
}