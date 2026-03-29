'use server'

import pool from '../../../lib/db'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/session';

export async function create_post(form_data: FormData){
    const title = form_data.get('title') as string;
    const body = form_data.get('body') as string;
    const channel_id = form_data.get('channel_id') as string;
    const user = await getCurrentUser();

    if (!user){
        console.error('must be logged in to post');
        return;
    }

    if (!title || title.trim() === ""){
        console.error("title is required");
        return;
    }
    try {
        const userResult = await pool.query('SELECT id FROM users LIMIT 1');
        
        if (userResult.rows.length === 0) {
            console.error("No users found in database.");
            return;
        }
        
        const author_id = userResult.rows[0].id;
        await pool.query(
            'INSERT INTO posts (channel_id, author_id, title, body) VALUES ($1, $2, $3, $4)',
            [channel_id, user.id, title, body] 
        );
        
        revalidatePath(`/channels/${channel_id}`);    
    } catch (error) {
        console.error('Failed to create post:', error);
    }
}