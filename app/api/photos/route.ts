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

    // Filter for image and video files
    const mediaFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm)$/i.test(file)
    );

    // Sort by filename in descending order (newest first, since filenames start with timestamp)
    mediaFiles.sort((a, b) => b.localeCompare(a));

    // Return media URLs via API endpoint
    const photos = mediaFiles.map(file => `/api/photos/${file}`);

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ photos: [] });
  }
}