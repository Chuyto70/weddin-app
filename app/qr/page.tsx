'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function QRPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Fixed URL for the wedding app
        const weddingAppUrl = "https://weddin-app.vercel.app/";
        const qrDataUrl = await QRCode.toDataURL(weddingAppUrl, {
          width: 600, // Larger for printing
          margin: 3,  // More margin for better scanning
          color: {
            dark: '#DC2626', // Rose color to match the theme
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mb-6">
          <span className="text-3xl">💕</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Código QR para Imprimir
        </h1>

        <p className="text-gray-600 mb-8">
          Imprime este código QR y colócalo en las mesas de los invitados. Al escanearlo, irán directamente a la aplicación de fotos de la boda de Jesús y Gabriela.
        </p>

        {qrCodeUrl && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg inline-block border-4 border-rose-100">
              <img
                src={qrCodeUrl}
                alt="Código QR para la boda de Jesús y Gabriela"
                className="w-80 h-80"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              URL: https://weddin-app.vercel.app/
            </p>
          </div>
        )}

        <div className="bg-rose-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Consejos para imprimir:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Imprime en tamaño A4 o carta</li>
            <li>• Asegúrate de que el código QR sea claramente visible</li>
            <li>• Coloca uno en cada mesa de los invitados</li>
            <li>• Los invitados pueden escanearlo con sus teléfonos</li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ← Volver a la App
          </Link>
        </div>
      </div>
    </div>
  );
}