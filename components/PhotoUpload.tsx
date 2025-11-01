'use client';

import { useRef, useState } from 'react';
import { Camera, X, Check, GalleryHorizontal, BookImage, Eye } from 'lucide-react';
import Link from 'next/link';

export default function PhotoUpload() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext && !isLocalhost) {
        alert('El acceso a la cámara requiere HTTPS. Asegúrate de que el sitio se sirva sobre HTTPS.');
        return;
      }

      // Try front camera first, then fallback to any available camera
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 4096 }, // muy alto, el navegador bajará si no puede
          height: { ideal: 2160 },
          aspectRatio: { ideal: 9/16 }
        }
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (frontCameraError) {
        // Fallback to any camera if front camera fails
        console.log('Cámara frontal no disponible, intentando cualquier cámara...');
        constraints.video = { width: { ideal: 1920 }, height: { ideal: 1080 } };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          setIsCapturing(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);

      let errorMessage = 'No se puede acceder a la cámara. ';

      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Por favor, permite el acceso a la cámara cuando el navegador te lo pida.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No se encontró cámara en este dispositivo.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'La cámara ya está en uso por otra aplicación.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'La cámara no soporta las restricciones requeridas.';
        } else if (error.name === 'SecurityError') {
          errorMessage += 'Acceso a la cámara bloqueado por restricciones de seguridad. Usa HTTPS.';
        } else {
          errorMessage += 'Por favor, verifica permisos e intenta de nuevo.';
        }
      } else {
        errorMessage += 'Por favor, verifica permisos e intenta de nuevo.';
      }

      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
    setCameraReady(false);
    setSelectedFile(null);
  };

  const capturePhoto = () => {
  if (!cameraReady) return;
  if (videoRef.current && canvasRef.current) {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const width = video.videoWidth || 720;
    const height = video.videoHeight || 1280;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // quitar inversión al dibujar
      ctx.save();
      // Si el video está espejado, revertimos para la foto final
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();

      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setPreview(imageDataUrl);
      stopCamera();
    }
  }
};

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setSelectedFile(file);
      setIsVideo(file.type.startsWith('video/'));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Por favor, selecciona un archivo de imagen o video válido.');
    }
  };

  const uploadPhoto = async () => {
    if (!preview) return;

    setIsUploading(true);
    try {
      let file: File;

      if (selectedFile) {
        // Use selected file from gallery
        file = selectedFile;
      } else {
        // Convert data URL to blob (from camera)
        const response = await fetch(preview);
        const blob = await response.blob();
        file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      }

      // Check file size (limit to 50MB for videos)
      if (file.size > 50 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 50MB.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();
      if (result.success) {
        alert(`¡${isVideo ? 'Video' : 'Foto'} subida exitosamente!`);
        setPreview(null);
        setSelectedFile(null);
        setIsVideo(false);
        // Trigger gallery refresh with cache busting
        window.location.href = window.location.href;
      } else {
        alert('Subida fallida. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Subida fallida. Por favor, intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-1 gap-4 mb-6">
        <button
          onClick={startCamera}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full"
        >
          
          <Camera size={24} className='self-end' />
          <span className="text-xl font-bold flex gap-2 items-center">Tomar Foto</span>
        </button>

        <div className="relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full"
          >
            <BookImage size={24} className='self-end' />
            <span className="text-xl font-bold">Elegir de la Galería</span>
          </button>
        </div>
        
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/gallery"
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xl font-bold flex gap-2 items-center w-full"
              >
                <Eye className='self-end' />
                Ver Galería
              </Link>
            </div>
      </div>

      {isCapturing && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm">Cargando cámara...</p>
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover block ${cameraReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: 'scaleX(-1)' }} // Mirror effect for selfie
          />
          <div className="absolute inset-0 pointer-events-none"></div>

          {/* Camera controls overlay */}
          {cameraReady && (
            <div className="absolute inset-0 flex flex-col pointer-events-auto">
              {/* Top bar with instructions */}
              <div className="flex justify-between items-center p-4 bg-linear-to-b from-black/50 to-transparent">
                <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  📹 Cámara Lista
                </div>
                <button
                  onClick={stopCamera}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Bottom controls */}
              <div className="flex-1 flex items-end justify-center pb-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-white text-center">
                    <div className="text-lg font-bold mb-2">Toca el botón para tomar la foto</div>
                    <div className="text-sm opacity-75">La foto aparecerá abajo para revisarla</div>
                  </div>
                  <button
                    onClick={capturePhoto}
                    className="bg-white text-black p-8 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-200 border-4 border-white/50"
                    title="Take Photo"
                  >
                    <div className="w-8 h-8 bg-black rounded-full"></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full">
              {isVideo ? (
                <video src={preview} controls className="w-full h-96 md:h-[480px] object-cover" />
              ) : (
                <img src={preview} alt="Preview" className="w-full h-96 md:h-[480px] object-cover" />
              )}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                Vista Previa
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex gap-3 max-w-md mx-auto">
              <button
                onClick={uploadPhoto}
                disabled={isUploading}
                className="flex-1 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Subiendo...
                  </>
                ) : (
                  <>
                    ✅ Aceptar y Subir
                  </>
                )}
              </button>
              <button
                onClick={() => setPreview(null)}
                className="flex-1 bg-muted hover:bg-muted/90 text-muted-foreground font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}