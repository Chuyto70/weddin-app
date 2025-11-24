import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '2000');
    const offset = (page - 1) * limit;

    const photosDir = join(process.cwd(), 'uploads', 'weddingPhotos');
    console.log('Reading photos from:', photosDir);

    let files: string[] = [];
    try {
      files = await readdir(photosDir);
    } catch (readError) {
      console.error('Error reading photos directory:', readError);
      return NextResponse.json({ photos: [], hasMore: false });
    }

    // Filter for image and video files
    const mediaFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|webp|mp4|mov|avi|webm)$/i.test(file)
    );

    // Sort by filename in descending order (newest first, since filenames start with timestamp)
    mediaFiles.sort((a, b) => b.localeCompare(a));

    // Apply pagination
    const paginatedFiles = mediaFiles.slice(offset, offset + limit);
    const hasMore = offset + limit < mediaFiles.length;

    // Return media URLs via API endpoint
    const photos = paginatedFiles.map(file => `/api/photos/${file}`);

    return NextResponse.json({ photos, hasMore });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ photos: [], hasMore: false });
  }
}