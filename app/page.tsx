import Link from 'next/link';
import PhotoUpload from '../components/PhotoUpload';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-rose-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="text-lg">👁️</span>Ver Galería
              </Link>
              <Link
                href="/qr"
                className="inline-flex items-center gap-2 bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="text-lg">📱</span>Código QR
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-rose-400 to-pink-400 rounded-full mb-4">
              <span className="text-3xl">💕</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              ¡Captura un Momento Especial!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Comparte fotos de la boda de Jesús y Gabriela. ¡Haz clic en &quot;Tomar Foto&quot; o &quot;Elegir de la Galería&quot;!
            </p>
          </div>

          <PhotoUpload />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-rose-100 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600">
            Hecho con ❤️ para la boda de Jesús y Gabriela
          </p>
        </div>
      </footer>
    </div>
  );
}
