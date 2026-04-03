'use server'

import pool from '../../../lib/db'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/session';
import fs from 'fs';
import path from 'path';

export async function create_post(form_data: FormData){
    const title = form_data.get('title') as string;
    const body = form_data.get('body') as string;
    const channel_id = form_data.get('channel_id') as string;
    const user = await getCurrentUser();
    const img = form_data.get('image') as File | null;

    if (!user){
        return { error: 'Must be logged in to post' };
    }

    if (!title || title.trim() === ""){
        return { error: 'Title is required' };
    }

    let img_path: string | null = null;
    try {
        if (img && img.size > 0) {
            const buffer = Buffer.from(await img.arrayBuffer());
            const filename = `${Date.now()}-${img.name.replace(/\s/g, '_')}`;
            const uploadDir = path.join(process.cwd(), 'uploads');

            if (!fs.existsSync(uploadDir)){
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(path.join(uploadDir, filename), buffer);
            img_path = `/api/uploads/${filename}`;
        }

        const postResult = await pool.query(
            'INSERT INTO posts (channel_id, author_id, title, body) VALUES ($1, $2, $3, $4) RETURNING id',
            [channel_id, user.id, title, body] 
        );
        
        const postId = postResult.rows[0].id;
        if (img_path) {
            await pool.query(
                'INSERT INTO attachments (target_type, target_id, mime_type, size_bytes, file_path) VALUES ($1, $2, $3, $4, $5)',
                ['post', postId, img!.type, img!.size, img_path]
            );
        }

        revalidatePath(`/channels/${channel_id}`);    
        return { success: true };
    } catch (error) {
        console.error('Failed to create post:', error);
        return { error: 'Failed to create post. Please try again.' };
    }
}