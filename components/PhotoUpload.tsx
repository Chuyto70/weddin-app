'use client';

import { useRef, useState } from 'react';
import { Camera, X, Check } from 'lucide-react';

export default function PhotoUpload() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      if (typeof window !== 'undefined' && !window.isSecureContext && window.location.protocol !== 'http:') {
        alert('Camera access requires HTTPS. Please ensure the site is served over HTTPS.');
        return;
      }

      // Try front camera first, then fallback to any available camera
      let constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user', // Front camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (frontCameraError) {
        // Fallback to any camera if front camera fails
        console.log('Front camera not available, trying any camera...');
        constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);

      let errorMessage = 'Unable to access camera. ';

      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera access when prompted by your browser.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'Camera does not support the required constraints.';
        } else if (error.name === 'SecurityError') {
          errorMessage += 'Camera access blocked due to security restrictions. Please use HTTPS.';
        } else {
          errorMessage += 'Please check permissions and try again.';
        }
      } else {
        errorMessage += 'Please check permissions and try again.';
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
    setPreview(null);
    setSelectedFile(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setPreview(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Please select a valid image file.');
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

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();
      if (result.success) {
        alert('Photo uploaded successfully!');
        setPreview(null);
        setSelectedFile(null);
        // Trigger gallery refresh (we'll handle this in the parent component)
        window.location.reload();
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-1 gap-4 mb-6">
        <button
          onClick={startCamera}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Camera size={24} />
          <span className="text-lg">Take Photo</span>
        </button>

        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-2xl">🖼️</span>
            <span className="text-lg">Choose from Gallery</span>
          </button>
        </div>
      </div>

      {isCapturing && (
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-6">
            <button
              onClick={capturePhoto}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <Check size={28} />
            </button>
            <button
              onClick={stopCamera}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
            >
              <X size={28} />
            </button>
          </div>
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            Camera Active
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-6">
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-64 md:h-80 object-cover" />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              Preview
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={uploadPhoto}
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Accept & Upload
                </>
              )}
            </button>
            <button
              onClick={() => setPreview(null)}
              className="flex-1 bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}