'use server'

import pool from '../lib/db';
import { revalidatePath } from 'next/cache';

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