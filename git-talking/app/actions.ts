'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import pool from '../lib/db';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/session';


export async function logout() {
  (await cookies()).delete('session');
  redirect('/login');
}

export async function createChannel(formData: FormData) {
    const user = await getCurrentUser();

    if (!user){
      return;
    }
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


export async function vote(targetType: 'post' | 'reply', targetId: string, value: 1 | -1, currentPath: string) {
  const user = await getCurrentUser();

  if (!user){
    console.error('must be logged in to vote');
    return;
  }

  try {
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [user.id, targetType, targetId]
    );

    if (existingVote.rows.length > 0) {
      const currentVote = existingVote.rows[0];

      if (currentVote.value === value) {
        await pool.query('DELETE FROM votes WHERE id = $1', [currentVote.id]);
      } else {
        await pool.query('UPDATE votes SET value = $1 WHERE id = $2', [value, currentVote.id]);
      }
    } else {
      await pool.query(
        'INSERT INTO votes (user_id, target_type, target_id, value) VALUES ($1, $2, $3, $4)',
        [user.id, targetType, targetId, value]
      );
    }

    revalidatePath(currentPath);
    
  } catch (error) {
    console.error('Voting failed:', error);
  }
}

export async function deletePost(postId: string) {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    revalidatePath('/admin');
  } catch (error) {
    console.error(error);
  }
}

export async function deleteReply(replyId: string) {
  try {
    await pool.query('DELETE FROM replies WHERE id = $1', [replyId]);
    revalidatePath('/admin');
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(userId: string) {
  try {
    await pool.query('DELETE FROM votes WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM replies WHERE author_id = $1', [userId]);
    await pool.query('DELETE FROM posts WHERE author_id = $1', [userId]);
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    revalidatePath('/admin');
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
}

export async function deleteChannel(channelId: string) {
  try {
    await pool.query('DELETE FROM channels WHERE id = $1', [channelId]);
    revalidatePath('/'); 
    revalidatePath('/admin'); 
  } catch (error) {
    console.error('Failed to delete channel:', error);
  }
}