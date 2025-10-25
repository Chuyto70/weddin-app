import Link from 'next/link';
import PhotoGallery from '../../components/PhotoGallery';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="text-lg">📸</span>
              Add Photo
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <PhotoGallery />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-rose-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 mb-2">
            Made with ❤️ for a special day
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <Link href="/upload" className="hover:text-rose-600 transition-colors">
              📸 Upload Photos
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-rose-600 transition-colors">
              🏠 Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}