import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const photosDir = join(process.cwd(), 'public', 'weddingPhotos');
    const files = await readdir(photosDir);

    // Filter for image files
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Return photo URLs
    const photos = imageFiles.map(file => `/weddingPhotos/${file}`);

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ photos: [] });
  }
}