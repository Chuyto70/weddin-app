'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Download } from 'lucide-react';

interface Photo {
  url: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos([{url:"/welcome-image.jpeg"}, ...data.photos.map((url: string) => ({ url }))]);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (photoUrl: string) => {
    setPhotoToDelete(photoUrl);
    setShowDeleteDialog(true);
    setPassword('');
    setDeleteError('');
  };

  const handleDeleteConfirm = async () => {
    if (!photoToDelete || !password) return;

    // Check password (you can change this to whatever password you want)
    const correctPassword = 'daqa1503*'; // Change this to your desired password

    if (password !== correctPassword) {
      setDeleteError('Contraseña incorrecta');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrl: photoToDelete }),
      });

      if (response.ok) {
        setPhotos(photos.filter(photo => photo.url !== photoToDelete));
        setShowDeleteDialog(false);
        setSelectedPhoto(null);
        alert('Foto eliminada exitosamente');
      } else {
        setDeleteError('Error al eliminar la foto');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      setDeleteError('Error al eliminar la foto');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (photoUrl: string) => {
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      // Extract filename from URL or create one
      const filename = photoUrl.split('/').pop() || `foto-boda-${Date.now()}.jpg`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading photo:', error);
      alert('Error al descargar la foto');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <p className="text-foreground font-medium">Cargando momentos hermosos...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-border">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📷</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">Aún no hay fotos</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            ¡Sé el primero en capturar y compartir un momento hermoso de este día especial!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-muted-foreground bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full">
          {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      
        {photos.map((photo, index) => (
          <div
            key={index}
            className="group aspect-square relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-card cursor-pointer"
            onClick={() => setSelectedPhoto(photo.url)}
          >
            <Image
              src={photo.url}
              alt={`Foto de la boda ${index + 1}`}
              fill
              unoptimized
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Foto {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Image Viewer */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Cerrar imagen"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => handleDownload(selectedPhoto)}
            className="absolute top-4 right-16 z-10 bg-primary/80 hover:bg-primary text-white p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Descargar foto"
          >
            <Download size={20} />
          </button>
         {selectedPhoto !== "/welcome-image.jpeg" && <button
            onClick={() => handleDeleteClick(selectedPhoto)}
            className="absolute top-4 left-4 z-10 bg-red-500/80 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 shadow-lg"
            aria-label="Eliminar foto"
          >
            <Trash2 size={20} />
          </button>}
          <div className="relative max-w-full max-h-full">
            <Image
              src={selectedPhoto}
              alt="Foto ampliada"
              width={1200}
              height={800}
              unoptimized
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">
              Confirmar eliminación
            </h3>
            <p className="text-white mb-4 text-center">
              Ingresa la contraseña para eliminar esta foto:
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              placeholder="Contraseña"
              onKeyDown={(e) => e.key === 'Enter' && handleDeleteConfirm()}
            />
            {deleteError && (
              <p className="text-destructive text-sm mb-4 text-center">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 bg-muted hover:bg-muted/90 text-muted-foreground py-3 px-4 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting || !password}
                className="flex-1 bg-red-500 hover:bg-destructive/90 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}