'use server'

import pool from '../../../lib/db';
import { revalidatePath } from 'next/cache';

export async function createReply(formData: FormData) {
    const body = formData.get('body') as string;
    const postId = formData.get('postId') as string;
    const parentReplyId = formData.get('parentReplyId') as string | null;

    if (!body || body.trim() === '') {
        console.error('Body is required');
        return;
    }

    try {
        const userResult = await pool.query('SELECT id FROM users LIMIT 1');
        const authorId = userResult.rows[0]?.id;
        if (!authorId) {
            console.error('No user found');
            return;
        }

        await pool.query(
            'INSERT INTO replies (post_id, parent_reply_id, author_id, body) VALUES ($1, $2, $3, $4)',
            [postId, parentReplyId || null, authorId, body]
        );
        revalidatePath(`/posts/${postId}`);
        
    } catch (error) {
        console.error('Failed to post reply:', error);
    }
}