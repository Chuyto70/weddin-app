import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [], // Allow images from any domain since we're serving from public folder
    unoptimized: true, // Disable Next.js image optimization for uploaded photos
  },
  // Enable camera permissions for camera access
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=()',
          },
        ],
      },
      {
        // Disable caching for wedding photos to ensure new uploads are visible immediately
        source: '/weddingPhotos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  // Ensure static files are served correctly from public folder
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;
