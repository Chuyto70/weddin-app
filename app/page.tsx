/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import PhotoUpload from '../components/PhotoUpload';
import { Eye } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-olive">
      {/* Header */}
      {/* <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">

          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-accent mb-4 rounded-full w-40 h-40">
             <img src={"/logo-photo-app.webp"}  width={500} height={500} alt='logo de boda' className='rounded-full' />
            </div>
             <p className='text-primary italic'>22-11-2025</p>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              ¡Captura un momento especial TEST!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Comparte fotos de la boda de  <br></br> Gaby & Jesús. <br></br> ¡Haz clic en &quot;Tomar Foto&quot; o &quot;Elegir de la Galería&quot;!
            </p>
          </div>

          <PhotoUpload />
        </div>
      </main>

    
    </div>
  );
}
