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
        console.error('must be logged in to post');
        return;
    }

    if (!title || title.trim() === ""){
        console.error("title is required");
        return;
    }

    let img_path: string | null = null;
    if (img && img.size > 0) {
        const MAX_IMG_SIZE = 5 * 1024 * 1024;
        if (img.size > MAX_IMG_SIZE){
            console.error('img is greater than 5 MB, please upload something smaller in size');
            return;
        }

        const valid_imgs = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!valid_imgs.includes(img.type)){
            console.error('this image is not compatible, pls use PNG, JPEG or JPG formats');
            return; 
        }

        try {
            const buffer = Buffer.from(await img.arrayBuffer());
            const file_name = `${Date.now()}-${img.name.replace(/\s/g, '_')}`;
            const upload_dir = path.join(process.cwd(), 'public/uploads');

            if (!fs.existsSync(upload_dir)){
                fs.mkdirSync(upload_dir, {recursive:true});
            }

            fs.writeFileSync(path.join(upload_dir, file_name), buffer);
            img_path = `/uploads/${file_name}`;
        } catch (err) {
            console.error("Error saving file:", err);
            return;
        }
    }

    try {
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
    } catch (error) {
        console.error('Failed to create post:', error);
    }
}