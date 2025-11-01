import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const photosDir = join(process.cwd(), 'public', 'weddingPhotos');
    console.log('Reading photos from:', photosDir);

    let files: string[] = [];
    try {
      files = await readdir(photosDir);
    } catch (readError) {
      console.error('Error reading photos directory:', readError);
      return NextResponse.json({ photos: [] });
    }

    // Filter for image files
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // Return photo URLs via API endpoint
    const photos = imageFiles.map(file => `/api/photos/${file}`);

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ photos: [] });
  }
}