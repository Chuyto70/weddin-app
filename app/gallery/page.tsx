import Link from 'next/link';
import PhotoGallery from '../../components/PhotoGallery';
import { Camera } from 'lucide-react';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-olive">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xl font-bold flex gap-2 items-center"
            >
              <Camera className='self-end' />
              Agregar Media
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12">
          <PhotoGallery />
        </div>
      </main>

    </div>
  );
}