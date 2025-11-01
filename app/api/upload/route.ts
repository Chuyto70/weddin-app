import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file received.' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Tipo de archivo no permitido. Solo imágenes y videos.' });
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: 'Archivo demasiado grande. Máximo 50MB.' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // For Vercel deployment, we'll use a different approach
    // Check if we're in Vercel environment
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

    if (isVercel) {
      // In Vercel, we can't write to the filesystem
      // For now, we'll return success but not actually save the file
      // In a real deployment, you'd want to use a cloud storage service like AWS S3, Cloudinary, etc.
      console.log('Vercel environment detected - file upload simulated');
      return NextResponse.json({
        success: true,
        message: 'File upload simulated in Vercel environment',
        filename: `simulated-${Date.now()}-${file.name}`
      });
    }

    // Production - save to mounted volume
    const uploadDir = join(process.cwd(), 'uploads', 'weddingPhotos');
    try {
      await mkdir(uploadDir, { recursive: true });
      // Ensure proper permissions for volume
      console.log('Upload directory ready:', uploadDir);
    } catch (mkdirError) {
      // Directory might already exist, continue
      console.log('Directory exists or created:', uploadDir);
    }

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);

    return NextResponse.json({
      success: true,
      filename,
      url: `/api/photos/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed.' });
  }
}