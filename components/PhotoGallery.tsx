'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Photo {
  url: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data.photos.map((url: string) => ({ url })));
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-rose-500 border-t-transparent"></div>
          <p className="text-gray-700 font-medium">Loading beautiful moments...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-rose-100">
          <div className="w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📷</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">No photos yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Be the first to capture and share a beautiful moment from this special day!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-2xl">💍</span>
          Wedding Gallery
        </h2>
        <div className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
          {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="group aspect-square relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
          >
            <Image
              src={photo.url}
              alt={`Wedding photo ${index + 1}`}
              fill
              unoptimized
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Photo {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}