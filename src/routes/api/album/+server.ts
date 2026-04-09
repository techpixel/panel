import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const ALBUM_DIR = path.resolve('static/album');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

export async function GET() {
	try {
		const files = fs.readdirSync(ALBUM_DIR).filter((f) => {
			const ext = path.extname(f).toLowerCase();
			return IMAGE_EXTENSIONS.includes(ext);
		});

		if (files.length === 0) {
			return json({ error: 'No images found' }, { status: 404 });
		}

		const images = files.map((f) => `/album/${f}`);
		return json(images);
	} catch (error) {
		console.error('Failed to read album:', error);
		return json({ error: 'Failed to read album' }, { status: 500 });
	}
}
