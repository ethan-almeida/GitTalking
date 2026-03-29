'use server'

import pool from '../../../lib/db';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/session';

export async function createReply(formData: FormData) {
    const body = formData.get('body') as string;
    const postId = formData.get('postId') as string;
    const parentReplyId = formData.get('parentReplyId') as string | null;
    const user = await getCurrentUser();

    if (!user){
        console.error('must be logged into reply');
    }

    if (!body || body.trim() === '') {
        console.error('Body is required');
        return;
    }

    try {
        await pool.query(
            'INSERT INTO replies (post_id, parent_reply_id, author_id, body) VALUES ($1, $2, $3, $4)',
            [postId, parentReplyId || null, user.id, body]
        );
        revalidatePath(`/posts/${postId}`);
        
    } catch (error) {
        console.error('Failed to post reply:', error);
    }
}