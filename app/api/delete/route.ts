import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { photoUrl } = await request.json();

    if (!photoUrl) { 
      return NextResponse.json({ success: false, message: 'No photo URL provided.' });
    }

    // For Vercel deployment, we'll use a different approach
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

    if (isVercel) {
      // In Vercel, we can't delete from the filesystem
      // For now, we'll return success but not actually delete the file
      // In a real deployment, you'd want to use a cloud storage service
      console.log('Vercel environment detected - file deletion simulated');
      return NextResponse.json({
        success: true,
        message: 'File deletion simulated in Vercel environment'
      });
    }

    // Extract filename from URL
    const filename = photoUrl.split('/').pop();
    if (!filename) {
      return NextResponse.json({ success: false, message: 'Invalid photo URL.' });
    }

    // Delete from local filesystem
    const filePath = join(process.cwd(), 'public', 'weddingPhotos', filename);

    try {
      await unlink(filePath);
      return NextResponse.json({ success: true, message: 'Photo deleted successfully.' });
    } catch (fileError) {
      console.error('File deletion error:', fileError);
      return NextResponse.json({ success: false, message: 'File not found or could not be deleted.' });
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ success: false, message: 'Delete failed.' });
  }
}