import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('file') as unknown as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No files received.' });
    }

    const uploadedFiles = [];
    const failedFiles = [];

    // Validate and process each file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

    // Check if we're in Vercel environment
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
    const uploadDir = join(process.cwd(), 'uploads', 'weddingPhotos');

    if (!isVercel) {
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (mkdirError) {
        // Directory might already exist, continue
      }
    }

    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        failedFiles.push({ name: file.name, reason: 'Tipo de archivo no permitido.' });
        continue;
      }

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        failedFiles.push({ name: file.name, reason: 'Archivo demasiado grande. Máximo 50MB.' });
        continue;
      }

      if (isVercel) {
        // In Vercel, we can't write to the filesystem
        console.log('Vercel environment detected - file upload simulated for', file.name);
        uploadedFiles.push({
          filename: `simulated-${Date.now()}-${file.name}`,
          originalName: file.name
        });
      } else {
        // Production - save to mounted volume
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename
          const filename = `${Date.now()}-${file.name}`;
          const path = join(uploadDir, filename);

          await writeFile(path, buffer);

          uploadedFiles.push({
            filename,
            url: `/api/photos/${filename}`,
            originalName: file.name
          });
        } catch (error) {
          console.error(`Error saving file ${file.name}:`, error);
          failedFiles.push({ name: file.name, reason: 'Error al guardar el archivo.' });
        }
      }
    }

    if (uploadedFiles.length === 0 && failedFiles.length > 0) {
      return NextResponse.json({ success: false, message: 'No se pudieron subir los archivos.', failedFiles });
    }

    return NextResponse.json({
      success: true,
      uploadedFiles,
      failedFiles,
      message: `Se subieron ${uploadedFiles.length} archivos exitosamente.`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed.' });
  }
}