'use server'

import pool from '../../../lib/db';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '../../../lib/auth/session';
import fs from 'fs';
import path from 'path';

export async function createReply(formData: FormData) {
    const body = formData.get('body') as string;
    const postId = formData.get('postId') as string;
    const parentReplyId = formData.get('parentReplyId') as string | null;
    const image = formData.get('image') as File | null; 
    const user = await getCurrentUser();

    if (!user) {
        return { error: 'You must be logged in to reply.' };
    }

    if (!body || body.trim() === '') {
        return { error: 'Reply body is required.' };
    }

    let imagePath: string | null = null;
    if (image && image.size > 0) {
        const MAX_SIZE = 5 * 1024 * 1024;
        if (image.size > MAX_SIZE) {
            return { error: 'Image size exceeds 5MB limit.' };
        }

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(image.type)) {
            return { error: 'Invalid image type. Use PNG, JPG, JPEG, or GIF.' };
        }

        try {
            const buffer = Buffer.from(await image.arrayBuffer());
            const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`;
            const uploadDir = path.join(process.cwd(), 'uploads');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            imagePath = `/api/uploads/${filename}`;
        } catch (err) {
            console.error("Error saving reply image:", err);
            return { error: 'Failed to save image. Please try again.' };
        }
    }

    try {
        const replyResult = await pool.query(
            'INSERT INTO replies (post_id, parent_reply_id, author_id, body) VALUES ($1, $2, $3, $4) RETURNING id',
            [postId, parentReplyId || null, user.id, body]
        );

        const replyId = replyResult.rows[0].id;
        if (imagePath) {
            await pool.query(
                'INSERT INTO attachments (target_type, target_id, mime_type, size_bytes, file_path) VALUES ($1, $2, $3, $4, $5)',
                ['reply', replyId, image!.type, image!.size, imagePath]
            );
        }

        revalidatePath(`/posts/${postId}`);
        return { success: true };
        
    } catch (error) {
        console.error('Failed to post reply:', error);
        return { error: 'Failed to post reply. Please try again.' };
    }
}